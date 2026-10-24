import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Stethoscope, 
  BrainCircuit, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Video, 
  FileText, 
  LineChart, 
  Clock, 
  Zap, 
  Users, 
  Lock, 
  Smartphone,
  Layers,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Doctor & Specialist Practice Management Software — AI Clinical Copilot & Teleconsultation | Aivion Care',
  description: 'AI-augmented practice management system for doctors and multi-specialty consultants. Voice-to-prescription AI drafting, continuous patient telemetry, smart OPD slot management, WebRTC HD teleconsultation, and longitudinal EHR analytics.',
  keywords: [
    'doctor practice management software',
    'clinical EMR for doctors',
    'AI prescription software for physicians',
    'doctor consultation scheduling software',
    'telemedicine software for doctors',
    'smart OPD prescription pad',
    'electronic medical records for specialists',
    'voice AI doctor consultation',
    'cardiologist practice software',
    'pediatrician EMR platform',
    'clinic management software for doctors'
  ],
  alternates: {
    canonical: 'https://www.aiconfidencecure.com/solutions/doctors-specialists',
  },
  openGraph: {
    title: 'Doctors & Specialists Clinical Suite | Aivion Care',
    description: 'Empower your clinical practice: AI prescription copilot, 30-year diagnostic decision support, WebRTC teleconsultation, and real-time patient vital streams.',
    url: 'https://www.aiconfidencecure.com/solutions/doctors-specialists',
    images: ['/images/healthcare/doctor-consulting.jpg'],
  },
};

const doctorFeatures = [
  {
    title: 'Ambient Voice-to-Rx AI Copilot',
    desc: 'Speak naturally during patient consultations. Our ambient speech AI transcribes clinical anamnesis, extracts chief complaints, auto-populates exact medicine names and dosages, and drafts full prescriptions in seconds.',
    icon: BrainCircuit,
    metric: '70% Faster',
    metricLabel: 'Consultation Documentation Time',
    image: '/images/healthcare/doctor-consulting.jpg'
  },
  {
    title: '30-Year Veteran Diagnostic Decision Support',
    desc: 'Synthesizes live vital signs, past medical history, and lab values against 100,000+ differential diagnosis pathways. Flags rare drug contraindications, renal clearance dosing, and cardiovascular risk escalations.',
    icon: ShieldCheck,
    metric: '99.2%',
    metricLabel: 'Clinical Concordance with Senior Specialists',
    image: '/images/healthcare/healthcare-ai-future.jpg'
  },
  {
    title: 'WebRTC HD Video Teleconsultation & Live Vitals',
    desc: 'Conduct crystal-clear, encrypted video consultations with integrated dual-frequency audio, real-time streaming ECG waveforms, SpO2, heart rate variability, and instantaneous digital sign-off.',
    icon: Video,
    metric: 'Zero Glare',
    metricLabel: 'High-Fidelity Telehealth Streaming',
    image: '/images/healthcare/telemedicine-call.jpg'
  },
  {
    title: 'Smart OPD Slot & Queue Velocity Engine',
    desc: 'Configure flexible consultation time blocks, clinic visit buffers, VIP priority queues, and automated follow-up reminders. Patients receive live queue notifications, cutting clinic waiting room congestion.',
    icon: Calendar,
    metric: '40% Less',
    metricLabel: 'Patient Waiting Room Congestion',
    image: '/images/healthcare/reception-desk.jpg'
  },
  {
    title: 'Longitudinal Patient Trajectory & Biomarker Trends',
    desc: 'Interactive visual timelines plotting blood pressure variability, HbA1c curves, lipid ratios, and De Ritis (AST/ALT) trajectories across months or years, giving you true preventive visibility.',
    icon: LineChart,
    metric: 'Full History',
    metricLabel: 'Unified Cross-Hospital Health Record',
    image: '/images/healthcare/digital-tablet-doctor.jpg'
  },
  {
    title: 'Direct Multi-Department Clinical Routing',
    desc: 'Dispatch e-prescriptions straight to local pharmacies, order diagnostic lab tests directly into pathology LIMS, and coordinate admissions with hospital wards with a single click.',
    icon: Layers,
    metric: '1-Click',
    metricLabel: 'Zero-Paper Interdepartmental Routing',
    image: '/images/healthcare/modern-clinic.jpg'
  }
];

const specialtiesSupported = [
  { name: 'Cardiology', focus: 'Real-time ECG stream surveillance, ASCVD 10-year risk, atherogenic indices', icon: HeartPulse },
  { name: 'Internal Medicine', focus: 'Multi-system syndrome triage, De Ritis liver ratios, BUN/Cr renal metrics', icon: Stethoscope },
  { name: 'Pediatrics', focus: 'Weight-based auto-dosage calculator, immunization scheduling, growth percentiles', icon: Activity },
  { name: 'Endocrinology', focus: 'HbA1c longitudinal drift, insulin resistance score, metabolic syndrome clustering', icon: Sparkles },
  { name: 'Pulmonology', focus: 'SpO2 continuous trending, respiratory rate telemetry, asthma attack triggers', icon: Clock },
  { name: 'General Practice', focus: 'Fast token queue management, ambient prescription drafting, instant lab orders', icon: Zap },
];

