import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

const toHttpUrl = (url: string): string => {
  if (typeof window === 'undefined') return url;
  return url.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
};

type MessageHandler = (message: any) => void;

class WebRtcWebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  /** Subscriptions requested before the socket was ready, replayed on connect. */
  private pending: Map<string, MessageHandler> = new Map();
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
      // Pass token as query param for SockJS (headers not reliable over SockJS)
      webSocketFactory: () => new SockJS(`${toHttpUrl(WS_URL)}/ws/webrtc?token=${encodeURIComponent(accessToken)}`) as any,
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
        console.error('WebRTC STOMP error:', frame.headers['message']);
      },
      onWebSocketError: (event) => {
        console.error('WebRTC WebSocket error:', event);
      },
    });

    this.client.activate();
  }

  /** Re-subscribes anything requested while the socket was still connecting. */
  private flushPending() {
    if (this.pending.size === 0) return;
    // Take ownership first: leaving entries behind re-subscribed them on every
    // reconnect, stacking duplicate subscriptions per destination.
    const queued = new Map(this.pending);
    this.pending.clear();
    for (const [destination, handler] of queued) {
      this.subscribe(destination, handler);
    }
  }

  onStatusChange(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.isConnected());
    return () => this.statusListeners.delete(listener);
  }

  subscribe(destination: string, handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      // Queue instead of dropping, otherwise an early subscribe() is a silent
      // no-op and the peer never receives signaling.
      this.pending.set(destination, handler);
      return () => this.pending.delete(destination);
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        handler(JSON.parse(message.body));
      } catch {
        handler(message.body);
      }
    });

    this.subscriptions.set(destination, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    };
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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.pending.clear();
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