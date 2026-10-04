'use client';

import { useCallback, useEffect, useState } from 'react';
import { pharmacyApi } from '@/lib/api/endpoints';
import { Card, Button, StatusBadge } from '@/components/ui';
import { ClipboardList, RefreshCw } from 'lucide-react';
import type { PharmacyOrderResponse } from '@/types/pharmacy';
import toast from 'react-hot-toast';

interface PharmacyOrderWorklistProps {
  /** Only show orders linked to a prescription. */
  prescriptionOnly?: boolean;
  title?: string;
}

export function PharmacyOrderWorklist({ prescriptionOnly = false, title }: PharmacyOrderWorklistProps) {
  const [orders, setOrders] = useState<PharmacyOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pharmacyApi.myOrders();
      const rows = Array.isArray(data) ? data : [];
      setOrders(prescriptionOnly ? rows.filter((order) => order.prescriptionId != null) : rows);
    } catch {
      toast.error('Unable to load pharmacy orders');
    } finally {
      setLoading(false);
    }
  }, [prescriptionOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (id: number | undefined, action: () => Promise<unknown>, success: string) => {
    if (!id) return;
    setBusyId(id);
    try {
      await action();
      toast.success(success);
      await load();
    } catch {
      toast.error('Action failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-heading font-bold text-primary-light">
          {title ?? (prescriptionOnly ? 'Prescription-linked orders' : 'Pharmacy orders')} ({orders.length})
        </h3>
        <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
      </div>

      {loading ? (
        <p className="text-body text-primary-light/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-body text-primary-light/60">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-amber-500/10 rounded-lg"><ClipboardList size={18} className="text-amber-500" /></span>
                  <div>
                    <p className="font-medium text-primary-light">
                      Order #{order.id} · {order.patientName ?? `Patient ${order.patientId ?? ''}`}
                    </p>
                    <p className="text-sm text-primary-light/60">
                      {order.totalAmount != null ? `₹${order.totalAmount}` : 'Amount pending'}
                      {order.prescriptionId ? ` · Rx #${order.prescriptionId}` : ''}
                      {order.orderedAt ? ` · ${new Date(order.orderedAt).toLocaleString()}` : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={order.status || 'PENDING'} />
                      {order.paymentStatus ? <StatusBadge status={order.paymentStatus} /> : null}
                      {order.fulfillmentType ? <span className="text-xs text-primary-light/50">{order.fulfillmentType}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" disabled={busyId === order.id} onClick={() => run(order.id, () => pharmacyApi.confirmOrder(order.id), 'Order confirmed')}>Confirm</Button>
                  <Button size="sm" variant="ghost" disabled={busyId === order.id} onClick={() => run(order.id, () => pharmacyApi.pickupReady(order.id), 'Marked ready for pickup')}>Ready</Button>
                  <Button size="sm" variant="ghost" disabled={busyId === order.id} onClick={() => run(order.id, () => pharmacyApi.pickupComplete(order.id), 'Pickup completed')}>Picked up</Button>
                  <Button size="sm" variant="ghost" disabled={busyId === order.id} onClick={() => run(order.id, () => pharmacyApi.dispatchDelivery(order.id), 'Out for delivery')}>Dispatch</Button>
                  <Button size="sm" variant="ghost" disabled={busyId === order.id} onClick={() => run(order.id, () => pharmacyApi.completeDelivery(order.id), 'Delivery completed')}>Delivered</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
