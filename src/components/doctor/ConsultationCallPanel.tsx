'use client';

import { useCallback, useState } from 'react';
import { Mic, PhoneOff, Video, Loader2, Radio, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWebRtc } from '@/lib/webrtc/use-webrtc';
import { useCallRecording } from '@/lib/webrtc/use-call-recording';
import { useAuthStore } from '@/lib/stores/auth';

interface ConsultationCallPanelProps {
  appointmentId: number;
  /** Receives the recorded call audio so it can be transcribed. */
  onRecordingReady: (blob: Blob | null) => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * Starts a consultation call from the consultation page and records both sides
 * of the audio, so the finished recording can be transcribed into notes.
 */
export default function ConsultationCallPanel({
  appointmentId,
  onRecordingReady,
}: ConsultationCallPanelProps) {
  const { user, accessToken } = useAuthStore();
  const {
    callState,
    isConnected,
    error,
    localStream,
    remoteStream,
    startCall,
    endCall,
  } = useWebRtc(appointmentId, user?.id ?? 0, user?.role ?? 'DOCTOR', accessToken);

  const [starting, setStarting] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);

  const recording = useCallRecording({ localStream, remoteStream });
  const inCall = callState === 'calling' || callState === 'connected' || callState === 'ringing';

  const handleStart = useCallback(
    async (video: boolean) => {
      setStarting(true);
      setRecordError(null);
      try {
        await startCall({ video });
        // Recording begins with the call so the doctor can decide afterwards
        // whether to keep it; the patient may join a moment later.
        const started = await recording.start();
        if (!started && recording.supported) {
          setRecordError(
            'The call started, but the browser blocked call recording. Transcription will fall back to the recorder below.'
          );
        }
      } catch {
        toast.error('Could not start the call. Check microphone and camera permissions.');
      } finally {
        setStarting(false);
      }
    },
    [startCall, recording]
  );

  const handleEnd = useCallback(async () => {
    setStopping(true);
    try {
      const blob = await recording.stop();
      onRecordingReady(blob);
      if (blob) {
        toast.success('Call recorded. Transcribing now...');
      }
    } finally {
      endCall();
      setStopping(false);
    }
  }, [recording, onRecordingReady, endCall]);

  return (
    <div className="rounded-card border border-tonal-20/60 bg-surface-20/70 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              inCall ? 'bg-danger/20 text-danger-light' : 'bg-doctor-blue/15 text-doctor-blue'
            }`}
          >
            {inCall ? <Radio size={19} className="animate-pulse" /> : <Video size={19} />}
          </span>
          <div>
            <p className="font-semibold text-primary-light">
              {inCall ? 'Call in progress' : 'Start a consultation call'}
            </p>
            <p className="text-support text-primary-light/55">
              {inCall
                ? `Recording ${formatElapsed(recording.elapsedMs)} · call audio is transcribed when you hang up`
                : 'Both sides of the call are recorded for AI notes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!inCall ? (
            <>
              <button
                type="button"
                onClick={() => handleStart(false)}
                disabled={starting || !isConnected}
                title="Start an audio-only call"
                aria-label="Start an audio call"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-doctor-blue-fill text-white transition hover:scale-105 hover:bg-doctor-blue/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {starting ? <Loader2 size={18} className="animate-spin" /> : <Mic size={19} />}
              </button>
              <button
                type="button"
                onClick={() => handleStart(true)}
                disabled={starting || !isConnected}
                title="Start a video call"
                aria-label="Start a video call"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-success-fill text-white shadow-lg shadow-success/25 transition hover:scale-105 hover:bg-success-fill/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {starting ? <Loader2 size={20} className="animate-spin" /> : <Video size={21} />}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEnd}
              disabled={stopping}
              title="End call and save the recording"
              aria-label="End call"
              className="flex h-12 items-center gap-2 rounded-full bg-danger-fill px-5 text-sm font-bold text-white transition hover:bg-danger-fill/90 disabled:opacity-60"
            >
              {stopping ? <Loader2 size={18} className="animate-spin" /> : <PhoneOff size={19} />}
              End &amp; transcribe
            </button>
          )}
        </div>
      </div>

      {!isConnected && (
        <p className="mt-3 text-support text-warning-light">
          Connecting to the signaling server...
        </p>
      )}
      {recordError && (
        <p className="mt-3 flex items-start gap-2 text-support text-warning-light">
          <Square size={13} className="mt-0.5 shrink-0" />
          {recordError}
        </p>
      )}
      {error && (
        <p className="mt-3 text-support text-danger-light">{error}</p>
      )}
    </div>
  );
}

