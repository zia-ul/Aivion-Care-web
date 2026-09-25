import { cn } from '@/lib/helpers';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <p className="text-body text-primary-light/60">{text}</p>
    </div>
  );
}
