import Image from 'next/image';
import {
  Accessibility,
  Clock,
  HeartPulse,
  IndianRupee,
  Lock,
  Network,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const benefits = [
  {
    title: 'Faster Access to Care',
    text: 'Book appointments, share biometric history and consult doctors without repeating paperwork or sitting in waiting rooms.',
    punchline: 'Zero waiting. Direct specialist care.',
    image: '/images/healthcare/reception-desk.jpg',
    Icon: Clock,
  },
  {
    title: 'Continuity of Records',
    text: 'Prescriptions, lab reports, ECG charts, and clinical notes stay permanently synced across visits and institutions.',
    punchline: 'One lifetime health record.',
    image: '/images/healthcare/digital-tablet-doctor.jpg',
    Icon: Network,
  },
  {
    title: 'Specialist Reach Anywhere',
    text: 'Remote video consults connect patients in any tier-2/3 city directly to top-tier hospital specialists.',
    punchline: 'World-class care delivered home.',
    image: '/images/healthcare/telemedicine-call.jpg',
    Icon: Stethoscope,
  },
  {
    title: 'Earlier Anomaly Detection',
    text: 'Continuous biological tracking alerts clinicians to abnormal arrhythmias or oxygen drops before emergency hospitalization.',
    punchline: 'Prevention before panic.',
    image: '/images/healthcare/ecg-monitor.jpg',
    Icon: HeartPulse,
  },
  {
    title: 'Lower Cost of Treatment',
    text: 'Early detection and fewer avoidable hospital admissions significantly reduce out-of-pocket healthcare expenses.',
    punchline: 'Affordable, transparent healthcare.',
    image: '/images/healthcare/pharmacy-shelf.jpg',
    Icon: IndianRupee,
  },
  {
    title: 'Designed for Everyone',
    text: 'High-contrast accessible interface easily navigable by elderly grandparents and first-time smartphone users alike.',
    punchline: 'Simple enough for everyone.',
    image: '/images/healthcare/pediatric-care.jpg',
    Icon: Accessibility,
  },
  {
    title: 'Privacy & HIPAA Standards',
    text: 'End-to-end encrypted sessions and zero selling of personal or biometric telemetry data.',
    punchline: 'Your health data belongs only to you.',
    image: '/images/healthcare/cardiology-care.jpg',
    Icon: Lock,
  },
  {
    title: 'Doctor-Verified AI Loops',
    text: 'Certified clinical doctors review and confirm every AI-suggested diagnostic insight before entry into records.',
    punchline: 'Human clinical expertise always first.',
    image: '/images/healthcare/research-scientist.jpg',
    Icon: ShieldCheck,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  text: string;
  punchline: string;
  image: string;
  Icon: LucideIcon;
}>;

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28 overflow-hidden">
      {/* Background Heart Rate Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
          <Sparkles size={13} className="text-teal-600 dark:text-teal-300" /> Clinical Impact
        </div>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary-light sm:text-4xl lg:text-5xl">
          What Connected Healthcare <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">Actually Delivers</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-primary-light/70 sm:text-lg">
          Technology only matters if it changes real human outcomes. Here is how Aivion Care protects patient health and simplifies daily lives.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {benefits.map(({ title, text, punchline, image, Icon }) => (
          <article
            key={title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-tonal-20 bg-surface-20/85 dark:bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/10"
          >
            {/* Box Background Image with radiant dark gradient overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-25 dark:opacity-35 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-surface-20/40 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/50" />
            </div>

            {/* Radiant Corner Glow */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/25 dark:border-white/10 shadow-inner group-hover:border-cyan-400/40">
                  <Icon size={20} className="text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>

                {/* Animated Heartbeat Indicator */}
                <HeartPulse size={16} className="text-rose-500 dark:text-rose-400 animate-heartbeat" />
              </div>

              <h3 className="mt-5 font-display text-base font-bold text-primary-light group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors">
                {title}
              </h3>
              <p className="mt-1 text-[11px] font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider">
                {punchline}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-primary-light/80">
                {text}
              </p>
            </div>

            {/* Mini ECG bottom separator */}
            <div className="mt-5 pt-3 border-t border-tonal-20 flex items-center justify-between text-[11px] font-semibold text-primary-light/60">
              <span className="text-teal-600 dark:text-teal-300 font-mono">100% Care Sync</span>
              <span className="text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">Active →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
