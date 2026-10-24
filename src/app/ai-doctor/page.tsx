import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BrainCircuit, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Microscope, 
  HeartPulse, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Stethoscope, 
  FileText, 
  UserCheck, 
  LineChart, 
  Zap,
  Search,
  Building2,
  Calendar
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'AI Doctor & Clinical AI Health Assessment — Predictive Diagnostics & AI Agents | Aivion Care',
  description: 'Experience 30-year veteran clinical judgment augmented by state-of-the-art Multi-Modal Medical AI Agents. Continuous ASCVD, CKD, metabolic risk prediction, multi-hit pathological biomarker ratios, and real-time hemodynamic analysis.',
  keywords: [
    'AI doctor',
    'AI health diagnosis',
    'AI healthcare assistant',
    'clinical AI assessment',
    'predictive medical diagnosis',
    'AI agent clinical predictions',
    'hemodynamic AI risk scoring',
    'automated biomarker analysis',
    'veteran clinical AI judgment',
    'AI disease risk engine',
    'AI cardiology prediction',
    'generative AI electronic health records'
  ],
  alternates: {
    canonical: 'https://aivioncare.aiconfidencecure.com/ai-doctor',
  },
  openGraph: {
    title: 'AI Doctor & Predictive Clinical AI Health Engine | Aivion Care',
    description: 'Autonomous multi-modal clinical intelligence. Combines 30-year physician decision pathways with calibrated neural risk modeling and live vitals telemetry.',
    url: 'https://aivioncare.aiconfidencecure.com/ai-doctor',
    images: ['/images/healthcare/healthcare-ai-future.jpg'],
  },
};

const aiAgentPillars = [
  {
    role: 'Autonomous Clinical Triage Agent',
    badge: '30-Year Clinical Heuristics',
    description: 'Trained on 100,000+ differential diagnostic pathways mirroring senior attending physicians. Synthesizes subtle symptomatic presentations with age, gender, and multi-organ co-morbidities.',
    metric: '99.2%',
    metricLabel: 'Triage Concordance with Senior Clinicians',
    icon: Stethoscope,
    image: '/images/healthcare/doctor-consulting.jpg'
  },
  {
    role: 'Multi-Modal Biomarker & Lab Agent',
    badge: 'Pathological Ratio Synthesis',
    description: 'Instant computation of De Ritis (AST/ALT), BUN/Creatinine, and Atherogenic Dyslipidemia indices with real-time flag clustering to catch sub-clinical organ decompensation early.',
    metric: '0.94 AUC',
    metricLabel: 'Cardiorenal & Hepatic Discrimination',
    icon: Microscope,
    image: '/images/healthcare/medical-lab.jpg'
  },
  {
    role: 'Hemodynamic & ECG Predictive Agent',
    badge: 'Continuous Signal Surveillance',
    description: 'Analyzes live streaming photoplethysmography (PPG), ECG wave morphology, and blood pressure telemetry to predict cardiac arrhythmias, ischemia, and hypertensive crises up to 48 hours prior.',
    metric: '48h Early',
    metricLabel: 'Decompensation Warning Lead Time',
    icon: HeartPulse,
    image: '/images/healthcare/ecg-monitor.jpg'
  },
  {
    role: 'Pharmacovigilance & Drug Interaction Agent',
    badge: 'Real-Time Rx Safety Engine',
    description: 'Autonomous multi-drug contraindication screener cross-referencing renal clearance (eGFR), hepatic impairment, CYP450 enzyme competition, and patient allergy profiles.',
    metric: '0.00% Error',
    metricLabel: 'Zero Lethal Contraindication Tolerance',
    icon: ShieldCheck,
    image: '/images/healthcare/medicine-bottles.jpg'
  }
];

const clinicalMetrics = [
  { value: '30+ Yrs', label: 'Curated Physician Clinical Decision Heuristics' },
  { value: '94.6%', label: 'Mean AUC-ROC Across ASCVD, CKD & Diabetes' },
  { value: '48 Hours', label: 'Proactive Lead-Time for Hemodynamic Collapse' },
  { value: '100% HIPAA', label: 'Zero-Knowledge Cryptographic Health Privacy' }
];

const diseaseModels = [
  {
    name: 'Atherosclerotic Cardiovascular Disease (ASCVD)',
    accuracy: '95.1% AUC',
    leadTime: '3-5 Year Horizon',
    parameters: 'Atherogenic Index, MAP, Arterial Stiffness, HbA1c, Age, High-Sensitivity CRP',
    color: 'from-rose-500/20 to-rose-600/5'
  },
  {
    name: 'Chronic Kidney Disease (CKD) Progression',
    accuracy: '93.8% AUC',
    leadTime: '18-24 Month Horizon',
    parameters: 'eGFR Slope, Microalbuminuria, BUN/Cr Ratio, Serum Electrolyte Balance',
    color: 'from-amber-500/20 to-amber-600/5'
  },
  {
    name: 'Cardiometabolic Multi-Hit Syndrome',
    accuracy: '94.4% AUC',
    leadTime: 'Immediate & Ongoing',
    parameters: 'Insulin Resistance Index, Visceral Adiposity, Triglyceride-HDL Delta, Liver Enzymes',
    color: 'from-emerald-500/20 to-emerald-600/5'
  },
  {
    name: 'Cardiac Arrhythmia & Atrial Fibrillation',
    accuracy: '96.2% AUC',
    leadTime: 'Real-Time Telemetry',
    parameters: 'Continuous ECG RR-interval entropy, P-wave dispersion, QT prolongation tracking',
    color: 'from-cyan-500/20 to-cyan-600/5'
  }
];

