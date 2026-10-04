'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentApi, chatApi } from '@/lib/api/endpoints';
import { wsService } from '@/lib/websocket/client';
import {
  MessageCircle, Send, User, Stethoscope, Video, ChevronRight, Paperclip,
  FileText, Download, Loader2, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { notifyError, readableError } from '@/lib/errors';

interface ChatRoom {
  id: number;
  appointmentId?: number | null;
  unreadCount?: number | null;
  participantUserIds?: number[] | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
}
interface ChatMessage {
  id?: number;
  senderId: number;
  senderName?: string;
  senderRole?: string;
  message: string;
  sentAt?: string | null;
  type?: string | null;
  fileName?: string | null;
  fileMimeType?: string | null;
  fileSize?: number | null;
  fileUrl?: string | null;
}
interface AppointmentLike { id: number; doctorName?: string; patientName?: string; appointmentDate?: string; slotTime?: string; chatRoomId?: number | null; }

/** Mirrors ChatFileStorageService on the backend. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/**
 * Download links are minted with a 15 minute window. Opening a PDF in a browser
 * tab, or retrying after a hiccup, can easily outlast a short default, and the
 * server clamps this to its own maximum.
 */
const DOWNLOAD_LINK_TTL_SECONDS = 15 * 60;
const ALLOWED_UPLOAD_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'text/plain', 'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdf(msg: ChatMessage): boolean {
  return (
    msg.type === 'PDF' ||
    msg.fileMimeType === 'application/pdf' ||
    (msg.fileName ?? '').toLowerCase().endsWith('.pdf')
  );
}

function hasAttachment(msg: ChatMessage): boolean {
  return Boolean(msg.fileName || msg.fileUrl || msg.fileMimeType);
}

/**
 * The same message can reach us twice: once from the POST response and again
 * over the websocket (or again after a reload). Appending blindly produced
 * duplicate rows, which React then reported as non-unique keys. Merge by id
 * instead, and fall back to a stable identity for messages that have no id yet.
 */
function mergeMessages(existing: ChatMessage[], incoming: ChatMessage | ChatMessage[]): ChatMessage[] {
  const keyOf = (m: ChatMessage) =>
    m.id != null ? `id:${m.id}` : `tmp:${m.senderId}:${m.sentAt ?? ''}:${m.message ?? ''}`;

  const candidates = Array.isArray(incoming) ? incoming : [incoming];
  const seen = new Set(existing.map(keyOf));
  const additions = candidates.filter((m) => !seen.has(keyOf(m)));
  return additions.length ? [...existing, ...additions] : existing;
}

function messageKey(msg: ChatMessage, idx: number): string {
  return msg.id != null
    ? `id:${msg.id}`
    : `tmp:${msg.senderId}:${msg.sentAt ?? ''}:${idx}`;
}

