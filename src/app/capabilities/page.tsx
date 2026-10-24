import { ArrowRight, BrainCircuit, HeartPulse, Lock, ShieldCheck, Stethoscope, Users, Sparkles, Activity, Cpu, Microscope } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
import { ParagraphWithBg } from '@/components/common/ParagraphWithBg';

const capabilities = [
  { 
    title: '24/7 Real-Time Biometric Telemetry', 
    description: 'Continuous continuous physiological monitoring capturing ECG waveforms, photoplethysmography (PPG), mean arterial pressure, and core temperature with sub-minute alert thresholds.', 
    points: ['Live streaming telemetry to doctor chambers', 'Real-time alert dispatch to family and ICU teams', 'Eliminates reliance on sparse yearly checkups'], 
    Icon: HeartPulse,
    image: '/images/healthcare/smart-monitoring.jpg'
  },
  { 
    title: 'AI Multi-Agent Diagnostic Copilot', 
    description: 'Autonomous clinical agents cross-referencing patient history, lab values, and vital kinetics against 30-year physician decision trees to assist doctors in rapid differential diagnosis.', 
    points: ['Lancet & Nature benchmarked disease risk models', 'Instant De Ritis & BUN-Cr biomarker ratio calculation', 'Highlights early organ axis decompensation'], 
    Icon: BrainCircuit,
    image: '/images/healthcare/healthcare-ai-future.jpg'
  },
  { 
    title: 'Phonocardiogram (PCG) Acoustic Screening', 
    description: 'Hardware-level digital stethoscope integration analyzing acoustic cardiac murmur signatures and S3/S4 gallop rhythms for non-invasive valvular heart screening.', 
    points: ['Acoustic cardiac sound spectrum analysis', 'Detects valvular stenosis & regurgitation early', 'Immediate visualization in clinical dashboard'], 
    Icon: Stethoscope,
    image: '/images/healthcare/stethoscope-vitals.jpg'
  },
  { 
    title: 'Autonomous Pharmacovigilance & Drug Safety', 
    description: 'Automated prescription screening engine cross-referencing eGFR-adjusted dosing, hepatic metabolism, drug-drug contraindications, and patient allergy profiles.', 
    points: ['Zero-tolerance lethal contraindication blocking', 'Renal clearance dosing recommendation', 'Instant alerts before pharmacy dispensation'], 
    Icon: ShieldCheck,
    image: '/images/healthcare/medicine-bottles.jpg'
  },
  { 
    title: 'Military-Grade Cryptographic Health Security', 
    description: 'End-to-end encrypted telemetry, AES-256 encrypted health records, and zero-knowledge role-based access control (RBAC) compliant with HIPAA, ISO 27001 & ABDM.', 
    points: ['Role-based access separation across staff', 'Tamper-evident medical audit trails', 'Patient-owned consent management architecture'], 
    Icon: Lock,
    image: '/images/healthcare/digital-tablet-doctor.jpg'
  },
  { 
    title: 'Unified Healthcare Operating System', 
    description: 'Seamless interconnection bridging hospital beds, private clinics, pathology labs, pharmacies, and patients into a single real-time coordinated clinical loop.', 
    points: ['Zero paper loss across OPD, labs, and pharmacy', 'Instant digital prescription and report routing', 'One health record accessible across specialist network'], 
    Icon: Users,
    image: '/images/healthcare/hospital-interior.jpg'
  },
] as const;

export default function CapabilitiesPage() {
  return (
    <PageShell>
      <main>
        {/* HERO SECTION WITH IMAGE BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-surface-20/80 p-8 sm:p-12 mb-10">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
            <Image
              src="/images/healthcare/smart-monitoring.jpg"
              alt="Healthcare and AI Capabilities"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-10 via-surface-10/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-4">
              <Cpu size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
              <span>Next-Gen Health Architecture</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary-light tracking-tight leading-tight">
              Clinical AI Capabilities <br />
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Engineered for Proactive Patient Survival.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-light/80 leading-relaxed">
              From 24/7 continuous vital surveillance to AI multi-agent diagnostic copilots, discover how Aivion Care unites hardware sensors and medical intelligence.
            </p>
          </div>
        </div>

        {/* PARAGRAPH WITH BG */}
        <ParagraphWithBg
          imageSrc="/images/healthcare/ecg-monitor.jpg"
          imageAlt="AI Biometric Surveillance Capabilities"
          badge="Signal-Driven Healthcare"
          badgeIcon={<Sparkles size={16} className="text-cyan-700 dark:text-cyan-400" />}
          heading="Continuous Biometric Intelligence Powered by Hardware & AI"
          paragraph="Traditional annual checkups capture less than 1% of a patient's physiological trajectory. Our platform bridges medical IoT sensors directly into clinical dashboards, transforming intermittent visits into a continuous loop of patient safety and proactive intervention."
          className="mt-6 mb-12"
        />

        {/* 6 CAPABILITIES CARDS WITH VISUAL IMAGES & HOVER EFFECTS */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {capabilities.map(({ title, description, points, Icon, image }) => (
            <article 
              key={title} 
              className="group relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/70 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
            >
              {/* Subtle Ambient Background Image */}
              <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none">
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/85 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                    AI Enabled
                  </span>
                </div>

                <h2 className="text-xl font-bold text-primary-light group-hover:text-sky-500 transition-colors">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-primary-light/75">
                  {description}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-tonal-20/50 pt-4">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-primary-light/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-tonal-20/40 flex items-center justify-between">
                <Link 
                  href="/clinical-assessment" 
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300"
                >
                  Explore in Clinical Studio <ArrowRight size={14} />
                </Link>
                <Link 
                  href="/book-appointment" 
                  className="text-xs text-primary-light/60 hover:text-primary-light font-medium"
                >
                  Book Doctor Consultation →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
