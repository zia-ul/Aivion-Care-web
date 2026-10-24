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
    // High-availability public STUN servers
    servers.push({
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
        'stun:stun.services.mozilla.com',
        'stun:global.stun.twilio.com:3478',
      ],
    });
    // Free open-relay TURN servers for cellular/mobile carrier NAT traversal
    servers.push({
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    });
    servers.push({
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    });
    servers.push({
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    });
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

  const handleSignal = useCallback(
    async (message: any) => {
      if (!message || typeof message !== 'object') return;
      if (message.senderId === userId) return;

      const current = peerConnectionRef.current;

      switch (message.type) {
        case 'call': {
          if (!isInitiator) {
            setIncomingCall({
              fromId: message.senderId,
              fromRole: message.senderRole,
              video: message.data?.video !== false,
            });
            setCallState('ringing');
          }
          break;
        }
        case 'accept': {
          if (isInitiator) {
            callAcceptedRef.current = true;
            if (current) {
              if (current.signalingState === 'stable') {
                try {
                  const offer = await current.createOffer();
                  await current.setLocalDescription(offer);
                  localOfferRef.current = offer;
                  sendSignal('offer', offer);
                } catch (err) {
                  console.warn('Failed to create offer upon accept:', err);
                }
              } else if (localOfferRef.current && current.signalingState === 'have-local-offer') {
                sendSignal('offer', localOfferRef.current);
              }
            }
            setCallState('calling');
          }
          break;
        }
        case 'offer': {
          const offer = message.data as RTCSessionDescriptionInit;
          localOfferRef.current = offer;
          if (current) {
            try {
              if (current.signalingState === 'stable' || current.signalingState === 'have-local-offer') {
                if (current.signalingState === 'have-local-offer') {
                  await current.setLocalDescription({ type: 'rollback' });
                }
                await current.setRemoteDescription(new RTCSessionDescription(offer));
                await flushPendingCandidates(current);
                const answer = await current.createAnswer();
                await current.setLocalDescription(answer);
                sendSignal('answer', answer);
                setCallState('connected');
              }
            } catch (err) {
              console.warn('Failed to handle incoming offer:', err);
            }
          } else if (!isInitiator) {
            // Patient received offer before clicking accept
            setIncomingCall({
              fromId: message.senderId,
              fromRole: message.senderRole,
              video: true,
            });
            setCallState('ringing');
          }
          break;
        }
        case 'answer': {
          if (current) {
            try {
              if (current.signalingState === 'have-local-offer') {
                await current.setRemoteDescription(
                  new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
                );
                await flushPendingCandidates(current);
                setCallState('connected');
              }
            } catch (err) {
              console.warn('Failed to handle incoming answer:', err);
            }
          }
          break;
        }
        case 'ice-candidate': {
          if (current) {
            await addCandidate(current, message.data);
          } else if (message.data) {
            pendingCandidatesRef.current.push(message.data);
          }
          break;
        }
        case 'join': {
          if (isInitiator && localOfferRef.current) {
            sendSignal('offer', localOfferRef.current);
          }
          break;
        }
        case 'reject': {
          if (isInitiator) {
            cleanup();
            setError('Call was rejected');
            setCallState('ended');
          }
          break;
        }
        case 'hang-up': {
          cleanup();
          setCallState('ended');
          break;
        }
      }
    },
    [userId, isInitiator, sendSignal, cleanup, addCandidate, flushPendingCandidates]
  );

  // Room listener: Subscribe to WebRTC topic as soon as connected and consultationId is valid
  useEffect(() => {
    if (!consultationId || !isConnected) return;
    const destination = `/topic/webrtc/${consultationId}`;
    const unsubscribe = webrtcWsService.subscribe(destination, handleSignal);
    return () => {
      unsubscribe();
    };
  }, [consultationId, isConnected, handleSignal]);

  const startCall = useCallback(
    async (options?: { video?: boolean }) => {
      if (!consultationId) return;

      if (!webrtcWsService.isConnected()) {
        let attempts = 0;
        while (!webrtcWsService.isConnected() && attempts < 15) {
          await new Promise((r) => setTimeout(r, 200));
          attempts++;
        }
        if (!webrtcWsService.isConnected()) {
          setError('Signaling connection not ready. Please try again in a moment.');
          return;
        }
      }

      const useVideo = options?.video !== false;

      cleanup();

      try {
        const audioConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: useVideo });
        const pc = new RTCPeerConnection({ iceServers });

        peerConnectionRef.current = pc;
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        setLocalStream(stream);
        setError(null);

        pc.ontrack = (event) => {
          console.log('[WebRTC] ontrack fired:', event.track.kind, event.track.id);
          let incoming = event.streams?.[0];
          if (!incoming) {
            incoming = new MediaStream();
          }
          if (event.track) {
            // Ensure track is in the stream if not already
            if (!incoming.getTracks().some((t) => t.id === event.track.id)) {
              incoming.addTrack(event.track);
            }
          }
          setRemoteStream(new MediaStream(incoming.getTracks()));
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

        // If we're doctor/initiator, create local offer and broadcast call signal
        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          localOfferRef.current = offer;
          sendSignal('call', { video: useVideo });
          setCallState('calling');
        } else {
          sendSignal('join', {});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start video call');
        setCallState('ended');
      }
    },
    [consultationId, isInitiator, iceServers, sendSignal, cleanup]
  );

  const acceptCall = useCallback(
    async (options?: { video?: boolean }) => {
      if (!consultationId) return;

      try {
        const useVideo = options?.video !== undefined ? options.video : incomingCall?.video !== false;
        const audioConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: useVideo });
        const pc = new RTCPeerConnection({ iceServers });

        peerConnectionRef.current = pc;
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        setLocalStream(stream);
        setError(null);
        setIncomingCall(null);

        pc.ontrack = (event) => {
          console.log('[WebRTC] ontrack fired (acceptCall):', event.track.kind, event.track.id);
          let incoming = event.streams?.[0];
          if (!incoming) {
            incoming = new MediaStream();
          }
          if (event.track) {
            if (!incoming.getTracks().some((t) => t.id === event.track.id)) {
              incoming.addTrack(event.track);
            }
          }
          setRemoteStream(new MediaStream(incoming.getTracks()));
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

        // If doctor's offer already landed, answer immediately
        if (localOfferRef.current) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(localOfferRef.current));
            await flushPendingCandidates(pc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignal('answer', answer);
            setCallState('connected');
          } catch (err) {
            console.warn('Failed to answer buffered offer:', err);
          }
        }

        // Notify initiator that call was accepted
        sendSignal('accept', {});
        setTimeout(() => {
          if (peerConnectionRef.current?.signalingState === 'stable' && !peerConnectionRef.current?.remoteDescription) {
            sendSignal('accept', {});
          }
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to accept call');
        setCallState('ended');
      }
    },
    [consultationId, incomingCall, iceServers, sendSignal, flushPendingCandidates]
  );

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



