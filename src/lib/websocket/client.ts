import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useEffect, useRef, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

const toHttpUrl = (url: string): string => {
  if (typeof window === 'undefined') return url;
  return url.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
};

type MessageHandler = (message: any) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualDisconnect = false;
  private statusListeners = new Set<(connected: boolean) => void>();
  private authListeners = new Set<(reason: string) => void>();

  connect(accessToken: string, onConnect?: () => void, onDisconnect?: () => void) {
    if (this.client?.connected) return;

    this.isManualDisconnect = false;
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${toHttpUrl(WS_URL)}/ws/chat`) as any,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: (() => Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay)) as any,
      onConnect: () => {
        this.reconnectAttempts = 0;
        this.statusListeners.forEach((listener) => listener(true));
        onConnect?.();
      },
      onDisconnect: () => {
        this.statusListeners.forEach((listener) => listener(false));
        if (!this.isManualDisconnect) {
          this.reconnectAttempts++;
        }
        onDisconnect?.();
      },
      onStompError: (frame) => {
        const reason = frame.headers['message'] || 'Unknown STOMP error';

        // An ERROR frame during the CONNECT handshake means the server refused
        // this token (missing, expired, revoked or wrong type). Reconnecting with
        // the same token can never succeed, so stop the retry loop instead of
        // letting stompjs redial forever and spam the console.
        if (!this.client?.connected) {
          this.client?.deactivate();
          this.statusListeners.forEach((listener) => listener(false));
          this.authListeners.forEach((listener) => listener(reason));
          return;
        }

        console.error('STOMP error:', reason);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    this.client.activate();
  }

  /**
   * Notified when the server rejects the handshake, so the caller can refresh or
   * drop the session instead of waiting for a reconnect that will never succeed.
   * Returns an unsubscribe function.
   */
  onAuthError(listener: (reason: string) => void): () => void {
    this.authListeners.add(listener);
    return () => this.authListeners.delete(listener);
  }

  onStatusChange(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.isConnected());
    return () => this.statusListeners.delete(listener);
  }

  subscribe(destination: string, handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected, cannot subscribe to', destination);
      return () => {};
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const parsed = JSON.parse(message.body);
        handler(parsed);
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

  send(destination: string, body: any) {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected, cannot send to', destination);
      return;
    }
    this.client.publish({
      destination: `/app${destination}`,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    });
  }

  disconnect() {
    this.isManualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
    this.client = null;
    this.statusListeners.forEach((listener) => listener(false));
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const wsService = new WebSocketService();

export function useWebSocket() {
  const wsRef = useRef(wsService);

  useEffect(() => {
    return () => {
      wsRef.current.disconnect();
    };
  }, []);

  return wsRef.current;
}
