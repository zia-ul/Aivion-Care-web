import Link from 'next/link';
import { ArrowRight, BookOpen, HeartPulse, ShoppingCart } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';import { CTASection } from '@/components/landing/ProductCTASection';

const products = [
  {
    title: 'Aivion Care',
    category: 'HealthTech Application',
    text: 'Connected healthcare for patients, doctors, hospitals, pharmacies and laboratories. Appointments, consultations, prescriptions, records, monitoring and AI-assisted workflows in one platform.',
    Icon: HeartPulse,
    href: '/products/aivion-care',
    cta: 'Explore Aivion Care',
    highlights: ['Appointments', 'Teleconsultations', 'Lab reports', '24/7 monitoring'],
  },
  {
    title: 'Qurbani',
    category: 'Mobile Application',
    text: 'A streamlined mobile app for managing Qurbani bookings, order tracking and service coordination.',
    Icon: ShoppingCart,
    href: '/products/qurbani',
    cta: 'Explore Qurbani',
    highlights: ['Bookings', 'Order tracking', 'Service coordination'],
  },
  {
    title: 'Quran',
    category: 'Mobile Application',
    text: 'A clean and accessible Quran mobile app focused on smooth reading, navigation and a distraction-free experience.',
    Icon: BookOpen,
    href: '/products/quran',
    cta: 'Explore Quran',
    highlights: ['Smooth reading', 'Navigation', 'Distraction-free'],
  },
] as const;

export default function ProductsPage() {
  return (
    <PageShell>
      <main>
        <section className="pb-16 pt-32 sm:pb-20 lg:pt-40">
          <div className="mx-auto max-w-container px-5 sm:px-8 lg:px-10">
            <SectionHeader
              eyebrow="Products"
              title="Products built by AI Confidence Cure."
              description="A connected healthcare platform and mobile applications shaped with practical workflows, polished user journeys and presentation-ready execution."
            />
          </div>
        </section>

        <section className="mx-auto max-w-container px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="grid gap-6 lg:grid-cols-3">
            {products.map(({ title, category, text, Icon, href, cta, highlights }) => (
              <article key={title} className="group relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/40 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-sky-500/15 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
                    <Icon size={28} aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 text-heading font-bold text-primary-light">{title}</h2>
                  <p className="mt-1 text-sm text-sky-400">{category}</p>
                  <p className="mt-4 text-sm leading-6 text-primary-light/55">{text}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {highlights.map((highlight) => (
                      <span key={highlight} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300">
                    {cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <CTASection
          title="Want a product pilot or a demo?"
          description="The team is open to conversations about pilots, integrations, and ecosystem partnerships."
          primaryLabel="Talk to the team"
          primaryHref="/contact"
        />
      </main>
    </PageShell>
  );
}

