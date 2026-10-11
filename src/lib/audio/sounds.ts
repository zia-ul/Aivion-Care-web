'use client';

import { useCallback, useEffect, useRef } from 'react';

export type SoundName = 'message' | 'reminder' | 'ring';

const SOURCES: Record<SoundName, string> = {
  message: '/sounds/message-notification.wav',
  reminder: '/sounds/reminder-notification.wav',
  ring: '/sounds/call-ring.wav',
};

/** The ringtone loops until it is explicitly stopped. */
const LOOPS: ReadonlySet<SoundName> = new Set<SoundName>(['ring']);

const MAX_INSTANCES = 4;
const instances = new Map<SoundName, HTMLAudioElement[]>();

let unlocked = false;
let unlockBound = false;

/**
 * Browsers block audio until the user has interacted with the page, so a sound
 * triggered by a WebSocket push is silently dropped on a fresh session. Playing
 * a silent buffer inside a user gesture marks the element as playable for good.
 */
function unlock(): void {
  if (unlocked || typeof window === 'undefined') return;
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const context = new Ctx();
    const buffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    void context.close();
    unlocked = true;
  } catch {
    // Autoplay stays locked; sounds are best-effort.
  }
}

/** Called from a click/keydown handler to prime playback as early as possible. */
export function primeAudio(): void {
  if (typeof window === 'undefined') return;
  if (!unlockBound) {
    unlockBound = true;
    const handler = () => unlock();
    window.addEventListener('pointerdown', handler, { once: true, capture: true });
    window.addEventListener('keydown', handler, { once: true, capture: true });
  }
  unlock();
}

function play(name: SoundName): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = instances.get(name) ?? [];
    // Cap repeats so a burst of messages cannot stack into a wall of noise.
    if (existing.length >= MAX_INSTANCES) return;

    const audio = new Audio(SOURCES[name]);
    audio.preload = 'auto';
    if (LOOPS.has(name)) {
      audio.loop = true;
    }
    audio.addEventListener('ended', () => {
      instances.set(
        name,
        (instances.get(name) ?? []).filter((item) => item !== audio),
      );
    });
    void audio.play().catch(() => {
      // Blocked by autoplay policy; the visual notification still shows.
    });
    instances.set(name, [...existing, audio]);
  } catch {
    // Audio is a progressive enhancement - never let it break the feature.
  }
}

function stop(name: SoundName): void {
  const existing = instances.get(name) ?? [];
  for (const audio of existing) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // ignore
    }
  }
  instances.delete(name);
}

function stopAll(): void {
  for (const name of Object.keys(SOURCES) as SoundName[]) {
    stop(name);
  }
}

/**
 * Plays a sound outside React. Safe to call from timers, service-worker
 * messages, and other non-component code.
 */
export function playSound(name: SoundName): void {
  primeAudio();
  play(name);
}

/** Stops a looping sound (currently the ringtone). */
export function stopSound(name: SoundName): void {
  stop(name);
}

/**
 * Plays UI sounds. The ringtone is special-cased: it loops until `stopRing` is
 * called, so an unanswered call keeps ringing.
 */
export function useSounds() {
  const ringRef = useRef(false);

  // A ringing call should not continue after the user navigates away.
  useEffect(() => {
    return () => {
      ringRef.current = false;
      stopAll();
    };
  }, []);

  const playMessage = useCallback(() => play('message'), []);
  const playReminder = useCallback(() => play('reminder'), []);

  const startRing = useCallback(() => {
    if (ringRef.current) return;
    ringRef.current = true;
    play('ring');
  }, []);

  const stopRing = useCallback(() => {
    if (!ringRef.current) return;
    ringRef.current = false;
    stop('ring');
  }, []);

  return { playMessage, playReminder, startRing, stopRing, primeAudio };
}
