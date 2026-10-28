import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  AlertTriangle, 
  Stethoscope, 
  Lock, 
  CheckCircle2, 
  Server, 
  UserCheck 
} from 'lucide-react';
import PageShell from '@/components/landing/PageShell';

export const metadata = {
  title: 'Terms of Service & Regulatory Compliance — Aivion Care',
  description: 'Terms of Service, CDSCO Medical Device Software guidance compliance, Telemedicine Practice Guidelines 2020, and DPDP Act 2023 alignment for Aivion Care.',
};

export default function TermsOfServicePage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto space-y-12 py-6">
        
        {/* Title Header */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-300">
            <Scale size={14} /> Legal & Regulatory Governance
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold text-primary-light tracking-tight">
            Terms of Service & Regulatory Compliance
          </h1>
          <p className="mt-3 text-sm sm:text-base text-primary-light/70 leading-relaxed">
            Effective Date: October 2026 • Governing Law: Republic of India. These terms govern the use of the Aivion Care health-tech platform and outline our compliance with statutory Government of India health directives.
          </p>
        </div>

        {/* Highlighted CDSCO Intended Use Box */}
        <div className="rounded-3xl border-2 border-teal-500/40 bg-teal-500/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-teal-700 dark:text-teal-300">
            <ShieldCheck size={22} className="shrink-0" />
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide">
              Official CDSCO Intended Use Statement
            </h2>
          </div>
          
          <blockquote className="rounded-2xl border border-teal-500/30 bg-surface-20/90 p-5 font-serif text-sm sm:text-base leading-relaxed text-primary-light shadow-inner">
            &ldquo;<strong>Aivion Care Clinical Decision Support Software is intended solely to assist licensed medical practitioners by organizing health records and computing validated clinical ratios. It is not intended for standalone automated diagnosis or autonomous treatment directives.</strong>&rdquo;
          </blockquote>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} /> Compliant with CDSCO Guidance Doc. CDSCO/MD/GD/MDSW/01/2026 (Medical Device Software - MDSW)
            </span>
            <span>•</span>
            <span>Medical Devices Rules (MDR), 2017</span>
          </div>
        </div>

        {/* Indian Government Regulatory Framework Checklist */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary-light flex items-center gap-2">
            <Server size={20} className="text-sky-500" /> Compliance with Indian Government Regulations
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            
            {/* 1. CDSCO SaMD Guidelines */}
            <div className="rounded-2xl border border-tonal-20 bg-surface-20/60 p-5 space-y-2">
              <span className="inline-block rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                CDSCO July 2026 Guidelines
              </span>
              <h4 className="font-bold text-primary-light">Non-Autonomous Clinical Decision Support</h4>
              <p className="text-xs text-primary-light/70 leading-relaxed">
                Operates strictly under supervised human-in-the-loop governance. All algorithmic ratios (De Ritis, Cardiorenal, Atherogenic) provide transparent formulas and physiological brackets so clinicians retain full independent reviewability.
              </p>
            </div>

            {/* 2. Telemedicine Practice Guidelines 2020 */}
            <div className="rounded-2xl border border-tonal-20 bg-surface-20/60 p-5 space-y-2">
              <span className="inline-block rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                MoHFW & NMC Guidelines 2020
              </span>
              <h4 className="font-bold text-primary-light">Telemedicine Practice Guidelines</h4>
              <p className="text-xs text-primary-light/70 leading-relaxed">
                Prescriptions can only be issued by Registered Medical Practitioners (RMPs) with verified registration numbers. Digital prescriptions generated via Aivion Care comply with prescribed formats and Schedule L/O/R medicine protocols.
              </p>
            </div>

            {/* 3. DPDP Act 2023 */}
            <div className="rounded-2xl border border-tonal-20 bg-surface-20/60 p-5 space-y-2">
              <span className="inline-block rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                DPDP Act, 2023
              </span>
              <h4 className="font-bold text-primary-light">Digital Personal Data Protection</h4>
              <p className="text-xs text-primary-light/70 leading-relaxed">
                Personal and digital health data (referral records, reports, vitals) are processed solely upon explicit user consent. Data is stored on secure servers located within the territory of India with end-to-end encryption.
              </p>
            </div>

            {/* 4. Drugs & Cosmetics Act, 1940 */}
            <div className="rounded-2xl border border-tonal-20 bg-surface-20/60 p-5 space-y-2">
              <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                Drugs & Cosmetics Act, 1940
              </span>
              <h4 className="font-bold text-primary-light">Pharmacy & Prescription Fulfillment</h4>
              <p className="text-xs text-primary-light/70 leading-relaxed">
                Aivion Care operates purely as a technology facilitator for prescription transmission. Schedule X and habit-forming drugs are strictly barred from unverified automated order fulfillment without physical RMP validation.
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="space-y-6 pt-4 border-t border-tonal-20">
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary-light">1. No Medical Advice or Emergency Care</h3>
            <p className="text-xs sm:text-sm text-primary-light/70 leading-relaxed">
              Aivion Care is not a medical emergency response provider. If you are experiencing an acute medical emergency (such as severe chest pain, stroke symptoms, acute respiratory distress, or severe trauma), immediately call 112 / 102 or proceed to the nearest emergency department.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary-light">2. Clinician Autonomy and Final Judgment</h3>
            <p className="text-xs sm:text-sm text-primary-light/70 leading-relaxed">
              Registered Medical Practitioners using Aivion Care retain exclusive clinical responsibility for diagnostic conclusions, prescription decisions, and therapeutic pathways. The clinical decision support tools and predictive ratios are reference aids only.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary-light">3. Referral Code Security & Data Access</h3>
            <p className="text-xs sm:text-sm text-primary-light/70 leading-relaxed">
              Referral codes (e.g. REF-XXXX) are confidential access identifiers. Sharing a referral code grants authorized consulting physicians access to historical diagnostic timelines, active prescriptions, and pathology documents for the purpose of continuity of care.
            </p>
          </div>

        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-tonal-20 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-sky-500 hover:underline">
            &larr; Return to Home
          </Link>
          <Link href="/privacy-policy" className="text-xs font-bold text-teal-600 hover:underline">
            View Privacy Policy &rarr;
          </Link>
        </div>

      </main>
    </PageShell>
  );
}
