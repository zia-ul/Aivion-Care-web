'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pathologyApi, chatApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Button, StatusBadge } from '@/components/ui';
import {
  TestTube, Microscope, ClipboardList, FileText, TrendingUp,
  CreditCard, MessageCircle, RefreshCw, ChevronRight,
  ExternalLink, Clock, Building2, MapPin, CheckCircle,
} from 'lucide-react';
import type {
  PathologyWorkflowResponse,
  PathologyDashboardStatsResponse,
  PathologyLabDiscoveryResponse,
} from '@/types/pathology';
import toast from 'react-hot-toast';

export default function PathologyDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<PathologyDashboardStatsResponse>({});
  const [requests, setRequests] = useState<PathologyWorkflowResponse[]>([]);
  const [labs, setLabs] = useState<PathologyLabDiscoveryResponse[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, requestsRes, labsRes, roomsRes] = await Promise.allSettled([
        pathologyApi.getDashboardStats(),
        pathologyApi.getMyRequests(),
        pathologyApi.getLabs(),
        chatApi.getRooms(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value?.data)) {
        setRequests(requestsRes.value.data);
      }
      if (labsRes.status === 'fulfilled' && Array.isArray(labsRes.value?.data)) {
        setLabs(labsRes.value.data);
      }
      if (roomsRes.status === 'fulfilled' && Array.isArray(roomsRes.value?.data)) {
        const totalUnread = roomsRes.value.data.reduce(
          (sum: number, r: { unreadCount?: number }) => sum + (r.unreadCount || 0),
          0
        );
        setUnreadChatCount(totalUnread);
      }
    } catch {
      toast.error('Failed to load pathology dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalRequestsCount = stats.totalRequests ?? requests.length;
  const pendingQuotationsCount = stats.pendingQuotations ?? requests.filter((r) => r.status === 'PENDING_QUOTATION').length;
  const pendingReportsCount = stats.pendingReports ?? requests.filter((r) => r.status === 'REPORT_PENDING' || r.status === 'IN_PROGRESS').length;
  const completedTodayCount = stats.completedToday ?? requests.filter((r) => r.status === 'COMPLETED').length;
  const totalRevenue = stats.totalRevenue ?? requests
    .filter((r) => r.paymentStatus === 'PAID' || r.status === 'COMPLETED')
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  const statCards = [
    {
      label: 'Total Requests',
      value: totalRequestsCount,
      icon: ClipboardList,
      color: 'text-blue-400',
    },
    {
      label: 'Pending Quotations',
      value: pendingQuotationsCount,
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      label: 'Pending Reports',
      value: pendingReportsCount,
      icon: TestTube,
      color: 'text-purple-400',
    },
    {
      label: 'Completed Today',
      value: completedTodayCount,
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      label: 'Diagnostic Labs',
      value: labs.length || 1,
      icon: Microscope,
      color: 'text-cyan-400',
    },
    {
      label: 'Revenue (MTD)',
      value: totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : '₹0',
      icon: CreditCard,
      color: 'text-indigo-400',
    },
  ];

  const quickActions = [
    {
      label: 'Workflow Queue',
      description: 'Quotes, bookings & report drafting',
      icon: TestTube,
      href: '/pathology/workflow',
      color: 'from-purple-600/20 to-purple-500/5 text-purple-400 border-purple-500/20',
    },
    {
      label: 'Diagnostic Labs',
      description: 'Lab locations & home collection',
      icon: Microscope,
      href: '/pathology/labs',
      color: 'from-cyan-600/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
    },
    {
      label: 'Client & Doctor Chat',
      description: 'Direct messaging and sample updates',
      icon: MessageCircle,
      href: '/pathology/chat',
      color: 'from-emerald-600/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    },
    {
      label: 'Accreditation & Profile',
      description: 'NABL certification & pathologist details',
      icon: Building2,
      href: '/profile',
      color: 'from-blue-600/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    },
  ];

  return (
    <AppLayout role="PATHOLOGY" title="Pathology Dashboard" subtitle="Diagnostic orders, reports, and lab communications">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-20/80 p-4 rounded-card border border-tonal-20/50">
          <div>
            <h2 className="text-lg font-bold text-primary-light">Pathology Diagnostic Operations</h2>
            <p className="text-sm text-primary-light/60">Live synced test bookings, quotations, and verified lab reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadData} disabled={loading} className="gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Sync Data
            </Button>
            <Link href="/pathology/chat">
              <Button className="gap-2 bg-accent hover:bg-accent-fill text-white">
                <MessageCircle size={16} />
                Open Messages {unreadChatCount > 0 && `(${unreadChatCount})`}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-light/60 truncate">{stat.label}</span>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-xl font-bold text-primary-light truncate">
                {loading ? '—' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href} className="group">
              <div
                className={`h-full p-4 rounded-card border bg-gradient-to-br transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${action.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <action.icon size={24} />
                  <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-semibold text-primary-light text-sm">{action.label}</h4>
                <p className="text-xs text-primary-light/60 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Two Column Section: Recent Requests & Lab Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Test Requests (2 Cols) */}
          <div className="lg:col-span-2 bg-surface-20/80 rounded-card border border-tonal-20/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-light text-base">Recent Test Requests</h3>
                <p className="text-xs text-primary-light/60">Sample collection, quotation, and report worklist</p>
              </div>
              <Link href="/pathology/workflow" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all workflow ({requests.length}) <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2 py-6 text-center text-primary-light/40">
                <RefreshCw size={24} className="mx-auto animate-spin mb-2" />
                <p className="text-sm">Loading test requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-10 text-primary-light/40 border border-dashed border-tonal-20 rounded-xl">
                <TestTube size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No pending diagnostic requests</p>
                <p className="text-xs text-primary-light/50 mt-1">New requests from patients or referrals will show up here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-tonal-20/50 text-xs text-primary-light/50">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Patient</th>
                      <th className="pb-2">Doctor / Lab</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tonal-20/30">
                    {requests.slice(0, 6).map((req) => (
                      <tr key={req.id} className="hover:bg-surface-10/40 transition-colors">
                        <td className="py-3 font-semibold text-primary-light">
                          #{req.id}
                        </td>
                        <td className="py-3 text-primary-light/80">
                          {req.patientName || `Patient #${req.patientId || '—'}`}
                        </td>
                        <td className="py-3 text-primary-light/60">
                          {req.doctorName ? `Dr. ${req.doctorName}` : req.pathologyLabName || 'Direct'}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={req.status || 'PENDING'} />
                        </td>
                        <td className="py-3 font-medium text-primary-light">
                          {req.totalAmount != null ? `₹${req.totalAmount}` : '—'}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href="/pathology/chat">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs gap-1 text-accent border-accent/30 hover:bg-accent/10"
                                title="Chat with patient or doctor"
                              >
                                <MessageCircle size={13} />
                                Chat
                              </Button>
                            </Link>
                            <Link href="/pathology/workflow">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                                Process
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Diagnostic Centers (1 Col) */}
          <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-light text-base">Diagnostic Centers</h3>
                <p className="text-xs text-primary-light/60">Collection centers & lab specs</p>
              </div>
              <Link href="/pathology/labs" className="text-xs text-accent hover:underline flex items-center gap-1">
                Labs ({labs.length}) <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2 py-6 text-center text-primary-light/40">
                <p className="text-sm">Loading lab locations...</p>
              </div>
            ) : labs.length === 0 ? (
              <div className="text-center py-8 text-primary-light/40 border border-dashed border-tonal-20 rounded-xl">
                <Building2 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">Default Lab Active</p>
                <p className="text-xs text-primary-light/50 mt-1">Your registered pathology center is ready for test bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {labs.slice(0, 4).map((lab) => (
                  <div
                    key={lab.id}
                    className="p-3.5 rounded-xl bg-surface-10/40 border border-tonal-20/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-primary-light text-sm">{lab.name}</h4>
                      {lab.homeCollectionAvailable && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                          Home Sample
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-primary-light/60 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-primary-light/40 flex-shrink-0" />
                        <span className="truncate">{lab.address}, {lab.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-primary-light/40 flex-shrink-0" />
                        <span>{lab.openingDays || 'Mon-Sat'}: {lab.openingHours || '08:00 AM - 08:00 PM'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
