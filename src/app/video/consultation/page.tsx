'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { consultationApi } from '@/lib/api/endpoints';
import { useWebRtc } from '@/lib/webrtc/use-webrtc';
import { Video, VideoOff, Mic, MicOff, PhoneOff, User, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';

function VideoConsultationContent() {
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const incomingParam = searchParams.get('incoming') === '1';
  const { user, accessToken } = useAuthStore();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadConsultation = useCallback(async () => {
    if (!consultationId) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await consultationApi.getByAppointment(consultationId);
      setConsultation(data);
    } catch (error) {
      console.error('Failed to load consultation:', error);
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  const { localStream, remoteStream, isMuted, isVideoOff, isConnected, error, callState, incomingCall, startCall, acceptCall, rejectCall, toggleMute, toggleVideo, endCall } = useWebRtc(consultationId, user?.id || 0, user?.role || 'PATIENT', accessToken);

  const handleStartCall = useCallback(async (options?: { video?: boolean }) => {
    try {
      await startCall(options);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start video call');
    }
  }, [startCall]);

  // Reaches this page from the global ring modal. The 'call' signal was already
  // delivered while we were on another route, so subscribe first and only then
  // send 'accept' - otherwise the doctor's offer has nobody listening.
  const autoAcceptedRef = useRef(false);
  useEffect(() => {
    if (!incomingParam || autoAcceptedRef.current || !isConnected) return;
    if (callState === 'ringing' && incomingCall) {
      autoAcceptedRef.current = true;
      acceptCall();
    } else if (callState === 'idle') {
      autoAcceptedRef.current = true;
      acceptCall();
    }
  }, [incomingParam, isConnected, callState, incomingCall, acceptCall]);

  const role = user?.role || 'PATIENT';
  const isDoctor = role === 'DOCTOR';
  const peerName = isDoctor ? (consultation?.patientName || 'Patient') : (consultation?.doctorName || 'Doctor');

  if (loading) return <AppLayout role={role} title="Video Consultation" subtitle="Loading..."><p className="text-body text-primary-light/60">Loading...</p></AppLayout>;
  if (!consultationId || !consultation) return <AppLayout role={role} title="Video Consultation" subtitle="Not found"><p className="text-body text-primary-light/60">Consultation not found</p></AppLayout>;

  // Incoming call ringing UI
  if (callState === 'ringing' && incomingCall) {
    const isVideoCall = incomingCall.video !== false;
    return (
      <AppLayout role={role} title="Video Consultation" subtitle={`Incoming ${isVideoCall ? 'Video' : 'Audio'} Call from ${incomingCall.fromRole}`}>
        <div className="max-w-md mx-auto">
          <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
            <div className="aspect-video bg-surface-10 relative flex flex-col items-center justify-center px-4 text-center">
              <div className="w-32 h-32 rounded-full bg-accent/15 flex items-center justify-center mb-6 animate-pulse">
                {isVideoCall ? <Video size={40} className="text-accent" /> : <Mic size={40} className="text-accent" />}
              </div>
              <p className="text-xl font-semibold text-primary-light mb-2">Incoming {isVideoCall ? 'Video' : 'Audio'} Call</p>
              <p className="text-body text-primary-light/60 mb-6">{incomingCall.fromRole} is calling...</p>
              <div className="flex gap-4">
                <button onClick={acceptCall} className="flex-1 px-6 py-3 bg-success-fill text-white font-bold rounded-input hover:bg-success-fill/90 transition-colors">Accept</button>
                <button onClick={rejectCall} className="flex-1 px-6 py-3 bg-danger-fill text-white font-bold rounded-input hover:bg-danger-fill/90 transition-colors">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calling state (doctor waiting for patient to accept)
  if (callState === 'calling') {
    return (
      <AppLayout role={role} title="Video Consultation" subtitle={`Calling ${peerName}...`}>
        <div className="max-w-md mx-auto">
          <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
            <div className="aspect-video bg-surface-10 relative flex flex-col items-center justify-center px-4 text-center">
              <div className="w-32 h-32 rounded-full bg-warning/15 flex items-center justify-center mb-6 animate-pulse">
                <Video size={40} className="text-warning" />
              </div>
              <p className="text-xl font-semibold text-primary-light mb-2">Calling {peerName}...</p>
              <p className="text-body text-primary-light/60 mb-6">Waiting for them to accept</p>
              <button onClick={endCall} className="px-6 py-3 bg-danger-fill text-white font-bold rounded-input hover:bg-danger-fill/90 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Idle / ended state. Call actions sit in the corner as icon buttons, matching
  // the layout used by mainstream messaging apps.
  if (callState === 'ended' || callState === 'idle') {
    return (
      <AppLayout role={role} title="Video Consultation" subtitle={`Consultation #${consultationId}`}>
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
            <div className="aspect-video bg-surface-10 relative flex items-center justify-center">
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <Video size={44} className="text-primary-light/25 mb-4" />
                <p className="text-body text-primary-light/60">
                  {callState === 'ended' ? 'Call ended' : `Ready to call ${peerName}`}
                </p>
                {!isConnected && (
                  <p className="mt-3 text-support text-warning-light">Connecting to signaling server...</p>
                )}
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartCall({ video: false })}
                  disabled={!isConnected}
                  title={`Call ${peerName} with audio`}
                  aria-label={`Call ${peerName} with audio`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-doctor-blue-fill text-white shadow-lg transition hover:scale-105 hover:bg-doctor-blue/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Mic size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleStartCall({ video: true })}
                  disabled={!isConnected}
                  title={`Call ${peerName} with video`}
                  aria-label={`Call ${peerName} with video`}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-success-fill text-white shadow-lg shadow-success/25 transition hover:scale-105 hover:bg-success-fill/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Video size={24} />
                </button>
              </div>
            </div>
            {error && <div className="absolute top-4 left-4 right-4 bg-danger/20 border border-danger/30 text-danger-light px-4 py-2 rounded-xl">{error}</div>}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calling / connected: remote fills the stage, local sits in the corner so
  // the doctor can see themselves the whole time, including while ringing.
  const showStage = callState === 'connected' && remoteStream;

  return (
    <AppLayout role={role} title="Video Consultation" subtitle={`Consultation #${consultationId}`}>
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
          <div className="aspect-video bg-surface-10 relative">
            {showStage ? (
              <video
                ref={(el) => { if (el && remoteStream) { el.srcObject = remoteStream; void el.play().catch(() => {}); } }}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-warning/15 text-warning">
                  <Video size={32} />
                </div>
                <p className="text-body text-primary-light/70">
                  {callState === 'connected' ? 'Waiting for their video...' : `Calling ${peerName}...`}
                </p>
                {!isConnected && (
                  <p className="mt-2 text-support text-warning-light">Connecting to signaling server...</p>
                )}
              </div>
            )}

            {/* Local self-view, always visible while the call is live. */}
            {localStream && (
              <div className="absolute bottom-4 right-4 h-32 w-24 overflow-hidden rounded-xl border border-tonal-20/60 bg-surface-10 shadow-xl sm:h-40 sm:w-32">
                <video
                  ref={(el) => { if (el && localStream) { el.srcObject = localStream; void el.play().catch(() => {}); } }}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 left-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  <User size={10} /> You
                </span>
              </div>
            )}

            {/* Peer name badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-support text-white">
              {isDoctor ? <Stethoscope size={13} /> : <User size={13} />}
              {peerName}
            </div>

            {error && <div className="absolute bottom-4 left-4 right-32 bg-danger/20 border border-danger/30 text-danger-light px-4 py-2 rounded-xl text-sm">{error}</div>}
          </div>

          <div className="flex items-center justify-center gap-4 p-4 bg-surface-10/50">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              className={`p-3 rounded-full transition ${isMuted ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
              className={`p-3 rounded-full transition ${isVideoOff ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button
              type="button"
              onClick={endCall}
              aria-label="End call"
              className="p-3 bg-danger-fill text-white rounded-full hover:bg-danger-fill/90"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function VideoConsultationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VideoConsultationContent />
    </Suspense>
  );
}


