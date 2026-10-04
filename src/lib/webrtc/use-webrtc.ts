'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { webrtcWsService } from '@/lib/websocket/webrtc-client';
import { WebRtcSignal, buildWebRtcSignal, type SignalType } from '@/lib/webrtc/types';

const TURN_URL = process.env.NEXT_PUBLIC_TURN_URL || '';
const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME || '';
const TURN_PASSWORD = process.env.NEXT_PUBLIC_TURN_PASSWORD || '';

type CallState = 'idle' | 'ringing' | 'calling' | 'connected' | 'ended';

export function useWebRtc(
  consultationId: number | null,
  userId: number,
  userRole: string,
  accessToken: string | null
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [incomingCall, setIncomingCall] = useState<{ fromId: number; fromRole: string; video?: boolean } | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const localOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
  const callAcceptedRef = useRef(false);
  /**
   * ICE candidates routinely arrive before the answer/offer is applied. Dropping
   * them (the previous behaviour) left the peer connection with no working
   * candidate pair, which is why media never flowed. Buffer until the remote
   * description exists, then flush.
   */
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const flushPendingCandidates = useCallback(async (pc: RTCPeerConnection) => {
    const queued = pendingCandidatesRef.current;
    if (!queued.length || !pc.remoteDescription) return;
    pendingCandidatesRef.current = [];
    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('Failed to add buffered ICE candidate:', err);
      }
    }
  }, []);

  const addCandidate = useCallback(
    async (pc: RTCPeerConnection, candidate: RTCIceCandidateInit) => {
      if (!pc.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('Failed to add ICE candidate:', err);
      }
    },
    []
  );

  const isInitiator = userRole === 'DOCTOR' || userRole === 'SUPER_ADMIN';

  // Stable identity: a fresh array each render would retrigger these effects.
  const iceServers = useMemo<RTCIceServer[]>(() => {
    const servers: RTCIceServer[] = [];
    if (TURN_URL) {
      servers.push({ urls: TURN_URL, username: TURN_USERNAME, credential: TURN_PASSWORD });
    }
    servers.push({ urls: 'stun:stun.l.google.com:19302' });
    return servers;
  }, []);