/** Removes repeats that survive merging messages from several rooms. */
function dedupeMessages(list: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  return list.filter((m, i) => {
    const key = messageKey(m, i);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isSameDay(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
}

/** WhatsApp-style day separator. */
function dayLabel(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateString?: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Older activity still needs a day, so show a compact date instead of a bare
  // time that would be ambiguous.
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString(
    [],
    sameYear ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: '2-digit' }
  );
}

/** Sidebar previews are plain strings, so detect the attachment markers. */
function hasAttachmentText(preview: string): boolean {
  return preview.includes('📎') || preview.includes('📄');
}

interface Conversation {
  /** Stable identity for the counterpart, so one thread per person. */
  key: string;
  name: string;
  role: 'DOCTOR' | 'PATIENT';
  /** Every room created with this counterpart, oldest first. */
  roomIds: number[];
  /** Room new messages are written to (the most recent one). */
  activeRoomId: number;
  appointmentId?: number | null;
  unreadCount: number;
  avatarInitial: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

function counterpartName(
  room: ChatRoom,
  appointments: AppointmentLike[],
  role: 'DOCTOR' | 'PATIENT'
): string {
  const appointment = appointments.find((a) => a.id === room.appointmentId);
  if (role === 'DOCTOR') return appointment?.patientName || 'Patient';
  const doctorName = appointment?.doctorName;
  return doctorName ? `Dr. ${doctorName}` : 'Doctor';
}

/**
 * A backend room is created per appointment, so booking again with the same
 * doctor used to produce a second, empty-looking thread. Conversations are
 * therefore collapsed per counterpart: one entry per person, merging the
 * history of every room that exists between the two of them.
 */
function buildConversations(
  rooms: ChatRoom[],
  appointments: AppointmentLike[],
  role: 'DOCTOR' | 'PATIENT',
  selfId?: number
): Conversation[] {
  const groups = new Map<string, Conversation>();

  const ordered = [...rooms].sort((a, b) => {
    const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    if (bt !== at) return bt - at;
    return a.id - b.id;
  });

  for (const room of ordered) {
    const name = counterpartName(room, appointments, role);
    // Prefer the real participant id; fall back to the name when unavailable.
    const otherId = room.participantUserIds?.find((id) => id !== selfId);
    const key = otherId != null ? `u:${otherId}` : `n:${name.toLowerCase()}`;

    const existing = groups.get(key);
    if (existing) {
      existing.roomIds.push(room.id);
      existing.unreadCount += room.unreadCount || 0;
      existing.activeRoomId = room.id;
      if (room.appointmentId && !existing.appointmentId) existing.appointmentId = room.appointmentId;
      if (room.lastMessageAt && (!existing.lastMessageAt || room.lastMessageAt > existing.lastMessageAt)) {
        existing.lastMessageAt = room.lastMessageAt;
        existing.lastMessage = room.lastMessage ?? existing.lastMessage;
      }
      continue;
    }

    groups.set(key, {
      key,
      name,
      role: role === 'DOCTOR' ? 'PATIENT' : 'DOCTOR',
      roomIds: [room.id],
      activeRoomId: room.id,
      appointmentId: room.appointmentId,
      unreadCount: room.unreadCount || 0,
      avatarInitial: name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase() || '?',
      lastMessage: room.lastMessage ?? undefined,
      lastMessageAt: room.lastMessageAt ?? undefined,
    });
  }

  // Newest activity first, matching the order of the `ordered` pass.
  return [...groups.values()].sort((a, b) => {
    const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bt - at;
  });
}

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

function useChatRooms(_role: 'DOCTOR' | 'PATIENT') {
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
      // Previously console-only, so an expired session looked like an empty inbox.
      notifyError(error, 'Could not load your conversations. Please refresh and try again.');
      setRooms([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { rooms, appointments, loading };
}

function useChatMessages(roomIds: number[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roomKey = roomIds.join(',');

  const loadMessages = useCallback(async () => {
    if (roomIds.length === 0) {
      setMessages([]);
      return;
    }
    try {
      // One thread per counterpart: pull every room that belongs to them and
      // interleave by time, so previous appointments keep their history.
      const results = await Promise.all(
        roomIds.map((id) => chatApi.getMessages(id).catch(() => ({ data: [] as ChatMessage[] })))
      );
      const merged = results
        .flatMap((r) => (Array.isArray(r.data) ? r.data : []))
        .sort((a, b) => {
          const at = a.sentAt ? new Date(a.sentAt).getTime() : 0;
          const bt = b.sentAt ? new Date(b.sentAt).getTime() : 0;
          return at - bt;
        });
      setMessages(dedupeMessages(merged));
      // Fire-and-forget: a failed read receipt must not interrupt the thread.
      roomIds.forEach((id) => { chatApi.markRead(id).catch(() => undefined); });
    } catch (error) {
      notifyError(error, 'Could not load messages for this conversation.');
    }
  }, [roomKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (roomIds.length === 0) return;
    let unsubscribe = () => {};
    const subscribe = () => {
      unsubscribe();
      if (!wsService.isConnected()) {
        toast('Live updates are reconnecting. Messages may be delayed.', { icon: '⚠️' });
        return;
      }
      unsubscribe = wsService.subscribe(`/topic/chat/${roomIds[roomIds.length - 1]}`, (message: ChatMessage) => {
        if (message && typeof message === 'object' && 'message' in message) {
          setMessages((prev) => mergeMessages(prev, message));
        }
      });
    };
    subscribe();
    const removeStatusListener = wsService.onStatusChange((isConnected) => {
      if (isConnected) subscribe();
    });
    return () => { removeStatusListener(); unsubscribe(); };
  }, [roomKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messages, setMessages, messagesEndRef, loadMessages };
}

export function ChatPanel({ role }: { role: 'DOCTOR' | 'PATIENT' }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { rooms, appointments, loading } = useChatRooms(role);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [openingFileId, setOpeningFileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversations = useMemo(
    () => buildConversations(rooms, appointments, role, user?.id),
    [rooms, appointments, role, user?.id]
  );

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.key === activeKey) || null,
    [conversations, activeKey]
  );

  // Rooms belonging to the open conversation; history is merged across them.
  const activeRoomIds = useMemo(
    () => selectedConversation?.roomIds ?? [],
    [selectedConversation]
  );

  const activeRoomId = selectedConversation?.activeRoomId ?? null;

  const { messages, setMessages, messagesEndRef, loadMessages } = useChatMessages(activeRoomIds);


const selectedAppointment = useMemo(() => {
    const appointmentId = selectedConversation?.appointmentId;
    if (!appointmentId) return null;
    return appointments.find((a) => a.id === appointmentId) ?? null;
  }, [selectedConversation, appointments]);

  const handleStartCall = useCallback(() => {
    if (!selectedAppointment) {
      toast.error('A video call needs a linked appointment, which this conversation does not have.');
      return;
    }
    router.push(`/video/consultation?id=${selectedAppointment.id}`);
  }, [router, selectedAppointment]);

  // Open the most recent conversation once loading settles.
  useEffect(() => {
    if (activeKey == null && !loading && conversations.length > 0) {
      setActiveKey(conversations[0].key);
    }
  }, [activeKey, loading, conversations]);

  useEffect(() => wsService.onStatusChange(setConnected), []);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) {
      toast.error('Type a message before sending.');
      return;
    }
    if (!activeRoomId) {
      toast.error('Select a conversation first.');
      return;
    }

    setNewMessage('');
    try {
      const { data } = await chatApi.sendMessage(activeRoomId, { message: text, type: 'TEXT' });
      if (data && typeof data === 'object' && 'message' in data) {
        setMessages((prev) => mergeMessages(prev, data as ChatMessage));
      } else {
        await loadMessages();
      }
    } catch (error) {
      // Realtime fallback kept, but the failure is now surfaced rather than alerted.
      wsService.send(`/chat/${activeRoomId}`, { payload: { message: text, type: 'TEXT' } });
      toast.error(readableError(error, 'Message failed to send. Check your connection and try again.'));
      setNewMessage(text);
    }
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;

    if (!activeRoomId) {
      toast.error('Select a conversation before attaching a file.');
      return;
    }
    if (file.type && !ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      toast.error(`"${file.type || 'This file type'}" is not supported. Attach a PDF, image, Word, Excel or CSV file.`);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`That file is ${formatBytes(file.size)}. The limit is 10 MB.`);
      return;
    }

    setUploading(true);
    const caption = newMessage.trim();
    try {
      const { data } = await chatApi.uploadFile(activeRoomId, file, caption || undefined);
      if (data && typeof data === 'object') {
        setMessages((prev) => mergeMessages(prev, data as ChatMessage));
      } else {
        await loadMessages();
      }
      setNewMessage('');
      toast.success(`${file.name} sent.`);
    } catch (error) {
      notifyError(error, `Could not send ${file.name}. Please try again.`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenFile = async (msg: ChatMessage) => {
    if (!msg.id) return;
    setOpeningFileId(msg.id);
    try {
      const { data } = await chatApi.getSignedFileUrl(msg.id, DOWNLOAD_LINK_TTL_SECONDS);
      const url = data?.url;
      if (!url) throw new Error('No download link was returned for this file.');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      notifyError(error, 'Could not open this file. Ask the sender to share it again.');
    } finally {
      setOpeningFileId(null);
    }
  };

  const getLastMessagePreview = (msg: ChatMessage) => {
    if (hasAttachment(msg)) {
      return isPdf(msg) ? `📄 ${msg.fileName}` : `📎 ${msg.fileName}`;
    }
    const { text, encrypted } = renderMessage(msg.message);
    return encrypted ? '🔒 Encrypted message' : text;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)]">
        <div className="w-full md:w-80 border-r border-tonal-20/50 bg-surface-20/80 animate-pulse">
          <div className="p-4 border-b border-tonal-20/50">
            <div className="h-6 bg-surface-10/50 rounded w-3/4"></div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-accent/15"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-surface-10/50 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-10/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-surface-20/80">
          <div className="p-4 border-b border-tonal-20/50">
            <div className="h-6 bg-surface-10/50 rounded w-1/4"></div>
          </div>
          <div className="flex-1"></div>
          <div className="p-4 border-t border-tonal-20/50">
            <div className="h-10 bg-surface-10/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] max-w-full">
      {/* Conversations Sidebar */}
      <aside className={`w-full md:w-80 border-r border-tonal-20/50 bg-surface-20/80 flex flex-col transition-all duration-300 ${!sidebarOpen ? 'md:w-0 md:overflow-hidden' : ''}`}>
        <div className="p-4 border-b border-tonal-20/50 flex items-center justify-between">
          <h2 className="text-heading font-bold text-primary-light">Messages</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-primary-light/60 hover:text-primary-light"
            aria-label={sidebarOpen ? 'Close conversations' : 'Open conversations'}
          >
            <ChevronRight size={20} className={sidebarOpen ? 'rotate-180' : ''} />
          </button>
        </div>

        <div className="p-3 border-b border-tonal-20/50">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 bg-surface-10/50 border border-tonal-20 rounded-xl text-primary-light placeholder-primary-light/40 focus:outline-none focus:border-accent text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-primary-light/40">
              <MessageCircle size={32} className="mx-auto mb-2 text-primary-light/20" />
              <p className="text-sm">{role === 'PATIENT' ? 'Book a VIDEO appointment to start chatting' : 'Your VIDEO appointments create conversations automatically'}</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.key}
                onClick={() => { setActiveKey(conv.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeKey === conv.key ? 'bg-accent/10 border border-accent/30' : 'hover:bg-surface-10/50'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-body">
                    {conv.avatarInitial}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent-fill text-white text-xs font-semibold flex items-center justify-center">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>
<div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-primary-light truncate">{conv.name}</h4>
                      <span className="shrink-0 text-support text-primary-light/45 whitespace-nowrap">
                        {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-sm text-primary-light/60 truncate">
                        {conv.lastMessage
                          ? (hasAttachmentText(conv.lastMessage) ? '📎 Attachment' : conv.lastMessage)
                          : 'Tap to start conversation'}
                      </p>
                      {conv.roomIds.length > 1 && (
                        <span className="shrink-0 rounded-full bg-tonal-20/60 px-1.5 py-0.5 text-[10px] text-primary-light/50">
                          {conv.roomIds.length} threads
                        </span>
                      )}
                    </div>
                  </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-20/80 min-w-0">
        <div className="p-4 border-b border-tonal-20/50 flex items-center justify-between gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-primary-light/60 hover:text-primary-light"
            aria-label="Open conversations"
          >
            <MessageCircle size={24} />
          </button>
          {selectedConversation ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-body">
                {selectedConversation.avatarInitial}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-light truncate">{selectedConversation.name}</h3>
                <p className="text-xs text-primary-light/50">
                  {selectedConversation.role === 'DOCTOR' ? 'Doctor' : 'Patient'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-center">
              <p className="text-primary-light/40">Select a conversation to start messaging</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            {selectedConversation && selectedAppointment && (
              <button
                onClick={handleStartCall}
                title={`Start video call with ${role === 'DOCTOR' ? selectedAppointment.patientName || 'patient' : selectedAppointment.doctorName || 'doctor'}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-input bg-success/15 text-success-light hover:bg-success-fill/25 transition-colors text-body font-medium"
              >
                <Video size={16} />
                Video Call
              </button>
            )}
            <span className={`text-support ${connected ? 'text-success-light' : 'text-danger-light'}`}>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={messagesEndRef}>
          {!selectedConversation && (
            <div className="flex items-center justify-center h-full text-primary-light/40">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-primary-light/20" />
                <p className="text-body">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
          {selectedConversation && messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-primary-light/40">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-primary-light/20" />
                <p className="text-body">No messages yet. Start the conversation!</p>
              </div>
            </div>
          )}
{messages.map((msg, idx) => {
            const mine = msg.senderId === user?.id;
            const prev = messages[idx - 1];
            // WhatsApp-style separator whenever the day changes.
            const showDivider = !isSameDay(prev?.sentAt, msg.sentAt);
            return (
              <div key={messageKey(msg, idx)}>
                {showDivider && (
                  <div className="my-3 flex justify-center">
                    <span className="rounded-full border border-tonal-20/60 bg-surface-10/70 px-3 py-1 text-support text-primary-light/60">
                      {dayLabel(msg.sentAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-xl ${mine ? 'bg-accent/20 text-primary-light' : 'bg-surface-10/50 text-primary-light'}`}>
                  {msg.senderName && (
                    <div className="flex items-center gap-1.5 text-support text-primary-light/50 mb-1">
                      {msg.senderRole === 'DOCTOR' && <Stethoscope size={12} />}
                      {msg.senderRole === 'PATIENT' && <User size={12} />}
                      <span>{msg.senderName}</span>
                      {msg.senderRole && <span className="text-[10px] px-1.5 py-0.5 rounded bg-tonal-20/50">{msg.senderRole}</span>}
                    </div>
                  )}

                  {hasAttachment(msg) && (
                    <button
                      type="button"
                      onClick={() => handleOpenFile(msg)}
                      disabled={openingFileId === msg.id}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg border border-tonal-20/60 bg-surface-20/40 p-2.5 text-left transition hover:border-accent/50 hover:bg-surface-20/70 disabled:opacity-60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                        {openingFileId === msg.id
                          ? <Loader2 size={17} className="animate-spin" />
                          : isPdf(msg) ? <FileText size={17} /> : <Paperclip size={17} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-primary-light">
                          {msg.fileName ?? 'Attachment'}
                        </span>
                        <span className="block text-support text-primary-light/50">
                          {isPdf(msg) ? 'PDF' : (msg.fileMimeType ?? 'File')}
                          {msg.fileSize ? ` · ${formatBytes(msg.fileSize)}` : ''}
                        </span>
                      </span>
                      <Download size={15} className="shrink-0 text-primary-light/50" aria-hidden="true" />
                    </button>
                  )}

                  {msg.message && (
                    <p className={`text-body ${hasAttachment(msg) ? 'mt-2' : ''} ${renderMessage(msg.message).encrypted ? 'italic text-primary-light/60' : ''}`}>
                      {renderMessage(msg.message).text}
                    </p>
                  )}
{msg.sentAt && <p className="text-support text-primary-light/40 mt-1">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedConversation && (
          <div className="border-t border-tonal-20/50 p-4">
            {!connected && (
              <div className="mb-3 flex items-start gap-2 rounded-input border border-warning/30 bg-warning/10 p-2.5 text-support text-warning-lighter">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>Realtime is disconnected. Messages will send once the connection recovers.</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp,image/gif,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="hidden"
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Attach a PDF, image or document"
                aria-label="Attach a file"
                className="px-3 py-2.5 rounded-input border border-tonal-20 bg-surface-20 text-primary-light/70 transition hover:border-accent/50 hover:text-accent disabled:opacity-50"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message, or attach a PDF..."
                className="flex-1 px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                aria-label="Send message"
                className="px-4 py-2.5 bg-accent-fill text-white rounded-input hover:bg-accent-fill/90 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-support text-primary-light/40">
              Attachments: PDF, images, Word, Excel, CSV or text up to 10 MB.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

