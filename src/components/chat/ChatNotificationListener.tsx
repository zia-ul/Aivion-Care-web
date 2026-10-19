'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { chatApi } from '@/lib/api/endpoints';
import { primeAudio, useSounds } from '@/lib/audio/sounds';
import { useAuthStore } from '@/lib/stores/auth';
import { useChatUnreadStore, type ChatRoomBadge } from '@/lib/stores/chat-unread';
import { wsService } from '@/lib/websocket/client';

/**
 * Watches every chat room the signed-in user belongs to, wherever they are in
 * the app.
 *
 * `ChatPanel` only subscribes to the room it is displaying, so without this a
 * message arriving while the user is on a dashboard would be invisible: no
 * sound, no badge, nothing. Mounted once in the providers tree.
 */
export function ChatNotificationListener() {
  const { accessToken, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { playMessage } = useSounds();

  const subscribedRef = useRef<number[]>([]);
  // The room currently on screen; messages for it are already seen.
  const activeRoomRef = useRef<number | null>(null);

  const setRooms = useChatUnreadStore((state) => state.setRooms);
  const increment = useChatUnreadStore((state) => state.increment);
  const clearRoom = useChatUnreadStore((state) => state.clearRoom);

  // Track which room is open so its messages do not double-count.
  useEffect(() => {
    const match = pathname?.match(/\/(?:patient|doctor|pharmacist|pharmacy|pathology)\/chat(?:\/(\d+))?/) ||
      pathname?.match(/\/(?:patient|doctor|pharmacist|pharmacy|pathology)?chat\/(\d+)/);
    activeRoomRef.current = match && match[1] ? Number(match[1]) : null;
  }, [pathname]);

  useEffect(() => {
    if (!accessToken) {
      setRooms([]);
      return;
    }

    let cancelled = false;
    const unsubscribers: Array<() => void> = [];
    subscribedRef.current = [];

    const unsubscribeAll = () => {
      while (unsubscribers.length) {
        try {
          unsubscribers.pop()?.();
        } catch {
          // ignore
        }
      }
      subscribedRef.current = [];
    };

    /** Rooms already covered by an active subscription. */
    const isSubscribed = (roomId: number) => subscribedRef.current.includes(roomId);

    const watch = async () => {
      try {
        const { data } = await chatApi.getRooms();
        if (cancelled) return;

        const rooms: ChatRoomBadge[] = (Array.isArray(data) ? data : []).map((room: {
          id?: number;
          roomId?: number;
          counterpartName?: string;
          otherUserName?: string;
          lastMessage?: string;
        }) => ({
          roomId: Number(room?.id ?? room?.roomId ?? 0),
          counterpartName: String(
            room?.counterpartName ?? room?.otherUserName ?? 'Conversation',
          ),
          lastMessage: room?.lastMessage,
        }))
          .filter((room) => room.roomId > 0);

        setRooms(rooms);

        rooms.forEach((room) => {
          if (isSubscribed(room.roomId)) return;

          const off = wsService.subscribe(`/topic/chat/${room.roomId}`, (message: {
            message?: string;
            senderId?: number;
          }) => {
            if (cancelled || !message || typeof message !== 'object') return;
            // Ignore the echo of something this user just sent.
            if (message.senderId != null && message.senderId === user?.id) return;

            const text = typeof message.message === 'string' ? message.message.trim() : '';
            const roomId = room.roomId;

            if (activeRoomRef.current === roomId) {
              // Visible already; keep the badge accurate without replaying sound.
              clearRoom(roomId);
              return;
            }

            increment(roomId, text, room.counterpartName);
            playMessage();
            primeAudio();
          });

          if (typeof off === 'function') {
            unsubscribers.push(off);
            subscribedRef.current = [...subscribedRef.current, room.roomId];
          }
        });
      } catch {
        // Chat is non-essential; a failure here must not break the shell.
      }
    };

    // wsService drops subscriptions made while disconnected, so wait for the
    // socket and re-attach on every reconnect.
    const offStatus = wsService.onStatusChange((connected) => {
      if (!connected) return;
      unsubscribeAll();
      void watch();
    });

    void watch();

    return () => {
      cancelled = true;
      offStatus?.();
      unsubscribeAll();
      setRooms([]);
    };
    // Deliberately not depending on pathname: re-subscribing on every route
    // change would drop and re-add every socket subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return null;
}

/** Clears the badge for a room as soon as it is opened. */
export function useClearRoomOnOpen(roomId: number | null | undefined) {
  const clearRoom = useChatUnreadStore((state) => state.clearRoom);
  useEffect(() => {
    if (roomId) clearRoom(roomId);
  }, [roomId, clearRoom]);
}