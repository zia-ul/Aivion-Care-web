import { ArrowRight, Calendar, Clock, HeartPulse, MapPin, Stethoscope, UserRoundCheck, Users, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';

const initiatives = [
  { 
    title: 'Free Community Health & Vitals Screening', 
    description: 'Quarterly grassroots public camps providing automated blood pressure, continuous ECG telemetry, blood sugar screening, and instant doctor consultations at zero cost.', 
    points: ['Free vitals & blood sugar profiling', 'On-the-spot physician review', 'Early hypertension & diabetes detection'], 
    Icon: HeartPulse,
    image: '/images/healthcare/doctor-patient-care.jpg'
  },
  { 
    title: 'Academic & Clinical Institutional MoUs', 
    description: 'Formal collaborations with medical colleges, university healthcare centers, and regional public hospitals to deploy AI triage copilots and research validation.', 
    points: ['Aligarh Muslim University incubation', 'Clinical ethics board oversight', 'Joint peer-reviewed medical publications'], 
    Icon: Building2,
    image: '/images/healthcare/hospital-interior.jpg'
  },
  { 
    title: 'Physician-Led Preventive Health Seminars', 
    description: 'Interactive campus and community workshops led by senior cardiologists and physicians educating families on cardiovascular risk factors and lifestyle interventions.', 
    points: ['Senior clinician talks', 'Interactive Q&A for chronic illness', 'Dietary & metabolic guidance'], 
    Icon: Stethoscope,
    image: '/images/healthcare/doctor-consulting.jpg'
  },
  { 
    title: 'Rural Telehealth & Emergency Outreach', 
    description: 'Connecting peripheral village health posts with top-tier city hospital specialists via low-bandwidth encrypted video calls and mobile diagnostic units.', 
    points: ['Reaches remote rural populations', 'Emergency ambulance synchronization', 'Eliminates travel delays for critical care'], 
    Icon: MapPin,
    image: '/images/healthcare/emergency-ambulance.jpg'
  },
  { 
    title: 'Digital Health Literacy for Families', 
    description: 'Empowering elderly patients and caregivers to monitor daily vitals, understand biometric risk alerts, and safely access digital prescriptions.', 
    points: ['Simplified multi-lingual mobile app', 'Caregiver notification alerts', 'Zero technical barrier for seniors'], 
    Icon: UserRoundCheck,
    image: '/images/healthcare/nurse-checking-patient.jpg'
  },
  { 
    title: 'Open Medical AI Safety Standards', 
    description: 'Advocating for transparent, non-black-box algorithmic auditing, bias minimization across diverse demographic cohorts, and patient data sovereignty.', 
    points: ['Transparent clinical decision trees', 'Zero-knowledge data encryption', 'Demographic fairness benchmarking'], 
    Icon: ShieldCheck,
    image: '/images/healthcare/healthcare-ai-future.jpg'
  },
] as const;

export default function InitiativesPage() {
  return (
    <PageShell>
      <main>
        {/* HERO SECTION WITH COMMUNITY HEALTH IMAGE */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-surface-20/80 p-8 sm:p-12 mb-10">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
            <Image
              src="/images/healthcare/doctor-patient-care.jpg"
              alt="Community Healthcare Initiatives"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-10 via-surface-10/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-4">
              <Sparkles size={14} />
              <span>Public Health & Social Impact</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary-light tracking-tight leading-tight">
              Reaching Beyond Clinics, <br />
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Into Homes and Communities.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-light/80 leading-relaxed">
              Aivion Care is not just enterprise software. We actively invest in free screening camps, clinical research partnerships, and medical literacy drives across India.
            </p>
          </div>
        </div>

        {/* INITIATIVES CARDS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map(({ title, description, points, Icon, image }) => (
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
                <p className="mt-3 text-xs sm:text-sm leading-6 text-primary-light/75">{description}</p>
              </div>

              <ul className="relative z-10 mt-6 space-y-2 border-t border-tonal-20/50 pt-4">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-primary-light/70">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* BOTTOM PARTNERSHIP CTA */}
        <div className="mt-12 rounded-3xl border border-sky-500/20 bg-surface-20/90 p-8 sm:p-10 backdrop-blur-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-light">Partner With Us for a Health Drive</h2>
          <p className="mt-3 text-xs sm:text-sm text-primary-light/75 max-w-xl mx-auto">
            Are you a hospital, university NGO, or community organization interested in running an automated vitals screening drive? We'd love to collaborate.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400"
            >
              Contact Our Outreach Team <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
