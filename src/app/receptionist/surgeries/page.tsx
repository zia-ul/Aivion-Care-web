'use client';

import { useEffect, useState } from 'react';
import { surgeryApi, type SurgeryBookingRequest, type SurgeryResponse } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';


export default function ReceptionistSurgeriesPage() {
  const { user } = useAuthStore();
  const [surgeries, setSurgeries] = useState<SurgeryResponse[]>([]);
  const [theaters, setTheaters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({
    hospitalId: '',
    patientId: '',
    surgeonUserId: '',
    scheduledDate: '',
    operationTheatreNo: '',
    surgeryType: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [surgeriesRes, theatersRes] = await Promise.allSettled([
        surgeryApi.getMySurgeries(),
        surgeryApi.getOperationTheaters(),
      ]);
      if (surgeriesRes.status === 'fulfilled') {
        setSurgeries(Array.isArray(surgeriesRes.value.data) ? surgeriesRes.value.data : []);
      }
      if (theatersRes.status === 'fulfilled' && Array.isArray(theatersRes.value.data)) {
        setTheaters(theatersRes.value.data);
      }
    } catch {
      toast.error('Unable to load surgeries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (user?.hospitalId) {
      setForm((previous) => ({ ...previous, hospitalId: previous.hospitalId || String(user.hospitalId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.hospitalId || !form.patientId || !form.surgeonUserId || !form.scheduledDate) {
      toast.error('Hospital, patient, surgeon and scheduled date are required');
      return;
    }
    const payload: SurgeryBookingRequest = {
      hospitalId: Number(form.hospitalId),
      patientId: Number(form.patientId),
      surgeonUserId: Number(form.surgeonUserId),
      scheduledDate: form.scheduledDate,
      operationTheatreNo: form.operationTheatreNo ? Number(form.operationTheatreNo) : undefined,
      surgeryType: form.surgeryType || undefined,
    };
    setBooking(true);
    try {
      await surgeryApi.book(payload);
      toast.success('Surgery booked');
      await load();
    } catch {
      toast.error('Unable to book surgery');
    } finally {
      setBooking(false);
    }
  };

  return (
    <AppLayout role="RECEPTIONIST" title="Surgeries" subtitle="Book and track surgical procedures">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4">Book surgery</h2>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Hospital ID" value={form.hospitalId} onChange={(event) => setForm({ ...form, hospitalId: event.target.value })} required />
            <Input label="Patient ID" value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })} required />
            <Input label="Surgeon user ID" value={form.surgeonUserId} onChange={(event) => setForm({ ...form, surgeonUserId: event.target.value })} required />
            <Input label="Scheduled date and time" type="datetime-local" value={form.scheduledDate} onChange={(event) => setForm({ ...form, scheduledDate: event.target.value })} required />
            <Input label={theaters.length > 0 ? `Operation theatre (available: ${theaters.join(', ')})` : 'Operation theatre (optional)'} value={form.operationTheatreNo} onChange={(event) => setForm({ ...form, operationTheatreNo: event.target.value })} />
            <Input label="Surgery type" value={form.surgeryType} onChange={(event) => setForm({ ...form, surgeryType: event.target.value })} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit" loading={booking}>Book surgery</Button>
            </div>
          </form>
        </Card>
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <h3 className="text-heading font-bold text-primary-light mb-4">Hospital surgeries</h3>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading surgeries...</p>
          ) : surgeries.length === 0 ? (
            <p className="text-body text-primary-light/60">No surgeries found in the current scope.</p>
          ) : (
            <div className="space-y-3">
              <SurgeryList surgeries={surgeries} onChanged={load} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function SurgeryList({ surgeries, onChanged }: { surgeries: SurgeryResponse[]; onChanged: () => Promise<void> }) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const updateStatus = async (id: number | undefined, status: string) => {
    if (!id) return;
    setUpdatingId(id);
    try {
      await surgeryApi.updateStatus(id, { status });
      toast.success('Surgery updated');
      await onChanged();
    } catch {
      toast.error('Unable to update surgery');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {surgeries.map((surgery) => (
        <div key={surgery.id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-10/50 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-purple-500/10 rounded-lg"><Stethoscope size={18} className="text-purple-500" /></span>
            <div>
              <p className="font-medium text-primary-light">{surgery.surgeryType || `Surgery #${surgery.id}`}</p>
              <p className="text-sm text-primary-light/60">
                Patient {surgery.patientId ?? ''} · Surgeon {surgery.surgeonId ?? ''}
                {surgery.scheduledDate ? ` · ${new Date(surgery.scheduledDate).toLocaleString()}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={String(surgery.status ?? 'BOOKED')} />
            <Button size="sm" variant="outline" disabled={updatingId === surgery.id} onClick={() => updateStatus(surgery.id, 'CONFIRMED')}>Confirm</Button>
            <Button size="sm" variant="ghost" disabled={updatingId === surgery.id} onClick={() => updateStatus(surgery.id, 'COMPLETED')}>Complete</Button>
          </div>
        </div>
      ))}
    </>
  );
}