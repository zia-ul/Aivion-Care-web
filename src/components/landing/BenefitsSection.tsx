import {
  Accessibility,
  Clock,
  HeartPulse,
  IndianRupee,
  Lock,
  Network,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

const benefits = [
  {
    title: 'Faster access to care',
    text: 'Book appointments, share records and consult a doctor without repeated paperwork or long waiting rooms.',
    Icon: Clock,
  },
  {
    title: 'Continuity of records',
    text: 'History, prescriptions, reports and consultation notes stay connected across visits and providers.',
    Icon: Network,
  },
  {
    title: 'Specialist reach',
    text: 'Remote consultation connects patients to specialists regardless of where they live.',
    Icon: Stethoscope,
  },
  {
    title: 'Earlier detection',
    text: 'Monitoring and timely alerts help clinicians act before a minor concern becomes a serious one.',
    Icon: HeartPulse,
  },
  {
    title: 'Lower cost of care',
    text: 'Fewer repeat visits and avoidable admissions reduce the financial burden on families.',
    Icon: IndianRupee,
  },
  {
    title: 'Designed for everyone',
    text: 'An accessible interface usable by older patients and first-time smartphone users.',
    Icon: Accessibility,
  },
  {
    title: 'Privacy by design',
    text: 'Role-based access and secure sessions keep clinical information protected.',
    Icon: Lock,
  },
  {
    title: 'Trusted workflows',
    text: 'Clinicians review and confirm every AI-assisted output before it enters a patient record.',
    Icon: ShieldCheck,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  text: string;
  Icon: LucideIcon;
}>;

export default function BenefitsSection() {
  return (
    <section id="benefits" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">
          Benefits
        </p>
        <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
          What connected healthcare actually delivers
        </h2>
        <p className="mt-5 leading-7 text-primary-light/60">
          Technology only matters if it changes outcomes. Here is what the platform is built to make
          better — for every person it serves. No fine print, we promise.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ title, text, Icon }) => (
          <article
            key={title}
            className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 transition hover:-translate-y-1 hover:border-accent/50 backdrop-blur"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
              <Icon size={21} aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-semibold text-primary-light">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-primary-light/55">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
