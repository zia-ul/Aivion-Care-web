import { ArrowRight, BrainCircuit, HeartPulse, Lock, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const capabilities = [
  { title: '24/7 Health Monitoring', description: 'Continuous monitoring designed to keep a live pulse on patient health instead of relying only on occasional visits and delayed symptom reporting.', points: ['Live visibility into changing vitals', 'Built for home and remote care contexts', 'Supports proactive follow-up'], Icon: HeartPulse },
  { title: 'Real-Time Health Insights', description: 'Transforms incoming health signals into timely observations that can help patients and clinicians react faster to risk patterns.', points: ['Live signal interpretation', 'Faster awareness of concerning trends', 'Simple insight surfaces for decision support'], Icon: BrainCircuit },
  { title: 'AI-Powered Diagnostic Support', description: 'Assistive diagnostic support aimed at helping clinicians interpret monitored signals with more context and confidence.', points: ['Supports clinical review, not guesswork', 'Highlights abnormal patterns sooner', 'Keeps decision support tied to live data'], Icon: ShieldCheck },
  { title: 'PCG-Enabled Screening', description: 'Uses phonocardiogram data as part of the monitoring stack so heart-sound patterns can contribute to richer screening and triage support.', points: ['Heart-sound informed analysis', 'Adds depth beyond standard vitals', 'Useful for signal-rich screening workflows'], Icon: Stethoscope },
  { title: 'Secure Care-Data Coordination', description: 'Role-based access, secure authentication, and encrypted sessions keep clinical information protected across the connected ecosystem.', points: ['Role-based access control', 'Secure authentication', 'Encrypted sessions'], Icon: Lock },
  { title: 'Connected Ecosystem', description: 'Bringing doctors, patients, pharmacies, and labs closer together through shared workflows and coordinated care.', points: ['Shared workflows', 'Coordinated care', 'One connected platform'], Icon: Users },
] as const;

export default function CapabilitiesPage() {
  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Capabilities"
          title="Capabilities designed to keep care proactive, connected, and affordable."
          description="From 24/7 monitoring to AI-assisted diagnostic support and secure care-data coordination, Aivion Care is being built around real healthcare needs."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {capabilities.map(({ title, description, points, Icon }) => (
            <article key={title} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-light/55">{description}</p>
              <ul className="mt-5 space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-primary-light/65">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <a href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Get started <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
