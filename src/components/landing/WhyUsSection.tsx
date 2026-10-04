import { Building2, HeartHandshake, Stethoscope, User, Users, Wallet } from 'lucide-react';

const audiences = [
  {
    audience: 'For patients',
    points: [
      'Book and manage appointments in a few taps',
      'Consult a doctor remotely when travel is difficult',
      'Keep prescriptions, reports and history in one place',
      'Get reminders for medicines and follow-ups',
    ],
    Icon: User,
  },
  {
    audience: 'For doctors',
    points: [
      'See a complete patient history before the consult',
      'Create digital prescriptions and share them instantly',
      'Use AI assistance to organise clinical notes',
      'Manage availability, queues and appointments',
    ],
    Icon: Stethoscope,
  },
  {
    audience: 'For hospitals',
    points: [
      'Connect departments and laboratories on one platform',
      'Reduce paperwork and manual coordination',
      'Give patients a clearer, self-serve experience',
      'Standardise how care information is recorded',
    ],
    Icon: Building2,
  },
  {
    audience: 'For the community',
    points: [
      'Health awareness and preventive care programmes',
      'Screening drives and education seminars',
      'Partnerships that extend services to rural areas',
      'Affordable care pathways built on technology',
    ],
    Icon: Users,
  },
] as const;

const assurance = [
  {
    title: 'Clinician-led',
    text: 'Every workflow is designed around how care is actually delivered.',
    Icon: Stethoscope,
  },
  {
    title: 'Partnership-first',
    text: 'MoUs with institutions extend care beyond city hospitals.',
    Icon: HeartHandshake,
  },
  {
    title: 'Affordable',
    text: 'Technology should reduce cost, not add to it.',
    Icon: Wallet,
  },
] as const;

export default function WhyUsSection() {
  return (
    <section id="why-us" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">
            Why Aivion Care
          </p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            One platform, built around every person in the care journey
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            Patients, doctors, hospitals, labs, pharmacies and communities — nobody gets left behind.
            This is healthcare that actually fits your life.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {audiences.map(({ audience, points, Icon }) => (
            <article
              key={audience}
              className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 transition hover:-translate-y-1 hover:border-accent/50 sm:p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <h3 className="text-heading font-bold text-primary-light">{audience}</h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-6 text-primary-light/65">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {assurance.map(({ title, text, Icon }) => (
            <div key={title} className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-5 backdrop-blur">
              <Icon size={20} className="text-sky-400" aria-hidden="true" />
              <h4 className="mt-4 font-semibold text-primary-light">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-primary-light/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
