import { ArrowRight, HeartPulse, Stethoscope, ShieldCheck, Activity, Thermometer, Waves, BrainCircuit, MapPin, Phone, Mail, Instagram, Linkedin } from 'lucide-react';

const capabilities = [
  {
    title: '24/7 Health Monitoring',
    text: 'Continuous monitoring designed to keep a live pulse on patient health instead of relying only on occasional visits and delayed symptom reporting.',
    points: ['Live visibility into changing vitals', 'Built for home and remote care contexts', 'Supports proactive follow-up'],
    Icon: Activity,
  },
  {
    title: 'Real-Time Health Insights',
    text: 'Transforms incoming health signals into timely observations that can help patients and clinicians react faster to risk patterns.',
    points: ['Live signal interpretation', 'Faster awareness of concerning trends', 'Simple insight surfaces for decision support'],
    Icon: BrainCircuit,
  },
  {
    title: 'AI-Powered Diagnostic Support',
    text: 'Assistive diagnostic support aimed at helping clinicians interpret monitored signals with more context and confidence.',
    points: ['Supports clinical review, not guesswork', 'Highlights abnormal patterns sooner', 'Keeps decision support tied to live data'],
    Icon: ShieldCheck,
  },
  {
    title: 'PCG-Enabled Screening',
    text: 'Uses phonocardiogram data as part of the monitoring stack so heart-sound patterns can contribute to richer screening and triage support.',
    points: ['Heart-sound informed analysis', 'Adds depth beyond standard vitals', 'Useful for signal-rich screening workflows'],
    Icon: HeartPulse,
  },
] as const;

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">Capabilities</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            Capabilities designed to keep care proactive, connected, and affordable.
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            From 24/7 monitoring to AI-assisted diagnostic support and secure care-data coordination, Aivion Care is being built around real healthcare needs.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {capabilities.map(({ title, text, points, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 transition hover:-translate-y-1 hover:border-accent/50 sm:p-6 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-light/55">{text}</p>
              <ul className="mt-5 space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-primary-light/65">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Explore capabilities <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

