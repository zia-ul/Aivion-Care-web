import { ArrowRight, Building2, Calendar, Clock, FlaskConical, HeartPulse, MapPin, Stethoscope, UserRoundCheck, Video, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './common';

const features = [
  { title: 'Book Appointments', description: 'Browse specialists, check real availability, and book consultations in minutes. Same-day slots for urgent needs.', icon: Calendar, href: '/patient/appointments' },
  { title: 'Slot Selection', description: 'Pick a date, time and doctor that fits your schedule. See availability before you commit.', icon: Clock, href: '/patient/appointments' },
  { title: 'Surgery Booking', description: 'Book surgical procedures with pre- and post-operative guidance, ward availability and follow-up scheduling.', icon: Stethoscope, href: '/receptionist/surgeries' },
  { title: 'ECG Dashboard', description: 'Continuous ECG and vital monitoring with real-time charts, alerts and trend history.', icon: HeartPulse, href: '/patient/dashboard' },
  { title: 'Video Consultation', description: 'Run secure teleconsultations with screen sharing, recording and transcription support.', icon: Video, href: '/video/consultation' },
  { title: 'Chat Rooms', description: 'Group and private conversations with your care team, including consultation notes and shared records.', icon: UserRoundCheck, href: '/patient/chat' },
  { title: 'Nearby Pharmacies', description: 'Discover pharmacies near you with stock checks, pricing and quick ordering.', icon: MapPin, href: '/patient/pharmacies' },
  { title: 'Payments', description: 'Pay for appointments, prescriptions and procedures securely through your preferred gateway.', icon: ArrowRight, href: '/patient/payments' },
] as const;

export default function PatientFeaturesSection() {
  return (
    <section id="patient-features" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <SectionHeader
        eyebrow="Patient features"
        title="Everything you need, built around your day"
        description="From booking to follow-up, the patient experience is designed to feel like one continuous care journey — not a dozen disconnected apps."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon, href }) => (
          <a key={title} href={href} className="block">
            <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 transition hover:-translate-y-1 hover:border-accent/50 backdrop-blur sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-light/55">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Open in patient portal <ArrowRight size={15} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

