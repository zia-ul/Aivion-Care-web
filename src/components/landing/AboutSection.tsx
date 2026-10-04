import Image from 'next/image';
import { Activity, ArrowUpRight, Building2, FlaskConical, Pill, Stethoscope, Users } from 'lucide-react';

const nodes = [['Patients', Users], ['Doctors', Stethoscope], ['Hospitals', Building2], ['Laboratories', FlaskConical], ['Pharmacies', Pill]] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div>
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">About Aivion Care</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            Your health, finally connected. No cap.
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            Aivion Care is the connected healthcare ecosystem from AI Confidence Cure — a student-led
            Indian health-tech startup incubated at AMU. We built the app so you stop juggling
            doctors, labs, pharmacies and paperwork.
          </p>
          <p className="mt-4 leading-7 text-primary-light/60">
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
                href="https://www.aiconfidencecure.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300"
              >
                aiconfidencecure.com <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['24/7', 'Always-on monitoring vision'],
              ['4', 'Core health signals tracked'],
              ['2025', 'Founded & incorporated in India'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-tonal-20/70 bg-surface-20/60 p-4">
                <dt className="text-2xl font-bold text-sky-400">{value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative rounded-2xl border border-tonal-20/70 bg-surface-10 p-6 sm:p-10 backdrop-blur">
          <div className="absolute inset-x-16 top-1/2 h-px bg-sky-500/20" />
          <div className="absolute bottom-12 left-1/2 top-12 w-px bg-sky-500/20" />
          <div className="relative z-10 mx-auto flex h-28 w-28 flex-col items-center justify-center overflow-hidden rounded-2xl border border-tonal-20 bg-sky-500/10 p-1 shadow-lg shadow-accent/10">
            <Image src="/aivion-care-logo.png" alt="Aivion Care" width={80} height={80} className="h-full w-full object-contain" />
          </div>
          <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {nodes.map(([label, Icon]) => (
              <div key={label} className="rounded-xl border border-tonal-20/70 bg-surface-20/70 p-3 text-center transition hover:-translate-y-1 hover:border-accent/50">
                <Icon size={18} className="mx-auto text-sky-400" />
                <p className="mt-2 text-support text-primary-light/70">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-support text-muted-foreground">
            <Building2 size={14} /> Shared workflows, clearer care
          </div>
        </div>
      </div>
    </section>
  );
}



