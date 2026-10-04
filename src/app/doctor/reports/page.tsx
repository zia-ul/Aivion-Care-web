'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi } from '@/lib/api/endpoints';
import { DarkCard, StatTile, FL } from '@/components/ui/FlutterTheme';
import { BarChart3, CalendarDays, CheckCircle2, Users } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

interface ReportStats {
  totalPatients?: number;
  todayAppointments?: number;
  criticalCases?: number;
  recoveryRate?: number;
  totalPatientsTrend?: string;
  todayAppointmentsSub?: string;
  recoveryRateTrend?: string;
  criticalCasesTrend?: string;
}

export default function DoctorReportsPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ReportStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.doctorId) return;
    appointmentApi.getDoctorStats(user.doctorId)
      .then(({ data }) => setStats(data ?? {}))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, [user?.doctorId]);

  return (
    <AppLayout role="DOCTOR" title="Reports" subtitle="Performance and care trends">
      <div className="space-y-5">
        {loading ? <p className="text-sm text-doctor-dim">Loading reports...</p> : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile title="Patients" value={stats.totalPatients ?? 0} sub={stats.totalPatientsTrend} icon={<Users size={20} />} color={FL.mint} />
            <StatTile title="Appointments" value={stats.todayAppointments ?? 0} sub={stats.todayAppointmentsSub} icon={<CalendarDays size={20} />} color={FL.blue} />
            <StatTile title="Recovery rate" value={`${stats.recoveryRate ?? 0}%`} sub={stats.recoveryRateTrend} icon={<CheckCircle2 size={20} />} color={FL.mint} />
            <StatTile title="Critical cases" value={stats.criticalCases ?? 0} sub={stats.criticalCasesTrend ?? 'Needs attention'} icon={<BarChart3 size={20} />} color={FL.pink} />
          </div>
        )}
        <DarkCard>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><BarChart3 size={19} className="text-doctor-mint" /> Care overview</h2>
          <p className="mt-2 text-sm leading-6 text-doctor-muted">Use these indicators to review patient volume, appointments, recovery progress, and cases that need follow-up. Detailed trends are sourced from the doctor dashboard API.</p>
        </DarkCard>
      </div>
    </AppLayout>
  );
}
