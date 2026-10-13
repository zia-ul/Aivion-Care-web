'use client';

import React, { useEffect, useState, useRef } from 'react';

interface StatItem {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const statsConfig: StatItem[] = [
  { target: 100, suffix: '+', label: 'Users reached' },
  { target: 4, suffix: '', label: 'Core health signals' },
  { target: 8, suffix: '+', label: 'Healthcare workflows' },
  { target: 24, suffix: '/7', label: 'Connected monitoring' },
];

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    const duration = 1600; // ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easedProgress * target);

      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [started, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function TrustStats() {
  return (
    <section className="border-y border-tonal-20/70 bg-surface-10 relative overflow-hidden" aria-label="Platform highlights">
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-sky-500/15 px-5 py-2 sm:px-8 md:grid-cols-4 md:divide-y-0 lg:px-10 relative z-10">
        {statsConfig.map(({ target, suffix, prefix, label }) => (
          <div key={label} className="px-4 py-7 text-center md:py-8 transition-transform hover:-translate-y-0.5">
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 sm:text-4xl drop-shadow-sm">
              <AnimatedCounter target={target} suffix={suffix} prefix={prefix} />
            </p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-primary-light/75 dark:text-primary-light/65">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
