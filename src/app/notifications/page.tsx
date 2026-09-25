'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { notificationApi } from '@/lib/api/endpoints';
import { Bell, Check } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  sentAt: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await notificationApi.getMy();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  return (
    <AppLayout role="PATIENT" title="Notifications" subtitle="Your alerts and updates">
      <div className="max-w-3xl">
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Loading...</p></div>
          ) : notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications yet" />
          ) : (
            <div className="space-y-3">
              {notifications.map(({ id, title, message, sentAt, isRead }) => (
                <div key={id} className={`p-4 rounded-xl border transition-colors ${isRead ? 'bg-surface-10/30 border-tonal-20/20' : 'bg-accent/5 border-accent/20'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-primary-light">{title}</p>
                      <p className="text-body text-primary-light/70 mt-1">{message}</p>
                      <p className="text-support text-primary-light/40 mt-2">{new Date(sentAt).toLocaleString()}</p>
                    </div>
                    {!isRead && (
                      <button onClick={() => markAsRead(id)} className="p-2 bg-accent/10 rounded-lg hover:bg-accent/20">
                        <Check size={16} className="text-accent" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
