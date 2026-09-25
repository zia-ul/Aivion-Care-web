'use client';

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/helpers';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-semibold text-primary-light/85">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-danger-light" role="alert">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const controlClasses = 'w-full rounded-input border border-tonal-30/90 bg-surface-20/80 px-4 py-3 text-body text-primary-light shadow-sm shadow-black/10 outline-none transition duration-200 placeholder:text-primary-light/30 hover:border-tonal-40 focus:border-accent/80 focus:bg-surface-20 focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, icon, className, id, ...props }, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div>
      {label && <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-primary-light/85">{label}</label>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent/70" aria-hidden="true">{icon}</span>}
        <input ref={ref} id={inputId} aria-invalid={Boolean(error) || undefined} className={cn(controlClasses, icon && 'pl-11', error && 'border-danger focus:border-danger focus:ring-danger/10', className)} {...props} />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger-light" role="alert">{error}</p>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, error, className, id, ...props }, ref) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  return (
    <div>
      {label && <label htmlFor={textareaId} className="mb-2 block text-sm font-semibold text-primary-light/85">{label}</label>}
      <textarea ref={ref} id={textareaId} aria-invalid={Boolean(error) || undefined} className={cn(controlClasses, 'min-h-28 resize-y', error && 'border-danger focus:border-danger focus:ring-danger/10', className)} {...props} />
      {error && <p className="mt-1.5 text-xs font-medium text-danger-light" role="alert">{error}</p>}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, error, options, className, id, ...props }, ref) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div>
      {label && <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-primary-light/85">{label}</label>}
      <select ref={ref} id={selectId} aria-invalid={Boolean(error) || undefined} className={cn(controlClasses, 'cursor-pointer appearance-none', error && 'border-danger focus:border-danger focus:ring-danger/10', className)} {...props}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-danger-light" role="alert">{error}</p>}
    </div>
  );
});
