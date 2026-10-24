import { create } from 'zustand';

/** A chat room as the sidebar needs it: an id to badge and a label to link to. */
export interface ChatRoomBadge {
  roomId: number;
  counterpartName: string;
  lastMessage?: string;
}

interface ChatUnreadState {
  /** Unread count keyed by room id. */
  unreadByRoom: Record<number, number>;
  /** Rooms the user belongs to, used to render names next to the badge. */
  rooms: ChatRoomBadge[];
  /** Newest message per room, used for the sidebar popup text. */
  latestMessageByRoom: Record<number, string>;
  /** Counter so repeated identical messages still trigger a popup. */
  lastEventAt: number;

  setRooms: (rooms: ChatRoomBadge[]) => void;
  increment: (roomId: number, message: string, counterpartName?: string) => void;
  clearRoom: (roomId: number) => void;
  reset: () => void;
}

const initialState = {
  unreadByRoom: {} as Record<number, number>,
  rooms: [] as ChatRoomBadge[],
  latestMessageByRoom: {} as Record<number, string>,
  lastEventAt: 0,
};

export const useChatUnreadStore = create<ChatUnreadState>((set) => ({
  ...initialState,

  setRooms: (rooms) =>
    set((state) => {
      // Keep any unread we already counted that is not in the fresh room list out
      // of the way, so a stale badge cannot survive a room being removed.
      const known = new Set(rooms.map((room) => room.roomId));
      const unreadByRoom: Record<number, number> = {};
      for (const [roomId, count] of Object.entries(state.unreadByRoom)) {
        const key = Number(roomId);
        if (known.has(key)) unreadByRoom[key] = count;
      }
      return { rooms, unreadByRoom };
    }),

  increment: (roomId, message, counterpartName) =>
    set((state) => ({
      unreadByRoom: { ...state.unreadByRoom, [roomId]: (state.unreadByRoom[roomId] ?? 0) + 1 },
      latestMessageByRoom: { ...state.latestMessageByRoom, [roomId]: message },
      rooms: state.rooms.map((room) =>
        counterpartName && room.roomId === roomId
          ? { ...room, counterpartName, lastMessage: message }
          : room.roomId === roomId
            ? { ...room, lastMessage: message }
            : room,
      ),
      lastEventAt: state.lastEventAt + 1,
    })),

  clearRoom: (roomId) =>
    set((state) => {
      if (state.unreadByRoom[roomId] === undefined) return state;
      const unreadByRoom = { ...state.unreadByRoom };
      delete unreadByRoom[roomId];
      return { unreadByRoom };
    }),

  reset: () => set({ ...initialState }),
}));

/** Total unread across every room, for the single sidebar badge. */
export function selectTotalUnread(state: ChatUnreadState): number {
  return Object.values(state.unreadByRoom).reduce((total, count) => total + count, 0);
}
