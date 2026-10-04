import { type LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">{eyebrow}</p>
      <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">{title}</h2>
      {description && <p className="mt-5 leading-7 text-primary-light/60">{description}</p>}
    </div>
  );
}