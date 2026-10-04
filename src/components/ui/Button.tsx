import { cn } from '@/lib/helpers';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, fullWidth, type = 'button', ...props }, ref) => {
    const baseClasses = 'inline-flex min-h-11 select-none items-center justify-center gap-2 rounded-input font-bold transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-10 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:active:scale-100';

    const variantClasses = {
      // Filled variants use the *-fill tokens: the plain `accent`/`success`
      // colours stay light in the dark theme for text and icons, so a button
      // needs its own deeper shade to carry a legible white label.
      primary: 'bg-accent-fill text-white hover:bg-accent-fill/90 active:bg-accent-fill/80',
      danger: 'bg-danger-fill text-white hover:bg-danger-fill/90 active:bg-danger-fill/80',
      success: 'bg-success-fill text-white hover:bg-success-fill/90 active:bg-success-fill/80',
      info: 'bg-info-fill text-white hover:bg-info-fill/90 active:bg-info-fill/80',
      outline: 'border border-tonal-30 bg-surface-20/60 text-primary-light hover:border-accent/60 hover:bg-surface-30/70',
      ghost: 'text-primary-light hover:bg-surface-20 hover:text-accent',
    };

    const sizeClasses = {
      sm: 'min-h-9 px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-body',
      lg: 'min-h-12 px-6 py-3.5 text-body',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {loading ? <span>Loading...</span> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
