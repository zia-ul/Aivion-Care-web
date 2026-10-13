import Image from 'next/image';
import { 
  ShieldCheck, 
  LockKeyhole, 
  KeyRound, 
  Database, 
  Cpu, 
  FileCheck2, 
  Binary, 
  Network, 
  Sparkles 
} from 'lucide-react';
import { ParagraphWithBg } from '@/components/common/ParagraphWithBg';

const securityLayers = [
  {
    title: 'Zero-Trust Role Isolation (RBAC)',
    description: 'Cryptographically scoped JWT tokens with strict segregation between Patient, Doctor, Hospital Head, Pharmacist, and Lab Technician access domains.',
    badge: 'HIPAA & DISHA Aligned',
    icon: KeyRound,
    gradient: 'from-sky-500/20 to-cyan-500/10'
  },
  {
    title: 'End-to-End Clinical Encryption',
    description: 'AES-256-GCM data at rest and TLS 1.3 in transit with automated key rotation. Sensitive biometric vitals & consultation audio streams remain confidential.',
    badge: 'AES-256-GCM + TLS 1.3',
    icon: LockKeyhole,
    gradient: 'from-teal-500/20 to-emerald-500/10'
  },
  {
    title: 'Distributed Immutable Audit Trails',
    description: 'Every medical record view, prescription generation, and diagnostic note revision is timestamped and cryptographically signed for forensic traceability.',
    badge: 'Tamper-Evident Ledger',
    icon: Database,
    gradient: 'from-indigo-500/20 to-blue-500/10'
  },
  {
    title: 'Differential Privacy Telemetry Vault',
    description: 'Real-time telemetry and ECG signals are pseudonymised with mathematical epsilon-differential privacy to ensure zero identifiable leakage.',
    badge: 'Mathematical Anonymization',
    icon: Binary,
    gradient: 'from-cyan-500/20 to-teal-500/10'
  }
];

const complexAlgorithms = [
  {
    tag: 'Pan-Tompkins DSP Pipeline',
    title: 'Real-Time Arrhythmia & QRS Waveform Detection',
    description: 'Executes bandpass filtering (5-15 Hz), derivative squaring, and dual-threshold adaptive moving windows to detect PVCs, AFib, and tachycardia with 99.8% signal fidelity.',
    formula: 'y[n] = 2y[n-1] - y[n-2] + x[n] - 2x[n-6] + x[n-12]',
    icon: Cpu
  },
  {
    tag: 'Multi-Agent Clinical NLP',
    title: 'Bayesian Pharmacovigilance & Drug Interaction Graph',
    description: 'Traverses dynamic CYP450 enzyme metabolization graphs and contraindications to prevent adverse drug events before prescriptions are signed.',
    formula: 'P(Event | Drug_A ∩ Drug_B) = [P(Drug_A ∩ Drug_B | Event) · P(Event)] / P(Evidence)',
    icon: Network
  },
  {
    tag: 'NEWS2 Risk Stratification',
    title: 'Autonomous Clinical Decompensation Forecaster',
    description: 'Processes non-linear vector streams of SpO₂, heart rate, respiratory cadence, and temperature to calculate early warning sepsis and respiratory collapse indexes.',
    formula: 'Score = Σ w_i · f(Vitals_i) | Alert Trigger Threshold ≥ 5',
    icon: FileCheck2
  }
];

export default function SecuritySection() {
  return (
    <section id="security" className="relative overflow-hidden bg-surface-10 py-20 sm:py-28">
      {/* Ambient background blur */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 -z-10 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        
        {/* Top Feature Highlight with ParagraphWithBg */}
        <ParagraphWithBg
          imageSrc="/images/healthcare/surgery-theatre.jpg"
          imageAlt="Advanced Hospital Operating Theatre and Security Infrastructure"
          badge="Zero-Trust Architecture"
          badgeIcon={<ShieldCheck size={16} className="text-cyan-400" />}
          heading={
            <span>
              Military-Grade Healthcare Security &{' '}
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Complex Algorithmic Intelligence
              </span>
            </span>
          }
          paragraph={
            <span>
              Healthcare data requires uncompromising cryptographic protection. Aivion Care pairs 
              zero-trust access isolation with advanced biomedical signal processing algorithms. 
              From real-time Pan-Tompkins QRS detection to multi-agent drug-interaction graph traversal, 
              your clinical records and live telemetry are guarded by mathematical precision.
            </span>
          }
          className="mb-14"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-500/20 px-3.5 py-1 text-xs font-bold text-teal-300">
              <Sparkles size={13} /> DISHA & HIPAA Standard Aligned
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-300">
              <LockKeyhole size={13} /> Hardware-Level Enclave Encryption
            </span>
          </div>
        </ParagraphWithBg>

        {/* Security Framework Cards Grid */}
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-primary-light">
              Core Security & Compliance Safeguards
            </h4>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Defense In Depth
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {securityLayers.map(({ title, description, badge, icon: Icon, gradient }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-tonal-20 bg-surface-20/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} blur-xl`} />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="mt-4 inline-block text-[10px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-300">
                    {badge}
                  </span>
                  <h5 className="mt-1 font-display text-base font-bold text-primary-light">
                    {title}
                  </h5>
                  <p className="mt-2 text-xs leading-relaxed text-primary-light/75">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complex Algorithms Showcase */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                Mathematical Foundations
              </p>
              <h4 className="mt-1 font-display text-xl sm:text-2xl font-bold text-primary-light">
                Complex Biomedical Algorithms We Deploy
              </h4>
            </div>
            <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">
              Live In Production
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {complexAlgorithms.map((algo) => {
              const Icon = algo.icon;
              return (
                <div
                  key={algo.tag}
                  className="relative overflow-hidden rounded-2xl border border-tonal-20 bg-surface-20/90 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between border-b border-tonal-20 pb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      <Icon size={15} /> {algo.tag}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <h5 className="mt-4 font-display text-lg font-bold text-primary-light">
                    {algo.title}
                  </h5>

                  <p className="mt-2 text-xs leading-relaxed text-primary-light/75">
                    {algo.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-tonal-20 bg-surface-30/80 p-3 font-mono text-[11px] text-cyan-700 dark:text-cyan-300 overflow-x-auto">
                    <code>{algo.formula}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