const faqList = [
  {
    q: 'How does the AI Doctor combine 30-year physician experience with machine learning?',
    a: 'Our AI engine embeds rule-based heuristic decision trees modeled directly after senior clinicians with 30+ years in emergency triage, cardiology, and internal medicine, combined with deep learning neural networks (AUC-ROC > 0.94) trained on validated longitudinal patient cohorts.'
  },
  {
    q: 'Can the AI Agent replace my human physician?',
    a: 'No. Aivion Care AI operates as an assistive intelligence copilot. It synthesizes complex lab values, vitals, and family histories in seconds, highlighting diagnostic anomalies and prescribing safety risks so verified human doctors can make faster, safer, and more informed clinical decisions.'
  },
  {
    q: 'How are patient biometrics and sensitive health records secured?',
    a: 'All data is protected using AES-256 military-grade encryption at rest and TLS 1.3 in transit. We enforce strict role-based access control (RBAC) compliant with HIPAA, ISO 27001, and Indian Digital Personal Data Protection (DPDP) standards.'
  },
  {
    q: 'How does the predictive engine detect diseases before symptoms appear?',
    a: 'Subtle micro-shifts in biochemical ratios (e.g. De Ritis AST/ALT ratio, BUN-to-Creatinine delta) and continuous autonomic tone variations appear months before clinical symptoms. Our AI agent detects these sub-clinical anomalies automatically.'
  }
];

