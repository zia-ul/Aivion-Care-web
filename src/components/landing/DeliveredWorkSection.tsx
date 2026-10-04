import { ArrowRight, Building2, Calendar, CheckCircle, HeartPulse, Smartphone, Star } from 'lucide-react';

const projects = [
  {
    title: 'Aivion Care',
    category: 'HealthTech Application',
    status: 'Featured product',
    statusIcon: Star,
    text: 'Aivion Care is a smart healthcare application that helps patients and families manage appointments, consultations, prescriptions, reports, reminders, and personal health records in one place.',
    highlights: ['Appointments', 'Teleconsultations', 'Lab reports', 'Family access'],
    Icon: HeartPulse,
  },
  {
    title: 'Qurbani',
    category: 'Mobile Application',
    status: 'Completed project',
    statusIcon: CheckCircle,
    text: 'A streamlined mobile app for managing Qurbani bookings, order tracking, and user-friendly service coordination.',
    highlights: ['Bookings', 'Order tracking', 'Service coordination'],
    Icon: Smartphone,
  },
  {
    title: 'Quran',
    category: 'Mobile Application',
    status: 'Completed project',
    statusIcon: CheckCircle,
    text: 'A clean and accessible Quran mobile app focused on smooth reading, navigation, and a distraction-free spiritual experience.',
    highlights: ['Smooth reading', 'Navigation', 'Distraction-free'],
    Icon: Smartphone,
  },
] as const;

export default function DeliveredWorkSection() {
  return (
    <section id="delivered-work" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">Delivered Work</p>
        <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
          Projects completed
        </h2>
        <p className="mt-5 leading-7 text-primary-light/60">
          A compact look at mobile application projects shaped with practical workflows, polished user journeys, and presentation-ready execution.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {projects.map(({ title, category, status, statusIcon: StatusIcon, text, highlights, Icon }) => (
          <article
            key={title}
            className="flex flex-col rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 transition hover:-translate-y-1 hover:border-accent/50 backdrop-blur sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-300">
                <StatusIcon size={12} aria-hidden="true" /> {status}
              </span>
            </div>
            <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
            <p className="mt-1 text-sm text-sky-400">{category}</p>
            <p className="mt-3 text-sm leading-6 text-primary-light/55">{text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">
                  {item}
                </span>
              ))}
            </div>
            <a href={title === 'Aivion Care' ? '/register' : '/contact'} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
              {title === 'Aivion Care' ? 'Explore Aivion Care' : 'Learn more'} <ArrowRight size={15} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

