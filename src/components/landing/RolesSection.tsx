import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, FlaskConical, Stethoscope, Users, HeartPulse, Sparkles } from 'lucide-react';

const roles = [
  {
    title: 'PATIENT',
    subtitle: 'Autonomous Wellness & 24/7 Care Control',
    text: 'Manage your entire healthcare journey — live biometric trends, instant doctor consults, and medication alerts at your fingertips.',
    items: ['24/7 continuous vitals monitoring', '1-click HD video consultations', 'Universal digital health passport', 'Smart WhatsApp & SMS medicine reminders'],
    image: '/images/healthcare/doctor-patient-care.jpg',
    Icon: Users,
    cta: 'Access Patient Portal',
    color: 'text-cyan-400',
  },
  {
    title: 'DOCTOR',
    subtitle: 'Zero Paperwork. 100% Clinical Focus.',
    text: 'Review longitudinal patient telemetry, trigger voice-to-SOAP note drafting, and dispatch verified digital prescriptions in seconds.',
    items: ['Real-time ECG & arrhythmia alerts', 'Automated SOAP notes & ICD-10 suggestions', 'CYP450 drug interaction safety filter', 'Direct OPD & video queue management'],
    image: '/images/healthcare/doctor-consulting.jpg',
    Icon: Stethoscope,
    cta: 'Access Doctor Portal',
    color: 'text-teal-400',
  },
  {
    title: 'HOSPITAL & CLINIC HEAD',
    subtitle: 'Enterprise Healthcare Synchrony',
    text: 'Oversee bed occupancy, department workflows, on-duty nurse rosters, and biomedical waste clearances on one unified screen.',
    items: ['Multi-department staff role provisioning', 'Real-time triage and bed allocation', 'Automated regulatory accreditation logs', 'OPD cashier & lab billing synchronization'],
    image: '/images/healthcare/icu-ward.jpg',
    Icon: Building2,
    cta: 'Access Hospital Portal',
    color: 'text-sky-400',
  },
  {
    title: 'LABORATORY & DIAGNOSTICS',
    subtitle: 'Instant Test Result Dispatch',
    text: 'Seamlessly upload blood panels, tissue histology, and imaging reports directly into the patient’s permanent clinical loop.',
    items: ['Automated HL7/FHIR sample ingestion', 'Instant patient & doctor report alerts', 'Critical value panic flag notifications', 'Digital pathologist sign-off workflows'],
    image: '/images/healthcare/medical-lab.jpg',
    Icon: FlaskConical,
    cta: 'Access Lab Portal',
    color: 'text-emerald-400',
  },
] as const;

export default function RolesSection() {
  return (
    <section id="roles" className="relative bg-surface-10 py-20 sm:py-28 overflow-hidden">
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
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            <Sparkles size={13} className="text-teal-300" /> Dedicated Ecosystem Workspaces
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Designed for Every <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Healthcare Role</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Whoever you are in the care journey, there is a workspace customized to your clinical flow. Rounded cards, high-res backgrounds, and zero friction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {roles.map(({ title, subtitle, text, items, image, Icon, cta, color }) => (
            <article
              key={title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-cyan-500/10"
            >
              {/* Background Hospital Role Image */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                  sizes="(max-width: 1024px) 100vw, 650px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
              </div>

              {/* Radiant Glow Orb */}
              <div className="pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner group-hover:border-cyan-400/40">
                      <Icon size={22} className={`${color} group-hover:scale-110 transition-transform`} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-extrabold tracking-wide text-white">
                        {title}
                      </h3>
                      <p className="text-xs font-bold text-teal-300">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Mini animated ECG pulse line */}
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

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {text}
                </p>

                <ul className="mt-5 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <HeartPulse size={13} className="shrink-0 text-rose-400 animate-heartbeat" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-1"
                >
                  {cta} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
