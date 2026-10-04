'use client';

type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    reminderId?: number;
    doseTime?: string;
    action?: 'TAKEN' | 'SKIPPED' | 'SNOOZE';
    url?: string;
  };
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
  vibrate?: number[];
};

class NotificationService {
  private static instance: NotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';
  private isSupported = false;
  private subscriptions: Map<number, { doseTime: string; reminderId: number }> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
      this.permission = Notification.permission;
      this.initServiceWorker();
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready for push notifications');
    } catch (error) {
      console.warn('Service Worker not available:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      this.permission = 'denied';
      return 'denied';
    }
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted');
      return;
    }

    try {
      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/icons/icon-512x512.svg',
        badge: payload.badge || '/icons/icon-512x512.svg',
        tag: payload.tag || `medication-${payload.data?.reminderId}-${payload.data?.doseTime}`,
        data: payload.data,
        requireInteraction: payload.requireInteraction ?? true,
      };

      const notification = this.swRegistration
        ? await this.swRegistration.showNotification(payload.title, options)
        : new Notification(payload.title, options);

      // Apply vibration pattern if supported
      if ('vibrate' in navigator && payload.vibrate) {
        navigator.vibrate(payload.vibrate);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async scheduleMedicationReminder(
    reminderId: number,
    medicineName: string,
    doseTimes: string[],
    startDate: Date
  ): Promise<void> {
    if (!this.isPermissionGranted()) {
      console.warn('Cannot schedule reminders: notification permission not granted');
      return;
    }

    doseTimes.forEach((doseTime) => {
      const [hours, minutes] = doseTime.split(':').map(Number);
      const scheduledDate = new Date(startDate);
      scheduledDate.setHours(hours, minutes, 0, 0);

      if (scheduledDate < new Date()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      const delay = scheduledDate.getTime() - Date.now();
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          this.showMedicationNotification(reminderId, medicineName, doseTime);
          this.rescheduleDaily(reminderId, medicineName, doseTime);
        }, delay);

        this.subscriptions.set(reminderId, { doseTime, reminderId });
      }
    });
  }

  private showMedicationNotification(reminderId: number, medicineName: string, doseTime: string): void {
    this.showLocalNotification({
      title: 'Medication Reminder',
      body: `Time to take ${medicineName}`,
      tag: `medication-${reminderId}-${doseTime}`,
      data: {
        reminderId,
        doseTime,
        action: 'TAKEN',
        url: `/patient/reminders?reminder=${reminderId}`,
      },
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
    });
  }

  private rescheduleDaily(reminderId: number, medicineName: string, doseTime: string): void {
    const [hours, minutes] = doseTime.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);

    const delay = tomorrow.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.showMedicationNotification(reminderId, medicineName, doseTime);
        this.rescheduleDaily(reminderId, medicineName, doseTime);
      }, delay);
    }
  }

  cancelMedicationReminder(reminderId: number): void {
    this.subscriptions.delete(reminderId);
  }

  async subscribeToPush(userId: number): Promise<PushSubscription | null> {
    if (!this.swRegistration || !this.isPermissionGranted()) {
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): BufferSource {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  onNotificationClick(callback: (notification: Notification) => void): void {
    if (typeof window !== 'undefined') {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_CLICK') {
          callback(event.data.notification);
        }
      });
    }
  }

  getScheduledReminders(): Map<number, { doseTime: string; reminderId: number }> {
    return this.subscriptions;
  }
}

export const notificationService = NotificationService.getInstance();

export default notificationService;