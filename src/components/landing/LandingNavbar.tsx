'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Smartphone, 
  Calendar, 
  ChevronDown, 
  Sparkles, 
  Building2, 
  Layers, 
  PhoneCall, 
  BrainCircuit, 
  Pill, 
  Microscope, 
  Stethoscope, 
  UserCheck, 
  Activity,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';

interface DropdownItem {
  title: string;
  desc: string;
  href: string;
  icon?: any;
  tag?: string;
}

interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  icon?: any;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

// 5 Curated Primary Nav Items with Deep SEO and Role Categorization
const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { 
    label: 'Book Appointment', 
    href: '/book-appointment', 
    highlight: true, 
    badge: 'Instant',
    icon: Calendar
  },
  { 
    label: 'AI Doctor & Health', 
    href: '/ai-doctor',
    badge: '30-Yr Wisdom',
    hasDropdown: true,
    dropdownItems: [
      { 
        title: 'AI Doctor & Predictive Engine', 
        desc: '30-year veteran clinical judgment + multi-modal AI agent prediction', 
        href: '/ai-doctor',
        icon: BrainCircuit,
        tag: 'Neural AI'
      },
      { 
        title: 'Clinical AI Assessment', 
        desc: 'Continuous ASCVD, CKD, De Ritis & metabolic risk ratio scoring', 
        href: '/clinical-assessment',
        icon: Sparkles,
        tag: 'Live Studio'
      },
      { 
        title: '24/7 Vitals Telemetry', 
        desc: 'Continuous ECG, PPG hemodynamics & arrhythmia surveillance', 
        href: '/capabilities',
        icon: HeartPulse,
        tag: 'Hardware IoT'
      },
    ]
  },
  { 
    label: 'Solutions & Roles', 
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { 
        title: 'Hospitals & Multi-Specialty Clinics', 
        desc: 'Complete digital OPD token queue, IPD bed census & clinical EMR', 
        href: '/solutions/hospitals-clinics',
        icon: Building2,
        tag: 'Enterprise OS'
      },
      { 
        title: 'Smart Pharmacy & E-Prescriptions', 
        desc: 'Instant doctor prescription sync & AI drug contraindication screener', 
        href: '/solutions/pharmacy',
        icon: Pill,
        tag: 'Dispensary'
      },
      { 
        title: 'Pathology & Diagnostic LIMS', 
        desc: 'Automated machine interfacing & AI biomarker ratio analysis', 
        href: '/solutions/pathology',
        icon: Microscope,
        tag: 'Laboratory'
      },
      { 
        title: 'Doctors & Specialists', 
        desc: 'Teleconsultation, prescription copilot & longitudinal patient tracking', 
        href: '/solutions/doctors-specialists',
        icon: Stethoscope,
        tag: 'Physicians'
      },
    ]
  },
  { 
    label: 'Company', 
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { title: 'About & Ecosystem', desc: 'Preventive health-tech vision & architecture', href: '/#about', icon: Activity },
      { title: 'Leadership & Team', desc: 'Founders, medical advisors & engineers', href: '/team', icon: UserCheck },
      { title: 'Recognitions & Awards', desc: 'AMUIF incubated & institutional accolades', href: '/recognitions', icon: Sparkles },
      { title: 'Public Health Initiatives', desc: 'Free community screening drives & MoUs', href: '/initiatives', icon: HeartPulse },
      { title: 'Careers & Internships', desc: 'Join our clinical AI & engineering mission', href: '/careers', icon: Layers },
      { title: 'Contact Us', desc: 'Support, hospital onboarding & partnerships', href: '/contact', icon: PhoneCall },
      { title: 'Terms & CDSCO Compliance', desc: 'Regulatory classification, intended use & terms', href: '/terms', icon: ShieldCheck },
    ]
  },
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
          <Link href="/" className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-tonal-20 min-w-0" aria-label="AI Confidence Cure home">
            <div className="w-8 h-8 rounded-lg bg-surface-10 flex items-center justify-center p-1 border border-tonal-20">
              <Image src="/aivion-care-logo.png" alt="Aivion Care logo" width={28} height={28} className="h-full w-full object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-primary-light">AI Confidence Cure</span>
              <span className="text-[10px] text-primary-light/60 leading-tight">Aivion Care | preventive health-tech</span>
            </div>
          </Link>

          {/* Clean 5 Nav Links */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasSub = !!item.hasDropdown;
              const isDropdownOpen = activeDropdown === item.label;

              if (hasSub) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                        isDropdownOpen 
                          ? 'bg-tonal-20/90 text-primary-light' 
                          : 'text-primary-light/75 hover:bg-tonal-20/60 hover:text-primary-light'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-bold text-cyan-600 dark:text-cyan-400">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Desktop Dropdown Panel */}
                    {isDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-84 sm:w-96 rounded-2xl border border-tonal-20/90 bg-surface-10/95 p-2.5 shadow-2xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95">
                        <div className="space-y-1">
                          {item.dropdownItems?.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-tonal-20/70"
                              >
                                {SubIcon && (
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                                    <SubIcon size={16} />
                                  </div>
                                )}
                                <div className="flex flex-col flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-primary-light group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                      {sub.title}
                                    </span>
                                    {sub.tag && (
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                                        {sub.tag}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-primary-light/65 leading-tight mt-0.5">
                                    {sub.desc}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.highlight) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-sky-500/10 border border-sky-500/40 px-3 py-2 text-xs font-bold text-primary-light shadow-sm transition-all hover:border-sky-400 hover:shadow-md hover:scale-[1.02]"
                  >
                    <Calendar size={13} className="text-sky-500 animate-pulse" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-sky-500 px-1.5 py-0.2 text-[9px] font-extrabold text-sky-950 uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-tonal-20 text-primary-light'
                      : 'text-primary-light/75 hover:bg-tonal-20/60 hover:text-primary-light'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Android APK download button */}
            <a
              href="https://drive.google.com/drive/u/1/folders/1ALfyNroHMqFdpmYDJ-hpWMcndzO4eAd8"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-tonal-20 bg-surface-10 px-2.5 py-1.5 text-xs font-semibold text-primary-light shadow-sm transition hover:bg-tonal-20"
              title="Download Android APK"
            >
              <Smartphone size={13} className="text-emerald-500" />
              <span>APK</span>
            </a>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-sky-500/30"
            >
              Sign In
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-tonal-20 bg-surface-10 text-primary-light transition hover:bg-tonal-20 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="mt-2 rounded-2xl border border-tonal-20/90 bg-surface-10/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden animate-in fade-in-50 slide-in-from-top-2">
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div key={item.label} className="border-b border-tonal-20/40 pb-2 mb-1">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-light/50">
                        {item.label}
                      </div>
                      <div className="pl-2 space-y-1">
                        {item.dropdownItems?.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-light/80 hover:bg-tonal-20 hover:text-primary-light"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      pathname === item.href
                        ? 'bg-tonal-20 text-primary-light'
                        : 'text-primary-light/80 hover:bg-tonal-20/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-extrabold text-sky-950">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="mt-3 flex flex-col gap-2 border-t border-tonal-20/60 pt-3">
                <a
                  href="https://drive.google.com/drive/u/1/folders/1ALfyNroHMqFdpmYDJ-hpWMcndzO4eAd8"
              target="_blank"
              rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-tonal-20 bg-surface-20 py-2.5 text-xs font-semibold text-primary-light"
                >
                  <Smartphone size={14} className="text-emerald-500" /> Download Android APK
                </a>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 py-2.5 text-xs font-bold text-slate-950 shadow-md"
                >
                  Sign In to Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
