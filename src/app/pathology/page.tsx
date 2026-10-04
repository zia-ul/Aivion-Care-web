'use client';

import { useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button, StatusBadge } from '@/components/ui';
import { LayoutDashboard, TestTube, Microscope, ClipboardList, FileText, TrendingUp, CreditCard, User, type LucideIcon } from 'lucide-react';
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

interface PathologyStats {
  totalRequests: number;
  pendingQuotations: number;
  pendingReports: number;
  completedToday: number;
  totalRevenue: number;
  activeLabs: number;
}

export default function PathologyDashboard() {
  const [stats, setStats] = useState<PathologyStats>({
    totalRequests: 0,
    pendingQuotations: 0,
    pendingReports: 0,
    completedToday: 0,
    totalRevenue: 0,
    activeLabs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const statsRes = await pathologyApi.getDashboardStats();
        setStats({
          totalRequests: statsRes.data.totalRequests || 45,
          pendingQuotations: statsRes.data.pendingQuotations || 8,
          pendingReports: statsRes.data.pendingReports || 12,
          completedToday: statsRes.data.completedToday || 6,
          totalRevenue: statsRes.data.totalRevenue || 78500,
          activeLabs: 3,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Fallback mock data
        setStats({
          totalRequests: 45,
          pendingQuotations: 8,
          pendingReports: 12,
          completedToday: 6,
          totalRevenue: 78500,
          activeLabs: 3,
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCardItem[] = [
    { label: 'Total Requests', value: stats.totalRequests, icon: ClipboardList, color: 'text-blue-500' },
    { label: 'Pending Quotations', value: stats.pendingQuotations, icon: FileText, color: 'text-amber-500' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: TestTube, color: 'text-purple-500' },
    { label: 'Completed Today', value: stats.completedToday, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Labs', value: stats.activeLabs, icon: Microscope, color: 'text-cyan-500' },
    { label: 'Revenue (MTD)', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Workflow', icon: TestTube, href: '/pathology/workflow', color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Labs', icon: Microscope, href: '/pathology/labs', color: 'bg-cyan-500/10 text-cyan-500' },
    { label: 'My Profile', icon: User, href: '/profile', color: 'bg-indigo-500/10 text-indigo-500' },
  ];

  return (
    <AppLayout role="PATHOLOGY" title="Pathology Dashboard" subtitle="Pathology lab management">
      <div className="max-w-6xl mx-auto space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <StatCard key={i} label="Loading..." value="—" icon={LayoutDashboard} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <h3 className="text-heading font-bold text-primary-light">Recent Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-tonal-20/50">
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Request ID</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Patient</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Lab</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Status</th>
                      <th className="pb-3 text-support font-semibold text-primary-light/60">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tonal-20/30">
                    <tr>
                      <td className="py-3 text-body text-primary-light">#PTH-001</td>
                      <td className="py-3 text-body text-primary-light/70">Rajesh Kumar</td>
                      <td className="py-3 text-body text-primary-light/70">City Pathology Lab</td>
                      <td className="py-3"><StatusBadge status="PENDING_QUOTATION" /></td>
                      <td className="py-3 text-body text-primary-light/70">2 hours ago</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-body text-primary-light">#PTH-002</td>
                      <td className="py-3 text-body text-primary-light/70">Priya Sharma</td>
                      <td className="py-3 text-body text-primary-light/70">HealthPlus Diagnostics</td>
                      <td className="py-3"><StatusBadge status="REPORT_PENDING" /></td>
                      <td className="py-3 text-body text-primary-light/70">5 hours ago</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-body text-primary-light">#PTH-003</td>
                      <td className="py-3 text-body text-primary-light/70">Amit Patel</td>
                      <td className="py-3 text-body text-primary-light/70">City Pathology Lab</td>
                      <td className="py-3"><StatusBadge status="COMPLETED" /></td>
                      <td className="py-3 text-body text-primary-light/70">1 day ago</td>
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