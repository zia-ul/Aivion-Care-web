import { ArrowRight, Calendar, Clock, HeartPulse, Stethoscope, UserRoundCheck, Users, Sparkles, BrainCircuit, Code2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
import { CONTACT_EMAILS, mailto } from '@/lib/contact-emails';

const openings = [
  { 
    title: 'Clinical AI & ML Research Intern', 
    duration: '4-6 months', 
    type: 'Hybrid / Remote',
    focus: 'Train and fine-tune multi-modal clinical diagnostic models, continuous arrhythmia detection on ECG streams, and biomarker ratio scoring pipelines.', 
    Icon: BrainCircuit,
    image: '/images/healthcare/healthcare-ai-future.jpg'
  },
  { 
    title: 'Full-Stack Telehealth Engineer', 
    duration: '4 months', 
    type: 'Full-time / Internship',
    focus: 'Build high-performance real-time WebRTC audio/video consultation interfaces, doctor EMR dashboards, and distributed appointment scheduling engines.', 
    Icon: Code2,
    image: '/images/healthcare/telemedicine-call.jpg'
  },
  { 
    title: 'Medical IoT & Embedded Systems Intern', 
    duration: '4 months', 
    type: 'On-site Aligarh',
    focus: 'Interface biometric hardware sensors (PPG, PCG digital stethoscope, temperature, NIBP) with microcontrollers and transmit encrypted telemetry to our cloud broker.', 
    Icon: Stethoscope,
    image: '/images/healthcare/stethoscope-vitals.jpg'
  },
] as const;

export default function CareersPage() {
  return (
    <PageShell>
      <main>
        {/* HERO SECTION WITH IMAGE BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-surface-20/80 p-8 sm:p-12 mb-10">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
            <Image
              src="/images/healthcare/research-scientist.jpg"
              alt="Careers in AI Healthcare"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-10 via-surface-10/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-4">
              <Users size={14} />
              <span>Join Our Mission</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary-light tracking-tight leading-tight">
              Build Technology That <br />
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Saves Real Human Lives.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-light/80 leading-relaxed">
              We are assembling passionate engineers, data scientists, and healthcare innovators to bridge hardware sensors, AI algorithms, and clinical workflows.
            </p>
          </div>
        </div>

        {/* OPEN ROLES WITH IMAGERY */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {openings.map(({ title, duration, type, focus, Icon, image }) => (
            <article 
              key={title} 
              className="group relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/70 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
            >
              <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none">
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/85 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-primary-light group-hover:text-sky-500 transition-colors">{title}</h3>
                <div className="mt-2.5 flex items-center gap-3 text-xs text-primary-light/60 font-medium">
                  <span className="inline-flex items-center gap-1"><Clock size={13} /> {duration}</span>
                  <span className="h-1 w-1 rounded-full bg-tonal-20" />
                  <span>{type}</span>
                </div>
                <p className="mt-4 text-xs sm:text-sm leading-6 text-primary-light/75">{focus}</p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-tonal-20/50">
                <a
                  href={`mailto:${CONTACT_EMAILS.hr}?subject=${encodeURIComponent(`Application: ${title}`)}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Apply for this role <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* APPLICATION FOOTER BANNER */}
        <div className="mt-12 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-surface-20 to-teal-500/10 p-6 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-light">Don't see an exact fit? Send an Open Application</h3>
              <p className="mt-2 text-xs sm:text-sm text-primary-light/75 leading-relaxed">
                We are always excited to collaborate with clinicians, embedded developers, cybersecurity researchers, and creative UI designers.
              </p>
              <p className="mt-3 text-xs text-primary-light/60">
                Direct your portfolio to{' '}
                <a href={mailto(CONTACT_EMAILS.hr)} className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
                  {CONTACT_EMAILS.hr}
                </a>
              </p>
            </div>
            <a 
              href={mailto(CONTACT_EMAILS.hr)} 
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              Email Your Resume <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
