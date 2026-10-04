'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/lib/stores/theme';
import { cn } from '@/lib/helpers';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark switch. Renders both icons and lets CSS pick the visible one, so
 * there is no icon swap between the server and client render.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'border border-tonal-20/70 bg-surface-20/70 text-primary-light/75',
        'transition hover:border-accent/50 hover:bg-surface-30/70 hover:text-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
    >
      <Sun size={18} className="hidden [html[data-theme='light']_&]:block" aria-hidden="true" />
      <Moon size={18} className="hidden [html[data-theme='dark']_&]:block" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;