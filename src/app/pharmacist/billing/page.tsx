'use client';

import { useEffect, useState } from 'react';
import { pharmacyApi } from '@/lib/api/endpoints';
import { billingApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatCard, StatusBadge } from '@/components/ui';
import { CreditCard, Download, RefreshCw, LayoutDashboard } from 'lucide-react';
import type { PharmacyOrderResponse } from '@/types/pharmacy';
import toast from 'react-hot-toast';

export default function PharmacistBillingPage() {
  const [orders, setOrders] = useState<PharmacyOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [invoiceId, setInvoiceId] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pharmacyApi.myOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setPayment = async (id: number | undefined, paymentStatus: string) => {
    if (!id) return;
    setBusyId(id);
    try {
      await pharmacyApi.updatePaymentStatus(id, { paymentStatus });
      toast.success(`Marked ${paymentStatus.toLowerCase()}`);
      await load();
    } catch {
      toast.error('Unable to update payment status');
    } finally {
      setBusyId(null);
    }
  };

  const downloadInvoice = async () => {
    const id = Number(invoiceId);
    if (!id) {
      toast.error('Enter an invoice ID');
      return;
    }
    try {
      const { data } = await billingApi.getInvoicePdf(id);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Unable to download invoice');
    }
  };

  const unpaid = orders.filter((order) => order.paymentStatus !== 'PAID' && order.paymentStatus !== 'ONLINE_PAID' && order.paymentStatus !== 'OFFLINE_PAID').length;
  const revenue = orders.reduce((total, order) => total + Number(order.totalAmount ?? 0), 0);

  return (
    <AppLayout role="PHARMACY" title="Billing" subtitle="Order payments and invoices">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total orders" value={orders.length} icon={CreditCard} />
          <StatCard label="Unpaid orders" value={unpaid} icon={CreditCard} />
          <StatCard label="Recorded revenue" value={`₹${revenue.toLocaleString()}`} icon={LayoutDashboard} />
        </div>

        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4">Invoice lookup</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Input label="Invoice ID" type="number" value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)} placeholder="e.g. 5501" />
            <Button onClick={downloadInvoice}><Download size={15} className="mr-2" /> Download invoice PDF</Button>
          </div>
        </Card>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading font-bold text-primary-light">Order payments</h3>
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading payments...</p>
          ) : orders.length === 0 ? (
            <p className="text-body text-primary-light/60">No orders to bill yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-10/50 rounded-xl">
                  <div>
                    <p className="font-medium text-primary-light">Order #{order.id} · {order.patientName ?? `Patient ${order.patientId ?? ''}`}</p>
                    <p className="text-sm text-primary-light/60">{order.totalAmount != null ? `₹${order.totalAmount}` : 'Amount pending'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.paymentStatus ? <StatusBadge status={order.paymentStatus} /> : <StatusBadge status="UNPAID" />}
                    <Button size="sm" variant="outline" disabled={busyId === order.id} onClick={() => setPayment(order.id, 'OFFLINE_PAID')}>Mark paid</Button>
                    <Button size="sm" variant="ghost" disabled={busyId === order.id} onClick={() => setPayment(order.id, 'UNPAID')}>Mark unpaid</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
