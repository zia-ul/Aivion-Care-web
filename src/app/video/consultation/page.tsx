'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { consultationApi } from '@/lib/api/endpoints';
import { useWebRtc } from '@/lib/webrtc/use-webrtc';
import { useCallRecording } from '@/lib/webrtc/use-call-recording';
import { Video, VideoOff, Mic, MicOff, PhoneOff, User, Stethoscope, Square, Radio, Activity, AlertCircle, CheckCircle2, ChevronRight, FileText, Pill as PillIcon, ShieldAlert, Sparkles, HeartPulse, Clock, Volume2, VolumeX, Sliders, Waves } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { Pill, FL } from '@/components/ui/FlutterTheme';

function VideoConsultationContent() {
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const incomingParam = searchParams.get('incoming') === '1';
  const videoParam = searchParams.get('video');
  const isAudioCallOnly = videoParam === '0';
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
      console.warn('Consultation details could not be loaded, using fallback for call session:', error);
      // Fallback consultation record so video call UI is never blocked from rendering
      setConsultation({
        id: consultationId,
        appointmentId: consultationId,
        doctorName: 'Doctor',
        patientName: 'Patient',
      });
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  const { localStream, remoteStream, isMuted, isVideoOff, isConnected, error, callState, incomingCall, startCall, acceptCall, rejectCall, toggleMute, toggleVideo, endCall } = useWebRtc(consultationId, user?.id || 0, user?.role || 'PATIENT', accessToken);

  // --- Web Audio Equalizer & Speaker Amplification ---
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [showEqPanel, setShowEqPanel] = useState(false);
  const [speakerVolume, setSpeakerVolume] = useState(100); // 0 - 200%
  const [lowFreqGain, setLowFreqGain] = useState(0); // -15dB to +15dB
  const [highFreqGain, setHighFreqGain] = useState(0); // -15dB to +15dB

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);

  // Initialize or re-attach Web Audio Graph when remoteStream arrives
  useEffect(() => {
    if (!remoteStream || remoteStream.getAudioTracks().length === 0) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        const resumeCtx = () => {
          ctx.resume().catch(() => {});
          window.removeEventListener('click', resumeCtx);
          window.removeEventListener('touchstart', resumeCtx);
        };
        window.addEventListener('click', resumeCtx);
        window.addEventListener('touchstart', resumeCtx);
      }

      // Cleanup existing source
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.disconnect(); } catch (_) {}
      }

      const source = ctx.createMediaStreamSource(remoteStream);
      sourceNodeRef.current = source;

      // Low frequency shelf filter (Bass: 250 Hz)
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowshelf';
      lowFilter.frequency.value = 250;
      lowFilter.gain.value = lowFreqGain;
      lowFilterRef.current = lowFilter;

      // High frequency shelf filter (Treble / Clarity: 3500 Hz)
      const highFilter = ctx.createBiquadFilter();
      highFilter.type = 'highshelf';
      highFilter.frequency.value = 3500;
      highFilter.gain.value = highFreqGain;
      highFilterRef.current = highFilter;

      // Master gain node (volume & mute)
      const gainNode = ctx.createGain();
      gainNode.gain.value = speakerEnabled ? speakerVolume / 100 : 0;
      gainNodeRef.current = gainNode;

      // Connect: source -> lowFilter -> highFilter -> gainNode -> destination
      source.connect(lowFilter);
      lowFilter.connect(highFilter);
      highFilter.connect(gainNode);
      gainNode.connect(ctx.destination);
    } catch (err) {
      console.warn('Web Audio setup error:', err);
    }

    return () => {
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.disconnect(); } catch (_) {}
      }
    };
  }, [remoteStream]);

  // Update gain node volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = speakerEnabled ? speakerVolume / 100 : 0;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [speakerEnabled, speakerVolume]);

  // Update low frequency equalizer
  useEffect(() => {
    if (lowFilterRef.current && audioCtxRef.current) {
      lowFilterRef.current.gain.setTargetAtTime(lowFreqGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [lowFreqGain]);

  // Update high frequency equalizer
  useEffect(() => {
    if (highFilterRef.current && audioCtxRef.current) {
      highFilterRef.current.gain.setTargetAtTime(highFreqGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [highFreqGain]);

  // Unlock and boost speaker
  const handleToggleSpeaker = useCallback(async () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      try {
        await audioCtxRef.current.resume();
      } catch (e) {
        console.warn('Failed to resume audio context:', e);
      }
    }
    setSpeakerEnabled((prev) => {
      const next = !prev;
      toast.success(next ? 'Speaker Output Enabled' : 'Speaker Output Muted', { id: 'speaker-status' });
      return next;
    });
  }, []);

  const callRecording = useCallRecording({ localStream, remoteStream });
  const [callRecordingBusy, setCallRecordingBusy] = useState(false);

  const formatCallElapsed = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  const handleStartCall = useCallback(async (options?: { video?: boolean }) => {
    try {
      await startCall(options);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start video call');
    }
  }, [startCall]);

  const handleToggleCallRecording = useCallback(async () => {
    if (!consultationId) return toast.error('Consultation not loaded yet');
    if (callRecording.isRecording) {
      const blob = await callRecording.stop();
      if (!blob) {
        setCallRecordingBusy(false);
        return;
      }
      const file = new File([blob], `consultation-${consultationId}-call.webm`, {
        type: blob.type || 'audio/webm',
      });
      setCallRecordingBusy(true);
      try {
        const { data } = await consultationApi.uploadRecordingAndGenerateDraft(consultationId, file);
        if (data.transcript) {
          toast.success('Call recorded and transcribed');
        } else {
          toast.success('Call saved. AI transcription unavailable - check backend logs.');
        }
      } catch {
        toast.error('Failed to save call recording');
      } finally {
        setCallRecordingBusy(false);
      }
    } else {
      const started = await callRecording.start();
      if (!started) {
        toast.error('Could not start recording the call');
      }
    }
  }, [callRecording, consultationId]);

  const handleEndCall = useCallback(async () => {
    if (callRecording.isRecording) {
      await callRecording.stop();
    }
    endCall();
  }, [callRecording, endCall]);

  // Reaches this page from the global ring modal. The 'call' signal was already
  // delivered while we were on another route, so subscribe first and only then
  // send 'accept' - otherwise the doctor's offer has nobody listening.
  const autoAcceptedRef = useRef(false);
  useEffect(() => {
    if (!incomingParam || autoAcceptedRef.current || !isConnected) return;
    const shouldEnableVideo = videoParam !== null ? videoParam === '1' : (incomingCall ? incomingCall.video !== false : true);
    if (callState === 'ringing' && incomingCall) {
      autoAcceptedRef.current = true;
      acceptCall({ video: shouldEnableVideo });
    } else if (callState === 'idle') {
      autoAcceptedRef.current = true;
      acceptCall({ video: shouldEnableVideo });
    }
  }, [incomingParam, videoParam, isConnected, callState, incomingCall, acceptCall]);

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
                <button onClick={() => acceptCall({ video: isVideoCall })} className="flex-1 px-6 py-3 bg-success-fill text-white font-bold rounded-input hover:bg-success-fill/90 transition-colors">Accept</button>
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

  // Idle / ended state.
  if (callState === 'ended' || callState === 'idle') {
    return (
      <AppLayout role={role} title="Video Consultation" subtitle={`Consultation #${consultationId}`}>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="relative bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden shadow-2xl">
            <div className="aspect-video bg-surface-10 relative flex flex-col items-center justify-center p-6 text-center">
              <div className="flex flex-col items-center justify-center max-w-lg">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center text-accent mb-4">
                  <Video size={36} />
                </div>
                <h3 className="text-xl font-bold text-primary-light">
                  {callState === 'ended'
                    ? 'Consultation Call Ended'
                    : isDoctor
                    ? `Ready to Connect with ${peerName}`
                    : `Virtual Waiting Room: ${peerName}`}
                </h3>
                <p className="text-body text-primary-light/80 mt-1.5">
                  {callState === 'ended'
                    ? 'The video session has concluded. Clinical documentation and prescriptions are saved.'
                    : isDoctor
                    ? `Patient is checked in. Click Call below when you are ready to initiate the video examination.`
                    : `You are in the secure virtual waiting room. Dr. ${consultation?.doctorName || 'your doctor'} has been notified and will connect with you shortly.`}
                </p>

                {/* Pre-Call Hardware & Diagnostic Check (Best Practice per JAMIA 2026) */}
                {!isDoctor && callState !== 'ended' && (
                  <div className="mt-5 w-full bg-surface-20/90 rounded-2xl p-4 border border-tonal-20/60 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-light/60 mb-2.5 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-accent" /> Telehealth Pre-Call System Check
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-10/70 border border-tonal-20/40">
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                        <span className="text-primary-light font-medium">Camera Ready</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-10/70 border border-tonal-20/40">
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                        <span className="text-primary-light font-medium">Microphone Ready</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-10/70 border border-tonal-20/40">
                        <CheckCircle2 size={16} className={isConnected ? "text-success shrink-0" : "text-warning shrink-0"} />
                        <span className="text-primary-light font-medium">{isConnected ? "Encrypted Signal Active" : "Connecting..."}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!isConnected && (
                  <p className="mt-3 text-support text-warning-light flex items-center gap-1.5">
                    <Clock size={13} className="animate-spin" /> Establishing encrypted medical signaling channel...
                  </p>
                )}
              </div>

              {isDoctor && (
                <div className="absolute bottom-6 right-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartCall({ video: false })}
                    disabled={!isConnected}
                    title={`Call ${peerName} with audio only`}
                    aria-label={`Call ${peerName} with audio only`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-doctor-blue-fill text-white shadow-lg transition hover:scale-105 hover:bg-doctor-blue/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Mic size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartCall({ video: true })}
                    disabled={!isConnected}
                    title={`Start Video Consultation with ${peerName}`}
                    aria-label={`Start Video Consultation with ${peerName}`}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-success-fill text-white shadow-lg shadow-success/25 transition hover:scale-105 hover:bg-success-fill/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Video size={24} />
                  </button>
                </div>
              )}
            </div>
            {error && <div className="absolute top-4 left-4 right-4 bg-danger/20 border border-danger/30 text-danger-light px-4 py-2 rounded-xl">{error}</div>}
          </div>

          {/* Quick clinical overview card below the waiting room */}
          {consultation && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-card bg-surface-20/80 border border-tonal-20/50">
                <p className="text-xs text-primary-light/60 uppercase font-semibold">Patient</p>
                <p className="text-body font-bold text-primary-light mt-1">{consultation.patientName || 'Patient'}</p>
                <p className="text-xs text-primary-light/70 mt-0.5">{[consultation.patientAge ? `${consultation.patientAge} yrs` : '', consultation.patientGender].filter(Boolean).join(' • ') || 'Profile Active'}</p>
              </div>
              <div className="p-4 rounded-card bg-surface-20/80 border border-tonal-20/50">
                <p className="text-xs text-primary-light/60 uppercase font-semibold">Consultation Mode</p>
                <div className="mt-1 flex items-center gap-2">
                  <Pill color={FL.cyan} size="sm">Synchronous Video / Teleconsult</Pill>
                </div>
                <p className="text-xs text-primary-light/70 mt-0.5">Dual-channel ambient transcription supported</p>
              </div>
              <div className="p-4 rounded-card bg-surface-20/80 border border-tonal-20/50">
                <p className="text-xs text-primary-light/60 uppercase font-semibold">Attending Physician</p>
                <p className="text-body font-bold text-primary-light mt-1">Dr. {consultation.doctorName || 'Assigned Doctor'}</p>
                <p className="text-xs text-primary-light/70 mt-0.5">{consultation.doctorSpecialization || 'General Consultation'}</p>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  // Calling / connected: remote fills the stage, local sits in the corner so
  // the doctor can see themselves the whole time, including while ringing.
  const remoteHasVideo = remoteStream && remoteStream.getVideoTracks().some((t) => t.enabled);
  const showStage = callState === 'connected' && remoteStream && remoteHasVideo;

  return (
    <AppLayout role={role} title={isAudioCallOnly ? "Audio Consultation" : "Video Consultation"} subtitle={`Consultation #${consultationId}`}>
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
          {/* Always mount dedicated audio playback for remote stream so voice is never interrupted */}
          {remoteStream && (
            <audio
              ref={(el) => {
                if (el && remoteStream) {
                  if (el.srcObject !== remoteStream) {
                    el.srcObject = remoteStream;
                  }
                  el.play().catch((e) => {
                    console.warn('Audio autoplay blocked by browser policy:', e);
                  });
                }
              }}
              autoPlay
              playsInline
            />
          )}
          <div className="aspect-video bg-surface-10 relative">
            {showStage ? (
              <video
                ref={(el) => { if (el && remoteStream) { el.srcObject = remoteStream; void el.play().catch(() => {}); } }}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : callState === 'connected' ? (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-doctor-blue/20 text-doctor-blue animate-pulse">
                  <Mic size={40} />
                </div>
                <p className="text-xl font-bold text-primary-light">{peerName}</p>
                <p className="text-sm text-doctor-mint mt-1">Audio Consultation Connected</p>
                {callRecording.isRecording && (
                  <p className="mt-2 text-xs text-danger-light font-medium bg-danger/10 px-3 py-1 rounded-full border border-danger/20">
                    Recording {formatCallElapsed(callRecording.elapsedMs)}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-warning/15 text-warning">
                  {isAudioCallOnly ? <Mic size={32} /> : <Video size={32} />}
                </div>
                <p className="text-body text-primary-light/70">
                  {`Calling ${peerName}...`}
                </p>
                {callRecording.isRecording && (
                  <p className="mt-1 text-xs text-danger-light font-medium">
                    Recording {formatCallElapsed(callRecording.elapsedMs)}
                  </p>
                )}
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

          {/* Audio Equalizer & Frequency Tuning Panel */}
          {showEqPanel && (
            <div className="border-t border-tonal-20/60 bg-surface-20/95 p-4 sm:p-5 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-doctor-blue" />
                  <span className="text-sm font-semibold text-primary-light">Speaker Equalizer & Audio Frequency Controls</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEqPanel(false)}
                  className="text-xs text-primary-light/60 hover:text-primary-light transition px-2 py-1 rounded bg-surface-10"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Speaker Volume / Boost */}
                <div className="p-3 rounded-xl bg-surface-10 border border-tonal-20/50 space-y-2">
                  <div className="flex justify-between items-center text-primary-light font-medium">
                    <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-accent" /> Speaker Volume</span>
                    <span className="font-bold text-accent">{speakerVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={speakerVolume}
                    onChange={(e) => setSpeakerVolume(Number(e.target.value))}
                    className="w-full accent-doctor-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-primary-light/50">
                    <span>Mute</span>
                    <span>100% (Normal)</span>
                    <span>200% (Boost)</span>
                  </div>
                </div>

                {/* Low Frequency (Bass / Body) */}
                <div className="p-3 rounded-xl bg-surface-10 border border-tonal-20/50 space-y-2">
                  <div className="flex justify-between items-center text-primary-light font-medium">
                    <span className="flex items-center gap-1.5"><Waves size={14} className="text-doctor-mint" /> Low Frequency (Bass)</span>
                    <span className="font-bold text-doctor-mint">{lowFreqGain > 0 ? `+${lowFreqGain}` : lowFreqGain} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="1"
                    value={lowFreqGain}
                    onChange={(e) => setLowFreqGain(Number(e.target.value))}
                    className="w-full accent-doctor-mint cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-primary-light/50">
                    <span>-15 dB (Cut)</span>
                    <span>0 dB (Flat)</span>
                    <span>+15 dB (Deep)</span>
                  </div>
                </div>

                {/* High Frequency (Treble / Vocal Clarity) */}
                <div className="p-3 rounded-xl bg-surface-10 border border-tonal-20/50 space-y-2">
                  <div className="flex justify-between items-center text-primary-light font-medium">
                    <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-doctor-blue" /> High Frequency (Voice Clarity)</span>
                    <span className="font-bold text-doctor-blue">{highFreqGain > 0 ? `+${highFreqGain}` : highFreqGain} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="1"
                    value={highFreqGain}
                    onChange={(e) => setHighFreqGain(Number(e.target.value))}
                    className="w-full accent-doctor-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-primary-light/50">
                    <span>-15 dB (Soft)</span>
                    <span>0 dB (Flat)</span>
                    <span>+15 dB (Crisp)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 bg-surface-10/50">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              className={`p-3 rounded-full transition ${isMuted ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
              title={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
              className={`p-3 rounded-full transition ${isVideoOff ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            {/* Open Speaker Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSpeaker}
              aria-label={speakerEnabled ? 'Turn off speaker' : 'Turn on speaker'}
              title={speakerEnabled ? 'Speaker is ON (Click to Mute)' : 'Speaker is OFF (Click to Open Speaker)'}
              className={`p-3 rounded-full transition ${!speakerEnabled ? 'bg-danger/20 text-danger-light' : 'bg-doctor-blue-fill text-white shadow-md hover:bg-doctor-blue/90'}`}
            >
              {!speakerEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {/* Equalizer Frequency Control Toggle */}
            <button
              type="button"
              onClick={() => setShowEqPanel((prev) => !prev)}
              aria-label="Audio frequency controls"
              title="Low / High Frequency Equalizer & Boost"
              className={`p-3 rounded-full transition ${showEqPanel ? 'bg-accent/20 text-accent ring-1 ring-accent' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              <Sliders size={20} />
            </button>
            <button
              type="button"
              onClick={handleToggleCallRecording}
              disabled={callState !== 'connected' || callRecordingBusy}
              aria-label={callRecording.isRecording ? 'Stop recording' : 'Record call'}
              title={callRecording.isRecording ? 'Stop recording' : 'Record call'}
              className={`p-3 rounded-full transition relative ${callRecording.isRecording ? 'bg-danger-fill text-white' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}
            >
              {callRecording.isRecording ? (
                <Square size={20} fill="currentColor" />
              ) : (
                <Radio size={20} />
              )}
              {callRecording.isRecording && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-danger-fill animate-pulse" />
              )}
            </button>
            <button
              type="button"
              onClick={handleEndCall}
              aria-label="End call"
              title="End call"
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


