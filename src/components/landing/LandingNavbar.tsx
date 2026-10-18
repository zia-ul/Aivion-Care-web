'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Team', href: '/team' },
  { label: 'Recognitions', href: '/recognitions' },
  { label: 'Careers', href: '/careers' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

export default function LandingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
<header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface-10/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-3 pr-14 md:px-6 md:pr-6">
        <nav className="flex w-full items-center justify-between gap-3 rounded-[22px] border border-tonal-20 bg-surface-20/85 px-4 py-2.5 shadow-lg shadow-accent/10 backdrop-blur-xl transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 pr-3 border-r border-tonal-20" aria-label="AI Confidence Cure home">
            <div className="w-8 h-8 rounded-lg bg-surface-10 flex items-center justify-center p-1 border border-tonal-20 ">
              <Image src="/aivion-care-logo.png" alt="Aivion Care logo" width={28} height={28} className="h-full w-full object-contain " priority />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-primary-light">AI Confidence Cure</span>
              <span className="text-[10px] text-primary-light/55 leading-tight">Aivion Care | preventive health-tech</span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {links.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent/15 font-semibold text-primary-light shadow-sm shadow-accent/10'
                      : 'text-primary-light/70 hover:bg-accent-fill/10 hover:text-primary-light'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-2 pl-2 md:flex">
            <a
              href="https://drive.google.com/drive/u/1/folders/1ALfyNroHMqFdpmYDJ-hpWMcndzO4eAd8"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 dark:border-teal-400/40 bg-teal-500/15 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-cyan-500/20 dark:to-sky-500/20 px-3 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-200 shadow-sm shadow-teal-500/10 backdrop-blur-md transition-all hover:scale-105 hover:border-teal-400 dark:hover:border-teal-300"
            >
              <Smartphone size={13} className="text-teal-700 dark:text-cyan-300" />
              <span>Android APK</span>
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 transition-all hover:scale-105"
            >
              Sign In
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-primary-light transition-colors hover:bg-accent-fill/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} className="text-primary-light" /> : <Menu size={24} className="text-primary-light" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-tonal-20 bg-surface-10/95 backdrop-blur-xl md:hidden">
          <nav className="space-y-1 px-4 py-3">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-accent/15 text-primary-light'
                    : 'text-primary-light/70 hover:bg-accent-fill/10 hover:text-primary-light'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile-only controls — Sign In, Android APK, theme toggle */}
          <div className="flex flex-wrap items-center gap-2 border-t border-tonal-20 px-4 py-3">
            <a
              href="https://drive.google.com/drive/u/1/folders/1ALfyNroHMqFdpmYDJ-hpWMcndzO4eAd8"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-teal-500/40 dark:border-teal-400/40 bg-teal-500/15 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-cyan-500/20 dark:to-sky-500/20 px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-200 shadow-sm shadow-teal-500/10 backdrop-blur-md transition-all hover:border-teal-400 dark:hover:border-teal-300"
            >
              <Smartphone size={13} className="shrink-0 text-teal-700 dark:text-cyan-300" />
              <span className="truncate">Android APK</span>
            </a>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 transition-all hover:scale-105"
            >
              Sign In
            </Link>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}




