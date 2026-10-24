import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Microscope, 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Scan,
  Share2,
  Activity
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Pathology & Diagnostic Lab Management Software — LIMS & AI Biomarker Ratios | Aivion Care',
  description: 'Next-generation Laboratory Information Management System (LIMS). Automated bidirectional machine interfacing, De Ritis / BUN-Cr diagnostic ratio computation, barcoded sample accessioning, and instant WhatsApp PDF reports.',
  keywords: [
    'pathology lab software',
    'diagnostic lab management system',
    'LIMS software healthcare',
    'pathology report management system',
    'diagnostic biomarker ratio calculator',
    'medical lab automation software',
    'blood test report generation software',
    'radiology and pathology reporting software'
  ],
  alternates: {
    canonical: 'https://aivioncare.aiconfidencecure.com/solutions/pathology',
  },
  openGraph: {
    title: 'Smart Pathology & Diagnostic Lab Software (LIMS) | Aivion Care',
    description: 'Transform diagnostic workflows: automated analyzer interfacing, AI biomarker interpretation, barcoded tracking, and instant digital report delivery.',
    url: 'https://aivioncare.aiconfidencecure.com/solutions/pathology',
    images: ['/images/healthcare/medical-lab.jpg'],
  },
};

const pathologyFeatures = [
  {
    title: 'Autonomous Diagnostic Ratio Computation',
    desc: 'Automatically computes critical physiological indices including De Ritis (AST/ALT), BUN/Creatinine, and Atherogenic Dyslipidemia ratios with clinical reference brackets.',
    icon: BrainCircuit,
    metric: 'Instant',
    metricLabel: 'Biomarker Ratio Computation',
    image: '/images/healthcare/medical-lab.jpg'
  },
  {
    title: 'Bidirectional Machine Interfacing',
    desc: 'Connects seamlessly with automated biochemistry, hematology, and immunology analyzers. Eliminates manual typing of numeric test results and prevents human errors.',
    icon: FlaskConical,
    metric: '0.0% Transcribe',
    metricLabel: 'Data Entry Error Elimination',
    image: '/images/healthcare/research-scientist.jpg'
  },
  {
    title: 'Barcoded Sample Accessioning & Tracking',
    desc: 'End-to-end chain of custody from phlebotomy draw to centrifuge, machine processing, and report dispatch. Real-time sample status visible to patients and doctors.',
    icon: Scan,
    metric: '100% Tracked',
    metricLabel: 'Sample Chain-of-Custody',
    image: '/images/healthcare/digital-tablet-doctor.jpg'
  },
  {
    title: 'One-Click WhatsApp & Portal Report Delivery',
    desc: 'Instant QR-coded, digitally signed PDF reports sent straight to patient phones and doctor EMR workspaces the moment the pathologist signs off.',
    icon: Share2,
    metric: '< 5 Sec',
    metricLabel: 'Automated Report Dispatch',
    image: '/images/healthcare/radiology-mri.jpg'
  }
];

export default function PathologyPage() {
  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/medical-lab.jpg"
              alt="Smart Pathology and Diagnostic Laboratory Automation"
              fill
              className="object-cover object-center opacity-20 dark:opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/70 via-surface-10/95 to-surface-10" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 backdrop-blur-md mb-6">
                <Microscope size={15} />
                <span>Next-Gen Pathology & Diagnostic LIMS</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Modern Diagnostic Lab Management, <br />
                <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-500 bg-clip-text text-transparent">
                  Supercharged with AI Biomarker Intelligence.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Connect your diagnostic center, pathology lab, or hospital testing department with automated analyzer interfacing, AI-interpreted test ratios, and instant multi-channel digital reporting.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register/pathology"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5"
                >
                  <Microscope size={16} /> Register Pathology Lab
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition hover:bg-surface-20"
                >
                  Lab Assistant Login <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Automated Delta Check Alerts</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> NABL Compliant Audit Logs</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Instant QR Code Verification</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Diagnostic Lab Suite
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Precision Testing, Automated Analyzer Flow, and Fast Turnaround
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {pathologyFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40"
                  >
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            {feat.metric} — {feat.metricLabel}
                          </span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                            <IconComp size={22} />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-purple-500 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                          {feat.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-tonal-20/60">
                        <Link href="/register/pathology" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                          Register Diagnostic Lab <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="border-t border-tonal-20/40 bg-surface-20/40 py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Scale Your Diagnostic Laboratory with Modern Automation
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Deliver faster test results, reduce phlebotomy turnaround times, and provide doctors with actionable AI biomarker ratios.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register/pathology" className="rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:bg-purple-500">
                Join Pathology Network
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
