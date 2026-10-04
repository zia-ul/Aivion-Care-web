import type { ReactNode } from 'react';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';

interface PageShellProps {
  children: ReactNode;
  /** Removes the top padding so the caller can place its own hero flush to the shell. */
  bare?: boolean;
}

/**
 * Shared wrapper for every marketing page. Puts the navbar, a boxed content
 * panel and the footer in the same arrangement used across the site, so
 * secondary pages keep the same rhythm as the homepage.
 */
export default function PageShell({ children, bare = false }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-bg text-primary-light">
      <LandingNavbar />
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="rounded-[26px] border border-tonal-20/70 bg-surface-10/60 shadow-soft backdrop-blur-xl">
          <div className={bare ? '' : 'px-5 py-12 sm:px-8 sm:py-16 lg:px-12'}>{children}</div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}

