import { ArrowRight, BrainCircuit, Calendar, Clock, FileText, Stethoscope, UserRoundCheck, Video, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './common';

const features = [
  {
    title: 'Patient Management',
    description: 'See complete patient history, vitals, prescriptions and consultation notes before every consult.',
    icon: UserRoundCheck,
    href: '/doctor/patients',
  },
  {
    title: 'Diagnosis & Notes',
    description: 'Record structured clinical notes, assessments and plans with AI-assisted organisation.',
    icon: FileText,
    href: '/doctor/diagnosis',
  },
  {
    title: 'Prescription Preview',
    description: 'Draft, review and share digital prescriptions with patients and pharmacies instantly.',
    icon: Stethoscope,
    href: '/doctor/dashboard',
  },
  {
    title: 'Schedule Management',
    description: 'Set availability, manage breaks and holidays, and let patients book only your open slots.',
    icon: Calendar,
    href: '/doctor/schedule',
  },
  {
    title: 'Emergency Alerts',
    description: 'Flag and escalate urgent cases so high-risk patients get the attention they need fast.',
    icon: Clock,
    href: '/doctor/dashboard',
  },
  {
    title: 'Video Consultation',
    description: 'Run secure teleconsultations with screen sharing, recording and transcription support.',
    icon: Video,
    href: '/video/consultation',
  },
] as const;

export default function DoctorFeaturesSection() {
  return (
    <section id="doctor-features" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow="Doctor features"
          title="Tools that fit real clinical workflows"
          description="Built alongside clinicians, so every feature supports the work you actually do — not the other way around."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon, href }) => (
            <a key={title} href={href} className="block">
              <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-6 transition hover:-translate-y-1 hover:border-accent/50 backdrop-blur sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-light/55">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                  Open doctor portal <ArrowRight size={15} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

