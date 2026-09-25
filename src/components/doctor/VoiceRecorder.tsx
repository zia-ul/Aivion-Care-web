'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, Upload, FileAudio, Play, Pause, Trash2, Volume2, VolumeX } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (file: File) => void;
  onTranscriptChange?: (transcript: string) => void;
  disabled?: boolean;
  maxDurationMinutes?: number;
}

export function VoiceRecorder({
  onRecordingComplete,
  onTranscriptChange,
  disabled = false,
  maxDurationMinutes = 30,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxDurationMs = maxDurationMinutes * 60 * 1000;

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;

    recorder.onstop = () => {
      const chunks = recordedChunksRef.current;
      if (chunks.length === 0) {
        setError('Recording did not complete. Please try again.');
        setIsRecording(false);
        return;
      }

      const mimeType = recorder.mimeType || 'audio/webm';
      const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('webm') ? 'webm' : 'wav';
      const file = new File(chunks, `consultation-${Date.now()}.${ext}`, { type: mimeType });

      const url = URL.createObjectURL(file);
      setAudioFile(file);
      setAudioUrl(url);
      setRecordingTime(0);
      setIsRecording(false);
      onRecordingComplete?.(file);
    };

    recorder.stop();
    mediaRecorderRef.current = null;
  }, [onRecordingComplete]);

  const handleStartRecording = useCallback(async () => {
    if (isRecording || disabled) return;

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;
      recorder.start(1000);

      setRecordingTime(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1000;
          if (next >= maxDurationMs) {
            stopRecording();
            return maxDurationMs;
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Microphone permission is required.');
    }
  }, [isRecording, disabled, maxDurationMs, stopRecording]);

  const handlePlayPause = useCallback(() => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const handleRemove = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioFile(null);
    setAudioUrl(null);
    setRecordingTime(0);
    onRecordingComplete?.(null as any);
  }, [audioUrl, onRecordingComplete]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [audioUrl]);

  if (disabled) {
    return (
      <div className="rounded-2xl border border-[#2A3D50] bg-[#1A2A3A] p-4 text-center">
        <Mic className="h-8 w-8 text-[#3F8FE0]/40 mx-auto mb-2" />
        <p className="text-sm text-[#8AB0C0]">Recording disabled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-colors ${
            isRecording
              ? 'bg-[#C25A5A] cursor-not-allowed'
              : 'bg-[#3F8FE0] hover:bg-[#3F8FE0]/90'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="h-5 w-5 animate-pulse" />
              <span>Recording {formatTime(recordingTime)}</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={stopRecording}
          disabled={!isRecording}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white bg-[#2A3D50] border border-[#3F8FE0]/30 hover:bg-[#3F8FE0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="h-5 w-5" />
          <span>Stop & Generate</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg bg-[#C25A5A]/10 border border-[#C25A5A]/30 p-3 text-sm text-[#FFB4B4]">
          {error}
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && audioFile && (
        <div className="rounded-2xl bg-[#2A3D50] p-4">
          <div className="flex items-center gap-3">
            <FileAudio className="h-6 w-6 text-[#4DD9AC]" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{audioFile.name}</p>
              <p className="text-xs text-[#8AB0C0]">
                {formatTime(recordingTime || audioFile.size)} • {(audioFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="rounded-lg bg-[#3F8FE0] p-2 text-white hover:bg-[#3F8FE0]/90"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-[#8AB0C0]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-[#1A2A3A] rounded-lg appearance-none accent-[#4DD9AC]"
                />
              </div>

              <button
                onClick={handleRemove}
                className="rounded-lg bg-[#C25A5A]/20 p-2 text-[#FFB4B4] hover:bg-[#C25A5A]/30"
                aria-label="Remove recording"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
        </div>
      )}

      {/* File Upload Fallback */}
      <div className="rounded-xl border-2 border-dashed border-[#3F8FE0]/30 bg-[#1A2A3A]/50 p-4">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="h-8 w-8 text-[#3F8FE0]/60" />
          <p className="text-sm text-[#8AB0C0]">Or upload audio file</p>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setAudioFile(file);
                setAudioUrl(url);
                onRecordingComplete?.(file);
              }
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}