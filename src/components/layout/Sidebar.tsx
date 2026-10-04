'use client';

import Link from 'next/link';
import { Activity, LayoutDashboard, Calendar, MessageCircle, Bell, User, Users, Building2, UserCheck, BarChart3, Radio, X, FileText, Pill, Wallet, CalendarDays, Sparkles, CreditCard, ShieldCheck, Shield, MapPin, Stethoscope, Building, Microscope, TestTube, ClipboardList, ShieldPlus, type LucideIcon } from 'lucide-react';
import { usePathmap } from '@/lib/use-pathmap';

type NavItem = { href: string; label: string; icon: LucideIcon };

const patientNavItems: NavItem[] = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/patient/pharmacies', label: 'Pharmacies', icon: Pill },
  { href: '/patient/pathology-labs', label: 'Pathology labs', icon: Activity },
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

const hospitalHeadNavItems: NavItem[] = [
  { href: '/hospital-head/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/hospital-head/doctors', label: 'Doctors', icon: UserCheck },
  { href: '/hospital-head/lab-assistants', label: 'Lab Assistants', icon: Microscope },
  { href: '/hospital-head/pharmacy', label: 'Pharmacy', icon: Building },
  { href: '/hospital-head/receptionists', label: 'Receptionists', icon: Users },
  { href: '/hospital-head/departments', label: 'Departments', icon: Building2 },
  { href: '/hospital-head/staff-approval', label: 'Staff Approval', icon: ShieldPlus },
  { href: '/hospital-head/profile', label: 'Hospital Profile', icon: Building2 },
  { href: '/hospital-head/status', label: 'Hospital Status', icon: Activity },
  { href: '/hospital-head/generate-login', label: 'Generate Login', icon: ShieldPlus },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const pharmacistNavItems: NavItem[] = [
  { href: '/pharmacist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pharmacist/inventory', label: 'Inventory', icon: Pill },
  { href: '/pharmacist/orders', label: 'Orders', icon: ClipboardList },
  { href: '/pharmacist/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/pharmacist/billing', label: 'Billing', icon: CreditCard },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const pathologyNavItems: NavItem[] = [
  { href: '/pathology/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pathology/workflow', label: 'Workflow', icon: TestTube },
  { href: '/pathology/labs', label: 'Labs', icon: Microscope },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const labAssistantNavItems: NavItem[] = [
  { href: '/lab-assistant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lab-assistant/tests', label: 'Hospital Tests', icon: TestTube },
  { href: '/lab-assistant/bookings', label: 'Bookings', icon: Calendar },
  { href: '/lab-assistant/upload-report', label: 'Upload Report', icon: FileText },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const receptionistNavItems: NavItem[] = [
  { href: '/receptionist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/receptionist/appointments', label: 'Appointments', icon: Calendar },
  { href: '/receptionist/schedule', label: 'Daily Schedule', icon: CalendarDays },
  { href: '/receptionist/surgeries', label: 'Surgeries', icon: Stethoscope },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { href: '/super-admin/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/super-admin/doctors/verification', label: 'Doctors', icon: UserCheck },
  { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/super-admin/broadcast', label: 'Broadcast', icon: Radio },
  { href: '/super-admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/super-admin/subscriptions/free-requests', label: 'Free Requests', icon: Shield },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ role, onClose }: { role: string; onClose?: () => void }) {
  const pathname = usePathmap();
  let items: NavItem[];
  switch (role) {
    case 'DOCTOR':
      items = doctorNavItems;
      break;
    case 'HOSPITAL_HEAD':
      items = hospitalHeadNavItems;
      break;
    case 'PHARMACY':
      items = pharmacistNavItems;
      break;
    case 'PATHOLOGY':
      items = pathologyNavItems;
      break;
    case 'LAB_ASSISTANT':
      items = labAssistantNavItems;
      break;
    case 'RECEPTIONIST':
      items = receptionistNavItems;
      break;
    case 'SUPER_ADMIN':
      items = adminNavItems;
      break;
    default:
      items = patientNavItems;
  }
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