const sendSignal = useCallback(
    (type: SignalType, data: Record<string, any>) => {
      if (consultationId == null) return;
      // Routed through the typed builder so the payload always matches the
      // WebRtcSignal contract the backend validates.
      webrtcWsService.send(
        `/webrtc/signal/${consultationId}`,
        buildWebRtcSignal({
          type,
          senderId: userId,
          senderRole: userRole,
          consultationId,
          data,
        })
      );
    },
    [consultationId, userId, userRole]
  );

  const cleanup = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    localOfferRef.current = null;
    callAcceptedRef.current = false;
    pendingCandidatesRef.current = [];

    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.oniceconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
      // Belt and braces: removing the track from the stream guarantees the
      // device is released even if a peer connection still holds a reference.
      try { localStreamRef.current?.removeTrack(track); } catch { /* already detached */ }
    });
    localStreamRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallState('idle');
    setIncomingCall(null);
    setError(null);
  }, []);

  // Connect the signaling socket.
  useEffect(() => {
    if (!accessToken) return;

    webrtcWsService.connect(accessToken);
    const removeListener = webrtcWsService.onStatusChange(setIsConnected);

    return () => {
      removeListener();
      webrtcWsService.disconnect();
    };
  }, [accessToken]);

  const startCall = useCallback(async (options?: { video?: boolean }) => {
    if (!consultationId) return;

    if (!webrtcWsService.isConnected()) {
      setError('Signaling connection not ready. Please try again in a moment.');
      return;
    }

    const useVideo = options?.video !== false; // default true

    // Release any stream from a previous attempt before requesting a new one,
    // otherwise a second press leaves the first camera track running.
    cleanup();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: useVideo });
      const pc = new RTCPeerConnection({ iceServers });

      peerConnectionRef.current = pc;
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      setLocalStream(stream);
      setError(null);

      pc.ontrack = (event) => {
        const incoming = event.streams?.[0];
        if (incoming) setRemoteStream(incoming);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) sendSignal('ice-candidate', event.candidate.toJSON());
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError(
            TURN_URL
              ? 'Media connection failed. Check your network or TURN configuration.'
              : 'Media connection failed. No TURN relay is configured, so calls will not connect on most mobile and campus networks. Ask an administrator to set NEXT_PUBLIC_TURN_URL.'
          );
        } else if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setCallState('connected');
        }
      };

      const handleSignal = async (message: any) => {
        if (!message || typeof message !== 'object') return;
        // Ignore the echo of our own broadcast (the topic fans out to all peers).
        if (message.senderId === userId) return;

        const current = peerConnectionRef.current;
        if (!current) return;

        switch (message.type) {
          case 'offer': {
            const offer = message.data as RTCSessionDescriptionInit;
            localOfferRef.current = offer;
            await current.setRemoteDescription(new RTCSessionDescription(offer));
            await flushPendingCandidates(current);
            const answer = await current.createAnswer();
            await current.setLocalDescription(answer);
            sendSignal('answer', answer);
            if (!isInitiator) {
              setCallState('connected');
            }
            break;
          }
          case 'answer': {
            // Only the offerer accepts an answer, and only while awaiting one.
            if (current.signalingState !== 'have-local-offer') return;
            await current.setRemoteDescription(
              new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
            );
            await flushPendingCandidates(current);
            if (isInitiator) {
              setCallState('connected');
            }
            break;
          }
          case 'ice-candidate': {
            // Buffer if the description has not landed yet.
            await addCandidate(current, message.data);
            break;
          }
          case 'join': {
            // Someone joined after our offer went out; re-send so they connect.
            if (isInitiator && localOfferRef.current) {
              sendSignal('offer', localOfferRef.current);
            }
            break;
          }
          case 'call': {
            // Incoming call notification
            if (!isInitiator) {
              setIncomingCall({ 
                fromId: message.senderId, 
                fromRole: message.senderRole,
                video: message.data?.video !== false 
              });
              setCallState('ringing');
            }
            break;
          }
          case 'accept': {
            // Call was accepted by the other party
            if (isInitiator && !callAcceptedRef.current) {
              callAcceptedRef.current = true;
              // Now create and send the offer
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              localOfferRef.current = offer;
              sendSignal('offer', offer);
              setCallState('calling');
            }
            break;
          }
          case 'reject': {
            // Call was rejected
            if (isInitiator) {
              cleanup();
              setError('Call was rejected');
            }
            break;
          }
          case 'hang-up': {
            cleanup();
            break;
          }
        }
      };

      const destination = `/topic/webrtc/${consultationId}`;
      unsubscribeRef.current?.();
      unsubscribeRef.current = webrtcWsService.subscribe(destination, handleSignal);

      // If we're the initiator (doctor), send a "call" signal to ring the other party
      if (isInitiator) {
        sendSignal('call', { video: useVideo });
        setCallState('calling');
      } else {
        // Patient waits for call signal, then sends 'join' to request offer
        sendSignal('join', {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start video call');
      setCallState('ended');
    }
  }, [consultationId, userId, isInitiator, iceServers, sendSignal, cleanup, addCandidate, flushPendingCandidates]);

  const acceptCall = useCallback(async () => {
    if (!consultationId || !incomingCall) return;
    
    try {
      const useVideo = incomingCall.video !== false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: useVideo });
      const pc = new RTCPeerConnection({ iceServers });

      peerConnectionRef.current = pc;
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      setLocalStream(stream);
      setError(null);
      setCallState('connected');
      setIncomingCall(null);

      pc.ontrack = (event) => {
        const incoming = event.streams?.[0];
        if (incoming) setRemoteStream(incoming);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) sendSignal('ice-candidate', event.candidate.toJSON());
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError(
            TURN_URL
              ? 'Media connection failed. Check your network or TURN configuration.'
              : 'Media connection failed. No TURN relay is configured, so calls will not connect on most mobile and campus networks. Ask an administrator to set NEXT_PUBLIC_TURN_URL.'
          );
        } else if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setCallState('connected');
        }
      };

      const handleSignal = async (message: any) => {
        if (!message || typeof message !== 'object') return;
        if (message.senderId === userId) return;

        const current = peerConnectionRef.current;
        if (!current) return;

        switch (message.type) {
          case 'offer': {
            const offer = message.data as RTCSessionDescriptionInit;
            localOfferRef.current = offer;
            await current.setRemoteDescription(new RTCSessionDescription(offer));
            await flushPendingCandidates(current);
            const answer = await current.createAnswer();
            await current.setLocalDescription(answer);
            sendSignal('answer', answer);
            setCallState('connected');
            break;
          }
          case 'ice-candidate': {
            await addCandidate(current, message.data);
            break;
          }
          case 'hang-up': {
            cleanup();
            break;
          }
        }
      };

      const destination = `/topic/webrtc/${consultationId}`;
      unsubscribeRef.current?.();
      unsubscribeRef.current = webrtcWsService.subscribe(destination, handleSignal);

      // Send accept signal to let initiator know we're ready
      sendSignal('accept', {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept call');
      setCallState('ended');
    }
  }, [consultationId, incomingCall, userId, iceServers, sendSignal, cleanup, addCandidate, flushPendingCandidates]);

const rejectCall = useCallback(() => {
    if (consultationId && incomingCall) {
      sendSignal('reject', {});
      // Releasing the camera here matters: accepting a call already requested
      // getUserMedia, so rejecting without cleanup left the camera light on.
      cleanup();
    }
  }, [consultationId, incomingCall, sendSignal, cleanup]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !next;
    });
    setIsMuted(next);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    const next = !isVideoOff;
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !next;
    });
    setIsVideoOff(next);
  }, [isVideoOff]);

  const endCall = useCallback(() => {
    sendSignal('hang-up', {});
    cleanup();
  }, [sendSignal, cleanup]);

// Tear the call down on unmount only.
  useEffect(() => cleanup, [cleanup]);

  // A tab closed or reloaded mid-call would otherwise leave the camera light
  // on. Only 'pagehide' is used - 'visibilitychange' also fires on a normal tab
  // switch, which would kill an active consultation.
  useEffect(() => {
    const release = () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    };
    window.addEventListener('pagehide', release);
    return () => window.removeEventListener('pagehide', release);
  }, []);

  return {
    localStream,
    remoteStream,
    isCallActive: callState === 'connected',
    isMuted,
    isVideoOff,
    isConnected,
    error,
    callState,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    toggleMute,
    toggleVideo,
    endCall,
    cleanup,
  };
}



