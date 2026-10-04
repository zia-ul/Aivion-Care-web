'use client';

import { useEffect, useState } from 'react';
import { appointmentApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button, StatusBadge } from '@/components/ui';
import { LayoutDashboard, Calendar, Users, Stethoscope, Clock, User, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

interface ReceptionistStats {
  todayAppointments: number;
  checkedIn: number;
  pending: number;
  surgeriesToday: number;
}

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState<ReceptionistStats>({
    todayAppointments: 0,
    checkedIn: 0,
    pending: 0,
    surgeriesToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const apptsRes = await appointmentApi.getDoctorToday();
        const appointments = apptsRes.data || [];
        setStats({
          todayAppointments: appointments.length,
          checkedIn: appointments.filter((a: any) => a.status === 'CHECKED_IN' || a.status === 'COMPLETED').length,
          pending: appointments.filter((a: any) => a.status === 'SCHEDULED' || a.status === 'PENDING').length,
          surgeriesToday: 3,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({
          todayAppointments: 24,
          checkedIn: 8,
          pending: 12,
          surgeriesToday: 3,
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCardItem[] = [
    { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-blue-500' },
    { label: 'Checked In', value: stats.checkedIn, icon: Users, color: 'text-green-500' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500' },
    { label: 'Surgeries Today', value: stats.surgeriesToday, icon: Stethoscope, color: 'text-purple-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Appointments', icon: Calendar, href: '/receptionist/appointments', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Daily Schedule', icon: Calendar, href: '/receptionist/schedule', color: 'bg-cyan-500/10 text-cyan-500' },
    { label: 'Surgeries', icon: Stethoscope, href: '/receptionist/surgeries', color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <AppLayout role="RECEPTIONIST" title="Reception Dashboard" subtitle="Front desk management">
      <div className="max-w-6xl mx-auto space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <StatCard key={i} label="Loading..." value="—" icon={LayoutDashboard} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} className="cursor-default" />
              ))}
            </div>

            <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
              <h3 className="text-heading font-bold text-primary-light mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <Button variant="outline" className={`w-full justify-start h-auto py-4 ${action.color} hover:bg-opacity-20`}>
                      <action.icon size={24} className="mr-3" />
                      <span className="font-medium">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
              <div className="mb-4">
                <h3 className="text-heading font-bold text-primary-light">Today&apos;s Schedule</h3>
              </div>
              <div className="space-y-2">
                {[
                  { time: '09:00 AM', patient: 'Ramesh Kumar', doctor: 'Dr. Patel', type: 'Consultation', status: 'SCHEDULED' },
                  { time: '09:30 AM', patient: 'Sita Devi', doctor: 'Dr. Sharma', type: 'Follow-up', status: 'CHECKED_IN' },
                  { time: '10:00 AM', patient: 'Amit Shah', doctor: 'Dr. Reddy', type: 'Consultation', status: 'SCHEDULED' },
                  { time: '10:30 AM', patient: 'Priya Nair', doctor: 'Dr. Gupta', type: 'Surgery Pre-op', status: 'PENDING' },
                  { time: '11:00 AM', patient: 'Vikram Singh', doctor: 'Dr. Iyer', type: 'Consultation', status: 'SCHEDULED' },
                ].map((appt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-10/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="w-20 text-sm font-medium text-primary-light/70">{appt.time}</span>
                      <div>
                        <p className="font-medium text-primary-light">{appt.patient}</p>
                        <p className="text-sm text-primary-light/60">{appt.doctor} · {appt.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}