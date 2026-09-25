import { cn } from '@/lib/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', onClick, hover }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5 md:p-6',
    lg: 'p-5 sm:p-7 md:p-8',
  };
  const interactive = Boolean(onClick);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'rounded-card border border-tonal-20/70 bg-surface-20/75 shadow-soft shadow-black/10 backdrop-blur-sm',
        paddingClasses[padding],
        interactive && 'cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-20 motion-reduce:transform-none motion-reduce:transition-none',
        hover && !onClick && 'transition duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-20 motion-reduce:transform-none motion-reduce:transition-none',
        onClick && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
    >
      {children}
    </div>
  );
}
