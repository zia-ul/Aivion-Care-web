'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useNotificationPopupStore } from '@/lib/stores/notification-popup';
import { notificationApi, patientApi } from '@/lib/api/endpoints';
import { playSound } from '@/lib/audio/sounds';
import { wsService } from '@/lib/websocket/client';

export function RealtimeNotificationListener() {
  const { accessToken, user, isAuthenticated } = useAuthStore();
  const showPopup = useNotificationPopupStore((s) => s.showPopup);
  const setUnreadCount = useNotificationPopupStore((s) => s.setUnreadCount);
  const lastKnownNotifIdRef = useRef<number>(0);
  const checkedRemindersRef = useRef<Set<string>>(new Set());

  // 1. Subscribe to User WebSocket topic if available
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const topicUser = `/topic/notifications/${user.id}`;
    const offUser = wsService.subscribe(topicUser, (msg: any) => {
      if (!msg) return;
      const title = msg.title || 'New Notification';
      const message = msg.message || 'You have a new update.';
      playSound('message');
      showPopup({
        id: msg.id,
        title,
        message,
        type: msg.type || 'NOTIFICATION',
        actionUrl: msg.actionUrl,
      });
    });

    return () => {
      try { offUser?.(); } catch { /* ignore */ }
    };
  }, [isAuthenticated, user?.id, showPopup]);

  // 2. Poll Notifications every 15s to catch new appointment bookings, status updates, or broadcast notifications
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const [notifRes, unreadRes] = await Promise.allSettled([
          notificationApi.getMy(),
          notificationApi.getUnreadCount(),
        ]);

        if (!isMounted) return;

        if (unreadRes.status === 'fulfilled' && unreadRes.value?.data) {
          const count = (unreadRes.value.data as any)?.count ?? 0;
          setUnreadCount(count);
        }

        if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value?.data)) {
          const list = notifRes.value.data;
          if (list.length > 0) {
            const newest = list[0];
            const newestId = Number(newest.id);
            if (lastKnownNotifIdRef.current === 0) {
              // Initial load - don't spam popups on cold page visit
              lastKnownNotifIdRef.current = newestId;
            } else if (newestId > lastKnownNotifIdRef.current) {
              // Brand new notification arrived!
              lastKnownNotifIdRef.current = newestId;
              if (!newest.isRead) {
                playSound('message');
                showPopup({
                  id: newest.id,
                  title: newest.title || 'Notification',
                  message: newest.message || '',
                  type: newest.type,
                  actionUrl: newest.actionUrl,
                });
              }
            }
          }
        }
      } catch {
        // Silent failure: network/offline background task
      }
    };

    void fetchLatest();
    const interval = setInterval(fetchLatest, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, accessToken, showPopup, setUnreadCount]);

  // 3. Medication Reminders Live Clock Checker (checks minute-by-minute)
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PATIENT') return;

    let isMounted = true;
    const checkReminders = async () => {
      try {
        const { data } = await patientApi.getMedicationReminders();
        if (!isMounted || !Array.isArray(data)) return;

        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;
        const todayDateStr = now.toISOString().split('T')[0];

        data.forEach((reminder: any) => {
          if (!reminder.active) return;
          const scheduleTimes = reminder.scheduleTimes || [];

          scheduleTimes.forEach((time: string) => {
            const key = `${reminder.id}-${todayDateStr}-${time}`;
            if (time === currentTimeStr && !checkedRemindersRef.current.has(key)) {
              checkedRemindersRef.current.add(key);
              // Ring reminder sound and show popup modal
              playSound('reminder');
              showPopup({
                title: 'Medication Reminder',
                message: `Time to take your scheduled dose: ${reminder.medicineName} (${reminder.dosage || reminder.amountPerUse || '1 dose'})`,
                type: 'MEDICATION',
                actionUrl: '/patient/reminders',
              });
            }
          });
        });
      } catch {
        // Silent
      }
    };

    void checkReminders();
    const interval = setInterval(checkReminders, 30000); // Check every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user?.role, showPopup]);

  return null;
}
