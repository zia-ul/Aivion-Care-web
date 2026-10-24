'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Smartphone, Calendar, ChevronDown, Sparkles, Building2, Layers, PhoneCall } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';

// 4-5 Streamlined Header Items
const navItems = [
  { label: 'Home', href: '/' },
  { 
    label: 'Book Appointment', 
    href: '/book-appointment', 
    highlight: true, 
    badge: 'Popular',
    icon: Calendar
  },
  { 
    label: 'Features & AI', 
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Clinical AI Assessment', desc: 'Continuous disease & biomarker risk scoring', href: '/clinical-assessment' },
      { title: 'Telehealth & Live Vitals', desc: '24/7 continuous telemetry & ECG monitoring', href: '/#monitoring' },
      { title: 'Core Capabilities', desc: 'Hospital OS, E-Prescriptions & OPD queue engine', href: '/capabilities' },
    ]
  },
  { 
    label: 'Company', 
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { title: 'About & Ecosystem', desc: 'Preventive health-tech vision', href: '/#about' },
      { title: 'Our Team', desc: 'Leadership, physicians & researchers', href: '/team' },
      { title: 'Recognitions & Awards', desc: 'AMUIF incubated & institutional accolades', href: '/recognitions' },
      { title: 'Initiatives', desc: 'Public health & social outreach', href: '/initiatives' },
      { title: 'Careers', desc: 'Join our healthcare technology team', href: '/careers' },
    ]
  },
  { label: 'Contact', href: '/contact' },
];

export default function LandingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface-10/85 backdrop-blur-xl border-b border-tonal-20/40' : 'bg-transparent'
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-3 pr-14 md:px-6 md:pr-6">
        <nav 
          ref={dropdownRef}
          className="flex w-full items-center justify-between gap-3 rounded-[22px] border border-tonal-20/80 bg-surface-20/90 px-4 py-2 shadow-lg shadow-accent/5 backdrop-blur-xl transition-all duration-300"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pr-3 border-r border-tonal-20" aria-label="AI Confidence Cure home">
            <div className="w-8 h-8 rounded-lg bg-surface-10 flex items-center justify-center p-1 border border-tonal-20">
              <Image src="/aivion-care-logo.png" alt="Aivion Care logo" width={28} height={28} className="h-full w-full object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-primary-light">AI Confidence Cure</span>
              <span className="text-[10px] text-primary-light/60 leading-tight">Aivion Care | preventive health-tech</span>
            </div>
          </Link>

          {/* Clean 4-5 Nav Links */}
          <div className="hidden flex-1 items-center justify-center gap-1.5 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isDropdownOpen = activeDropdown === item.label;

              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                        isDropdownOpen
                          ? 'bg-accent/15 text-primary-light font-semibold'
                          : 'text-primary-light/70 hover:bg-accent-fill/10 hover:text-primary-light'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu with Light/Dark Surface */}
                    {isDropdownOpen && (
                      <div 
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl border border-tonal-20/90 bg-surface-20/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                      >
                        {item.dropdownItems?.map((drop) => (
                          <Link
                            key={drop.title}
                            href={drop.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block rounded-xl p-2.5 transition hover:bg-surface-10/90 group"
                          >
                            <p className="text-xs font-bold text-primary-light group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                              {drop.title}
                            </p>
                            <p className="text-[11px] text-primary-light/60 mt-0.5 leading-snug">
                              {drop.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    item.highlight
                      ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-800 dark:text-teal-200 border border-teal-500/35 font-bold shadow-sm'
                      : isActive
                      ? 'bg-accent/15 font-semibold text-primary-light shadow-sm shadow-accent/10'
                      : 'text-primary-light/70 hover:bg-accent-fill/10 hover:text-primary-light'
                  }`}
                >
                  {item.icon && <item.icon size={14} className="text-teal-600 dark:text-teal-300" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-teal-500/20 px-1.5 py-0.2 text-[9px] font-bold text-teal-700 dark:text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action buttons: Android APK + Sign In + Theme Toggle */}
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
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 transition-all hover:scale-105"
            >
              Sign In
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Hamburger toggle */}
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

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-tonal-20 bg-surface-10/95 backdrop-blur-xl md:hidden max-h-[85vh] overflow-y-auto">
          <nav className="space-y-1 px-4 py-3">
            <Link
              href="/book-appointment"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-500/40 px-3.5 py-2.5 text-sm font-bold text-teal-800 dark:text-teal-200"
            >
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-teal-600 dark:text-teal-300" />
                Book Doctor Appointment
              </span>
              <span className="text-[10px] bg-teal-500/30 px-2 py-0.5 rounded-full">Top</span>
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-light/80 hover:bg-surface-20"
            >
              Home
            </Link>

            <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-primary-light/45 px-3">
              Features & AI
            </div>
            <Link
              href="/clinical-assessment"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Clinical AI Assessment
            </Link>
            <Link
              href="/#monitoring"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • 24/7 Vitals Telemetry
            </Link>
            <Link
              href="/capabilities"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Hospital & Clinic OS
            </Link>

            <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-primary-light/45 px-3">
              Company
            </div>
            <Link
              href="/team"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Our Team
            </Link>
            <Link
              href="/recognitions"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Recognitions
            </Link>
            <Link
              href="/initiatives"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Initiatives
            </Link>
            <Link
              href="/careers"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-1.5 text-sm text-primary-light/75 hover:bg-surface-20 pl-5"
            >
              • Careers
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-light/80 hover:bg-surface-20"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile bottom controls */}
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
