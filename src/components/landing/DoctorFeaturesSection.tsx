import Image from 'next/image';
import { ArrowRight, BrainCircuit, Calendar, Clock, FileText, Stethoscope, UserRoundCheck, Video, Sparkles, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './common';

const features = [
  {
    title: 'Patient Management',
    description: 'See complete patient history, vitals, prescriptions and consultation notes before every consult.',
    icon: UserRoundCheck,
    href: '/doctor/patients',
    image: '/images/healthcare/doctor-patient-care.jpg',
  },
  {
    title: 'Diagnosis & Notes',
    description: 'Record structured clinical notes, assessments and plans with AI-assisted organisation.',
    icon: FileText,
    href: '/doctor/diagnosis',
    image: '/images/healthcare/digital-tablet-doctor.jpg',
  },
  {
    title: 'Prescription Preview',
    description: 'Draft, review and share digital prescriptions with patients and pharmacies instantly.',
    icon: Stethoscope,
    href: '/doctor/dashboard',
    image: '/images/healthcare/doctor-consulting.jpg',
  },
  {
    title: 'Schedule Management',
    description: 'Set availability, manage breaks and holidays, and let patients book only your open slots.',
    icon: Calendar,
    href: '/doctor/schedule',
    image: '/images/healthcare/reception-desk.jpg',
  },
  {
    title: 'Emergency Alerts',
    description: 'Flag and escalate urgent cases so high-risk patients get the attention they need fast.',
    icon: Clock,
    href: '/doctor/dashboard',
    image: '/images/healthcare/ecg-monitor.jpg',
  },
  {
    title: 'Video Consultation',
    description: 'Run secure teleconsultations with screen sharing, recording and transcription support.',
    icon: Video,
    href: '/video/consultation',
    image: '/images/healthcare/telemedicine-call.jpg',
  },
] as const;

export default function DoctorFeaturesSection() {
  return (
    <section id="doctor-features" className="relative bg-surface-10 py-20 sm:py-28 overflow-hidden">
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

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 relative z-10">
        <SectionHeader
          eyebrow="Doctor features"
          title="Tools that fit real clinical workflows"
          description="Built alongside clinicians, so every feature supports the work you actually do — not the other way around."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon, href, image }) => (
            <a key={title} href={href} className="group block">
              <div className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-tonal-20 bg-surface-20/85 dark:bg-slate-950/85 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-cyan-500/15 h-full">
                {/* Background image overlay */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-25 dark:opacity-35 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-surface-20/40 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/60" />
                </div>

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-cyan-600 dark:text-cyan-300 border border-sky-500/25 dark:border-sky-400/20 shadow-md">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-primary-light group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-primary-light/75">{description}</p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                  <span>Open doctor portal</span> <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

