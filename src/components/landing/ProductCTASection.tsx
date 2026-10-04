import Link from 'next/link';
import { ArrowRight, HeartPulse } from 'lucide-react';

interface CTASectionProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel = 'Get Started',
  primaryHref = '/register',
}: CTASectionProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-sky-500/10 p-6 text-center backdrop-blur sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-sky-500/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-teal-500/20" aria-hidden="true" />
        <HeartPulse className="relative mx-auto text-sky-400" size={28} aria-hidden="true" />
        <h2 className="relative mt-5 text-section font-bold text-primary-light">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl leading-7 text-primary-light/60">{description}</p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400">
            {primaryLabel} <ArrowRight size={17} />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-500/20 bg-background/60 px-5 py-3 font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-sky-500/10">
            Talk to the team
          </Link>
        </div>
      </div>
    </section>
  );
}


