'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { useRouter } from 'next/navigation';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Card, Button } from '@/components/ui';

interface Availability {
  id: number;
  weekday: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  consultationMode: string;
  isActive: boolean;
}

const WEEKDAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
// Backend ConsultationMode enum is ONLINE|OFFLINE only.
const MODES = [
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'ONLINE', label: 'Online' },
];

export default function DoctorAvailability() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ weekday: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15, consultationMode: 'OFFLINE', isActive: true });

  useEffect(() => {
    const load = async () => {
      if (!user?.doctorId) return;
      try {
        const res = await doctorApi.getAvailability(user.doctorId);
        setAvailability(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.doctorId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorApi.createAvailability(user!.doctorId!, form);
      const res = await doctorApi.getAvailability(user!.doctorId!);
      setAvailability(res.data || []);
      setShowForm(false);
      setForm({ weekday: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15, consultationMode: 'OFFLINE', isActive: true });
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to create availability');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await doctorApi.deleteAvailability(user!.doctorId!, id);
      setAvailability((prev) => prev.filter((a) => a.id !== id));
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <AppLayout role="DOCTOR" title="Availability" subtitle="Manage your schedule">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-heading font-bold text-primary-light">Your Availability</h3>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={18} className="inline mr-2" /> Add Slot
          </Button>
        </div>

        {showForm && (
          <Card>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <select value={form.weekday} onChange={(e) => setForm({ ...form, weekday: e.target.value })} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent">
                  {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" />
                <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" />
                <input type="number" value={form.slotDurationMinutes} onChange={(e) => setForm({ ...form, slotDurationMinutes: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" />
                <select value={form.consultationMode} onChange={(e) => setForm({ ...form, consultationMode: e.target.value })} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent">
                  {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Save</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-body text-primary-light/60">Loading...</p>
            </div>
          ) : availability.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={40} className="text-primary-light/30 mx-auto mb-2" />
              <p className="text-body text-primary-light/60">No availability slots configured</p>
            </div>
          ) : (
            <div className="space-y-2">
              {availability.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-surface-10/50 rounded-xl border border-tonal-20/30">
                  <div>
                    <p className="font-semibold text-primary-light">{slot.weekday}</p>
                    <p className="text-support text-primary-light/60">{slot.startTime} - {slot.endTime} | {slot.slotDurationMinutes} min slots | {slot.consultationMode}</p>
                  </div>
                  <button onClick={() => handleDelete(slot.id)} className="p-2 bg-danger/10 rounded-lg hover:bg-danger-fill/20">
                    <Trash2 size={16} className="text-danger-light" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
