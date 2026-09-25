import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/helpers';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('rounded-card border border-dashed border-tonal-30/70 bg-surface-20/40 px-5 py-10 text-center', className)}>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent/70">
        <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-primary-light">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-primary-light/55">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
