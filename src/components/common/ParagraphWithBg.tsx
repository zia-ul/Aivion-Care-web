import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/helpers';

interface ParagraphWithBgProps {
  imageSrc: string;
  imageAlt?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  heading: React.ReactNode;
  paragraph: React.ReactNode;
  overlayOpacity?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ParagraphWithBg({
  imageSrc,
  imageAlt = 'Healthcare Background Scene',
  badge,
  badgeIcon,
  heading,
  paragraph,
  overlayOpacity,
  className,
  children,
}: ParagraphWithBgProps) {
  return (
    <div
      className={cn(
        'relative group overflow-hidden rounded-[28px] border border-tonal-20/80 bg-surface-20/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/50',
        className
      )}
    >
      {/* Background Clinical Image with Adaptive Vignette */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover opacity-25 dark:opacity-35 transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Dynamic theme backdrop that turns dark in dark mode and pearl/white in light mode */}
        <div
          className={cn(
            'absolute inset-0',
            overlayOpacity || 'bg-surface-20/90 dark:bg-slate-950/85'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-10 via-surface-20/80 to-transparent dark:from-slate-950 dark:via-slate-950/60 dark:to-transparent" />
      </div>

      {/* Grid Scanline Overlay for Medical Telemetry Feel */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content Layer with Crisp Adaptive Typography */}
      <div className="relative z-10 max-w-3xl">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/15 dark:border-cyan-400/35 dark:bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-cyan-300 backdrop-blur-md">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary-light leading-tight">
          {heading}
        </h3>

        <div className="mt-4 text-base sm:text-lg leading-relaxed text-primary-light/85 font-normal">
          {paragraph}
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

export default ParagraphWithBg;
