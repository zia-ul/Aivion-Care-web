'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL } from '@/components/ui/FlutterTheme';
import { User, FileText, MessageCircle, Play, Check, XCircle } from 'lucide-react';

interface Appt { id: number; patientName?: string; hospitalName?: string; appointmentDate?: string; slotTime?: string; status?: string; type?: string; chatRoomId?: number | null; }

type Tab = 'today' | 'week' | 'all';

export default function DoctorAppointments() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('today');
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (which: Tab) => {
    setLoading(true);
    try {
      // Backend: JWT-scoped endpoints (doctorId comes from token).
      // "all" uses the doctor-scoped list, which is the only endpoint that
      // returns past appointments - today/week are forward looking date ranges.
      const { data } = which === 'today'
        ? await appointmentApi.getDoctorToday()
        : which === 'week'
          ? await appointmentApi.getDoctorWeek()
          : await appointmentApi.getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(tab); }, [load, tab]);

  const today = new Date().toISOString().split('T')[0];
  const isUpcoming = (a: Appt) =>
    (a.appointmentDate ?? '') >= today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED';

  const byDateAsc = (a: Appt, b: Appt) =>
    `${a.appointmentDate ?? ''}${String(a.slotTime ?? '')}`.localeCompare(`${b.appointmentDate ?? ''}${String(b.slotTime ?? '')}`);
  const byDateDesc = (a: Appt, b: Appt) => byDateAsc(b, a);

  const upcoming = tab === 'all' ? appointments.filter(isUpcoming).sort(byDateAsc) : appointments;
  const past = tab === 'all' ? appointments.filter((a) => !isUpcoming(a)).sort(byDateDesc) : [];
  const list = tab === 'all' ? upcoming : appointments;

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

  const renderCard = (a: Appt) => (
    <DarkCard key={a.id}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold inline-flex items-center gap-2 text-primary-light"><User size={16} className="text-doctor-blue" /> {a.patientName ?? '—'}</p>
            <Pill color={statusColor(a.status)}>{a.status ?? ''}</Pill>
          </div>
          <p className="text-xs text-doctor-muted mt-1">{a.hospitalName ?? ''}{a.type ? ` • ${a.type}` : ''}</p>
          <p className="text-xs text-doctor-muted mt-1">{a.appointmentDate} at {String(a.slotTime ?? '').slice(0, 5)}</p>
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
  );

  return (
    <AppLayout role="DOCTOR" title="Appointments" subtitle="Your consultation schedule">
      <div className="space-y-5">
        {/* Colours are all theme tokens: bg-surface-30 / tonal-20 flip with the
            theme, so this reads as a raised bar on light and dark alike. */}
        <div className="inline-flex rounded-2xl border border-tonal-20 bg-surface-30 p-1">
          {(['today', 'week', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${tab === t ? 'bg-accent-fill text-white' : 'text-primary-light/60 hover:text-primary-light'}`}
            >
              {t === 'today' ? 'Today' : t === 'week' ? 'This week' : 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-primary-light/60">Loading...</p>
        ) : list.length === 0 && past.length === 0 ? (
          <div className="rounded-3xl border border-tonal-20 bg-surface-20 p-6 text-center text-sm text-primary-light/60">
            No appointments in this view.
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="space-y-3">
                {upcoming.map(renderCard)}
              </div>
            )}

            {past.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-light/50">
                    Past appointments ({past.length})
                  </p>
                  <div className="h-px flex-1 bg-tonal-20" />
                </div>                {past.map(renderCard)}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
