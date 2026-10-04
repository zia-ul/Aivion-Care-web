import Link from 'next/link';
import { ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';import { CTASection } from '@/components/landing/ProductCTASection';

export interface ProductFeature {
  title: string;
  text: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetail {
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  Icon: LucideIcon;
  highlights: string[];
  features: ProductFeature[];
  specs: ProductSpec[];
  platforms: string[];
  ctaLabel: string;
}

export default function ProductPageTemplate({ product }: { product: ProductDetail }) {
  const { eyebrow, title, tagline, description, status, Icon, highlights, features, specs, platforms, ctaLabel } = product;

  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 lg:pt-40">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-support font-semibold uppercase tracking-[0.14em] text-sky-400">
                  <span className="h-2 w-2 rounded-full bg-success-light" /> {eyebrow}
                </p>
                <h1 className="mt-6 text-headline font-bold leading-tight text-primary-light">{title}</h1>
                <p className="mt-5 text-xl font-semibold leading-8 text-sky-400">{tagline}</p>
                <p className="mt-4 max-w-2xl leading-7 text-primary-light/60">{description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-input bg-accent-fill px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20">
                    {ctaLabel} <ArrowRight size={18} />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-input border border-sky-500/20 bg-sky-500/5 px-5 py-3 font-semibold text-sky-400 transition hover:-translate-y-0.5 hover:bg-sky-500/10">
                    Talk to the team
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span key={platform} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-support font-medium text-sky-300">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in-up animation-delay-200">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-sky-500/20 via-transparent to-teal-500/20 blur-xl opacity-60" />
                <div className="relative rounded-2xl border border-sky-500/20 bg-surface-20/60 p-6 backdrop-blur sm:p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
                    <Icon size={28} aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-support uppercase tracking-[0.14em] text-muted-foreground">{status}</p>
                  <ul className="mt-4 space-y-3">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm text-primary-light/70">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-10 py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <SectionHeader
              eyebrow="What it does"
              title={`Capabilities inside ${title}`}
              description="Every part of the product is built around one goal: making care simpler to access and easier to keep track of."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent/50">
                  <h3 className="text-heading font-bold text-primary-light">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-primary-light/55">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <SectionHeader eyebrow="Details" title="Product details at a glance" />
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 backdrop-blur">
                <dt className="text-support uppercase tracking-[0.12em] text-muted-foreground">{spec.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-primary-light">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <CTASection
          title={`Ready to try ${title}?`}
          description="Create an account and get connected with the care team in minutes."
        />
      </main>
    </PageShell>
  );
}



