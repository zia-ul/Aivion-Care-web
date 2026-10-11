'use client';

// Flutter-app visual language: dark navy cards on light minted backgrounds.
// Values are CSS custom properties (channels as "R G B") so they follow the
// active theme. Inline styles cannot take an opacity modifier, so components
// that build inline colours resolve them through resolveVar().
export const FL = {
  mint: 'var(--accent)',
  blue: 'var(--c-blue)',
  pink: 'var(--c-pink)',
  lavender: 'var(--c-lavender)',
  gold: 'var(--c-gold)',
  cyan: 'var(--c-slate)',
  muted: 'var(--c-muted)',
  gray: 'var(--c-muted)',
  coral: 'var(--c-pink)',
} as const;

export const FormField = Field;

/** Tinted background that works for both hex literals and theme tokens. */
function tint(token: string, alpha: number): string {
  return `color-mix(in srgb, ${token} ${alpha}%, transparent)`;
}

export function DarkCard({ children, tone = 'doctor', className = '' }: { children: React.ReactNode; tone?: 'doctor' | 'patient'; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-accent/15 shadow-[0_10px_18px_rgba(34,211,197,0.12)] p-5 ${tone === 'doctor' ? 'bg-tonal-0' : 'bg-surface-20'} ${className}`}
    >
      {children}
    </div>
  );
}

export function InnerCard({ children, tone = 'doctor', className = '' }: { children: React.ReactNode; tone?: 'doctor' | 'patient'; className?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${tone === 'doctor' ? 'bg-tonal-10' : 'bg-surface-30'} ${className}`}>
      {children}
    </div>
  );
}

export function LightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface-20 border border-tonal-20 shadow-[0_10px_18px_rgba(63,143,224,0.08)] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-bold text-primary-light">{children}</h3>
      {action}
    </div>
  );
}

export function Pill({ children, color = FL.mint, size }: { children: React.ReactNode; color?: string; size?: 'sm' | 'md' | 'lg' | string }) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  return (
    <span className={`${sizeClasses} rounded-full font-semibold inline-flex items-center gap-1`} style={{ backgroundColor: tint(color, 14), color }}>
      {children}
    </span>
  );
}

export function StatTile({ title, value, sub, icon, color }: { title: string; value: string | number; sub?: string; icon?: React.ReactNode; color?: string }) {
  const c = color ?? FL.mint;
  return (
    <div className="rounded-3xl p-4 bg-surface-20 border border-tonal-20 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tint(c, 14), color: c }}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-primary-light/60">{title}</p>
          <p className="text-2xl font-extrabold leading-tight text-primary-light">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-3 text-xs font-semibold" style={{ color: c }}>{sub}</p>}
    </div>
  );
}

export function ActionButton({ children, onClick, variant = 'primary', disabled, className = '', size }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'danger' | 'ghost'; disabled?: boolean; className?: string; size?: 'sm' | 'md' | 'lg' | string;
}) {
  const styles: Record<string, string> = {
    primary: 'bg-accent-fill text-white hover:bg-accent-fill/90',
    outline: 'bg-transparent text-primary-light border border-tonal-30 hover:bg-surface-30',
    danger: 'bg-danger/20 text-danger-light hover:bg-danger-fill/30',
    ghost: 'bg-tonal-10 text-primary-light hover:bg-tonal-20',
  };
  const sizeClass = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} rounded-2xl font-semibold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-primary-light mb-1.5">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full px-4 py-2.5 rounded-2xl bg-surface-20 border border-tonal-30 text-primary-light placeholder:text-primary-light/40 focus:outline-none focus:border-accent';

export function Shield({ children, className = '', size }: { children?: React.ReactNode; className?: string; size?: number }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium ${className}`}>
      <svg className="w-3.5 h-3.5" style={size ? { width: size, height: size } : undefined} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      {children}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-primary-light/60">{message}</p>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${sizes[size]} w-full bg-surface-20 rounded-3xl border border-accent/15 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-accent/15">
          <h3 className="text-lg font-bold text-primary-light">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-primary-light/60 hover:bg-surface-30 hover:text-primary-light transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
