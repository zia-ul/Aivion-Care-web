'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['Roles', '#roles'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'border-b border-tonal-20/70 bg-tonal-0/95 shadow-soft backdrop-blur-lg' : 'bg-tonal-0/45 backdrop-blur-sm'}`}>
      <nav className="mx-auto flex max-w-container items-center justify-between px-5 py-4 sm:px-8 lg:px-10" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3" aria-label="Aivion Care home">
          <span className="flex h-11 w-11 items-center justify-center rounded-input bg-[#e8fbf9] p-1"><Image src="/aivion-care-logo.svg" alt="" width={44} height={44} priority /></span>
          <span className="font-bold tracking-tight text-primary-light">Aivion Care</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="text-sm text-primary-light/65 transition hover:text-primary-light">{label}</a>)}
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/login" className="rounded-input px-4 py-2.5 text-sm font-semibold text-primary-light/70 hover:bg-surface-20 hover:text-primary-light">Sign In</Link>
          <Link href="/register" className="rounded-input bg-accent px-4 py-2.5 text-sm font-bold text-tonal-0 hover:bg-primary-50">Get Started</Link>
        </div>
        <button type="button" className="rounded-input p-2 text-primary-light sm:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {open && <div className="border-t border-tonal-20/70 bg-tonal-0 px-5 pb-5 sm:hidden">
        <div className="flex flex-col gap-1 pt-3">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-input px-3 py-3 text-sm text-primary-light/75 hover:bg-surface-20">{label}</a>)}</div>
        <div className="mt-3 flex gap-3 border-t border-tonal-20/60 pt-4"><Link href="/login" className="flex-1 rounded-input border border-tonal-20 px-4 py-2.5 text-center text-sm font-semibold">Sign In</Link><Link href="/register" className="flex-1 rounded-input bg-accent px-4 py-2.5 text-center text-sm font-bold text-tonal-0">Get Started</Link></div>
      </div>}
    </header>
  );
}
