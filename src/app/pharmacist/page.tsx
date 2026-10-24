'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pharmacyApi, chatApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { StatCard, Button, StatusBadge } from '@/components/ui';
import {
  Package, ClipboardList, AlertTriangle, Pill, CreditCard,
  MessageCircle, RefreshCw, ChevronRight, CheckCircle2,
  Clock, Truck, ExternalLink, Calendar,
} from 'lucide-react';
import type { PharmacyOrderResponse, InventoryBatchResponse } from '@/types/pharmacy';
import toast from 'react-hot-toast';

export default function PharmacistDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<PharmacyOrderResponse[]>([]);
  const [inventory, setInventory] = useState<InventoryBatchResponse[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, inventoryRes, roomsRes] = await Promise.allSettled([
        pharmacyApi.myOrders(),
        pharmacyApi.myInventoryBatches(),
        chatApi.getRooms(),
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value.data)) {
        setOrders(ordersRes.value.data);
      }
      if (inventoryRes.status === 'fulfilled' && Array.isArray(inventoryRes.value.data)) {
        setInventory(inventoryRes.value.data);
      }
      if (roomsRes.status === 'fulfilled' && Array.isArray(roomsRes.value.data)) {
        const totalUnread = roomsRes.value.data.reduce(
          (sum: number, r: { unreadCount?: number }) => sum + (r.unreadCount || 0),
          0
        );
        setUnreadChatCount(totalUnread);
      }
    } catch {
      toast.error('Failed to refresh pharmacy dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived metrics
  const pendingOrders = orders.filter((o) =>
    ['PENDING', 'CREATED', 'PLACED', 'ESTIMATE_REQUESTED'].includes(o.status?.toUpperCase() || '')
  );
  const activeOrders = orders.filter((o) =>
    !['DELIVERED', 'COMPLETED', 'CANCELLED', 'REJECTED'].includes(o.status?.toUpperCase() || '')
  );
  const lowStockBatches = inventory.filter((b) => (b.quantity ?? 0) <= 15);
  const totalRevenue = orders
    .filter((o) => ['PAID', 'COMPLETED', 'DELIVERED'].includes(o.paymentStatus?.toUpperCase() || o.status?.toUpperCase() || ''))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const statCards = [
    {
      label: 'Total Orders',
      value: orders.length || 0,
      icon: ClipboardList,
      color: 'text-blue-400',
    },
    {
      label: 'Pending Fulfillment',
      value: pendingOrders.length || 0,
      icon: Clock,
      color: 'text-amber-400',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockBatches.length || 0,
      icon: AlertTriangle,
      color: 'text-rose-400',
    },
    {
      label: 'Medicine SKUs',
      value: inventory.length || 0,
      icon: Package,
      color: 'text-purple-400',
    },
    {
      label: 'Customer Chats',
      value: unreadChatCount > 0 ? `${unreadChatCount} Unread` : 'Active',
      icon: MessageCircle,
      color: 'text-emerald-400',
    },
    {
      label: 'Revenue (Fitted)',
      value: totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : '₹0',
      icon: CreditCard,
      color: 'text-cyan-400',
    },
  ];

  const quickActions = [
    {
      label: 'Dispense & Orders',
      description: 'Manage active customer orders',
      icon: ClipboardList,
      href: '/pharmacist/orders',
      color: 'from-blue-600/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    },
    {
      label: 'Stock & Batches',
      description: 'Inventory levels & expiry dates',
      icon: Package,
      href: '/pharmacist/inventory',
      color: 'from-purple-600/20 to-purple-500/5 text-purple-400 border-purple-500/20',
    },
    {
      label: 'Prescription Rx',
      description: 'Review doctor prescriptions',
      icon: Pill,
      href: '/pharmacist/prescriptions',
      color: 'from-amber-600/20 to-amber-500/5 text-amber-400 border-amber-500/20',
    },
    {
      label: 'Patient Messages',
      description: 'Direct inquiries & consultation',
      icon: MessageCircle,
      href: '/pharmacist/chat',
      color: 'from-emerald-600/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    },
    {
      label: 'Billing & POS',
      description: 'Receipts & invoices',
      icon: CreditCard,
      href: '/pharmacist/billing',
      color: 'from-cyan-600/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
    },
  ];

  return (
    <AppLayout role="PHARMACY" title="Pharmacy Dashboard" subtitle="Real-time dispensary, inventory, and patient orders">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-20/80 p-4 rounded-card border border-tonal-20/50">
          <div>
            <h2 className="text-lg font-bold text-primary-light">Pharmacy Operations Control</h2>
            <p className="text-sm text-primary-light/60">Live metrics synced across web and Android mobile apps</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadData} disabled={loading} className="gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Sync Data
            </Button>
            <Link href="/pharmacist/chat">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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

        {/* Two Column Section: Recent Orders & Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Orders Worklist (2 Cols) */}
          <div className="lg:col-span-2 bg-surface-20/80 rounded-card border border-tonal-20/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-light text-base">Active Orders</h3>
                <p className="text-xs text-primary-light/60">Orders requiring confirmation, dispensing, or delivery</p>
              </div>
              <Link href="/pharmacist/orders" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all ({orders.length}) <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2 py-6 text-center text-primary-light/40">
                <RefreshCw size={24} className="mx-auto animate-spin mb-2" />
                <p className="text-sm">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-primary-light/40 border border-dashed border-tonal-20 rounded-xl">
                <ClipboardList size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No active orders</p>
                <p className="text-xs text-primary-light/50 mt-1">Orders placed by patients or doctors will show up here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-tonal-20/50 text-xs text-primary-light/50">
                      <th className="pb-2">Order #</th>
                      <th className="pb-2">Patient / Customer</th>
                      <th className="pb-2">Items</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tonal-20/30">
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-surface-10/40 transition-colors">
                        <td className="py-3 font-semibold text-primary-light">
                          #{order.id}
                        </td>
                        <td className="py-3 text-primary-light/80">
                          {order.patientName || `Patient #${order.patientId || '—'}`}
                        </td>
                        <td className="py-3 text-primary-light/60">
                          {order.items?.length ? `${order.items.length} meds` : '1 package'}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={order.status || 'PENDING'} />
                        </td>
                        <td className="py-3 font-medium text-primary-light">
                          {order.totalAmount != null ? `₹${order.totalAmount}` : '—'}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href="/pharmacist/chat">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs gap-1 text-accent border-accent/30 hover:bg-accent/10"
                                title="Chat with patient"
                              >
                                <MessageCircle size={13} />
                                Chat
                              </Button>
                            </Link>
                            <Link href="/pharmacist/orders">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                                Fulfill
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

          {/* Low Stock & Expiry Alerts (1 Col) */}
          <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-light text-base">Low Stock Warnings</h3>
                <p className="text-xs text-primary-light/60">Batches needing restocking</p>
              </div>
              <Link href="/pharmacist/inventory" className="text-xs text-accent hover:underline flex items-center gap-1">
                Inventory <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2 py-6 text-center text-primary-light/40">
                <p className="text-sm">Checking inventory...</p>
              </div>
            ) : lowStockBatches.length === 0 ? (
              <div className="text-center py-8 text-primary-light/40 border border-dashed border-tonal-20 rounded-xl">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400 opacity-60" />
                <p className="text-sm font-medium text-primary-light/70">Inventory Healthy</p>
                <p className="text-xs text-primary-light/40 mt-1">All batches meet minimum buffer thresholds</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockBatches.slice(0, 5).map((batch, idx) => (
                  <div
                    key={batch.id || idx}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-primary-light text-sm truncate">
                        {batch.medicineName || 'Medicine Batch'}
                      </p>
                      <p className="text-xs text-rose-300/80">
                        Batch: {batch.batchNumber || 'N/A'} • Exp: {batch.expiryDate || '—'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300">
                        {batch.quantity ?? 0} left
                      </span>
                    </div>
                  </div>
                ))}
                <Link href="/pharmacist/inventory" className="block pt-2">
                  <Button variant="outline" className="w-full text-xs">
                    Manage Batches & Restock
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
