'use client';

import { create } from 'zustand';

export interface AppNotificationItem {
  id?: number;
  title: string;
  message: string;
  type?: string;
  actionUrl?: string;
  timestamp?: number;
}

interface NotificationPopupState {
  activeNotification: AppNotificationItem | null;
  unreadCount: number;
  showPopup: (notification: AppNotificationItem) => void;
  closePopup: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
}

export const useNotificationPopupStore = create<NotificationPopupState>((set) => ({
  activeNotification: null,
  unreadCount: 0,
  showPopup: (notification) =>
    set((state) => ({
      activeNotification: {
        ...notification,
        timestamp: Date.now(),
      },
      unreadCount: state.unreadCount + 1,
    })),
  closePopup: () => set({ activeNotification: null }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
