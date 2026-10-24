import { HeartPulse, Activity } from 'lucide-react';

interface HeartLoadingProps {
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function HeartLoading({
  label = 'Loading...',
  sublabel,
  fullScreen = false,
  size = 'md',
  className = '',
}: HeartLoadingProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const content = (
    <div className={`relative flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {/* Background glow circle */}
      <div className="absolute inset-0 rounded-full bg-teal-500/15 dark:bg-teal-400/10 blur-xl animate-pulse" />
      
      {/* Heart pulse container */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-teal-500/20 via-sky-500/15 to-emerald-500/20 flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-500/10 backdrop-blur-md`}
      >
        <HeartPulse
          className={`${iconSizes[size]} text-teal-600 dark:text-teal-300 animate-heartbeat-fast drop-shadow-[0_0_12px_rgba(20,184,166,0.5)]`}
        />
        <Activity className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 text-sky-500 dark:text-sky-300 animate-pulse" />
      </div>

      {label && (
        <p className="relative mt-3.5 text-sm font-semibold tracking-wide text-primary-light">
          {label}
        </p>
      )}

      {sublabel && (
        <p className="relative mt-1 text-xs text-primary-light/60 max-w-xs">
          {sublabel}
        </p>
      )}

      {/* Mini ECG audio wave simulation bar */}
      <div className="relative mt-3 flex items-center gap-1">
        <span className="w-1 h-3 rounded-full bg-teal-400/80 animate-pulse" />
        <span className="w-1 h-5 rounded-full bg-sky-400 animate-pulse animation-delay-100" />
        <span className="w-1 h-6 rounded-full bg-teal-400 animate-pulse animation-delay-200" />
        <span className="w-1 h-4 rounded-full bg-emerald-400 animate-pulse animation-delay-300" />
        <span className="w-1 h-2 rounded-full bg-teal-400/80 animate-pulse animation-delay-400" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-10/70 backdrop-blur-md">
        <div className="rounded-3xl border border-tonal-20/80 bg-surface-20/90 shadow-2xl backdrop-blur-xl p-2">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
