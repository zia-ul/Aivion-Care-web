'use client';

import { useEffect, useState } from 'react';
import { pharmacyApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { Plus, RefreshCw } from 'lucide-react';
import type { InventoryBatchResponse } from '@/types/pharmacy';
import toast from 'react-hot-toast';

interface BatchRow extends InventoryBatchResponse {
  displayName?: string;
  genericName?: string;
  batchNumber?: string;
  expiryDate?: string;
  quantity?: number;
  unitPrice?: number;
}

export default function PharmacistInventoryPage() {
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    medicineName: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    unitPrice: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pharmacyApi.myInventoryBatches();
      setBatches(Array.isArray(data) ? (data as BatchRow[]) : []);
    } catch {
      toast.error('Unable to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.medicineName || !form.batchNumber || !form.expiryDate || !form.quantity || !form.unitPrice) {
      toast.error('All inventory fields are required');
      return;
    }
    setSaving(true);
    try {
      await pharmacyApi.saveInventoryBatch({
        medicineName: form.medicineName.trim(),
        batchNumber: form.batchNumber.trim(),
        expiryDate: form.expiryDate,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      toast.success('Inventory batch saved');
      setForm({ medicineName: '', batchNumber: '', expiryDate: '', quantity: '', unitPrice: '' });
      await load();
    } catch {
      toast.error('Unable to save inventory batch');
    } finally {
      setSaving(false);
    }
  };

  const visible = batches.filter((batch) => {
    if (!query.trim()) return true;
    const haystack = `${batch.displayName ?? ''} ${batch.medicineName ?? ''} ${batch.genericName ?? ''} ${batch.batchNumber ?? ''}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <AppLayout role="PHARMACY" title="Inventory" subtitle="Medicine batches and stock levels">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4">Add or update inventory batch</h2>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Medicine name" value={form.medicineName} onChange={(event) => setForm({ ...form, medicineName: event.target.value })} required />
            <Input label="Batch number" value={form.batchNumber} onChange={(event) => setForm({ ...form, batchNumber: event.target.value })} required />
            <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} required />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required />
            <Input label="Unit price" type="number" step="0.01" value={form.unitPrice} onChange={(event) => setForm({ ...form, unitPrice: event.target.value })} required />
            <div className="flex items-end">
              <Button type="submit" loading={saving}><Plus size={16} className="mr-2" /> Save batch</Button>
            </div>
          </form>
        </Card>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <h3 className="text-heading font-bold text-primary-light">Inventory batches ({batches.length})</h3>
            <div className="flex items-end gap-3">
              <Input label="Search" placeholder="Medicine or batch" value={query} onChange={(event) => setQuery(event.target.value)} />
              <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
            </div>
          </div>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading inventory...</p>
          ) : visible.length === 0 ? (
            <p className="text-body text-primary-light/60">No inventory batches found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-tonal-20/50">
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Medicine</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Batch</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Expiry</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Qty</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Unit price</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tonal-20/30">
                  {visible.map((batch, index) => (
                    <tr key={batch.id ?? index}>
                      <td className="py-3 text-body text-primary-light">{batch.displayName ?? batch.medicineName ?? '—'}</td>
                      <td className="py-3 text-body text-primary-light/70">{batch.batchNumber ?? '—'}</td>
                      <td className="py-3 text-body text-primary-light/70">{batch.expiryDate ?? '—'}</td>
                      <td className="py-3 text-body text-primary-light/70">{batch.quantity ?? 0}</td>
                      <td className="py-3 text-body text-primary-light/70">{batch.unitPrice != null ? `₹${batch.unitPrice}` : '—'}</td>
                      <td className="py-3">{Number(batch.quantity ?? 0) <= 50 ? <StatusBadge status="LOW_STOCK" /> : <StatusBadge status="IN_STOCK" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}