const faqList = [
  {
    q: 'How does the ambient voice-to-prescription AI assist during patient visits?',
    a: 'While you converse with the patient, the AI copilot listens and structures the dialogue into clinical sections (Chief Complaint, Symptoms, Diagnosis, Advice, and Prescriptions). It extracts medicine brand names, formulations, dosage strengths (e.g. 500 mg), and frequencies automatically for your final review and signature.'
  },
  {
    q: 'Can I use this software for both in-clinic OPD and online video consultations?',
    a: 'Yes. Aivion Care seamlessly bridges both. You can manage physical clinic queues with real-time token displays alongside WebRTC remote video consultations with live streaming vitals on one unified calendar.'
  },
  {
    q: 'Are patient medical records protected and compliant with healthcare privacy regulations?',
    a: 'Absolutely. All patient health records and telemetry streams are encrypted using AES-256 at rest and TLS 1.3 in transit. Our architecture complies with ABDM (Ayushman Bharat Digital Mission), HIPAA, and DPDP guidelines.'
  },
  {
    q: 'How quickly can a doctor get onboarded and verified?',
    a: 'Registration takes less than 2 minutes. Once your medical registration council credentials (MCI / State Medical Council) are verified by our clinical verification team, your digital clinic and prescription pad become live immediately.'
  }
];

export default function DoctorsSpecialistsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://www.aiconfidencecure.com/solutions/doctors-specialists/#webpage',
        url: 'https://www.aiconfidencecure.com/solutions/doctors-specialists',
        name: 'Doctor & Specialist Practice Management Software | Aivion Care',
        description: 'Advanced clinical practice management software with AI prescription drafting, real-time vitals telemetry, WebRTC video consultations, and intelligent OPD slot scheduling.',
        medicalAudience: 'Medical Doctors, Specialists, and Clinical Practitioners'
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.aiconfidencecure.com/solutions/doctors-specialists/#faq',
        mainEntity: faqList.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    ]
  };

  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/doctor-consulting.jpg"
              alt="Doctor & Specialist Clinical Suite"
              fill
              className="object-cover object-center opacity-25 dark:opacity-20 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/75 via-surface-10/95 to-surface-10" />
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 backdrop-blur-md mb-6">
                <Stethoscope size={15} />
                <span>Specialist & Physician Practice OS</span>
                <span className="h-1 w-1 rounded-full bg-sky-400" />
                <span className="text-primary-light/70 normal-case font-medium">Empowered by Clinical AI</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Designed for Doctors. <br />
                <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                  Augmented by 30-Year Clinical AI Wisdom.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Reclaim your clinical time. Eliminate paperwork with ambient voice-to-prescription drafting, stream live patient vitals during HD teleconsultations, and tap into AI differential diagnostic guidance.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register/doctor"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
                >
                  <Stethoscope size={16} /> Register as Doctor (Free Trial)
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition hover:bg-surface-20"
                >
                  Doctor Portal Login <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> ABDM & MCI Credential Verified</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Zero Hardware Lock-In</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Full Patient Data Privacy</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6 CORE DOCTOR FEATURES */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Physician Superpowers
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Everything You Need to Run a Modern, High-Velocity Practice
              </h2>
              <p className="mt-4 text-base text-primary-light/70">
                From high-volume physical OPD queues to complex chronic disease management and cross-border video teleconsultations.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {doctorFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
                  >
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/85 to-transparent" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                          {feat.metric}
                        </span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                          <IconComp size={22} />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-primary-light group-hover:text-sky-500 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-primary-light/75">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="relative z-10 mt-5 pt-4 border-t border-tonal-20/50 flex items-center justify-between text-xs text-primary-light/60">
                      <span>{feat.metricLabel}</span>
                      <Link href="/register/doctor" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
                        Enable Feature →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SUPPORTED SPECIALTIES MATRIX */}
        <section className="border-t border-tonal-20/40 bg-surface-20/30 py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Specialty Tailored Workflows
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-primary-light sm:text-4xl">
                Customized for Every Clinical Department
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specialtiesSupported.map((spec) => {
                const IconComp = spec.icon;
                return (
                  <div key={spec.name} className="rounded-2xl border border-tonal-20/80 bg-surface-10 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <IconComp size={18} />
                      </div>
                      <h3 className="font-bold text-base text-primary-light">{spec.name}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-primary-light/75">
                      {spec.focus}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ SECTION FOR DOCTOR SEO */}
        <section className="py-16 border-t border-tonal-20/40 bg-surface-20/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Doctor FAQ
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-primary-light sm:text-4xl">
                Frequently Asked Clinical & Practice Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqList.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-tonal-20/70 bg-surface-10 p-6 shadow-sm">
                  <h3 className="font-bold text-primary-light text-base sm:text-lg flex items-center gap-2">
                    <Sparkles size={16} className="text-sky-500 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-primary-light/75 pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Elevate Your Medical Practice with Aivion Care
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Join leading doctors and specialists delivering faster, safer, and AI-augmented patient care.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register/doctor"
                className="rounded-xl bg-sky-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                Register as Doctor Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
