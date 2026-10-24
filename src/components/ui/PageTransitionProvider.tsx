'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { HeartPulse, Activity } from 'lucide-react';

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [displayPath, setDisplayPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== displayPath) {
      // Trigger smooth transition out & in
      setNavigating(true);
      const timer = setTimeout(() => {
        setDisplayPath(pathname);
        setNavigating(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayPath]);

  // Intercept in-app link clicks for smooth navigation feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !target.getAttribute('target') &&
        !target.getAttribute('download') &&
        href !== pathname
      ) {
        setNavigating(true);
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname]);

  return (
    <>
      {/* Top ambient ECG glow line that runs during navigation */}
      <div
        className={`fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none transition-opacity duration-300 ${
          navigating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-full w-full bg-gradient-to-r from-teal-400 via-sky-400 to-emerald-400 animate-shimmer" />
      </div>

      {/* Heartbeat pulse overlay when transitioning/loading */}
      {navigating && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-surface-10/40 backdrop-blur-[3px] pointer-events-none animate-fade-in transition-all">
          <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-surface-20/90 border border-tonal-20/80 shadow-2xl shadow-accent/20 backdrop-blur-xl">
            {/* Ambient radiant pulse circle */}
            <div className="absolute inset-0 rounded-3xl bg-teal-500/10 animate-radiant-pulse" />
            
            {/* Heartbeat icon */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-500/20 flex items-center justify-center border border-teal-500/30">
              <HeartPulse className="w-9 h-9 text-teal-400 animate-heartbeat-fast drop-shadow-[0_0_12px_rgba(20,184,166,0.6)]" />
              <Activity className="absolute bottom-1 right-1 w-4 h-4 text-sky-400 animate-pulse" />
            </div>

            <span className="relative mt-3 text-xs font-semibold tracking-wider uppercase text-primary-light/80">
              Connecting...
            </span>
          </div>
        </div>
      )}

      {/* Animated page container with slide-up + fade */}
      <div
        key={pathname}
        className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out fill-mode-both"
      >
        {children}
      </div>
    </>
  );
}
