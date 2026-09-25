import { cn, getStatusClasses } from '@/lib/helpers';

interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayStatus = status?.replaceAll('_', ' ') ?? '';

  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', getStatusClasses(status), className)}>
      {displayStatus}
    </span>
  );
}
