'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, Pill, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNotificationPopupStore } from '@/lib/stores/notification-popup';

export function GlobalNotificationToast() {
  const router = useRouter();
  const activeNotification = useNotificationPopupStore((s) => s.activeNotification);
  const closePopup = useNotificationPopupStore((s) => s.closePopup);
  const [display, setDisplay] = useState(activeNotification);

  useEffect(() => {
    if (activeNotification) {
      setDisplay(activeNotification);
      const timer = setTimeout(() => {
        closePopup();
      }, 9000);
      return () => clearTimeout(timer);
    } else {
      const exitTimer = setTimeout(() => setDisplay(null), 300);
      return () => clearTimeout(exitTimer);
    }
  }, [activeNotification, closePopup]);

  if (!display) return null;

  const isAppointment = display.type === 'APPOINTMENT' || display.title?.toLowerCase().includes('appointment');
  const isReminder = display.type === 'MEDICATION' || display.type === 'REMINDER' || display.title?.toLowerCase().includes('medication');
  const isEmergency = display.type === 'EMERGENCY' || display.title?.toLowerCase().includes('emergency');

  const getIcon = () => {
    if (isEmergency) return <ShieldAlert size={20} className="text-danger-light" />;
    if (isReminder) return <Pill size={20} className="text-warning-light" />;
    if (isAppointment) return <Calendar size={20} className="text-accent" />;
    return <Bell size={20} className="text-accent" />;
  };

  const getBorderColor = () => {
    if (isEmergency) return 'border-danger-fill/60';
    if (isReminder) return 'border-warning-fill/60';
    return 'border-accent/40';
  };

  const handleAction = () => {
    closePopup();
    if (display.actionUrl && display.actionUrl.startsWith('/')) {
      router.push(display.actionUrl);
    } else if (isReminder) {
      router.push('/patient/reminders');
    } else if (isAppointment) {
      router.push('/patient/appointments');
    } else {
      router.push('/notifications');
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[99] w-[min(24rem,calc(100vw-2rem))] transition-all duration-300 ${
        activeNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`rounded-2xl border ${getBorderColor()} bg-surface-20/95 p-4 shadow-2xl backdrop-blur-xl`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-10 border border-tonal-20/40">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80">
                {display.type || 'Notification'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-primary-light mt-0.5 leading-snug">
              {display.title}
            </h4>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-primary-light/75">
              {display.message}
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAction}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                <span>View Details</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={closePopup}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-lg p-1 text-primary-light/40 transition hover:bg-surface-10 hover:text-primary-light"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
