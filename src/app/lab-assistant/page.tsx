'use client';

import { useEffect, useState } from 'react';
import { labApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button, StatusBadge } from '@/components/ui';
import { LayoutDashboard, TestTube, Calendar, FileText, User, type LucideIcon } from 'lucide-react';
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

interface LabAssistantStats {
  totalTests: number;
  pendingBookings: number;
  completedToday: number;
  pendingReports: number;
}

export default function LabAssistantDashboard() {
  const [stats, setStats] = useState<LabAssistantStats>({
    totalTests: 0,
    pendingBookings: 0,
    completedToday: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // In a real app, these would come from dedicated stats endpoints
        setStats({
          totalTests: 45,
          pendingBookings: 12,
          completedToday: 8,
          pendingReports: 5,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCardItem[] = [
    { label: 'Available Tests', value: stats.totalTests, icon: TestTube, color: 'text-blue-500' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, color: 'text-amber-500' },
    { label: 'Completed Today', value: stats.completedToday, icon: TestTube, color: 'text-green-500' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: FileText, color: 'text-purple-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Hospital Tests', icon: TestTube, href: '/lab-assistant/tests', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Bookings', icon: Calendar, href: '/lab-assistant/bookings', color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Upload Report', icon: FileText, href: '/lab-assistant/upload-report', color: 'bg-green-500/10 text-green-500' },
  ];

  return (
    <AppLayout role="LAB_ASSISTANT" title="Lab Assistant Dashboard" subtitle="Laboratory management">
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
                <h3 className="text-heading font-bold text-primary-light">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-tonal-20/50">
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Booking ID</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Patient</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Test</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Scheduled</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tonal-20/30">
                    <tr>
                      <td className="py-3 text-body text-primary-light">#LAB-001</td>
                      <td className="py-3 text-body text-primary-light/70">Sunita Devi</td>
                      <td className="py-3 text-body text-primary-light/70">CBC + ESR</td>
                      <td className="py-3 text-body text-primary-light/70">Today 10:00 AM</td>
                      <td className="py-3"><StatusBadge status="SCHEDULED" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 text-body text-primary-light">#LAB-002</td>
                      <td className="py-3 text-body text-primary-light/70">Mohammad Ali</td>
                      <td className="py-3 text-body text-primary-light/70">Lipid Profile</td>
                      <td className="py-3 text-body text-primary-light/70">Today 11:30 AM</td>
                      <td className="py-3"><StatusBadge status="SAMPLE_COLLECTED" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 text-body text-primary-light">#LAB-003</td>
                      <td className="py-3 text-body text-primary-light/70">Kavita Singh</td>
                      <td className="py-3 text-body text-primary-light/70">Thyroid Panel</td>
                      <td className="py-3 text-body text-primary-light/70">Tomorrow 09:00 AM</td>
                      <td className="py-3"><StatusBadge status="PENDING" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}