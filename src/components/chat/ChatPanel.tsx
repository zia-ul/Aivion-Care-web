'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { appointmentApi, chatApi } from '@/lib/api/endpoints';
import { wsService } from '@/lib/websocket/client';
import { MessageCircle, Send } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

interface ChatRoom { id: number; appointmentId?: number | null; unreadCount?: number | null; }
interface ChatMessage { id?: number; senderId: number; senderName?: string; message: string; sentAt?: string | null; }
interface AppointmentLike { id: number; doctorName?: string; patientName?: string; appointmentDate?: string; slotTime?: string; chatRoomId?: number | null; }

function renderMessage(message: string): { text: string; encrypted: boolean } {
  const trimmed = message.trim();
  if (trimmed.startsWith('E2EE::')) {
    try {
      const envelope = JSON.parse(trimmed.slice('E2EE::'.length)) as { kind?: string };
      if (envelope.kind === 'key_announce') {
        return { text: 'Secure key exchange message', encrypted: true };
      }
      return { text: 'Encrypted message. Open this conversation in the Aivion Care mobile app to read it.', encrypted: true };
    } catch {
      return { text: 'Encrypted message. The web app cannot read this message yet.', encrypted: true };
    }
  }
  return { text: message, encrypted: false };
}

function useChatRooms(role: 'DOCTOR' | 'PATIENT') {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [appointments, setAppointments] = useState<AppointmentLike[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [{ data: roomData }, { data: aptData }] = await Promise.all([
        chatApi.getRooms(),
        appointmentApi.getMyAppointments(),
      ]);
      setRooms(Array.isArray(roomData) ? roomData : []);
      setAppointments(Array.isArray(aptData) ? aptData : []);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { load(); }, [load]);
  return { rooms, appointments, loading };
}

function useChatMessages(roomId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      const { data } = await chatApi.getMessages(roomId);
      setMessages(Array.isArray(data) ? data : []);
      await chatApi.markRead(roomId).catch(() => undefined);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [roomId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!roomId) return;
    let unsubscribe = () => {};
    const subscribe = () => {
      // Backend broadcasts ChatMessageResponse on /topic/chat/{roomId}.
      unsubscribe();
      unsubscribe = wsService.subscribe(`/topic/chat/${roomId}`, (message: ChatMessage) => {
        if (message && typeof message === 'object' && 'message' in message) {
          setMessages((prev) => [...prev, message]);
        }
      });
    };
    subscribe();
    const removeStatusListener = wsService.onStatusChange((isConnected) => {
      if (isConnected) subscribe();
    });
    return () => { removeStatusListener(); unsubscribe(); };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messages, setMessages, messagesEndRef, loadMessages };
}

export function ChatPanel({ role }: { role: 'DOCTOR' | 'PATIENT' }) {
  const { user } = useAuthStore();
  const { rooms, appointments, loading } = useChatRooms(role);
  const [roomId, setRoomId] = useState<number | null>(null);
  const { messages, setMessages, messagesEndRef, loadMessages } = useChatMessages(roomId);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);

  // Auto-select: appointment-linked room first, then most recent room.
  useEffect(() => {
    if (roomId == null && !loading) {
      const withRoom = appointments.find((a) => a.chatRoomId);
      setRoomId(withRoom?.chatRoomId ?? rooms?.[0]?.id ?? null);
    }
  }, [roomId, loading, appointments, rooms]);

  useEffect(() => wsService.onStatusChange(setConnected), []);

  const handleSend = async () => {
    if (!newMessage.trim() || !roomId) return;
    const text = newMessage.trim();
    setNewMessage('');
    try {
      // REST send is the source of truth (persists + validates + broadcasts).
      const { data } = await chatApi.sendMessage(roomId, { message: text, type: 'TEXT' });
      if (data && typeof data === 'object' && 'message' in data) setMessages((prev) => [...prev, data as ChatMessage]);
      else await loadMessages();
    } catch (error: any) {
      // Fallback: socket publish so UX stays responsive.
      wsService.send(`/chat/${roomId}`, { payload: { message: text, type: 'TEXT' } });
      alert(error?.response?.data?.message || 'Message send failed, tried realtime fallback');
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 overflow-hidden">
        <div className="p-3 border-b border-tonal-20/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-accent" />
            <select
              value={roomId ?? ''}
              onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
              className="bg-surface-20 border border-tonal-20 rounded-input text-primary-light px-2 py-1.5 text-body"
            >
              <option value="">Select conversation</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>Room {r.id}{r.appointmentId ? ` (Appt ${r.appointmentId})` : ''}</option>
              ))}
            </select>
          </div>
          <span className={`text-support ${connected ? 'text-success-light' : 'text-danger-light'}`}>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="h-[400px] overflow-y-auto p-4 space-y-3">
          {loading && <p className="text-body text-primary-light/40 text-center py-8">Loading conversations...</p>}
          {!loading && !roomId && <p className="text-body text-primary-light/40 text-center py-8">No chat room yet. {role === 'PATIENT' ? 'Book a VIDEO appointment to start the conversation!' : 'Your VIDEO appointments create chat rooms automatically.'}</p>}
          {!loading && roomId && messages.length === 0 && <p className="text-body text-primary-light/40 text-center py-8">No messages yet. Start the conversation!</p>}
          {messages.map((msg, idx) => (
            <div key={msg.id ?? idx} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-xl ${msg.senderId === user?.id ? 'bg-accent/20 text-primary-light' : 'bg-surface-10/50 text-primary-light'}`}>
                {msg.senderName && <p className="text-support text-primary-light/50 mb-1">{msg.senderName}</p>}
                <p className={`text-body ${renderMessage(msg.message).encrypted ? 'italic text-primary-light/60' : ''}`}>{renderMessage(msg.message).text}</p>
                {msg.sentAt && <p className="text-support text-primary-light/40 mt-1">{new Date(msg.sentAt).toLocaleTimeString()}</p>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-tonal-20/50 flex gap-2">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." disabled={!roomId} className="flex-1 px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" />
          <button onClick={handleSend} disabled={!roomId} className="px-4 py-2.5 bg-accent text-surface-0 rounded-input hover:bg-accent/90 disabled:opacity-50"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
