'use client';

// Flutter-app visual language: dark navy cards on light minted backgrounds.
export const FL = {
  patientBg: '#07141D',
  doctorBg: '#0A1B26',
  patientCard: '#0D202B',
  doctorCard: '#102A36',
  patientInner: '#143342',
  doctorInner: '#123A49',
  mint: '#22D3C5',
  blue: '#6E96FF',
  pink: '#F47D8A',
  lavender: '#A8A4E7',
  gold: '#F2C66D',
  cyan: '#76C8D4',
  muted: '#8CB5BE',
};

export function DarkCard({ children, tone = 'doctor', className = '' }: { children: React.ReactNode; tone?: 'doctor' | 'patient'; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-[#22D3C5]/15 shadow-[0_10px_18px_rgba(34,211,197,0.12)] p-5 ${tone === 'doctor' ? 'bg-[#102A36]' : 'bg-[#0D202B]'} ${className}`}
    >
      {children}
    </div>
  );
}

export function InnerCard({ children, tone = 'doctor', className = '' }: { children: React.ReactNode; tone?: 'doctor' | 'patient'; className?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${tone === 'doctor' ? 'bg-[#123A49]' : 'bg-[#143342]'} ${className}`}>
      {children}
    </div>
  );
}

export function LightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-white border border-[#D6ECF1] shadow-[0_10px_18px_rgba(63,143,224,0.08)] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-bold text-[#132633]">{children}</h3>
      {action}
    </div>
  );
}

export function Pill({ children, color = '#4DD9AC' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${color}22`, color }}>
      {children}
    </span>
  );
}

export function StatTile({ title, value, sub, icon, color }: { title: string; value: string | number; sub?: string; icon?: React.ReactNode; color?: string }) {
  const c = color ?? FL.mint;
  return (
    <div className="rounded-3xl p-4 text-white bg-[#1C2B3A] border border-white/10 shadow-[0_10px_18px_rgba(77,217,172,0.12)]">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${c}26`, color: c }}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#8AB0C0]">{title}</p>
          <p className="text-2xl font-extrabold leading-tight">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-3 text-xs" style={{ color: c }}>{sub}</p>}
    </div>
  );
}

export function ActionButton({ children, onClick, variant = 'primary', disabled, className = '' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'danger' | 'ghost'; disabled?: boolean; className?: string;
}) {
  const styles: Record<string, string> = {
    primary: 'bg-[#4DD9AC] text-[#0E2A22] hover:bg-[#3FCB9E]',
    outline: 'bg-transparent text-[#132633] border border-[#B9DCE4] hover:bg-[#E7F6F9]',
    danger: 'bg-[#F09595]/20 text-[#C25A5A] hover:bg-[#F09595]/30',
    ghost: 'bg-[#2A3D50] text-white hover:bg-[#33495F]',
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
      <span className="block text-sm font-medium text-[#132633] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full px-4 py-2.5 rounded-2xl bg-white border border-[#B9DCE4] text-[#132633] focus:outline-none focus:border-[#4DD9AC]';
