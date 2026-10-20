'use client';

import { useCallback, useState } from 'react';
import { Mic, PhoneOff, Video, Loader2, Radio, Square, Maximize2, Minimize2 } from 'lucide-react';
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
 * of the audio, displaying live video streams and providing manual recording controls.
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
  const [expanded, setExpanded] = useState(false);

  const recording = useCallRecording({ localStream, remoteStream });
  const inCall = callState === 'calling' || callState === 'connected' || callState === 'ringing';

  const handleStart = useCallback(
    async (video: boolean) => {
      setStarting(true);
      setRecordError(null);
      try {
        await startCall({ video });
        const started = await recording.start();
        if (!started && recording.supported) {
          setRecordError(
            'The call started, but the browser blocked automatic call recording. Use the recording button to start manually.'
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
      if (recording.isRecording) {
        const blob = await recording.stop();
        onRecordingReady(blob);
        if (blob) {
          toast.success('Call recorded. Transcribing now...');
        }
      }
    } finally {
      endCall();
      setStopping(false);
    }
  }, [recording, onRecordingReady, endCall]);

  const handleToggleRecording = useCallback(async () => {
    if (recording.isRecording) {
      const blob = await recording.stop();
      onRecordingReady(blob);
      if (blob) {
        toast.success('Recording saved and ready for notes.');
      }
    } else {
      const started = await recording.start();
      if (started) {
        toast.success('Recording started.');
      } else {
        toast.error('Could not start recording. Check microphone permissions.');
      }
    }
  }, [recording, onRecordingReady]);

  const remoteHasVideo = remoteStream && remoteStream.getVideoTracks().some((t) => t.enabled);
  const localHasVideo = localStream && localStream.getVideoTracks().some((t) => t.enabled);

  return (
    <div className="rounded-card border border-tonal-20/60 bg-surface-20/70 p-4 backdrop-blur shadow-md">
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
              {inCall ? (callState === 'connected' ? 'Call Connected' : 'Calling...') : 'Consultation Telehealth Call'}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-support text-primary-light/55">
                {recording.isRecording
                  ? `Recording active (${formatElapsed(recording.elapsedMs)})`
                  : inCall
                  ? 'In active call'
                  : 'Start audio or video call with patient'}
              </p>
              {recording.isRecording && (
                <span className="flex h-2 w-2 rounded-full bg-danger-fill animate-pulse" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual recording toggle button available anytime during or outside call */}
          <button
            type="button"
            onClick={handleToggleRecording}
            title={recording.isRecording ? 'Stop Recording' : 'Start Recording Call/Notes'}
            aria-label={recording.isRecording ? 'Stop Recording' : 'Start Recording Call/Notes'}
            className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition ${
              recording.isRecording
                ? 'bg-danger/20 text-danger-light border border-danger/40 hover:bg-danger/30'
                : 'bg-surface-30/70 text-primary-light/80 border border-tonal-20/60 hover:bg-surface-30 hover:text-primary-light'
            }`}
          >
            {recording.isRecording ? (
              <>
                <Square size={13} fill="currentColor" />
                <span>Stop Rec ({formatElapsed(recording.elapsedMs)})</span>
              </>
            ) : (
              <>
                <Radio size={14} className="text-danger" />
                <span>Record Call</span>
              </>
            )}
          </button>

          {!inCall ? (
            <>
              <button
                type="button"
                onClick={() => handleStart(false)}
                disabled={starting}
                title="Start an audio-only call"
                aria-label="Start an audio call"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-doctor-blue-fill text-white transition hover:scale-105 hover:bg-doctor-blue/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {starting ? <Loader2 size={18} className="animate-spin" /> : <Mic size={19} />}
              </button>
              <button
                type="button"
                onClick={() => handleStart(true)}
                disabled={starting}
                title="Start a video call"
                aria-label="Start a video call"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-success-fill text-white shadow-lg shadow-success/25 transition hover:scale-105 hover:bg-success-fill/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {starting ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                title={expanded ? 'Minimize Video View' : 'Expand Video View'}
                aria-label="Toggle Expand"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-30 text-primary-light hover:bg-surface-30/80 transition"
              >
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                onClick={handleEnd}
                disabled={stopping}
                title="End call and save the recording"
                aria-label="End call"
                className="flex h-11 items-center gap-2 rounded-full bg-danger-fill px-4 text-xs font-bold text-white transition hover:bg-danger-fill/90 disabled:opacity-60"
              >
                {stopping ? <Loader2 size={16} className="animate-spin" /> : <PhoneOff size={16} />}
                End Call
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Video Streams View */}
      {inCall && (
        <div className={`mt-4 relative overflow-hidden rounded-2xl bg-surface-10 border border-tonal-20/60 transition-all duration-300 ${expanded ? 'h-[450px]' : 'h-64'}`}>
          {/* Main Remote View */}
          {remoteStream && remoteHasVideo ? (
            <video
              ref={(el) => {
                if (el && remoteStream) {
                  el.srcObject = remoteStream;
                  void el.play().catch(() => {});
                }
              }}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          ) : callState === 'connected' ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-doctor-blue/20 text-doctor-blue animate-pulse">
                <Mic size={28} />
              </div>
              <p className="font-semibold text-primary-light">Audio Connected</p>
              <p className="text-xs text-primary-light/60 mt-0.5">Speaking with patient</p>
              {remoteStream && (
                <audio
                  ref={(el) => {
                    if (el && remoteStream) {
                      el.srcObject = remoteStream;
                      void el.play().catch(() => {});
                    }
                  }}
                  autoPlay
                />
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="mb-3 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-warning/15 text-warning">
                <Video size={24} />
              </div>
              <p className="text-sm font-semibold text-primary-light">Connecting Call...</p>
              <p className="text-xs text-primary-light/60 mt-1">Waiting for patient to answer</p>
            </div>
          )}

          {/* Picture-in-Picture Local Self-View */}
          {localStream && (
            <div className="absolute bottom-3 right-3 h-28 w-24 overflow-hidden rounded-xl border border-tonal-20/80 bg-surface-20/90 shadow-2xl">
              {localHasVideo ? (
                <video
                  ref={(el) => {
                    if (el && localStream) {
                      el.srcObject = localStream;
                      void el.play().catch(() => {});
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-xs text-primary-light/70">
                  <Mic size={18} className="text-doctor-blue mb-1" />
                  <span>Mic On</span>
                </div>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-medium text-white">
                You
              </span>
            </div>
          )}
        </div>
      )}

      {!isConnected && (
        <p className="mt-3 text-support text-warning-light flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" />
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


