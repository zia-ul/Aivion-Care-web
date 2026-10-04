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
} as const;

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

export function Pill({ children, color = FL.mint }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: tint(color, 14), color }}>
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

export function ActionButton({ children, onClick, variant = 'primary', disabled, className = '' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'danger' | 'ghost'; disabled?: boolean; className?: string;
}) {
  const styles: Record<string, string> = {
    primary: 'bg-accent-fill text-white hover:bg-accent-fill/90',
    outline: 'bg-transparent text-primary-light border border-tonal-30 hover:bg-surface-30',
    danger: 'bg-danger/20 text-danger-light hover:bg-danger-fill/30',
    ghost: 'bg-tonal-10 text-primary-light hover:bg-tonal-20',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-primary-light mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full px-4 py-2.5 rounded-2xl bg-surface-20 border border-tonal-30 text-primary-light placeholder:text-primary-light/40 focus:outline-none focus:border-accent';
