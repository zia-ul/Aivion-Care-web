import { ArrowRight, HeartPulse, Stethoscope, Users } from 'lucide-react';

const galleryItems = [
  { title: 'Aivion Care monitoring', subtitle: 'Continuous vitals intelligence', text: 'A single monitoring view for SpO2, heart rate, temperature, and PCG so care teams can move beyond episodic checkups.', Icon: HeartPulse },
  { title: 'Signal intelligence', subtitle: '4 signals tracked in one loop', text: 'Theme continuity — dark dashboard language, shared surfaces, connector glow, and AI-focused motion keep the homepage visually aligned.', Icon: Stethoscope },
  { title: 'Care coordination', subtitle: 'Shared surfaces', text: 'Bringing doctors, patients, pharmacies, and labs closer together through connected workflows.', Icon: Users },
] as const;

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">Product Story</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            A visual story for the monitoring, diagnostics, and care-data workflows behind Aivion Care.
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            The gallery highlights how the startup is thinking about continuous monitoring, early warning support, and connected healthcare operations.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {galleryItems.map(({ title, subtitle, text, Icon }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 transition hover:-translate-y-1 hover:border-accent/50 backdrop-blur sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400">
                  <Icon size={28} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-heading font-bold text-primary-light">{title}</h3>
                <p className="mt-1 text-sm font-semibold text-sky-400">{subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-primary-light/55">{text}</p>
                <a href="/products/aivion-care" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                  View product <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
