'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useNotificationPopupStore } from '@/lib/stores/notification-popup';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuthStore();
  const unreadCount = useNotificationPopupStore((s) => s.unreadCount);
  const role = user?.role?.replace(/_/g, ' ').toLowerCase() || 'member';

  return (
    <header className="sticky top-0 z-30 border-b border-tonal-20/60 bg-surface-10/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-screen-xl items-center justify-between gap-4 px-4 py-3 sm:px-5 md:min-h-20 md:px-6">
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent/75">Aivion Care</p>
          <h1 className="truncate text-heading font-extrabold tracking-tight text-primary-light">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-support text-primary-light/55">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-tonal-20/70 bg-surface-20/70 text-primary-light/70 transition hover:border-accent/40 hover:bg-surface-30/70 hover:text-primary-light"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-fill px-1 text-[10px] font-black text-white shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          <Link href="/profile" className="group flex items-center gap-2 rounded-full border border-tonal-20/70 bg-surface-20/70 p-1.5 pr-2 transition hover:border-accent/40 hover:bg-surface-30/70" aria-label="Open profile">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-extrabold text-accent" aria-hidden="true">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block max-w-36 truncate text-sm font-semibold text-primary-light">{user?.fullName || 'Account'}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary-light/45">{role}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
