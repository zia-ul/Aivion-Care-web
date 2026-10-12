import Image from 'next/image';
import { Activity, BellRing, CalendarDays, FileHeart, FileText, Video, HeartPulse, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Smart Appointments & Zero Waiting',
    text: 'Book verified doctors in seconds. Real-time token queues mean no more 2-hour hospital lobby agony.',
    punchline: 'Skip the line. Pure ease.',
    image: '/images/healthcare/doctor-consulting.jpg',
    Icon: CalendarDays,
    color: 'text-sky-400',
  },
  {
    title: 'Instant Video Consultations',
    text: 'Encrypted HD telehealth consults with automated live vitals streaming and clinical speech-to-text.',
    punchline: 'Doctor visits without the commute.',
    image: '/images/healthcare/doctor-examining.jpg',
    Icon: Video,
    color: 'text-teal-400',
  },
  {
    title: 'Continuous AI Vitals Monitoring',
    text: '24/7 stream of ECG, SpO₂, body temperature, and HRV analyzed for early warning decompensation.',
    punchline: 'Your heart’s personal guardian.',
    image: '/images/healthcare/smart-monitoring.jpg',
    Icon: HeartPulse,
    color: 'text-rose-400',
  },
  {
    title: 'Autonomous Digital Prescriptions',
    text: 'Legally certified e-prescriptions with automatic CYP450 drug interaction screening and pharmacy dispatch.',
    punchline: 'Legible, safe, delivered.',
    image: '/images/healthcare/doctor-patient-care.jpg',
    Icon: FileText,
    color: 'text-cyan-400',
  },
  {
    title: 'Universal Health Record Vault',
    text: 'One lifetime health passport. Lab scans, vitals history, and discharge summaries synced across clinics.',
    punchline: 'Never lose a medical report again.',
    image: '/images/healthcare/hospital-interior.jpg',
    Icon: FileHeart,
    color: 'text-emerald-400',
  },
  {
    title: 'Intelligent Real-Time Health Alerts',
    text: 'Multi-channel WhatsApp, SMS, and in-app triggers for abnormal arrhythmia, pill reminders, and follow-ups.',
    punchline: 'Proactive alerts before it’s urgent.',
    image: '/images/healthcare/modern-clinic.jpg',
    Icon: BellRing,
    color: 'text-amber-400',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-surface-10 py-20 sm:py-28 overflow-hidden">
      {/* Ambient Moving Heart Rate Grid Background */}
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
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            <Sparkles size={13} className="text-teal-300" /> Platform Architecture
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything You Need for <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Connected Healthcare</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            From booking to bedside, every workflow has a place. Designed with real hospital backgrounds, rounded radiant cards, and live ECG monitors.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, text, punchline, image, Icon, color }) => (
            <article
              key={title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-cyan-500/10"
            >
              {/* Box Background Image with radiant dark gradient overlay */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
              </div>

              {/* Radiant Glow on Card Corner */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner group-hover:border-cyan-400/40">
                    <Icon size={22} className={`${color} group-hover:scale-110 transition-transform`} />
                  </div>
                  
                  {/* Mini animated ECG pulse line in each box */}
                  <div className="h-6 w-20 text-cyan-400/60 group-hover:text-cyan-300 transition-colors">
                    <svg viewBox="0 0 100 24" className="h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M0 12 h25 l4 -8 l5 16 l4 -10 l4 2 h40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-ecg-dash"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {title}
                </h3>
                <p className="mt-1 text-xs font-bold text-teal-300 uppercase tracking-wider">
                  {punchline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  <HeartPulse size={14} className="text-rose-400 animate-heartbeat" /> Live Care Active
                </span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
