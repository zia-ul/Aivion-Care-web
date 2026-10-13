import Image from 'next/image';
import { ArrowRight, Building2, Calendar, Clock, FlaskConical, HeartPulse, MapPin, Stethoscope, UserRoundCheck, Video, Sparkles, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './common';

const features = [
  { title: 'Book Appointments', description: 'Browse specialists, check real availability, and book consultations in minutes. Same-day slots for urgent needs.', icon: Calendar, href: '/patient/appointments', image: '/images/healthcare/doctor-consulting.jpg' },
  { title: 'Slot Selection', description: 'Pick a date, time and doctor that fits your schedule. See availability before you commit.', icon: Clock, href: '/patient/appointments', image: '/images/healthcare/reception-desk.jpg' },
  { title: 'Surgery Booking', description: 'Book surgical procedures with pre- and post-operative guidance, ward availability and follow-up scheduling.', icon: Stethoscope, href: '/receptionist/surgeries', image: '/images/healthcare/surgery-theatre.jpg' },
  { title: 'ECG Dashboard', description: 'Continuous ECG and vital monitoring with real-time charts, alerts and trend history.', icon: HeartPulse, href: '/patient/dashboard', image: '/images/healthcare/ecg-monitor.jpg' },
  { title: 'Video Consultation', description: 'Run secure teleconsultations with screen sharing, recording and transcription support.', icon: Video, href: '/video/consultation', image: '/images/healthcare/telemedicine-call.jpg' },
  { title: 'Chat Rooms', description: 'Group and private conversations with your care team, including consultation notes and shared records.', icon: UserRoundCheck, href: '/patient/chat', image: '/images/healthcare/doctor-nurse-team.jpg' },
  { title: 'Nearby Pharmacies', description: 'Discover pharmacies near you with stock checks, pricing and quick ordering.', icon: MapPin, href: '/patient/pharmacies', image: '/images/healthcare/pharmacy-shelf.jpg' },
  { title: 'Payments', description: 'Pay for appointments, prescriptions and procedures securely through your preferred gateway.', icon: ArrowRight, href: '/patient/payments', image: '/images/healthcare/modern-clinic.jpg' },
] as const;

export default function PatientFeaturesSection() {
  return (
    <section id="patient-features" className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28 overflow-hidden">
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

      <div className="relative z-10">
        <SectionHeader
          eyebrow="Patient features"
          title="Everything you need, built around your day"
          description="From booking to follow-up, the patient experience is designed to feel like one continuous care journey — not a dozen disconnected apps."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon, href, image }) => (
            <a key={title} href={href} className="group block">
              <div className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-tonal-20 bg-surface-20/85 dark:bg-slate-950/85 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/15 h-full">
                {/* Background clinical image with gradient overlay */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-25 dark:opacity-35 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-surface-20/40 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/60" />
                </div>

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:text-cyan-300 border border-sky-500/25 dark:border-sky-400/20 shadow-md">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-primary-light group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-primary-light/80">{description}</p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
                  <span>Open portal</span> <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

