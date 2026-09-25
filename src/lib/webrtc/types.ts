export type SignalType = 'offer' | 'answer' | 'ice-candidate' | 'hang-up';

export interface WebRtcSignal {
  type: SignalType;
  senderId: number;
  senderRole: 'DOCTOR' | 'PATIENT';
  consultationId: number;
  data: Record<string, any>;
}

export interface WebRtcState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallActive: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  error: string | null;
}
