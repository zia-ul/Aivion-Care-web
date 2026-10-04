'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { patientApi } from '@/lib/api/endpoints';
import { notificationService } from '@/lib/notifications/notification-service';

interface MedicationReminder {
  id: number;
  consultationId?: number;
  prescriptionId?: number;
  medicineName: string;
  dosage?: string;
  amountPerUse?: string;
  frequencyPerDay?: string;
  timing?: string;
  durationText?: string;
  notes?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  scheduleTimes: string[];
  todayDoses: Dose[];
  takenCount: number;
  skippedCount: number;
  pendingCount: number;
}

interface Dose {
  scheduledDate: string;
  doseTime: string;
  status: 'PENDING' | 'TAKEN' | 'SKIPPED';
  actedAt?: string;
}

interface UseMedicationRemindersOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useMedicationReminders(options: UseMedicationRemindersOptions = {}) {
  const { autoRefresh = true, refreshInterval = 60000 } = options;
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  const loadReminders = useCallback(async () => {
    try {
      setError(null);
      const { data } = await patientApi.getMedicationReminders();
      const loaded = Array.isArray(data) ? data : [];
      setReminders(loaded);

      if (!initializedRef.current) {
        initializedRef.current = true;
        scheduleNotifications(loaded);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleNotifications = useCallback(async (reminderList: MedicationReminder[]) => {
    const perm = await notificationService.requestPermission();
    setPermission(perm);

    if (perm !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    for (const reminder of reminderList) {
      if (!reminder.active) continue;

      const startDate = reminder.startDate ? new Date(reminder.startDate) : new Date();
      await notificationService.scheduleMedicationReminder(
        reminder.id,
        reminder.medicineName,
        reminder.scheduleTimes,
        startDate
      );
    }
  }, []);

  const startReminder = useCallback(async (id: number) => {
    try {
      await patientApi.startMedicationReminder(id);
      await loadReminders();
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Failed to start reminder');
    }
  }, [loadReminders]);

  const logDose = useCallback(async (
    id: number,
    doseTime: string,
    status: 'TAKEN' | 'SKIPPED'
  ) => {
    try {
      const now = new Date();
      await patientApi.logAdherence(id, {
        scheduledDate: now.toISOString().split('T')[0],
        doseTime,
        status,
      });
      await loadReminders();
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Failed to log dose');
    }
  }, [loadReminders]);

  const refresh = useCallback(() => {
    loadReminders();
  }, [loadReminders]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshTimerRef.current = setInterval(loadReminders, refreshInterval);
    }
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, loadReminders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  return {
    reminders,
    loading,
    error,
    permission,
    startReminder,
    logDose,
    refresh,
    loadReminders,
  };
}