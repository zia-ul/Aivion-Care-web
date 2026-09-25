'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import { BarChart3, Building2, Users, Activity } from 'lucide-react';
import { StatCard } from '@/components/ui';

interface Analytics {
  totalHospitals: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
}

export default function SuperAdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await superAdminApi.getAnalytics();
        setAnalytics(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Hospitals', value: analytics?.totalHospitals || 0, icon: Building2 },
    { label: 'Total Doctors', value: analytics?.totalDoctors || 0, icon: Users },
    { label: 'Total Patients', value: analytics?.totalPatients || 0, icon: Activity },
    { label: 'Total Appointments', value: analytics?.totalAppointments || 0, icon: BarChart3 },
  ];

  return (
    <AppLayout role="SUPER_ADMIN" title="Analytics" subtitle="Platform-wide statistics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 md:p-6">
          <h3 className="text-heading font-bold text-primary-light mb-4">Platform Overview</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-body text-primary-light/60">Loading analytics...</p>
            </div>
          ) : (
            <p className="text-body text-primary-light/70">Analytics data loaded successfully. Additional charts and detailed reports can be added here.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
