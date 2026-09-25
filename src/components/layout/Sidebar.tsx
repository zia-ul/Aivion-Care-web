'use client';

import Link from 'next/link';
import { Activity, LayoutDashboard, Calendar, MessageCircle, Bell, User, Users, Building2, UserCheck, BarChart3, Radio, X, FileText, Pill, Wallet, CalendarDays, Sparkles, CreditCard, ShieldCheck, type LucideIcon } from 'lucide-react';
import { usePathmap } from '@/lib/use-pathmap';

type NavItem = { href: string; label: string; icon: LucideIcon };

const patientNavItems: NavItem[] = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/patient/records', label: 'Medical records', icon: FileText },
  { href: '/patient/reminders', label: 'Medicines', icon: Pill },
  { href: '/patient/chat', label: 'Messages', icon: MessageCircle },
  { href: '/patient/payments', label: 'Payments', icon: Wallet },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const doctorNavItems: NavItem[] = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/doctor/reports', label: 'Reports', icon: BarChart3 },
  { href: '/doctor/diagnosis', label: 'AI diagnosis', icon: Sparkles },
  { href: '/doctor/ecg', label: 'ECG monitor', icon: Activity },
  { href: '/doctor/chat', label: 'Messages', icon: MessageCircle },
  { href: '/doctor/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { href: '/super-admin/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/super-admin/doctors/verification', label: 'Doctors', icon: UserCheck },
  { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/super-admin/broadcast', label: 'Broadcast', icon: Radio },
  { href: '/super-admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ role, onClose }: { role: string; onClose?: () => void }) {
  const pathname = usePathmap();
  const items = role === 'DOCTOR' ? doctorNavItems : role === 'SUPER_ADMIN' ? adminNavItems : patientNavItems;
  const roleLabel = role.replace(/_/g, ' ').toLowerCase();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-tonal-20/60 bg-surface-10/95 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between border-b border-tonal-20/50 px-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent/70">Healthcare OS</p>
          <p className="mt-0.5 text-lg font-extrabold tracking-tight text-primary-light">Aivion Care</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-primary-light/70 hover:bg-surface-20 hover:text-primary-light md:hidden" aria-label="Close navigation">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/5 px-3 py-2.5">
        <ShieldCheck size={17} className="shrink-0 text-accent" aria-hidden="true" />
        <span className="text-xs font-semibold capitalize text-primary-light/75">{roleLabel} workspace</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-body transition ${isActive ? 'bg-accent/10 font-bold text-accent' : 'font-medium text-primary-light/65 hover:bg-surface-20/80 hover:text-primary-light'}`}
            >
              {isActive && <span className="absolute -left-3 h-7 w-1 rounded-r-full bg-accent shadow-[0_0_12px_rgba(34,211,197,0.65)]" />}
              <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-tonal-20/50 p-4">
        <div className="rounded-xl bg-surface-20/60 p-3">
          <p className="text-xs font-semibold text-primary-light/70">Secure care workspace</p>
          <p className="mt-1 text-[10px] leading-relaxed text-primary-light/40">Aivion Care · Connected healthcare</p>
        </div>
      </div>
    </aside>
  );
}
