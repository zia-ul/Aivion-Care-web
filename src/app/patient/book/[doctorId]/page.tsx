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

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const [date, setDate] = useState(today);
  const [type, setType] = useState<'VIDEO' | 'TELECONSULT' | 'IN_PERSON'>('VIDEO');
  interface SlotItem {
    time: string;
    status: 'AVAILABLE' | 'BOOKED' | 'PAST';
    bookable: boolean;
  }

  const [slotItems, setSlotItems] = useState<SlotItem[]>([]);
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
      // Backend: GET /doctors/{id}/slots?date=YYYY-MM-DD -> { slots: ["HH:mm"...], detailedSlots: [{ time, status, bookable }] }
      const { data } = await doctorApi.getSlots(doctorId, date);
      if (Array.isArray(data?.detailedSlots) && data.detailedSlots.length > 0) {
        setSlotItems(data.detailedSlots.map((d: any) => ({
          time: String(d.time).slice(0, 5),
          status: d.status || 'AVAILABLE',
          bookable: Boolean(d.bookable),
        })));
      } else {
        const raw: unknown[] = Array.isArray(data?.slots) ? data.slots : [];
        setSlotItems(raw.map((s) => ({
          time: String(s).slice(0, 5),
          status: 'AVAILABLE',
          bookable: true,
        })));
      }
      if (data?.error) setSlotsError(String(data.error));
    } catch (err: any) {
      setSlotItems([]);
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
            <div className="w-16 h-16 mx-auto rounded-full bg-doctor-mint/20 flex items-center justify-center text-doctor-mint">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary-light mt-4">Appointment Confirmed</h3>
            <p className="text-sm text-doctor-muted mt-1">Your slot has been reserved successfully.</p>
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
          <div className="flex items-center gap-2 text-primary-light font-semibold"><Building2 size={18} className="text-doctor-mint" /> Appointment details</div>
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
            <p className="text-xs text-doctor-gold mt-3">Chat rooms are only created for online (VIDEO/TELECONSULT) appointments.</p>
          )}
        </DarkCard>

        <div>
          <SectionTitle action={<Pill color={FL.blue}>{slotItems.filter(s => s.bookable).length} available</Pill>}>
            <span className="inline-flex items-center gap-2"><CalendarDays size={18} /> Daily Schedule — {date}</span>
          </SectionTitle>
          {loadingSlots ? (
            <p className="text-sm text-doctor-dim">Loading slots...</p>
          ) : slotsError ? (
            <div className="rounded-3xl bg-surface-20 border border-doctor-gold/50 p-5 text-sm text-warning-light">{slotsError}</div>
          ) : slotItems.length === 0 ? (
            <div className="rounded-3xl bg-surface-20 border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">
              No slots scheduled for this doctor on this date. Try another date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {slotItems.map((slot) => {
                const selected = selectedSlot === slot.time;
                const isBooked = slot.status === 'BOOKED';
                const isPast = slot.status === 'PAST';
                const isAvailable = slot.bookable;

                return (
                  <button
                    key={slot.time}
                    disabled={!isAvailable || booking}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      selected
                        ? 'bg-doctor-mint-fill text-white border-doctor-mint-fill shadow-lg shadow-doctor-mint/25'
                        : isBooked
                        ? 'bg-surface-10/40 text-primary-light/40 border-tonal-20/40 cursor-not-allowed opacity-60'
                        : isPast
                        ? 'bg-surface-10/30 text-primary-light/30 border-tonal-20/20 cursor-not-allowed opacity-40'
                        : 'bg-surface-20 text-primary-light border-doctor-border-input hover:border-doctor-mint hover:bg-surface-30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-black/20">
                        {isBooked ? '🔒 Booked' : isPast ? '⏰ Past' : '✓ Available'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-base mt-1">
                      <Clock size={15} /> {slot.time}
                    </div>
                    <span className="text-[11px] text-doctor-muted mt-1">
                      {isBooked ? 'Already reserved' : isPast ? 'Slot expired' : 'Tap to select'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {bookError && (
          <div className="rounded-3xl bg-surface-20 border border-doctor-danger-soft/50 p-5 text-sm text-doctor-red">{bookError}</div>
        )}

        <DarkCard tone="patient">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-primary-light font-semibold">Selected: {selectedSlot || 'no slot yet'}</p>
              <p className="text-xs text-doctor-muted mt-1 inline-flex items-center gap-1"><Video size={12} /> {type}</p>
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
    <div className="rounded-2xl bg-doctor-shell p-3">
      <p className="text-xs text-doctor-muted">{label}</p>
      <p className="text-primary-light font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-doctor-dim">Loading...</div>}>
      <BookContent />
    </Suspense>
  );
}
