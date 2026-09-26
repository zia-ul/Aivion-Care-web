'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full',
};

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={cn(
          'w-full bg-surface-20/95 rounded-2xl shadow-2xl border border-tonal-20/50',
          'animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size]
        )}
      >
        <div className="flex items-center justify-between border-b border-tonal-20/50 px-6 py-4">
          <h2 className="text-heading font-bold text-primary-light">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-primary-light/50 hover:text-primary-light hover:bg-surface-10/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}