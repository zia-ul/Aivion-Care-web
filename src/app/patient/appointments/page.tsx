'use client';

import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi, chatApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, SectionTitle } from '@/components/ui/FlutterTheme';
import { CalendarDays, MessageCircle, XCircle, Clock } from 'lucide-react';

interface Appt {
  id: number; doctorName?: string; hospitalName?: string; appointmentDate?: string; slotTime?: string;
  status?: string; type?: string; tokenNumber?: string; chatRoomId?: number | null;
}

export default function PatientAppointmentsPage() {
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await appointmentApi.getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingIds = new Set(
    appointments
      .filter((a) => (a.appointmentDate ?? '') >= today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED')
      .map((a) => a.id)
  );
  const upcoming = appointments.filter((a) => upcomingIds.has(a.id))
    .sort((a, b) => (a.appointmentDate ?? '').localeCompare(b.appointmentDate ?? ''));
  const history = appointments.filter((a) => !upcomingIds.has(a.id))
    .sort((a, b) => (b.appointmentDate ?? '').localeCompare(a.appointmentDate ?? ''));

  const cancel = async (id: number) => {
    if (!confirm('Cancel this appointment?')) return;
    setCancellingId(id);
    try {
      // Backend: PATCH /appointments/{id}/status { status, cancellationReason }
      await appointmentApi.updateStatus(id, { status: 'CANCELLED', cancellationReason: 'Cancelled by patient' });
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  const openChat = async (appt: Appt) => {
    if (appt.chatRoomId) return routerPushChat(appt.chatRoomId);
    try {
      const { data } = await chatApi.getRoomByAppointment(appt.id);
      if (data?.id) return routerPushChat(data.id);
      alert('Chat room is not available for this appointment.');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Chat room is not available for this appointment.');
    }
  };

  const routerPushChat = (roomId: number) => {
    window.location.assign(`/patient/chat?roomId=${roomId}`);
  };

  const list = tab === 'upcoming' ? upcoming : history;
  const statusColor = (s?: string) => (s === 'CONFIRMED' ? FL.mint : s === 'PENDING' ? FL.gold : s === 'COMPLETED' ? FL.blue : s === 'IN_PROGRESS' ? FL.lavender : FL.pink);

  return (
    <AppLayout role="PATIENT" title="My Appointments" subtitle="Upcoming and past visits">
      <div className="space-y-5">
        <div className="inline-flex rounded-2xl bg-white border border-[#B9DCE4] p-1">
          {(['upcoming', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-[#4DD9AC] text-[#0E2A22]' : 'text-[#5B7A88] hover:text-[#132633]'}`}
            >
              {t === 'upcoming' ? 'Upcoming' : 'History'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-[#5B7A88]">Loading...</p>
        ) : list.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#D6ECF1] p-6 text-center text-sm text-[#5B7A88]">
            {tab === 'upcoming' ? 'No upcoming appointments.' : 'No past appointments yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((a) => (
              <DarkCard key={a.id} tone="patient">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold">Dr. {a.doctorName ?? '—'}</p>
                      <Pill color={statusColor(a.status)}>{a.status ?? ''}</Pill>
                    </div>
                    <p className="text-xs text-[#8AB0C0] mt-1">{a.hospitalName ?? ''}{a.type ? ` • ${a.type}` : ''}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#8AB0C0]">
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {a.appointmentDate}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12} /> {String(a.slotTime ?? '').slice(0, 5)}</span>
                      {a.tokenNumber && <span>Token #{a.tokenNumber}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(a.type === 'VIDEO' || a.type === 'TELECONSULT') && a.status !== 'CANCELLED' && (
                      <ActionButton variant="ghost" onClick={() => openChat(a)}>
                        <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> Chat</span>
                      </ActionButton>
                    )}
                    {tab === 'upcoming' && a.status !== 'CANCELLED' && (
                      <ActionButton variant="danger" disabled={cancellingId === a.id} onClick={() => cancel(a.id)}>
                        <span className="inline-flex items-center gap-1.5"><XCircle size={15} /> {cancellingId === a.id ? 'Cancelling...' : 'Cancel'}</span>
                      </ActionButton>
                    )}
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
