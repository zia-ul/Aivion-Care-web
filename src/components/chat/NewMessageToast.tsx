'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatUnreadStore } from '@/lib/stores/chat-unread';
import { useAuthStore } from '@/lib/stores/auth';

/**
 * Popup that appears in the corner when a message arrives while the user is
 * somewhere other than the chat page. It names the sender and shows a preview so
 * the user can decide whether to open it.
 */
export function NewMessageToast() {
  const rooms = useChatUnreadStore((state) => state.rooms);
  const latestMessageByRoom = useChatUnreadStore((state) => state.latestMessageByRoom);
  const lastEventAt = useChatUnreadStore((state) => state.lastEventAt);
  const clearRoom = useChatUnreadStore((state) => state.clearRoom);

  const [visible, setVisible] = useState<{ roomId: number; name: string; preview: string } | null>(null);

  useEffect(() => {
    if (lastEventAt === 0) return;

    // The most recently updated room is the one that just received a message.
    const entries = Object.entries(latestMessageByRoom);
    if (entries.length === 0) return;
    const [roomId, preview] = entries[entries.length - 1];
    const room = rooms.find((item) => String(item.roomId) === roomId);

    setVisible({
      roomId: Number(roomId),
      name: room?.counterpartName ?? 'New message',
      preview,
    });

    const timer = window.setTimeout(() => setVisible(null), 7000);
    return () => window.clearTimeout(timer);
    // Keyed on the store counter so repeated identical messages still pop.
  }, [lastEventAt, latestMessageByRoom, rooms]);

  const userRole = useAuthStore((state) => state.user?.role);
  const chatPath = userRole === 'DOCTOR' ? '/doctor/chat' : '/patient/chat';

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-24 right-4 z-[95] w-[min(22rem,calc(100vw-2rem))] animate-fade-in-up md:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-accent/30 bg-surface-20/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <MessageCircle size={19} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-primary-light">
              {visible.name}
              <span className="ml-2 text-[11px] font-medium text-primary-light/50">new message</span>
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-primary-light/70">
              {visible.preview || 'Sent you a message'}
            </p>
            <a
              href={`${chatPath}?roomId=${visible.roomId}`}
              onClick={() => clearRoom(visible.roomId)}
              className="mt-2 inline-block text-xs font-semibold text-accent hover:underline"
            >
              Open chat
            </a>
          </div>
          <button
            type="button"
            onClick={() => setVisible(null)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-lg p-1 text-primary-light/40 transition hover:bg-surface-20 hover:text-primary-light"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
