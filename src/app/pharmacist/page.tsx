'use client';

import { useEffect, useState } from 'react';
import { hospitalApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button } from '@/components/ui';
import { LayoutDashboard, Pill, ClipboardList, AlertTriangle, Package, Calendar, CreditCard, User, type LucideIcon } from 'lucide-react';
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

interface PharmacyStats {
  totalMedicines: number;
  lowStockCount: number;
  pendingOrders: number;
  totalRevenue: number;
  expiringSoon: number;
  prescriptionsToday: number;
}

export default function PharmacistDashboard() {
  const [stats, setStats] = useState<PharmacyStats>({
    totalMedicines: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    expiringSoon: 0,
    prescriptionsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // In a real app, these would come from dedicated stats endpoints
        setStats({
          totalMedicines: 1250,
          lowStockCount: 23,
          pendingOrders: 8,
          totalRevenue: 45600,
          expiringSoon: 12,
          prescriptionsToday: 34,
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
    { label: 'Total Medicines', value: stats.totalMedicines.toLocaleString(), icon: Package, color: 'text-blue-500' },
    { label: 'Low Stock Alerts', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ClipboardList, color: 'text-amber-500' },
    { label: 'Prescriptions Today', value: stats.prescriptionsToday, icon: Pill, color: 'text-green-500' },
    { label: 'Expiring Soon', value: stats.expiringSoon, icon: Calendar, color: 'text-orange-500' },
    { label: 'Revenue (MTD)', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-500' },
  ];

  const quickActions: QuickActionItem[] = [
    { label: 'Inventory', icon: Package, href: '/pharmacist/inventory', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Orders', icon: ClipboardList, href: '/pharmacist/orders', color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Prescriptions', icon: Pill, href: '/pharmacist/prescriptions', color: 'bg-green-500/10 text-green-500' },
    { label: 'Billing', icon: CreditCard, href: '/pharmacist/billing', color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  return (
    <AppLayout role="PHARMACY" title="Pharmacy Dashboard" subtitle="Pharmacy management overview">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <h3 className="text-heading font-bold text-primary-light mb-4">Low Stock Alerts</h3>
              <div className="space-y-2">
                {[
                  { name: 'Amoxicillin 500mg', stock: 5, threshold: 20 },
                  { name: 'Paracetamol 650mg', stock: 8, threshold: 30 },
                  { name: 'Metformin 1000mg', stock: 12, threshold: 25 },
                  { name: 'Vitamin D3 60000 IU', stock: 3, threshold: 15 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div>
                      <p className="font-medium text-primary-light">{item.name}</p>
                      <p className="text-sm text-primary-light/60">Stock: {item.stock} / Threshold: {item.threshold}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10">Reorder</Button>
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