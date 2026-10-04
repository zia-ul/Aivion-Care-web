import { ArrowRight, Globe2, Smartphone, Tablet } from 'lucide-react';
import { SectionHeader } from './common';

const platforms = [
  {
    title: 'Web Application',
    description: 'Access Aivion Care from any modern browser on desktop or laptop. Full feature parity with the mobile app — appointments, consultations, prescriptions, health records, monitoring, and AI-assisted workflows all work seamlessly in your browser.',
    icon: Globe2,
    features: ['Full desktop experience', 'Real-time health monitoring', 'Video consultations', 'AI clinical assistance', 'Secure cloud sync'],
    color: 'sky',
  },
  {
    title: 'Mobile Application',
    description: 'The Aivion Care mobile app puts your health in your pocket. Designed for iOS and Android, it brings continuous monitoring, appointments, teleconsultations, and smart reminders to your fingertips — wherever you are.',
    icon: Smartphone,
    features: ['iOS & Android support', 'Push notifications', 'Offline access to records', 'Biometric login', 'Background health sync'],
    color: 'teal',
  },
  {
    title: 'Tablet Experience',
    description: 'A purpose-built tablet layout that scales the full dashboard experience for larger screens — ideal for family viewing, clinic kiosks, or shared health monitoring at home.',
    icon: Tablet,
    features: ['Optimised for tablets', 'Family health view', 'Clinic kiosk mode', 'Shared monitoring dashboards', 'High-resolution charts'],
    color: 'sky',
  },
] as const;

export default function PlatformsSection() {
  return (
    <section id="platforms" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Available everywhere"
          title="Aivion Care on web, mobile, and tablet"
          description="Same connected care experience, available on the device you use every day. Whether you are at home, in the clinic, or on the go, your health stays connected."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {platforms.map(({ title, description, icon: Icon, features, color }) => (
            <article
              key={title}
              className={`group relative overflow-hidden rounded-2xl border p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                color === 'sky'
                  ? 'border-tonal-20/70 bg-surface-20/60 hover:border-accent/50'
                  : 'border-teal-500/15 bg-surface-20/60 hover:border-teal-400/40'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: color === 'sky'
                    ? 'linear-gradient(135deg, rgba(14,165,233,0.08), transparent 60%)'
                    : 'linear-gradient(135deg, rgba(13,148,136,0.08), transparent 60%)',
                }}
              />
              <div className="relative">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  color === 'sky' ? 'bg-sky-500/15 text-sky-400' : 'bg-teal-500/15 text-teal-400'
                }`}>
                  <Icon size={28} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-heading font-bold text-primary-light">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-primary-light/55">{description}</p>
                <ul className="mt-6 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-primary-light/70">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${color === 'sky' ? 'bg-sky-400' : 'bg-teal-400'}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                  Get started <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
