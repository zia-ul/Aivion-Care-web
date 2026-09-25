'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { chatApi, consultationApi } from '@/lib/api/endpoints';
import { useWebRtc } from '@/lib/webrtc/use-webrtc';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';

function VideoConsultationContent() {
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const { user } = useAuthStore();
  const [consultation, setConsultation] = useState<any>(null);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadConsultation = useCallback(async () => {
    if (!consultationId) {
      setLoading(false);
      return;
    }
    try {
      // Video page receives appointmentId (?id=appointmentId); canonical backend fetch is by appointment.
      const { data } = await consultationApi.getByAppointment(consultationId);
      setConsultation(data);
      try {
        const room = await chatApi.getRoomByAppointment(data?.appointmentId ?? consultationId);
        setChatRoomId(room?.data?.id ?? null);
      } catch {
        setChatRoomId(null);
      }
    } catch (error) {
      console.error('Failed to load consultation:', error);
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  const { localStream, remoteStream, isCallActive, isMuted, isVideoOff, error, startCall, toggleMute, toggleVideo, endCall } = useWebRtc(consultationId, user?.id || 0, user?.role || 'PATIENT', chatRoomId);

  const handleStartCall = useCallback(async () => {
    try {
      await startCall();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start video call');
    }
  }, [startCall]);

  const role = user?.role || 'PATIENT';

  if (loading) return <AppLayout role={role} title="Video Consultation" subtitle="Loading..."><p className="text-body text-primary-light/60">Loading...</p></AppLayout>;
  if (!consultationId || !consultation) return <AppLayout role={role} title="Video Consultation" subtitle="Not found"><p className="text-body text-primary-light/60">Consultation not found</p></AppLayout>;

  return (
    <AppLayout role={role} title="Video Consultation" subtitle={`Consultation #${consultationId}`}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
          <div className="aspect-video bg-surface-0 relative">
            {isCallActive ? (
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="relative bg-surface-0"><video ref={(el) => { if (el && localStream) el.srcObject = localStream; }} autoPlay playsInline muted className="w-full h-full object-cover" /><p className="absolute bottom-2 left-2 text-support text-primary-light/70 bg-surface-10/50 px-2 py-1 rounded">You</p></div>
                <div className="relative bg-surface-0"><video ref={(el) => { if (el && remoteStream) el.srcObject = remoteStream; }} autoPlay playsInline className="w-full h-full object-cover" /><p className="absolute bottom-2 left-2 text-support text-primary-light/70 bg-surface-10/50 px-2 py-1 rounded">{role === 'DOCTOR' ? 'Patient' : 'Doctor'}</p></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Video size={48} className="text-primary-light/30 mb-4" />
                <p className="text-body text-primary-light/60 mb-4">Ready to start video consultation</p>
                <button onClick={handleStartCall} className="px-6 py-3 bg-success text-surface-0 font-bold rounded-input hover:bg-success/90 transition-colors">Start Video Call</button>
              </div>
            )}
            {error && <div className="absolute top-4 left-4 right-4 bg-danger/20 border border-danger/30 text-danger-light px-4 py-2 rounded-xl">{error}</div>}
          </div>
          {isCallActive && (
            <div className="flex items-center justify-center gap-4 p-4 bg-surface-10/50">
              <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}>{isMuted ? <MicOff size={20} /> : <Mic size={20} />}</button>
              <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-danger/20 text-danger-light' : 'bg-surface-20 text-primary-light hover:bg-surface-30'}`}>{isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}</button>
              <button onClick={endCall} className="p-3 bg-danger text-surface-0 rounded-full hover:bg-danger/90"><PhoneOff size={20} /></button>
            </div>
          )}
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
