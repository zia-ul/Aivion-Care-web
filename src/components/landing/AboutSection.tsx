import Image from 'next/image';
import { Activity, ArrowUpRight, Building2, FlaskConical, Pill, Stethoscope, Users } from 'lucide-react';

const nodes = [['Patients', Users], ['Doctors', Stethoscope], ['Hospitals', Building2], ['Laboratories', FlaskConical], ['Pharmacies', Pill]] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div>
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">About Aivion Care</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            Your health, finally connected. No cap.
          </h2>
          <p className="mt-5 leading-7 text-primary-light/70">
            Aivion Care is the connected healthcare ecosystem from AI Confidence Cure — a student-led
            Indian health-tech startup incubated at AMU. We built the app so you stop juggling
            doctors, labs, pharmacies and paperwork.
          </p>
          <p className="mt-4 leading-7 text-primary-light/70">
            Appointments, teleconsultation, lab reports, prescriptions, medication reminders,
            health alerts and AI-assisted workflows — every part of the care journey lives in one
            place. Clinical judgement stays with the clinician. Tech just makes the connection.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 backdrop-blur">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-tonal-20/70 bg-sky-500/10 p-2 shadow-lg shadow-accent/10">
              <Image src="/aivion-care-logo.png" alt="Aivion Care logo" width={48} height={48} className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-primary-light">Aivion Care</p>
              <p className="text-sm text-muted-foreground">Connected healthcare, built in India 🇮🇳</p>
              <a
                href="https://aivioncare.aiconfidencecure.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
              >
                aiconfidencecure.com <ArrowUpRight size={15} />
              </a>
            </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['24/7', 'Always-on monitoring vision'],
              ['4', 'Core health signals tracked'],
              ['2025', 'Founded & incorporated in India'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-tonal-20/70 bg-surface-20/60 p-4">
                <dt className="text-2xl font-bold text-sky-600 dark:text-sky-400">{value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-tonal-20 bg-surface-20/85 dark:bg-slate-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-cyan-500/20 blur-xl opacity-75" />
          
          {/* Real Hospital & Doctor Visual */}
          <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl border border-tonal-20">
            <Image
              src="/images/healthcare/doctor-patient-care.jpg"
              alt="Doctor consulting patient with AI telemetry"
              fill
              className="object-cover opacity-75 dark:opacity-90 transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/40 to-transparent dark:from-slate-950 dark:via-slate-950/40 dark:to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-500/30 backdrop-blur-md">
                Continuous Doctor-Patient Loop
              </span>
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-300">
                AI Telemetry Enabled
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {nodes.map(([label, Icon], idx) => (
              <div
                key={label}
                className={`rounded-2xl border border-tonal-20 bg-surface-30/60 dark:bg-white/[0.03] p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:bg-surface-40/60 dark:hover:bg-white/[0.08] ${
                  idx === 4 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <Icon size={20} className="mx-auto text-sky-600 dark:text-sky-400" />
                <p className="mt-2 text-xs font-semibold text-primary-light/90 truncate">{label}</p>
              </div>
            ))}
          </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-primary-light/70">
            <Building2 size={15} className="text-teal-600 dark:text-teal-400" /> Unified clinical operating system across clinics and hospitals
          </div>
        </div>
      </div>
    </section>
  );
}



