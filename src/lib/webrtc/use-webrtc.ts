'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { wsService } from '@/lib/websocket/client';
import { WebRtcSignal, WebRtcState } from '@/lib/webrtc/types';

const TURN_URL = process.env.NEXT_PUBLIC_TURN_URL || '';
const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME || '';
const TURN_PASSWORD = process.env.NEXT_PUBLIC_TURN_PASSWORD || '';

export function useWebRtc(consultationId: number | null, userId: number, userRole: string, chatRoomId?: number | null) {
  const [state, setState] = useState<WebRtcState>({
    localStream: null,
    remoteStream: null,
    isCallActive: false,
    isMuted: false,
    isVideoOff: false,
    error: null,
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsSubscriptionRef = useRef<(() => void) | null>(null);

  const iceServers: RTCIceServer[] = [];
  if (TURN_URL) {
    iceServers.push({
      urls: TURN_URL,
      username: TURN_USERNAME,
      credential: TURN_PASSWORD,
    });
  }
  iceServers.push({ urls: 'stun:stun.l.google.com:19302' });

  const cleanup = useCallback(() => {
    if (wsSubscriptionRef.current) {
      wsSubscriptionRef.current();
      wsSubscriptionRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onsignalingstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (state.localStream) {
      state.localStream.getTracks().forEach((track) => track.stop());
    }
    setState((prev) => ({
      ...prev,
      localStream: null,
      remoteStream: null,
      isCallActive: false,
      error: null,
    }));
  }, [state.localStream]);

  const sendSignal = useCallback((signal: WebRtcSignal, roomId?: number | null) => {
    // Backend ChatSocketController only supports /app/chat/{roomId} with
    // SocketChatMessageRequest { payload: ChatMessageCreateRequest { message, type, fileUrl } }.
    // WebRTC is therefore tunneled as a chat TEXT message carrying JSON.
    if (roomId == null) return;
    wsService.send('/chat/' + roomId, {
      payload: { message: JSON.stringify({ webrtc: signal }), type: 'TEXT' },
    });
  }, []);

  const startCall = useCallback(async () => {
    if (!consultationId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      setState((prev) => ({ ...prev, localStream: stream, isCallActive: true, error: null }));

      pc.ontrack = (event) => {
        setState((prev) => ({ ...prev, remoteStream: event.streams[0] }));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: 'ice-candidate',
            senderId: userId,
            senderRole: userRole as any,
            consultationId,
            data: event.candidate.toJSON(),
          }, chatRoomId);
        }
      };

      pc.onsignalingstatechange = () => {
        if (pc.signalingState === 'stable' && pc.remoteDescription) {
          setState((prev) => ({ ...prev, isCallActive: true }));
        }
      };

      wsSubscriptionRef.current = wsService.subscribe(
        '/topic/chat/' + chatRoomId,
        (message: any) => {
          // ChatMessageResponse shape; WebRTC signals arrive tunneled in message.message JSON.
          let signal: WebRtcSignal | null = null;
          try {
            const parsed = typeof message?.message === 'string' ? JSON.parse(message.message) : null;
            signal = parsed?.webrtc ?? null;
          } catch {
            signal = null;
          }
          if (!signal) return;
          if (signal.senderId === userId) return;
          if (signal.consultationId !== consultationId) return;

          switch (signal.type) {
            case 'offer':
              handleOffer(pc, signal.data as RTCSessionDescriptionInit);
              break;
            case 'answer':
              pc.setRemoteDescription(new RTCSessionDescription(signal.data as RTCSessionDescriptionInit));
              break;
            case 'ice-candidate':
              pc.addIceCandidate(new RTCIceCandidate(signal.data));
              break;
            case 'hang-up':
              cleanup();
              break;
          }
        }
      );

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal({
        type: 'offer',
        senderId: userId,
        senderRole: userRole as any,
        consultationId,
        data: offer,
      }, chatRoomId);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start video call',
        isCallActive: false,
      }));
    }
  }, [consultationId, userId, userRole, iceServers, sendSignal, cleanup, chatRoomId]);

  const handleOffer = async (pc: RTCPeerConnection, offer: RTCSessionDescriptionInit) => {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignal({
      type: 'answer',
      senderId: userId,
      senderRole: userRole as any,
      consultationId: consultationId!,
      data: answer,
    }, chatRoomId);
  };

  const toggleMute = useCallback(() => {
    setState((prev) => {
      if (prev.localStream) {
        prev.localStream.getAudioTracks().forEach((track) => {
          track.enabled = !track.enabled;
        });
      }
      return { ...prev, isMuted: !prev.isMuted };
    });
  }, []);

  const toggleVideo = useCallback(() => {
    setState((prev) => {
      if (prev.localStream) {
        prev.localStream.getVideoTracks().forEach((track) => {
          track.enabled = !track.enabled;
        });
      }
      return { ...prev, isVideoOff: !prev.isVideoOff };
    });
  }, []);

  const endCall = useCallback(() => {
    if (consultationId) {
      sendSignal({
        type: 'hang-up',
        senderId: userId,
        senderRole: userRole as any,
        consultationId,
        data: {},
      }, chatRoomId);
    }
    cleanup();
  }, [consultationId, userId, userRole, sendSignal, cleanup, chatRoomId]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    startCall,
    toggleMute,
    toggleVideo,
    endCall,
    cleanup,
  };
}
