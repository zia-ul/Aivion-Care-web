'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi, notificationApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { DarkCard, InnerCard, SectionTitle, Pill, ActionButton, FL } from '@/components/ui/FlutterTheme';
import { Building2, CalendarDays, FileText, Pill as PillIcon, MessageCircle, Wallet, Bell, Stethoscope, Clock } from 'lucide-react';

interface Appt { id: number; doctorName?: string; hospitalName?: string; appointmentDate?: string; slotTime?: string; status?: string; type?: string; }

const TILES = [
  { href: '/patient/hospitals', title: 'Find Hospitals', subtitle: 'Book appointments faster', icon: Building2, color: FL.mint },
  { href: '/patient/appointments', title: 'My Appointments', subtitle: 'Upcoming & past visits', icon: CalendarDays, color: FL.blue },
  { href: '/patient/records', title: 'Medical Records', subtitle: 'Prescriptions & history', icon: FileText, color: FL.lavender },
  { href: '/patient/reminders', title: 'Medicines', subtitle: 'Reminders & adherence', icon: PillIcon, color: FL.gold },
  { href: '/patient/chat', title: 'Chat', subtitle: 'Talk to your doctor', icon: MessageCircle, color: FL.cyan },
  { href: '/patient/payments', title: 'Payments', subtitle: 'Invoices & billing', icon: Wallet, color: FL.pink },
  { href: '/patient/notifications', title: 'Alerts', subtitle: 'Updates & reminders', icon: Bell, color: FL.mint },
];

export default function PatientDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await appointmentApi.getMyAppointments();
        setAppointments(Array.isArray(data) ? data : []);
        const n = await notificationApi.getUnreadCount();
        setUnread((n.data as any)?.count ?? 0);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter((a) => (a.appointmentDate ?? '') >= today && a.status !== 'CANCELLED')
    .sort((a, b) => (a.appointmentDate ?? '').localeCompare(b.appointmentDate ?? ''));

  return (
    <AppLayout role="PATIENT" title="Home" subtitle={`Welcome, ${user?.fullName ?? 'Patient'}`}>
      <div className="space-y-6">
        {unread > 0 && (
          <button onClick={() => router.push('/patient/notifications')} className="w-full text-left">
            <DarkCard tone="patient" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#4DD9AC]/20 flex items-center justify-center text-[#4DD9AC]"><Bell size={20} /></div>
              <div className="flex-1">
                <p className="text-white font-semibold">{unread} new notification{unread > 1 ? 's' : ''}</p>
                <p className="text-xs text-[#8AB0C0]">Tap to view your latest alerts</p>
              </div>
            </DarkCard>
          </button>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {TILES.map(({ href, title, subtitle, icon: Icon, color }) => (
            <button key={href} onClick={() => router.push(href)} className="text-left">
              <DarkCard tone="patient" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, color }}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold leading-tight">{title}</p>
                    <p className="text-xs text-[#8AB0C0] mt-1">{subtitle}</p>
                  </div>
                </div>
              </DarkCard>
            </button>
          ))}
        </div>

        <div>
          <SectionTitle action={<ActionButton variant="outline" onClick={() => router.push('/patient/appointments')}>View all</ActionButton>}>
            Upcoming appointments
          </SectionTitle>
          {loading ? (
            <p className="text-sm text-[#5B7A88]">Loading...</p>
          ) : upcoming.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#D6ECF1] p-5 text-center text-sm text-[#5B7A88]">
              No upcoming appointments. Book one from Find Hospitals.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map((a) => <AppointmentRow key={a.id} appt={a} />)}
            </div>
          )}
        </div>

        {/* Health snapshot dark card (Flutter parity) */}
        <DarkCard tone="patient">
          <h3 className="text-xl font-bold text-white">Health snapshot</h3>
          <p className="text-sm text-[#8AB0C0] mt-1.5">{user?.fullName}, keep your records and billing ready before your next visit.</p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <InnerCard tone="patient">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#4DD9AC]/15 flex items-center justify-center text-[#4DD9AC]"><Stethoscope size={18} /></div>
                <div>
                  <p className="text-xs text-[#8AB0C0]">Profile</p>
                  <p className="text-white font-semibold">Patient</p>
                </div>
              </div>
            </InnerCard>
            <InnerCard tone="patient">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#4DD9AC]/15 flex items-center justify-center text-[#4DD9AC]"><Clock size={18} /></div>
                <div>
                  <p className="text-xs text-[#8AB0C0]">Status</p>
                  <p className="text-white font-semibold">Active</p>
                </div>
              </div>
            </InnerCard>
          </div>
          <div className="flex gap-3 mt-5">
            <ActionButton variant="ghost" className="flex-1" onClick={() => router.push('/patient/records')}>View records</ActionButton>
            <ActionButton className="flex-1" onClick={() => router.push('/patient/payments')}>Payments</ActionButton>
          </div>
        </DarkCard>
      </div>
    </AppLayout>
  );
}

function AppointmentRow({ appt }: { appt: Appt }) {
  const router = useRouter();
  const color = appt.status === 'CONFIRMED' ? FL.mint : appt.status === 'PENDING' ? FL.gold : FL.cyan;
  return (
    <button onClick={() => router.push('/patient/appointments')} className="w-full text-left">
      <DarkCard tone="patient">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">Dr. {appt.doctorName ?? '—'}</p>
            <p className="text-xs text-[#8AB0C0] mt-0.5">{appt.hospitalName ?? ''}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#8AB0C0]">
              <span>{appt.appointmentDate}</span>
              <span>{String(appt.slotTime ?? '').slice(0, 5)}</span>
            </div>
          </div>
          <Pill color={color}>{appt.status ?? ''}</Pill>
        </div>
      </DarkCard>
    </button>
  );
}
