'use client';

import { useEffect, useState } from 'react';
import { hospitalApi } from '@/lib/api/endpoints';
import { StatCard, Button } from '@/components/ui';
import { Building2, Users, UserPlus, Pill, Microscope, ShieldPlus, LayoutDashboard, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { notifyError } from '@/lib/errors';
import type { ComponentType } from 'react';

interface ActivityItem {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  color: 'blue' | 'amber' | 'green';
  title: string;
  subtitle: string;
}

interface StatCardItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  color: string;
}

interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

interface HospitalStats {
  totalDoctors: number;
  totalLabAssistants: number;
  totalPharmacies: number;
  totalReceptionists: number;
  pendingApprovals: number;
  activeDepartments: number;
}

export default function HospitalHeadDashboardContent() {
  const [stats, setStats] = useState<HospitalStats | null>({
    totalDoctors: 0,
    totalLabAssistants: 0,
    totalPharmacies: 0,
    totalReceptionists: 0,
    pendingApprovals: 0,
    activeDepartments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        await hospitalApi.getMyProfile();
        // In a real app, these would come from dedicated stats endpoints
        setStats({
          totalDoctors: 12,
          totalLabAssistants: 3,
          totalPharmacies: 1,
          totalReceptionists: 4,
          pendingApprovals: 2,
          activeDepartments: 8,
        });
      } catch (error) {
        // Previously console-only, so a rejected load rendered as an empty dashboard.
        notifyError(error, 'Could not load your hospital profile. Check your connection and try again.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCardItem[] = !stats
    ? []
    : [
    { label: 'Doctors', value: stats.totalDoctors, icon: Users, href: '/hospital-head/doctors', color: 'text-blue-500' },
    { label: 'Lab Assistants', value: stats.totalLabAssistants, icon: Microscope, href: '/hospital-head/lab-assistants', color: 'text-purple-500' },
    { label: 'Pharmacies', value: stats.totalPharmacies, icon: Pill, href: '/hospital-head/pharmacy', color: 'text-green-500' },
    { label: 'Receptionists', value: stats.totalReceptionists, icon: Users, href: '/hospital-head/receptionists', color: 'text-orange-500' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: ShieldPlus, href: '/hospital-head/staff-approval', color: 'text-amber-500' },
    { label: 'Active Departments', value: stats.activeDepartments, icon: Building2, href: '/hospital-head/departments', color: 'text-cyan-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Doctors', icon: Users, href: '/hospital-head/doctors', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Staff Approval', icon: ShieldPlus, href: '/hospital-head/staff-approval', color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Departments', icon: Building2, href: '/hospital-head/departments', color: 'bg-cyan-500/10 text-cyan-500' },
    { label: 'Hospital Profile', icon: Building2, href: '/hospital-head/profile', color: 'bg-indigo-500/10 text-indigo-500' },
    { label: 'Hospital Status', icon: ShieldPlus, href: '/hospital-head/status', color: 'bg-green-500/10 text-green-500' },
    { label: 'Generate Login', icon: ShieldPlus, href: '/hospital-head/generate-login', color: 'bg-purple-500/10 text-purple-500' },
  ];

  const recentActivity: ActivityItem[] = [
    {
      icon: UserPlus,
      color: 'blue',
      title: 'Create hospital users and staff accounts',
      subtitle: 'Add doctors, lab assistants, pharmacy staff and receptionists',
    },
    {
      icon: ShieldPlus,
      color: 'amber',
      title: 'Review staff and department updates',
      subtitle: 'Check current approval and department requests',
    },
    {
      icon: Pill,
      color: 'green',
      title: 'Keep every hospital department active',
      subtitle: 'Manage departments, inventory and staff records',
    },
  ];

  return (
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
                stat.href ? (
                  <Link key={stat.label} href={stat.href}>
                    <StatCard
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                    />
                  </Link>
) : !stats ? (
          <div className="rounded-card border border-danger/30 bg-danger/10 p-6 text-center">
            <p className="font-semibold text-danger-light">We could not load your hospital dashboard.</p>
            <p className="mt-2 text-body text-primary-light/60">
              Your profile request did not complete. Refresh the page, or check that your session is still active.
            </p>
          </div>
        ) : (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    className="cursor-default"
                  />
                )
              ))}
            </div>

            <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
              <h3 className="text-heading font-bold text-primary-light mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <h3 className="text-heading font-bold text-primary-light mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item) => {
                  const ItemIcon = item.icon;
                  const badgeClass = item.color === 'amber'
                    ? 'bg-amber-500/10'
                    : item.color === 'green'
                      ? 'bg-green-500/10'
                      : 'bg-blue-500/10';
                  const iconClass = item.color === 'amber'
                    ? 'text-amber-500'
                    : item.color === 'green'
                      ? 'text-green-500'
                      : 'text-blue-500';
                  return (
                    <div key={item.title} className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                      <div className={`p-2 rounded-lg ${badgeClass}`}><ItemIcon size={18} className={iconClass} /></div>
                      <div>
                        <p className="text-body text-primary-light">{item.title}</p>
                        <p className="text-sm text-primary-light/50">{item.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
  );
}


