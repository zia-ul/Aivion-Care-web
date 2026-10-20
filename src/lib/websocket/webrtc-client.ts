import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import { resolveWsOrigin } from '@/lib/api/config';
import { getValidAccessToken } from '@/lib/api/auth-token';

const WS_URL = resolveWsOrigin();

const toHttpUrl = (url: string): string => {
  if (typeof window === 'undefined') return url;
  let clean = url.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
  if (window.location.protocol === 'https:' && clean.startsWith('http:')) {
    clean = clean.replace(/^http:/, 'https:');
  }
  return clean;
};

type MessageHandler = (message: any) => void;

class WebRtcWebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  /** Signals published before the socket was ready, replayed on connect. */
  private pendingSends: Array<{ destination: string; body: any }> = [];
  private statusListeners = new Set<(connected: boolean) => void>();
  private isManualDisconnect = false;
  /**
   * The socket is shared: a global incoming-call listener holds it open while
   * the consultation page also connects. Without counting, the page unmounting
   * would disconnect the listener and calls would stop ringing.
   */
  private refCount = 0;

  connect(accessToken: string, onConnect?: () => void, onDisconnect?: () => void) {
    this.refCount += 1;

    if (this.client?.connected) {
      onConnect?.();
      return;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isManualDisconnect = false;
    this.client = new Client({
      beforeConnect: async () => {
        const freshToken = await getValidAccessToken();
        if (freshToken && this.client) {
          this.client.connectHeaders = {
            Authorization: `Bearer ${freshToken}`,
          };
        }
      },
      // Pass token as query param for SockJS (headers not reliable over SockJS)
      webSocketFactory: () => {
        const token = (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null) || accessToken;
        return new SockJS(`${toHttpUrl(WS_URL)}/ws/webrtc?token=${encodeURIComponent(token)}`) as any;
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      // A call is short-lived, so recover from a dropped socket with a fixed
      // backoff rather than an ever-growing delay.
      reconnectDelay: 2000,
onConnect: () => {
          this.statusListeners.forEach((listener) => listener(true));
          this.flushPending();
          this.flushPendingSends();
          onConnect?.();
        },
      onDisconnect: () => {
        this.statusListeners.forEach((listener) => listener(false));
        onDisconnect?.();
      },
      onStompError: (frame) => {
        const errorMsg = frame.headers['message'] || 'STOMP connection error';
        if (process.env.NODE_ENV === 'development') {
          console.warn('WebRTC STOMP notice:', errorMsg);
        }
      },
      onWebSocketError: (event) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('WebRTC WebSocket notice:', event);
        }
      },
    });

    this.client.activate();
  }

  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private pendingHandlers: Map<string, Set<MessageHandler>> = new Map();

  /** Re-subscribes anything requested while the socket was still connecting. */
  private flushPending() {
    if (this.pendingHandlers.size === 0) return;
    const queued = new Map(this.pendingHandlers);
    this.pendingHandlers.clear();
    for (const [destination, handlerSet] of queued) {
      handlerSet.forEach((h) => this.subscribe(destination, h));
    }
  }

  onStatusChange(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.isConnected());
    return () => this.statusListeners.delete(listener);
  }

  subscribe(destination: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(destination)) {
      this.handlers.set(destination, new Set());
    }
    this.handlers.get(destination)!.add(handler);

    const unsubscribe = () => {
      const set = this.handlers.get(destination);
      if (set) {
        set.delete(handler);
        if (set.size === 0) {
          this.handlers.delete(destination);
          const sub = this.subscriptions.get(destination);
          if (sub) {
            try { sub.unsubscribe(); } catch {}
            this.subscriptions.delete(destination);
          }
        }
      }
      const pendingSet = this.pendingHandlers.get(destination);
      if (pendingSet) {
        pendingSet.delete(handler);
        if (pendingSet.size === 0) {
          this.pendingHandlers.delete(destination);
        }
      }
    };

    if (!this.client?.connected) {
      if (!this.pendingHandlers.has(destination)) {
        this.pendingHandlers.set(destination, new Set());
      }
      this.pendingHandlers.get(destination)!.add(handler);
      return unsubscribe;
    }

    if (!this.subscriptions.has(destination)) {
      const subscription = this.client.subscribe(destination, (message) => {
        let payload: any;
        try {
          payload = JSON.parse(message.body);
        } catch {
          payload = message.body;
        }
        const currentHandlers = this.handlers.get(destination);
        if (currentHandlers) {
          currentHandlers.forEach((h) => {
            try {
              h(payload);
            } catch (err) {
              console.error('WebRTC message handler error on', destination, err);
            }
          });
        }
      });
      this.subscriptions.set(destination, subscription);
    }

    return unsubscribe;
  }

  /**
   * Messages published before the socket finished connecting used to be dropped
   * with only a console warning. A start-call that fires during the handshake
   * therefore lost its offer/answer and the call silently never connected.
   * They are queued and flushed on connect instead.
   */
  send(destination: string, body: any) {
    if (!this.client?.connected) {
      this.pendingSends.push({ destination, body });
      return;
    }
    this.client.publish({
      destination: `/app${destination}`,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    });
  }

  private flushPendingSends() {
    if (this.pendingSends.length === 0) return;
    const queued = this.pendingSends;
    this.pendingSends = [];
    for (const item of queued) {
      this.send(item.destination, item.body);
    }
  }

  disconnect() {
    this.refCount = Math.max(0, this.refCount - 1);
    // Another holder (e.g. the global call listener) still needs the socket.
    if (this.refCount > 0) return;

    this.isManualDisconnect = true;
    this.subscriptions.forEach((sub) => {
      try { sub.unsubscribe(); } catch {}
    });
    this.subscriptions.clear();
    this.handlers.clear();
    this.pendingHandlers.clear();
    this.pendingSends = [];
    this.client?.deactivate();
    this.client = null;
    this.statusListeners.forEach((listener) => listener(false));
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const webrtcWsService = new WebRtcWebSocketService();