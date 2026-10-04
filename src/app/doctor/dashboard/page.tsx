'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { DarkCard, InnerCard, Pill, ActionButton, StatTile, FL, SectionTitle } from '@/components/ui/FlutterTheme';
import { Group, CalendarDays, TrendingUp, Siren, MessageCircle, FileText, Sparkles, Shield, DollarSign } from 'lucide-react';

interface Stats { totalPatients?: number; todayAppointments?: number; criticalCases?: number; recoveryRate?: number; totalPatientsTrend?: string; todayAppointmentsSub?: string; recoveryRateTrend?: string; criticalCasesTrend?: string; aiInsight?: string; }
interface Appt { id: number; patientName?: string; hospitalName?: string; appointmentDate?: string; slotTime?: string; status?: string; type?: string; chatRoomId?: number | null; }

export default function DoctorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({});
  const [todayAppointments, setTodayAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.doctorId) { setLoading(false); return; }
    setLoading(true);
    try {
      // Backend: GET /doctors/{id}/dashboard-stats (DashboardStatsResponse) + JWT today list
      const [{ data: s }, { data: t }] = await Promise.all([
        appointmentApi.getDoctorStats(user.doctorId),
        appointmentApi.getDoctorToday(),
      ]);
      setStats(s ?? {});
      setTodayAppointments(Array.isArray(t) ? t : []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId]);

  useEffect(() => { load(); }, [load]);

  const statusColor = (s?: string) => (s === 'CONFIRMED' ? FL.mint : s === 'PENDING' ? FL.gold : s === 'COMPLETED' ? FL.blue : s === 'IN_PROGRESS' ? FL.lavender : FL.pink);

  return (
    <AppLayout role="DOCTOR" title="Medical Dashboard" subtitle={`Dr. ${user?.fullName ?? ''}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile title="Total Patients" value={stats.totalPatients ?? 0} sub={stats.totalPatientsTrend} icon={<Group size={20} />} color={FL.mint} />
          <StatTile title="Today's Appointments" value={stats.todayAppointments ?? 0} sub={stats.todayAppointmentsSub} icon={<CalendarDays size={20} />} color={FL.blue} />
          <StatTile title="Recovery Rate" value={`${stats.recoveryRate ?? 0}%`} sub={stats.recoveryRateTrend} icon={<TrendingUp size={20} />} color={FL.mint} />
          <StatTile title="Critical Cases" value={stats.criticalCases ?? 0} sub={stats.criticalCasesTrend ?? 'Needs attention'} icon={<Siren size={20} />} color={FL.pink} />
        </div>

        {stats.aiInsight && (
          <DarkCard>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-doctor-lavender/15 flex items-center justify-center text-doctor-lavender shrink-0"><Sparkles size={18} /></div>
              <div>
                <p className="text-white font-semibold">AI Insight</p>
                <p className="text-sm text-doctor-muted mt-1">{stats.aiInsight}</p>
              </div>
            </div>
          </DarkCard>
        )}

        <div>
          <SectionTitle action={<ActionButton variant="outline" onClick={() => router.push('/doctor/appointments')}>All appointments</ActionButton>}>
            Today&apos;s appointments
          </SectionTitle>
          {loading ? (
            <p className="text-sm text-doctor-dim">Loading appointments…</p>
          ) : todayAppointments.length === 0 ? (
            <div className="rounded-3xl bg-white border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">No appointments scheduled for today.</div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((a) => (
                <DarkCard key={a.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold">{a.patientName ?? '—'}</p>
                        <Pill color={statusColor(a.status)}>{a.status ?? ''}</Pill>
                      </div>
                      <p className="text-xs text-doctor-muted mt-1">{a.hospitalName ?? ''}{a.type ? ` • ${a.type}` : ''}</p>
                      <p className="text-xs text-doctor-muted mt-1">{a.appointmentDate} at {String(a.slotTime ?? '').slice(0, 5)}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {(a.type === 'VIDEO' || a.type === 'TELECONSULT') && a.chatRoomId && (
                        <ActionButton variant="ghost" onClick={() => router.push(`/doctor/chat?roomId=${a.chatRoomId}`)}>
                          <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> Chat</span>
                        </ActionButton>
                      )}
                      <ActionButton onClick={() => router.push(`/doctor/consultation/${a.id}`)}>
                        <span className="inline-flex items-center gap-1.5"><FileText size={15} /> Consult</span>
                      </ActionButton>
                    </div>
                  </div>
                </DarkCard>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button onClick={() => router.push('/doctor/patients')}><InnerCard className="text-center"><p className="text-white font-semibold">My Patients</p><p className="text-xs text-doctor-muted mt-1">Patient directory</p></InnerCard></button>
          <button onClick={() => router.push('/doctor/schedule')}><InnerCard className="text-center"><p className="text-white font-semibold">Schedule</p><p className="text-xs text-doctor-muted mt-1">Availability & slots</p></InnerCard></button>
          <button onClick={() => router.push('/doctor/reports')}><InnerCard className="text-center"><p className="text-white font-semibold">Reports</p><p className="text-xs text-doctor-muted mt-1">Performance & trends</p></InnerCard></button>
          <button onClick={() => router.push('/doctor/diagnosis')}><InnerCard className="text-center"><p className="text-white font-semibold">AI Diagnosis</p><p className="text-xs text-doctor-muted mt-1">Notes & draft Rx</p></InnerCard></button>
          <button onClick={() => router.push('/doctor/ecg')}><InnerCard className="text-center"><p className="text-white font-semibold">ECG Monitor</p><p className="text-xs text-doctor-muted mt-1">Vitals overview</p></InnerCard></button>
          <button onClick={() => router.push('/notifications')}><InnerCard className="text-center"><p className="text-white font-semibold">Alerts</p><p className="text-xs text-doctor-muted mt-1">Notifications</p></InnerCard></button>
        </div>
      </div>
    </AppLayout>
  );
}