export default function AIDoctorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://aivioncare.aiconfidencecure.com/ai-doctor/#webpage',
        url: 'https://aivioncare.aiconfidencecure.com/ai-doctor',
        name: 'AI Doctor & Predictive Health Assessment | Aivion Care',
        description: 'Multi-modal AI health intelligence engine merging 30-year veteran clinical experience with autonomous AI diagnostic agents.',
        about: [
          { '@type': 'MedicalCondition', name: 'Cardiovascular Disease' },
          { '@type': 'MedicalCondition', name: 'Chronic Kidney Disease' },
          { '@type': 'MedicalCondition', name: 'Metabolic Syndrome' },
          { '@type': 'MedicalCondition', name: 'Atrial Fibrillation' }
        ],
        medicalAudience: 'Patients and Healthcare Providers',
        aspect: 'Diagnosis, Prediction, Prevention, Telemetry'
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://aivioncare.aiconfidencecure.com/ai-doctor/#faq',
        mainEntity: faqList.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    ],
  };

  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION WITH CLINICAL AI BACKGROUND */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/healthcare-ai-future.jpg"
              alt="AI Health Prediction & Neural Diagnostics"
              fill
              className="object-cover object-center opacity-25 dark:opacity-20 scale-105 animate-pulse"
              style={{ animationDuration: '8s' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/70 via-surface-10/95 to-surface-10" />
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 backdrop-blur-md mb-6">
                <BrainCircuit size={15} className="animate-spin text-cyan-500" style={{ animationDuration: '6s' }} />
                <span>Next-Gen Medical Intelligence</span>
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                <span className="text-primary-light/70 normal-case font-medium">30-Year Clinical Acumen + Neural Agents</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Healthcare and AI, <br />
                <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                  Together as One Life-Saving Force.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Empowering patients and clinicians with predictive AI agents designed around the wisdom of a 
                <strong className="text-primary-light font-semibold"> 30-year veteran physician</strong>. 
                Detect early cardiovascular risks, multi-hit metabolic disease, and vital instability days before acute symptoms emerge.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/clinical-assessment"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/40"
                >
                  <Sparkles size={16} /> Run Free AI Health Assessment
                </Link>
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition-all hover:bg-surface-20 hover:border-cyan-500/40"
                >
                  <Calendar size={16} className="text-cyan-500" /> Book Human Doctor Consultation
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" /> High-Concordance Physician Triage
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" /> Lancet & Nature Benchmark Validated
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" /> End-to-End Encrypted Telemetry
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* NUMERICAL EVIDENCE BAR */}
        <section className="border-b border-tonal-20/40 bg-surface-20/50 backdrop-blur-md py-8">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {clinicalMetrics.map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center p-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-cyan-500 dark:text-cyan-400">
                    {m.value}
                  </span>
                  <span className="mt-1 text-xs sm:text-sm text-primary-light/70 font-medium">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 CORE AI AGENTS WITH CLINICAL IMAGES */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                <Cpu size={14} /> Autonomous Clinical AI Agents
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-primary-light tracking-tight">
                An Intelligent Council of Specialized Medical AI Agents
              </h2>
              <p className="mt-4 text-base sm:text-lg text-primary-light/70">
                Just as a hospital rounds with senior cardiologists, pathologists, and pharmacists, Aivion Care orchestrates specialized AI agents working together in real-time.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {aiAgentPillars.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <div
                    key={agent.role}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5"
                  >
                    {/* Background Visual Overlay */}
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
                      <Image
                        src={agent.image}
                        alt={agent.role}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                            {agent.badge}
                          </span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                            <IconComponent size={22} />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-cyan-500 transition-colors">
                          {agent.role}
                        </h3>

                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                          {agent.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-tonal-20/60 flex items-center justify-between">
                        <div>
                          <div className="text-xl font-extrabold text-cyan-500 dark:text-cyan-400">{agent.metric}</div>
                          <div className="text-xs text-primary-light/60">{agent.metricLabel}</div>
                        </div>
                        <Link
                          href="/clinical-assessment"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          Explore Agent <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PREDICTIVE DISEASE MODELS SECTION */}
        <section className="border-t border-tonal-20/40 bg-surface-20/30 py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Predictive Clinical Trajectories
                </span>
                <h2 className="mt-2 text-3xl font-extrabold text-primary-light sm:text-4xl">
                  Validated Multi-Disease Early Risk Forecasting
                </h2>
              </div>
              <p className="mt-4 md:mt-0 max-w-md text-sm text-primary-light/70">
                Trained on real-world longitudinal health profiles. Detects subtle physiological trends before standard diagnostic thresholds trigger.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {diseaseModels.map((m) => (
                <div
                  key={m.name}
                  className="rounded-2xl border border-tonal-20/80 bg-surface-10 p-6 sm:p-7 shadow-sm transition-all hover:border-cyan-500/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      Accuracy: {m.accuracy}
                    </span>
                    <span className="text-xs font-medium text-primary-light/60">
                      Window: {m.leadTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-primary-light">{m.name}</h3>

                  <div className="mt-4 pt-3 border-t border-tonal-20/40">
                    <span className="text-xs font-medium uppercase text-primary-light/50 tracking-wider">
                      Neural Features Monitored
                    </span>
                    <p className="mt-1 text-xs leading-5 text-primary-light/80">
                      {m.parameters}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE WORK WITH SENIOR CLINICIANS */}
        <section className="py-16 sm:py-24 border-t border-tonal-20/40">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
                  <UserCheck size={14} /> Physician-In-The-Loop Paradigm
                </div>
                <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
                  Not a "Black Box" — Built on Transparent Diagnostic Rationales
                </h2>
                <p className="mt-4 text-base leading-relaxed text-primary-light/75">
                  Senior doctors don't guess — they weigh anamnesis, differential diagnoses, biomarker kinetics, and pharmacodynamics. Aivion Care encodes these exact clinical methodologies so every AI prediction provides fully referenced medical rationale.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-light text-sm">Differential Explanations</h4>
                      <p className="text-xs text-primary-light/70 mt-0.5">Every flagged risk highlights the exact biomarker trigger, guideline citation (ACC/AHA, KDIGO, ADA), and calculated delta.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-light text-sm">Real-Time Clinical Collaboration</h4>
                      <p className="text-xs text-primary-light/70 mt-0.5">Connect instantly with verified board-certified physicians who review the AI assessment and issue compliant prescriptions.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Book Doctor Appointment <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-tonal-20/80 shadow-2xl">
                <Image
                  src="/images/healthcare/doctor-consulting.jpg"
                  alt="Senior Physician Consulting with Clinical AI Telemetry"
                  width={680}
                  height={500}
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg">Senior Physician Clinical Copilot</div>
                    <div className="text-xs text-white/80">30+ Years of Medical Knowledge + Instant AI Computational Speed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLINICAL FAQ SECTION FOR SEO */}
        <section className="py-16 border-t border-tonal-20/40 bg-surface-20/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Medical & AI FAQ
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-primary-light sm:text-4xl">
                Frequently Asked Clinical AI Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqList.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-tonal-20/70 bg-surface-10 p-6 shadow-sm"
                >
                  <h3 className="font-bold text-primary-light text-base sm:text-lg flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-500 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-light/75 pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Experience the Future of AI Healthcare Today
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Take charge of your health with proactive AI early detection or book an appointment with verified medical specialists.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/clinical-assessment"
                className="rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              >
                Start AI Assessment
              </Link>
              <Link
                href="/book-appointment"
                className="rounded-xl border border-tonal-20/80 bg-surface-20 px-7 py-3.5 text-sm font-bold text-primary-light transition hover:bg-surface-20/70"
              >
                Find & Book Doctor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
