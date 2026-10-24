import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Bed, 
  Calendar, 
  Users, 
  Layers, 
  HeartPulse, 
  Clock, 
  Zap,
  Activity,
  FileCheck2,
  Lock
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Hospital & Clinic Management Software — OPD, IPD, Bed & AI Triage | Aivion Care',
  description: 'Enterprise hospital and multi-specialty clinic management system (HMS/EMR). Integrated real-time OPD token queue, IPD bed census, AI clinical triaging, doctor roster scheduling, and NABH-compliant health records.',
  keywords: [
    'hospital management software',
    'clinic management system',
    'hospital EMR software',
    'OPD queue management system',
    'hospital IPD bed tracking',
    'digital clinic management',
    'NABH compliant hospital software',
    'doctor consultation scheduling software',
    'multi-specialty clinic software',
    'smart hospital operating system'
  ],
  alternates: {
    canonical: 'https://www.aiconfidencecure.com/solutions/hospitals-clinics',
  },
  openGraph: {
    title: 'Smart Hospital & Clinic Management OS | Aivion Care',
    description: 'Transform hospital operations with AI triage, digital OPD queues, real-time bed tracking, and interconnected clinical departments.',
    url: 'https://www.aiconfidencecure.com/solutions/hospitals-clinics',
    images: ['/images/healthcare/hospital-interior.jpg'],
  },
};

const hospitalFeatures = [
  {
    title: 'Intelligent OPD Queue & Token Engine',
    desc: 'Eliminate chaotic waiting rooms. Patients receive live SMS/app queue notifications with dynamic wait-time estimation based on real consultation velocity.',
    icon: Clock,
    metric: '45% Less',
    metricLabel: 'Average Patient Waiting Time',
    image: '/images/healthcare/reception-desk.jpg'
  },
  {
    title: 'Dynamic IPD Ward & Bed Allocation',
    desc: 'Interactive 3D-style bed matrix for ICU, HDU, general, and deluxe wards. Real-time discharge forecasts, transfer management, and automated sanitization alerts.',
    icon: Bed,
    metric: '99.4%',
    metricLabel: 'Bed Occupancy Accuracy',
    image: '/images/healthcare/icu-ward.jpg'
  },
  {
    title: 'AI Clinical Triage & Patient Flow Copilot',
    desc: 'Pre-screens arriving emergency and outpatient cases using validated 30-year physician triage algorithms to route high-risk vitals directly to critical care teams.',
    icon: HeartPulse,
    metric: '3.2x Faster',
    metricLabel: 'Critical Patient Escalation',
    image: '/images/healthcare/hospital-hallway.jpg'
  },
  {
    title: 'Complete Inter-Departmental Connectivity',
    desc: 'Seamless real-time order entry between doctor chambers, pathology labs, pharmacy dispensaries, and billing counters with zero paper trails.',
    icon: Layers,
    metric: '100% Digital',
    metricLabel: 'Zero Paper Prescription Loss',
    image: '/images/healthcare/modern-clinic.jpg'
  }
];

export default function HospitalsClinicsPage() {
  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION WITH HOSPITAL INTERIOR BACKGROUND */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/hospital-interior.jpg"
              alt="Smart Hospital Operating System"
              fill
              className="object-cover object-center opacity-20 dark:opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/70 via-surface-10/95 to-surface-10" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 backdrop-blur-md mb-6">
                <Building2 size={15} />
                <span>Enterprise Hospital OS & Clinic Suite</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Modern Hospital & Clinic Management, <br />
                <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                  Driven by Real-Time Clinical AI.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Connect your OPD, IPD, ICU, Pharmacy, and Diagnostics in a unified cloud platform. Designed for small private clinics up to 1,000-bed multi-specialty hospital networks.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register/hospital"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
                >
                  <Building2 size={16} /> Register Hospital / Clinic
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition hover:bg-surface-20"
                >
                  Schedule an Enterprise Demo <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> NABH & ABDM Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Multi-Branch Cloud Architecture</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Role-Based Staff Permissions</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Hospital Workflow Engine
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Built to Power Every Wing of Your Medical Facility
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {hospitalFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40"
                  >
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {feat.metric} — {feat.metricLabel}
                          </span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                            <IconComp size={22} />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-sky-500 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                          {feat.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-tonal-20/60">
                        <Link href="/register/hospital" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                          Get Started for Hospitals <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTEGRATION BANNER */}
        <section className="border-t border-tonal-20/40 bg-surface-20/40 py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Elevate Your Hospital’s Clinical Efficiency
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Empower your doctors, nurses, receptionists, and hospital administrators with AI intelligence and paperless coordination.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register/hospital" className="rounded-xl bg-sky-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400">
                Onboard Hospital Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
