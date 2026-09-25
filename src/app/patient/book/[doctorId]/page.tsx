'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi, doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { DarkCard, Pill, ActionButton, FL, inputClass, Field, SectionTitle } from '@/components/ui/FlutterTheme';
import { CalendarDays, Clock, Video, Building2, CheckCircle2 } from 'lucide-react';

interface BookedResult { id: number; tokenNumber?: string; appointmentDate?: string; slotTime?: string; doctorName?: string; chatRoomId?: number | null; }

function BookContent() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const doctorId = Number(params.doctorId);
  const hospitalId = Number(search.get('hospitalId') ?? 0);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [date, setDate] = useState(today);
  const [type, setType] = useState<'VIDEO' | 'TELECONSULT' | 'IN_PERSON'>('VIDEO');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [result, setResult] = useState<BookedResult | null>(null);
  const [doctorName, setDoctorName] = useState('');

  const loadSlots = useCallback(async () => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot('');
    try {
      // Backend: GET /doctors/{id}/slots?date=YYYY-MM-DD -> { slots: ["HH:mm"...], error, message }
      const { data } = await doctorApi.getSlots(doctorId, date);
      const raw: unknown[] = Array.isArray(data?.slots) ? data.slots : [];
      setSlots(raw.map((s) => String(s).slice(0, 5)));
      if (data?.error) setSlotsError(String(data.error));
    } catch (err: any) {
      setSlots([]);
      setSlotsError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  }, [doctorId, date]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  useEffect(() => {
    doctorApi.get(doctorId).then(({ data }) => setDoctorName(data?.name ?? '')).catch(() => undefined);
  }, [doctorId]);

  const handleBook = async () => {
    if (!hospitalId || !doctorId || !date || !selectedSlot) return;
    setBooking(true);
    setBookError(null);
    try {
      // Backend: POST /appointments/self-book (patientId derived from JWT)
      const { data } = await appointmentApi.selfBook({
        hospitalId,
        doctorId,
        appointmentDate: date,
        slotTime: selectedSlot,
        type,
      });
      setResult(data);
    } catch (err: any) {
      setBookError(err?.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  // ---- Confirmation screen (Flutter appointment_confirmation parity) ----
  if (result) {
    return (
      <AppLayout role="PATIENT" title="Booking Confirmed" subtitle="Appointment details">
        <div className="max-w-xl space-y-4">
          <DarkCard tone="patient" className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#4DD9AC]/20 flex items-center justify-center text-[#4DD9AC]">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-4">Appointment Confirmed</h3>
            <p className="text-sm text-[#8AB0C0] mt-1">Your slot has been reserved successfully.</p>
            <div className="grid grid-cols-2 gap-3 mt-6 text-left">
              <InnerRow label="Token number" value={result.tokenNumber ?? '—'} />
              <InnerRow label="Status" value="CONFIRMED" />
              <InnerRow label="Doctor" value={`Dr. ${result.doctorName || doctorName || ''}`} />
              <InnerRow label="Date" value={result.appointmentDate ?? date} />
              <InnerRow label="Time" value={String(result.slotTime ?? selectedSlot).slice(0, 5)} />
              <InnerRow label="Type" value={type} />
            </div>
            <div className="flex gap-3 mt-6">
              <ActionButton variant="ghost" className="flex-1" onClick={() => router.push('/patient/appointments')}>My appointments</ActionButton>
              <ActionButton className="flex-1" onClick={() => router.push('/patient/chat')}>Open chat</ActionButton>
            </div>
          </DarkCard>
        </div>
      </AppLayout>
    );
  }

  // ---- Slot selection screen (Flutter slot_selection parity) ----
  return (
    <AppLayout role="PATIENT" title="Select Slot" subtitle={`Dr. ${doctorName || ''}`}>
      <div className="max-w-2xl space-y-5">
        <DarkCard tone="patient">
          <div className="flex items-center gap-2 text-white font-semibold"><Building2 size={18} className="text-[#4DD9AC]" /> Appointment details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Date">
              <input type="date" min={today} max={new Date(Date.now() + 180 * 864e5).toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Appointment type">
              <select value={type} onChange={(e) => setType(e.target.value as any)} className={inputClass}>
                <option value="VIDEO">Video consultation (chat + video)</option>
                <option value="TELECONSULT">Teleconsult (chat + video)</option>
                <option value="IN_PERSON">In-person visit</option>
              </select>
            </Field>
          </div>
          {type === 'IN_PERSON' && (
            <p className="text-xs text-[#F3C979] mt-3">Chat rooms are only created for online (VIDEO/TELECONSULT) appointments.</p>
          )}
        </DarkCard>

        <div>
          <SectionTitle action={<Pill color={FL.blue}>{slots.length} slots</Pill>}>
            <span className="inline-flex items-center gap-2"><CalendarDays size={18} /> Available slots — {date}</span>
          </SectionTitle>
          {loadingSlots ? (
            <p className="text-sm text-[#5B7A88]">Loading slots...</p>
          ) : slotsError ? (
            <div className="rounded-3xl bg-white border border-[#F3C979]/50 p-5 text-sm text-[#8A6D1F]">{slotsError}</div>
          ) : slots.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#D6ECF1] p-6 text-center text-sm text-[#5B7A88]">
              No available slots on this date. Try another date.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {slots.map((s) => {
                const selected = selectedSlot === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`py-2.5 rounded-2xl text-sm font-semibold border transition-colors inline-flex items-center justify-center gap-1.5 ${
                      selected ? 'bg-[#4DD9AC] text-[#0E2A22] border-[#4DD9AC]' : 'bg-white text-[#132633] border-[#B9DCE4] hover:border-[#4DD9AC]'
                    }`}
                  >
                    <Clock size={14} /> {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {bookError && (
          <div className="rounded-3xl bg-white border border-[#F09595]/50 p-5 text-sm text-[#C25A5A]">{bookError}</div>
        )}

        <DarkCard tone="patient">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-white font-semibold">Selected: {selectedSlot || 'no slot yet'}</p>
              <p className="text-xs text-[#8AB0C0] mt-1 inline-flex items-center gap-1"><Video size={12} /> {type}</p>
            </div>
            <ActionButton disabled={!selectedSlot || booking || !hospitalId} onClick={handleBook}>
              {booking ? 'Booking...' : 'Confirm booking'}
            </ActionButton>
          </div>
        </DarkCard>
      </div>
    </AppLayout>
  );
}

function InnerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#2E3946] p-3">
      <p className="text-xs text-[#8AB0C0]">{label}</p>
      <p className="text-white font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-[#5B7A88]">Loading...</div>}>
      <BookContent />
    </Suspense>
  );
}
