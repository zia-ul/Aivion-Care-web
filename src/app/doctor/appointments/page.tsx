'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL } from '@/components/ui/FlutterTheme';
import { User, FileText, MessageCircle, Play, Check, XCircle } from 'lucide-react';

interface Appt { id: number; patientName?: string; hospitalName?: string; appointmentDate?: string; slotTime?: string; status?: string; type?: string; chatRoomId?: number | null; }

export default function DoctorAppointments() {
  const router = useRouter();
  const [tab, setTab] = useState<'today' | 'week'>('today');
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (which: string) => {
    setLoading(true);
    try {
      // Backend: JWT-scoped endpoints (doctorId comes from token)
      const { data } = which === 'today' ? await appointmentApi.getDoctorToday() : await appointmentApi.getDoctorWeek();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(tab); }, [load, tab]);

  const setStatus = async (id: number, status: string) => {
    if (!confirm(`Mark this appointment ${status.toLowerCase()}?`)) return;
    setBusyId(id);
    try {
      await appointmentApi.updateStatus(id, { status });
      await load(tab);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  };

  const statusColor = (s?: string) => (s === 'CONFIRMED' ? FL.mint : s === 'PENDING' ? FL.gold : s === 'COMPLETED' ? FL.blue : s === 'IN_PROGRESS' ? FL.lavender : s === 'CANCELLED' ? FL.pink : FL.cyan);

  return (
    <AppLayout role="DOCTOR" title="Appointments" subtitle="Your consultation schedule">
      <div className="space-y-5">
        <div className="inline-flex rounded-2xl bg-white border border-[#B9DCE4] p-1">
          {(['today', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-[#4DD9AC] text-[#0E2A22]' : 'text-[#5B7A88] hover:text-[#132633]'}`}
            >
              {t === 'today' ? 'Today' : 'This week'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-[#5B7A88]">Loading...</p>
        ) : appointments.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#D6ECF1] p-6 text-center text-sm text-[#5B7A88]">
            No appointments in this view.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <DarkCard key={a.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold inline-flex items-center gap-2"><User size={16} className="text-[#3F8FE0]" /> {a.patientName ?? '—'}</p>
                      <Pill color={statusColor(a.status)}>{a.status ?? ''}</Pill>
                    </div>
                    <p className="text-xs text-[#8AB0C0] mt-1">{a.hospitalName ?? ''}{a.type ? ` • ${a.type}` : ''}</p>
                    <p className="text-xs text-[#8AB0C0] mt-1">{a.appointmentDate} at {String(a.slotTime ?? '').slice(0, 5)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(a.type === 'VIDEO' || a.type === 'TELECONSULT') && a.chatRoomId && (
                      <ActionButton variant="ghost" onClick={() => router.push(`/doctor/chat?roomId=${a.chatRoomId}`)}>
                        <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> Chat</span>
                      </ActionButton>
                    )}
                    <ActionButton variant="outline" onClick={() => router.push(`/doctor/consultation/${a.id}`)}>
                      <span className="inline-flex items-center gap-1.5"><FileText size={15} /> Consult</span>
                    </ActionButton>
                    {a.status !== 'IN_PROGRESS' && a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                      <ActionButton variant="ghost" disabled={busyId === a.id} onClick={() => setStatus(a.id, 'IN_PROGRESS')}>
                        <span className="inline-flex items-center gap-1.5"><Play size={15} /> Start</span>
                      </ActionButton>
                    )}
                    {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                      <>
                        <ActionButton disabled={busyId === a.id} onClick={() => setStatus(a.id, 'COMPLETED')}>
                          <span className="inline-flex items-center gap-1.5"><Check size={15} /> Complete</span>
                        </ActionButton>
                        <ActionButton variant="danger" disabled={busyId === a.id} onClick={() => setStatus(a.id, 'CANCELLED')}>
                          <span className="inline-flex items-center gap-1.5"><XCircle size={15} /> Cancel</span>
                        </ActionButton>
                      </>
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
