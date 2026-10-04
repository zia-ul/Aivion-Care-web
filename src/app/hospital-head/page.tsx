'use client';

import { useEffect, useState } from 'react';
import { hospitalApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button } from '@/components/ui';
import { Building2, Users, Pill, Microscope, ShieldPlus, Bell, User, LayoutDashboard, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

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

export default function HospitalHeadDashboard() {
  const [stats, setStats] = useState<HospitalStats>({
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
        const profileRes = await hospitalApi.getMyProfile();
        const hospital = profileRes.data;
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
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards: StatCardItem[] = [
    { label: 'Doctors', value: stats.totalDoctors, icon: Users, color: 'text-blue-500' },
    { label: 'Lab Assistants', value: stats.totalLabAssistants, icon: Microscope, color: 'text-purple-500' },
    { label: 'Pharmacies', value: stats.totalPharmacies, icon: Pill, color: 'text-green-500' },
    { label: 'Receptionists', value: stats.totalReceptionists, icon: Users, color: 'text-orange-500' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: ShieldPlus, color: 'text-amber-500' },
    { label: 'Active Departments', value: stats.activeDepartments, icon: Building2, color: 'text-cyan-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Doctors', icon: Users, href: '/hospital-head/doctors', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Staff Approval', icon: ShieldPlus, href: '/hospital-head/staff-approval', color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Hospital Profile', icon: Building2, href: '/hospital-head/profile', color: 'bg-indigo-500/10 text-indigo-500' },
    { label: 'Hospital Status', icon: ShieldPlus, href: '/hospital-head/status', color: 'bg-green-500/10 text-green-500' },
    { label: 'Notifications', icon: Bell, href: '/notifications', color: 'bg-cyan-500/10 text-cyan-500' },
    { label: 'My Profile', icon: User, href: '/profile', color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Hospital Dashboard" subtitle="Hospital administration overview">
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
                <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Users size={18} className="text-blue-500" /></div>
                  <div>
                    <p className="text-body text-primary-light">New staff approvals and profile updates</p>
                    <p className="text-sm text-primary-light/50">Stay informed about onboarding changes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                  <div className="p-2 bg-amber-500/10 rounded-lg"><ShieldPlus size={18} className="text-amber-500" /></div>
                  <div>
                    <p className="text-body text-primary-light">Review staff and department updates</p>
                    <p className="text-sm text-primary-light/50">Check current approval and department requests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                  <div className="p-2 bg-green-500/10 rounded-lg"><Pill size={18} className="text-green-500" /></div>
                  <div>
                    <p className="text-body text-primary-light">Keep every hospital department active</p>
                    <p className="text-sm text-primary-light/50">Manage departments, inventory and staff records</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}