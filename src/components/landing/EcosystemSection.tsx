import Image from 'next/image';
import { Building2, FlaskConical, Pill, Stethoscope, Users, Sparkles, CheckCircle2 } from 'lucide-react';

const roles = [
  { role: 'Patient', text: 'Appointments · Records · Prescriptions', Icon: Users, image: '/images/healthcare/doctor-patient-care.jpg' },
  { role: 'Doctor', text: 'Consultation · History · Notes', Icon: Stethoscope, image: '/images/healthcare/doctor-consulting.jpg' },
  { role: 'Hospital Head', text: 'Operations · Beds · Staff Rosters', Icon: Building2, image: '/images/healthcare/hospital-interior.jpg' },
  { role: 'Laboratory', text: 'Tests · Reports · Results', Icon: FlaskConical, image: '/images/healthcare/medical-lab.jpg' },
  { role: 'Pharmacy', text: 'Prescriptions · Medication · Orders', Icon: Pill, image: '/images/healthcare/pharmacy-shelf.jpg' },
] as const;

export default function EcosystemSection() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28 overflow-hidden">
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <Sparkles size={13} className="text-teal-600 dark:text-teal-300" /> Whole-Facility Architecture
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary-light sm:text-4xl lg:text-5xl">
            One Platform. <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">Multiple Healthcare Roles.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-light/70 sm:text-lg">
            Shared clinical context helps each role move patient care forward with zero lost folders. Nobody is left out of the loop.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {roles.map(({ role, text, Icon, image }) => (
            <div
              key={role}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/85 p-6 text-center shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-cyan-500/20"
            >
              {/* Background Role Image */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={image}
                  alt={role}
                  fill
                  className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                  sizes="(max-width: 768px) 100vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
              </div>

              <div>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/15 text-cyan-300 shadow-lg group-hover:scale-105 transition-transform">
                  <Icon size={26} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {role}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {text}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-teal-400">
                <CheckCircle2 size={12} /> Connected
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-4 text-sm font-semibold text-cyan-300 backdrop-blur-xl shadow-2xl">
          <Building2 size={20} className="text-teal-400" />
          <span>One connected workspace for the complete care journey · AMUIF Incubated</span>
        </div>
      </div>
    </section>
  );
}
