'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { ActionButton, DarkCard, Field, FL, InnerCard, Pill, inputClass } from '@/components/ui/FlutterTheme';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Edit2, Plus, Trash2 } from 'lucide-react';

const WEEKDAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MODES = ['OFFLINE', 'ONLINE'];

interface DoctorAvailability {
  id: number;
  weekday: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  consultationMode: string;
  isActive: boolean;
}

interface AvailabilityFormData {
  weekday: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  consultationMode: string;
  isActive: boolean;
}

const emptyForm = (): AvailabilityFormData => ({
  weekday: WEEKDAYS[0],
  startTime: '09:00:00',
  endTime: '17:00:00',
  slotDurationMinutes: 15,
  consultationMode: 'OFFLINE',
  isActive: true,
});

function formatTime(value: string) {
  return value.split(':').slice(0, 2).join(':');
}

export default function DoctorSchedule() {
  const router = useRouter();
  const { user } = useAuthStore();
  const doctorId = user?.doctorId;
  const [tab, setTab] = useState<'schedule' | 'slots'>('schedule');
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DoctorAvailability | null>(null);
  const [form, setForm] = useState<AvailabilityFormData>(emptyForm());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);

  const loadAvailabilities = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await doctorApi.getAvailability(doctorId);
      setAvailabilities(Array.isArray(data) ? data : []);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const fetchSlots = useCallback(async () => {
    if (!doctorId) return;
    setSlotLoading(true);
    try {
      const date = selectedDate.toISOString().slice(0, 10);
      const { data } = await doctorApi.getSlots(doctorId, date);
      setSlots(Array.isArray(data) ? data : Array.isArray(data?.slots) ? data.slots : []);
    } catch (error) {
      console.error('Failed to load slots:', error);
      setSlots([]);
    } finally {
      setSlotLoading(false);
    }
  }, [doctorId, selectedDate]);

  useEffect(() => { void loadAvailabilities(); }, [loadAvailabilities]);
  useEffect(() => { void fetchSlots(); }, [fetchSlots]);

  const openForm = (item?: DoctorAvailability) => {
    setEditing(item ?? null);
    setForm(item ? { weekday: item.weekday, startTime: item.startTime, endTime: item.endTime, slotDurationMinutes: item.slotDurationMinutes, consultationMode: item.consultationMode, isActive: item.isActive } : emptyForm());
    setShowForm(true);
  };

  const save = async () => {
    if (!doctorId) return;
    setSaving(true);
    const payload = { ...form, startTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime, endTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime };
    try {
      if (editing) await doctorApi.updateAvailability(doctorId, editing.id, payload);
      else await doctorApi.createAvailability(doctorId, payload);
      setShowForm(false);
      await loadAvailabilities();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: DoctorAvailability) => {
    if (!doctorId || !window.confirm(`Delete the ${item.weekday} schedule?`)) return;
    try {
      await doctorApi.deleteAvailability(doctorId, item.id);
      await loadAvailabilities();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete availability');
    }
  };

  const toggleActive = async (item: DoctorAvailability) => {
    if (!doctorId) return;
    try {
      await doctorApi.updateAvailability(doctorId, item.id, { ...item, isActive: !item.isActive });
      await loadAvailabilities();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update availability');
    }
  };

  if (!user || !doctorId) {
    return <AppLayout role="DOCTOR" title="Schedule" subtitle="Not available"><InnerCard className="p-8 text-center"><p className="font-semibold text-white">Doctor profile not loaded.</p><button className="mt-4 text-accent" onClick={() => router.push('/')}>Back to home</button></InnerCard></AppLayout>;
  }

  return (
    <AppLayout role="DOCTOR" title="Schedule" subtitle={`Dr. ${user.fullName}`}>
      <div className="mb-5 inline-flex rounded-2xl border border-tonal-20 bg-surface-20 p-1">
        <button onClick={() => setTab('schedule')} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'schedule' ? 'bg-accent text-[#06221F]' : 'text-primary-light/60'}`}><Clock size={15} /> Availability</button>
        <button onClick={() => setTab('slots')} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'slots' ? 'bg-accent text-[#06221F]' : 'text-primary-light/60'}`}><CalendarDays size={15} /> Available slots</button>
      </div>

      {tab === 'schedule' && <div className="space-y-4">
        <div className="flex items-center justify-between gap-3"><p className="text-sm text-primary-light/55">Set weekly availability for appointments and consultations.</p><ActionButton onClick={() => openForm()}><Plus size={15} /> Add availability</ActionButton></div>
        {loading ? <p className="text-sm text-primary-light/55">Loading availability...</p> : availabilities.length === 0 ? <DarkCard><div className="py-6 text-center text-sm text-primary-light/55"><CalendarDays size={32} className="mx-auto mb-2 text-accent/70" /><p className="font-semibold text-white">No availability set</p><p className="mt-1">Add a schedule to start receiving appointment requests.</p></div></DarkCard> : availabilities.map((item) => <DarkCard key={item.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><p className="font-semibold text-white">{item.weekday}</p><Pill color={item.isActive ? FL.mint : FL.muted}>{item.isActive ? 'Active' : 'Inactive'}</Pill></div><p className="mt-1 text-sm text-primary-light/55">{formatTime(item.startTime)} - {formatTime(item.endTime)} · {item.slotDurationMinutes} minute slots · {item.consultationMode}</p></div><div className="flex gap-2"><ActionButton variant="ghost" onClick={() => toggleActive(item)}>{item.isActive ? 'Deactivate' : 'Activate'}</ActionButton><ActionButton variant="outline" onClick={() => openForm(item)}><Edit2 size={14} /> Edit</ActionButton><ActionButton variant="danger" onClick={() => remove(item)}><Trash2 size={14} /></ActionButton></div></div></DarkCard>)}
      </div>}

      {tab === 'slots' && <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-white">{selectedDate.toDateString()}</p><p className="text-sm text-primary-light/55">{slots.length} generated slot{slots.length === 1 ? '' : 's'}</p></div><div className="flex gap-2"><ActionButton variant="outline" onClick={() => setSelectedDate(new Date())}>Today</ActionButton><ActionButton variant="ghost" onClick={() => setSelectedDate((date) => new Date(date.getTime() - 86400000))}><ChevronLeft size={18} /></ActionButton><ActionButton variant="ghost" onClick={() => setSelectedDate((date) => new Date(date.getTime() + 86400000))}><ChevronRight size={18} /></ActionButton></div></div>{slotLoading ? <p className="text-sm text-primary-light/55">Loading slots...</p> : slots.length === 0 ? <DarkCard><p className="text-sm text-primary-light/55">No slots for this day. Add an active availability covering this weekday.</p></DarkCard> : <div className="grid gap-3 sm:grid-cols-2">{slots.map((slot, index) => <DarkCard key={`${slot}-${index}`}><div className="flex items-center justify-between"><div><p className="text-lg font-semibold text-white">{formatTime(slot)}</p><p className="text-xs text-primary-light/55">Available appointment slot</p></div><Check className="text-accent" size={19} /></div></DarkCard>)}</div>}</div>}

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02080D]/75 p-4"><div className="w-full max-w-lg rounded-card border border-accent/20 bg-surface-10 p-6 shadow-soft"><h2 className="text-heading font-bold text-white">{editing ? 'Edit availability' : 'Add availability'}</h2><p className="mt-1 text-sm text-primary-light/55">Choose when patients can book appointments.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Weekday"><select value={form.weekday} onChange={(event) => setForm({ ...form, weekday: event.target.value })} className={inputClass}>{WEEKDAYS.map((day) => <option key={day}>{day}</option>)}</select></Field><Field label="Consultation mode"><select value={form.consultationMode} onChange={(event) => setForm({ ...form, consultationMode: event.target.value })} className={inputClass}>{MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></Field><Field label="Start time"><input type="time" value={form.startTime.slice(0, 5)} onChange={(event) => setForm({ ...form, startTime: event.target.value })} className={inputClass} /></Field><Field label="End time"><input type="time" value={form.endTime.slice(0, 5)} onChange={(event) => setForm({ ...form, endTime: event.target.value })} className={inputClass} /></Field><Field label="Slot duration (minutes)"><input type="number" min="1" value={form.slotDurationMinutes} onChange={(event) => setForm({ ...form, slotDurationMinutes: Number(event.target.value) })} className={inputClass} /></Field></div><label className="mt-4 flex items-center gap-2 text-sm text-primary-light"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Active schedule</label><div className="mt-6 flex justify-end gap-3"><ActionButton variant="ghost" onClick={() => setShowForm(false)}>Cancel</ActionButton><ActionButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save availability'}</ActionButton></div></div></div>}
    </AppLayout>
  );
}
