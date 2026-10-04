'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface CallRecordingOptions {
  /** Local microphone stream from getUserMedia. */
  localStream?: MediaStream | null;
  /** Remote peer stream, once WebRTC connects. */
  remoteStream?: MediaStream | null;
}

interface CallRecordingApi {
  isRecording: boolean;
  elapsedMs: number;
  supported: boolean;
  start: () => Promise<boolean>;
  stop: () => Promise<Blob | null>;
  reset: () => void;
}

/**
 * Records a consultation call so the audio can be transcribed afterwards.
 *
 * A call has two audio sources, and capturing only one side produces an
 * unusable transcript. This mixes the local microphone and the remote stream
 * through a Web Audio destination and records that combined track.
 *
 * Recording starts even if the remote stream has not arrived yet - the peer
 * can join mid-call - and any remote track appearing later is picked up.
 */
export function useCallRecording({
  localStream,
  remoteStream,
}: CallRecordingOptions): CallRecordingApi {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const sourcesRef = useRef<{ context: AudioContext; source: MediaStreamAudioSourceNode }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const supported =
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof window.AudioContext !== 'undefined';

  const teardownAudioGraph = useCallback(() => {
    sourcesRef.current.forEach(({ source }) => {
      try {
        source.disconnect();
      } catch {
        /* already detached */
      }
    });
    sourcesRef.current = [];
    destinationRef.current = null;
    if (audioContextRef.current) {
      const context = audioContextRef.current;
      audioContextRef.current = null;
      void context.close().catch(() => undefined);
    }
  }, []);

  /** Connects a stream to the mix, if recording is already running. */
  const attachStream = useCallback((stream: MediaStream | null | undefined) => {
    if (!isRecording || !stream) return;
    const context = audioContextRef.current;
    const destination = destinationRef.current;
    if (!context || !destination) return;
    if (stream.getAudioTracks().length === 0) return;

    try {
      const source = context.createMediaStreamSource(stream);
      source.connect(destination);
      sourcesRef.current.push({ context, source });
    } catch {
      // A stream can be ended between check and connect; ignore.
    }
  }, [isRecording]);

  useEffect(() => {
    attachStream(localStream);
  }, [attachStream, localStream]);

  useEffect(() => {
    attachStream(remoteStream);
  }, [attachStream, remoteStream]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      try {
        recorderRef.current?.stop();
      } catch {
        /* not recording */
      }
      recorderRef.current = null;
      teardownAudioGraph();
    },
    [teardownAudioGraph]
  );

  const start = useCallback(async (): Promise<boolean> => {
    if (!supported || isRecording) return false;

    try {
      const context = new AudioContext();
      // Autoplay policies can leave the context suspended.
      if (context.state === 'suspended') {
        await context.resume();
      }
      const destination = context.createMediaStreamDestination();
      audioContextRef.current = context;
      destinationRef.current = destination;
      sourcesRef.current = [];

      // Mix in whatever is already available.
      [localStream, remoteStream].forEach((stream) => {
        if (!stream || stream.getAudioTracks().length === 0) return;
        try {
          const source = context.createMediaStreamSource(stream);
          source.connect(destination);
          sourcesRef.current.push({ context, source });
        } catch {
          /* ignore a dead stream */
        }
      });

      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(destination.stream, {
        ...(mimeType ? { mimeType } : {}),
      });

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;

      setElapsedMs(0);
      timerRef.current = setInterval(() => {
        setElapsedMs((prev) => prev + 1000);
      }, 1000);
      setIsRecording(true);
      return true;
    } catch {
      teardownAudioGraph();
      return false;
    }
  }, [supported, isRecording, localStream, remoteStream, teardownAudioGraph]);

  const stop = useCallback(async (): Promise<Blob | null> => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const recorder = recorderRef.current;
    if (!recorder) {
      setIsRecording(false);
      return null;
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        resolve(
          chunksRef.current.length ? new Blob(chunksRef.current, { type }) : null
        );
      };
      try {
        recorder.stop();
      } catch {
        resolve(null);
      }
    });

    recorderRef.current = null;
    chunksRef.current = [];
    teardownAudioGraph();
    setIsRecording(false);
    setElapsedMs(0);
    return blob;
  }, [teardownAudioGraph]);

  const reset = useCallback(() => {
    chunksRef.current = [];
    setElapsedMs(0);
  }, []);

  return { isRecording, elapsedMs, supported, start, stop, reset };
}
