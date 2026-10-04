import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/helpers';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, href, onClick, className }: StatCardProps) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent-fill/15" aria-hidden="true">
        <Icon size={21} strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-support font-medium text-primary-light/55">{label}</span>
        <span className="mt-0.5 block truncate text-2xl font-extrabold tracking-tight text-primary-light">{value}</span>
      </span>
    </>
  );
  const classes = cn(
    'group flex min-h-[5.25rem] items-center gap-3 rounded-card border border-tonal-20/70 bg-surface-20/75 p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    className
  );

  if (href) return <Link href={href} className={classes}>{content}</Link>;
  if (onClick) return <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }} className={classes}>{content}</div>;
  return <div className={classes}>{content}</div>;
}
