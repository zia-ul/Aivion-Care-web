export type SignalType = 'offer' | 'answer' | 'ice-candidate' | 'hang-up' | 'join' | 'call' | 'accept' | 'reject';

export interface WebRtcSignal {
  type: SignalType;
  senderId: number;
  senderRole: string;
  consultationId: number;
  data: Record<string, any>;
  /** ISO-8601. Backend validates @Valid; omit and Spring rejects with 400 → STOMP ERROR. */
  timestamp: string;
}

export const buildWebRtcSignal = (signal: Omit<WebRtcSignal, 'timestamp'>): WebRtcSignal => ({
  ...signal,
  timestamp: new Date().toISOString(),
});
