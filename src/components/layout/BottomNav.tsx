'use client';

import Link from 'next/link';
import {
  BarChart3, Building2, Calendar, FileText, LayoutDashboard,
  MessageCircle, Radio, User, UserCheck, Users, type LucideIcon,
} from 'lucide-react';
import { usePathmap } from '@/lib/use-pathmap';

type NavItem = { href: string; label: string; icon: LucideIcon };

const patientNavItems: NavItem[] = [
  { href: '/patient/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/patient/appointments', label: 'Appts', icon: Calendar },
  { href: '/patient/records', label: 'Records', icon: FileText },
  { href: '/patient/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

const doctorNavItems: NavItem[] = [
  { href: '/doctor/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'Appts', icon: Calendar },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { href: '/super-admin/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/super-admin/doctors/verification', label: 'Doctors', icon: UserCheck },
  { href: '/super-admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/super-admin/broadcast', label: 'Broadcast', icon: Radio },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav({ role }: { role: string }) {
  const pathname = usePathmap();
  const items = role === 'DOCTOR' ? doctorNavItems : role === 'SUPER_ADMIN' ? adminNavItems : patientNavItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-tonal-20/70 bg-surface-10/95 shadow-[0_-12px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl md:hidden" aria-label="Primary navigation">
      <div className="safe-bottom mx-auto grid h-[4.25rem] max-w-lg grid-cols-5 px-1 pt-1.5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive ? 'bg-accent/10 text-accent' : 'text-primary-light/45 hover:bg-surface-20/70 hover:text-primary-light'
              }`}
            >
              {isActive && <span className="absolute top-0 h-0.5 w-7 rounded-full bg-accent shadow-[0_0_12px_rgba(34,211,197,0.75)]" />}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.9} aria-hidden="true" />
              <span className="max-w-full truncate text-[10px] font-semibold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
