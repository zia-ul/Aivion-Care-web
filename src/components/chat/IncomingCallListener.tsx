'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentApi } from '@/lib/api/endpoints';
import { webrtcWsService } from '@/lib/websocket/webrtc-client';
import { useAuthStore } from '@/lib/stores/auth';

interface IncomingCall {
  consultationId: number;
  fromRole: string;
  video: boolean;
}

/**
 * Call invitations are broadcast to `/topic/webrtc/{consultationId}`. Without a
 * listener mounted app-wide, a patient only rang while already sitting on the
 * consultation page, so a call started from the dashboard was never seen.
 */
export function IncomingCallListener() {
  const { accessToken, user } = useAuthStore();
  const router = useRouter();
  const [incoming, setIncoming] = useState<IncomingCall | null>(null);
  const selfIdRef = useRef<number | undefined>(user?.id);
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => { selfIdRef.current = user?.id; }, [user?.id]);

  useEffect(() => {
    if (!accessToken) return;

    webrtcWsService.connect(accessToken);
    const unsubscribers: Array<() => void> = [() => webrtcWsService.disconnect()];
    cleanupRef.current = unsubscribers;

    const watch = async () => {
      try {
        const { data } = await appointmentApi.getMyAppointments();
        const appointments = Array.isArray(data) ? data : [];

        appointments.forEach((appointment: { id?: number }) => {
          if (appointment?.id == null) return;
          const destination = `/topic/webrtc/${appointment.id}`;

          const off = webrtcWsService.subscribe(destination, (message: any) => {
            if (!message || typeof message !== 'object') return;
            // Ignore the echo of our own broadcast.
            if (selfIdRef.current != null && message.senderId === selfIdRef.current) return;
            if (message.type !== 'call') return;

            const isFromDoctor = message.senderRole === 'DOCTOR';
            if (!isFromDoctor) return;

            setIncoming({
              consultationId: Number(message.consultationId ?? appointment.id),
              fromRole: message.senderRole ?? 'DOCTOR',
              video: message.data?.video !== false,
            });
            toast('Incoming video call', { icon: '📞' });
          });

          unsubscribers.push(off);
        });
      } catch (error) {
        // Silent: this is a background listener, not a user-initiated action.
        console.warn('Incoming call listener could not load appointments:', error);
      }
    };

    void watch();

    return () => {
      unsubscribers.forEach((off) => {
        try { off(); } catch { /* already gone */ }
      });
      cleanupRef.current = [];
    };
  }, [accessToken]);

  const accept = useCallback(() => {
    if (!incoming) return;
    const { consultationId } = incoming;
    setIncoming(null);
    // `incoming=1` tells the page to accept immediately instead of waiting for
    // the doctor to press the button a second time.
    router.push(`/video/consultation?id=${consultationId}&incoming=1`);
  }, [incoming, router]);

  const reject = useCallback(() => {
    if (!incoming) return;
    webrtcWsService.send(`/webrtc/signal/${incoming.consultationId}`, {
      type: 'reject',
      senderId: selfIdRef.current ?? 0,
      senderRole: user?.role ?? 'PATIENT',
      consultationId: incoming.consultationId,
      data: {},
    });
    setIncoming(null);
  }, [incoming, user?.role]);

  if (!incoming) return null;

  const isVideo = incoming.video;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-tonal-20/60 bg-surface-20 p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-accent/15 text-accent">
          {isVideo ? <Video size={34} /> : <Mic size={34} />}
        </div>
        <p className="mt-5 text-lg font-semibold text-primary-light">
          Incoming {isVideo ? 'video' : 'audio'} call
        </p>
        <p className="mt-1 text-sm text-primary-light/60">
          {incoming.fromRole === 'DOCTOR' ? 'Your doctor' : incoming.fromRole} is calling you.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded-xl bg-success-fill px-4 py-3 font-bold text-white transition hover:bg-success-fill/90"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={reject}
            aria-label="Reject call"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-fill text-white transition hover:bg-danger-fill/90"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
