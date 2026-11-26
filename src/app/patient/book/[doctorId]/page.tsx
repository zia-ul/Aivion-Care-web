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

  // User's local machine time detection
  const userTimeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
    } catch {
      return 'Local Time';
    }
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const [date, setDate] = useState(today);
  const [type, setType] = useState<'VIDEO' | 'TELECONSULT' | 'IN_PERSON'>('VIDEO');
  const [paymentMode, setPaymentMode] = useState<'ONLINE' | 'CASH'>('ONLINE');
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

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

  // Fetch full doctor profile including consultation fee
  useEffect(() => {
    if (!doctorId) return;
    doctorApi.get(doctorId)
      .then(({ data }) => setDoctorProfile(data))
      .catch(() => undefined);
  }, [doctorId]);

  const doctorName = doctorProfile?.name || '';
  const consultationFee = useMemo(() => {
    if (!doctorProfile) return 0;
    if (type === 'VIDEO' || type === 'TELECONSULT') {
      return doctorProfile.onlineConsultationFee ?? doctorProfile.consultationFee ?? 0;
    }
    return doctorProfile.consultationFee ?? 0;
  }, [doctorProfile, type]);

  // Load and categorize slots strictly based on the user's current device machine time
  const loadSlots = useCallback(async () => {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot('');
    try {
      const { data } = await doctorApi.getSlots(doctorId, date);
      const userNow = new Date();
      const isSelectedDateToday = date === today;
      const currentHoursMinutes = `${String(userNow.getHours()).padStart(2, '0')}:${String(userNow.getMinutes()).padStart(2, '0')}`;

      if (Array.isArray(data?.detailedSlots) && data.detailedSlots.length > 0) {
        setSlotItems(
          data.detailedSlots
            .filter((d: any) => {
              if (d.status === 'PAST') return false;
              if (isSelectedDateToday && String(d.time).slice(0, 5) <= currentHoursMinutes) return false;
              return true;
            })
            .map((d: any) => ({
              time: String(d.time).slice(0, 5),
              status: d.status || 'AVAILABLE',
              bookable: Boolean(d.bookable),
            }))
        );
      } else {
        const raw: unknown[] = Array.isArray(data?.slots) ? data.slots : [];
        setSlotItems(
          raw
            .map((s) => String(s).slice(0, 5))
            .filter((timeStr) => {
              if (isSelectedDateToday && timeStr <= currentHoursMinutes) return false;
              return true;
            })
            .map((timeStr) => ({
              time: timeStr,
              status: 'AVAILABLE',
              bookable: true,
            }))
        );
      }
      if (data?.error) setSlotsError(String(data.error));
    } catch (err: any) {
      setSlotItems([]);
      setSlotsError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  }, [doctorId, date, today]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const handleBook = async () => {
    if (!hospitalId || !doctorId || !date || !selectedSlot) return;
    setBooking(true);
    setBookError(null);
    try {
      const effectivePaymentMode = type === 'VIDEO' ? 'ONLINE' : paymentMode;
      const { data } = await appointmentApi.selfBook({
        hospitalId,
        doctorId,
        appointmentDate: date,
        slotTime: selectedSlot,
        type,
        paymentMode: effectivePaymentMode,
      });
      setResult(data);
    } catch (err: any) {
      setBookError(err?.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  // ---- Confirmation screen ----
  if (result) {
    return (
      <AppLayout role="PATIENT" title="Booking Confirmed" subtitle="Appointment details">
        <div className="max-w-xl mx-auto space-y-4">
          <DarkCard tone="patient" className="text-center p-6 sm:p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-doctor-mint/20 flex items-center justify-center text-doctor-mint">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary-light mt-4">Appointment Confirmed</h3>
            <p className="text-sm text-doctor-muted mt-1">Your consultation has been booked successfully.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left">
              <InnerRow label="Token Number" value={result.tokenNumber ?? '—'} />
              <InnerRow label="Status" value="CONFIRMED" />
              <InnerRow label="Doctor" value={`Dr. ${result.doctorName || doctorName || ''}`} />
              <InnerRow label="Consultation Fee" value={consultationFee > 0 ? `₹${consultationFee}` : 'Free'} />
              <InnerRow label="Payment Choice" value={type === 'VIDEO' || paymentMode === 'ONLINE' ? 'Online Payment' : 'Pay Cash at Clinic'} />
              <InnerRow label="Scheduled Date" value={result.appointmentDate ?? date} />
              <InnerRow label="Your Local Time" value={`${String(result.slotTime ?? selectedSlot).slice(0, 5)} (${userTimeZone})`} />
              <InnerRow label="Consultation Mode" value={type === 'VIDEO' ? 'Instant Video Call' : type === 'TELECONSULT' ? 'Teleconsult' : 'In-Person Clinic Visit'} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <ActionButton variant="ghost" className="flex-1" onClick={() => router.push('/patient/appointments')}>
                View My Appointments
              </ActionButton>
              <ActionButton className="flex-1" onClick={() => router.push(type === 'IN_PERSON' ? '/patient/appointments' : '/patient/chat')}>
                {type === 'IN_PERSON' ? 'Done' : 'Open Consultation Chat'}
              </ActionButton>
            </div>
          </DarkCard>
        </div>
      </AppLayout>
    );
  }

  // Group slots into Morning, Afternoon, Evening
  const morningSlots = slotItems.filter((s) => s.time < '12:00');
  const afternoonSlots = slotItems.filter((s) => s.time >= '12:00' && s.time < '17:00');
  const eveningSlots = slotItems.filter((s) => s.time >= '17:00');

  return (
    <AppLayout role="PATIENT" title="Book Doctor Appointment" subtitle={`Dr. ${doctorName || 'Specialist'}`}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Doctor & Fee Summary Card */}
        <DarkCard tone="patient" className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-doctor-mint/15 text-doctor-mint flex items-center justify-center font-bold text-lg">
                {doctorName ? doctorName.replace(/^Dr\.\s*/, '').charAt(0) : 'D'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary-light">Dr. {doctorName || 'Doctor'}</h2>
                <p className="text-xs text-primary-light/60">{doctorProfile?.speciality || 'General Medicine'} • {doctorProfile?.qualification || 'MBBS'}</p>
                <p className="text-[11px] text-doctor-mint font-medium mt-0.5">Device Clock: {userTimeZone}</p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto p-3 sm:p-0 rounded-xl bg-surface-20/60 sm:bg-transparent">
              <p className="text-xs text-primary-light/60">Consultation Fee</p>
              <p className="text-2xl font-black text-doctor-mint">
                {consultationFee > 0 ? `₹${consultationFee}` : 'Free'}
              </p>
              <p className="text-[10px] text-primary-light/50">Guaranteed upfront rate</p>
            </div>
          </div>
        </DarkCard>

        {/* Date and Type Selection */}
        <DarkCard tone="patient">
          <div className="flex items-center gap-2 text-primary-light font-semibold mb-3">
            <Building2 size={18} className="text-doctor-mint" /> 
            <span>Choose Visit Date & Type</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Appointment Date (Today or Future)">
              <input 
                type="date" 
                min={today} 
                max={new Date(Date.now() + 180 * 864e5).toISOString().split('T')[0]} 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className={inputClass} 
              />
            </Field>
            <Field label="How would you like to consult?">
              <select 
                value={type} 
                onChange={(e) => {
                  const newType = e.target.value as any;
                  setType(newType);
                  if (newType === 'VIDEO') {
                    setPaymentMode('ONLINE');
                  }
                }} 
                className={inputClass}
              >
                <option value="VIDEO">Video Consultation (Online)</option>
                <option value="TELECONSULT">Teleconsult (Chat + Video)</option>
                <option value="IN_PERSON">In-Person Clinic Visit</option>
              </select>
            </Field>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-5 pt-4 border-t border-tonal-20/60">
            <p className="text-sm font-semibold text-primary-light mb-2">Select Payment Method</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('ONLINE')}
                className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                  paymentMode === 'ONLINE'
                    ? 'border-doctor-mint bg-doctor-mint/15 text-primary-light'
                    : 'border-tonal-20/70 bg-surface-20/70 text-primary-light/70 hover:border-tonal-30'
                }`}
              >
                <span className="text-xl">💳</span>
                <div>
                  <p className="text-sm font-bold">Online Payment</p>
                  <p className="text-xs text-primary-light/60">UPI, Cards, NetBanking</p>
                </div>
              </button>

              <button
                type="button"
                disabled={type === 'VIDEO'}
                onClick={() => setPaymentMode('CASH')}
                className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                  type === 'VIDEO'
                    ? 'opacity-40 cursor-not-allowed border-tonal-20/40 bg-surface-10/40'
                    : paymentMode === 'CASH'
                    ? 'border-doctor-mint bg-doctor-mint/15 text-primary-light'
                    : 'border-tonal-20/70 bg-surface-20/70 text-primary-light/70 hover:border-tonal-30'
                }`}
              >
                <span className="text-xl">💵</span>
                <div>
                  <p className="text-sm font-bold">Pay Cash at Clinic</p>
                  <p className="text-xs text-primary-light/60">
                    {type === 'VIDEO' ? 'Online only for video' : 'Pay when you arrive'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </DarkCard>

        {/* Slot Grid by Day Time Segments */}
        <div>
          <SectionTitle action={<Pill color={FL.blue}>{slotItems.filter(s => s.bookable).length} available</Pill>}>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={18} /> Available Slots ({userTimeZone})
            </span>
          </SectionTitle>

          {loadingSlots ? (
            <p className="text-sm text-doctor-dim py-4 text-center">Checking doctor schedule...</p>
          ) : slotsError ? (
            <div className="rounded-3xl bg-surface-20 border border-doctor-gold/50 p-5 text-sm text-warning-light">{slotsError}</div>
          ) : slotItems.length === 0 ? (
            <div className="rounded-3xl bg-surface-20 border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">
              No slots available for this doctor on {date}. Please select another date.
            </div>
          ) : (
            <div className="space-y-4">
              {morningSlots.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-primary-light/50 uppercase tracking-wider mb-2">Morning (Before 12:00 PM)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {morningSlots.map((slot) => renderSlotButton(slot))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-primary-light/50 uppercase tracking-wider mb-2">Afternoon (12:00 PM - 5:00 PM)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {afternoonSlots.map((slot) => renderSlotButton(slot))}
                  </div>
                </div>
              )}

              {eveningSlots.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-primary-light/50 uppercase tracking-wider mb-2">Evening (5:00 PM onwards)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {eveningSlots.map((slot) => renderSlotButton(slot))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {bookError && (
          <div className="rounded-3xl bg-surface-20 border border-doctor-danger-soft/50 p-5 text-sm text-doctor-red">{bookError}</div>
        )}

        {/* Confirmation Footer */}
        <DarkCard tone="patient">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-primary-light font-bold text-base">
                Selected: {selectedSlot ? `${selectedSlot} (${userTimeZone})` : 'Please pick a slot'}
              </p>
              <p className="text-xs text-primary-light/60 mt-0.5">
                {consultationFee > 0 ? `Total: ₹${consultationFee}` : 'Free'} • {paymentMode === 'CASH' ? 'Cash at Clinic' : 'Online Payment'}
              </p>
            </div>
            <ActionButton 
              disabled={!selectedSlot || booking || !hospitalId} 
              onClick={handleBook}
              className="w-full sm:w-auto px-6 py-3"
            >
              {booking ? 'Reserving...' : `Confirm & Book (₹${consultationFee})`}
            </ActionButton>
          </div>
        </DarkCard>
      </div>
    </AppLayout>
  );

  function renderSlotButton(slot: SlotItem) {
    const selected = selectedSlot === slot.time;
    const isBooked = slot.status === 'BOOKED';
    const isPast = slot.status === 'PAST';
    const isAvailable = slot.bookable;

    return (
      <button
        key={slot.time}
        type="button"
        disabled={!isAvailable || booking}
        onClick={() => setSelectedSlot(slot.time)}
        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
          selected
            ? 'bg-doctor-mint-fill text-white border-doctor-mint-fill shadow-lg shadow-doctor-mint/25 scale-[1.02]'
            : isBooked
            ? 'bg-surface-10/40 text-primary-light/40 border-tonal-20/40 cursor-not-allowed opacity-60'
            : isPast
            ? 'bg-surface-10/30 text-primary-light/30 border-tonal-20/20 cursor-not-allowed opacity-40'
            : 'bg-surface-20 text-primary-light border-doctor-border-input hover:border-doctor-mint hover:bg-surface-30'
        }`}
      >
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-black/20">
            {isBooked ? '🔒 Booked' : isPast ? '⏰ Past' : '✓ Open'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base mt-1">
          <Clock size={14} /> {slot.time}
        </div>
        <span className="text-[10px] text-doctor-muted mt-1 truncate">
          {isBooked ? 'Unavailable' : isPast ? 'Passed' : 'Available'}
        </span>
      </button>
    );
  }
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
