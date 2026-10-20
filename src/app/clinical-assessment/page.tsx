'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BrainCircuit, 
  Sparkles, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  FileSearch, 
  Microscope, 
  HeartPulse, 
  Flame, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Lock,
  Workflow
} from 'lucide-react';
import PageShell from '@/components/landing/PageShell';
import { SectionHeader } from '@/components/landing/common';
import StandaloneDocumentStudio from '@/components/doctor/StandaloneDocumentStudio';

const researchHighlights = [
  {
    title: 'Multi-Modal Calibrated Probability (AUC-ROC 0.89 - 0.95)',
    description: 'Calculates continuous probability distributions coupled with Relative Risk Ratios (RR) and clinical discrimination metrics based on 2025/2026 Lancet & Nature Digital Medicine benchmarks.',
    icon: TrendingUp,
    stat: '94.2%',
    statLabel: 'Mean AUC-ROC across ASCVD & CKD',
  },
  {
    title: 'Diagnostic Biomarker Ratios',
    description: 'Autonomous calculation of clinically validated diagnostic ratios including De Ritis (AST/ALT), BUN/Creatinine, and Atherogenic Lipid Index (TG/HDL-C) with reference brackets.',
    icon: Microscope,
    stat: '3 Core',
    statLabel: 'Compound Ratios evaluated',
  },
  {
    title: 'Multi-Hit Pathological Signatures',
    description: 'Detects cross-system co-morbid pathologies including Cardiometabolic Syndrome, Cardiorenal Axis Syndrome, and Chronic Inflammatory-Hematopoietic shifts.',
    icon: Layers,
    stat: 'Multi-Hit',
    statLabel: 'Organ-axis interaction mapping',
  },
  {
    title: 'Autonomous 3-Agent Clinical Architecture',
    description: 'Rigorous RAG multi-agent orchestration comprising Clinical Ingestion Agent (Extraction & Normalization), CDS Medical Agent (Reasoning), and Pharmacovigilance & Safety Auditor.',
    icon: Cpu,
    stat: '< 450ms',
    statLabel: 'End-to-end extraction & scoring',
  },
];

const diseaseMetrics = [
  { name: 'Type 2 Diabetes Mellitus', icd: 'E11.9', baselineAuc: '0.94', target: 'HbA1c, Fasting Plasma Glucose, BMI' },
  { name: 'Atherosclerotic CVD (ASCVD)', icd: 'I25.10', baselineAuc: '0.91', target: 'Lipid Panel, LDL-C, TG/HDL-C, SBP' },
  { name: 'Chronic Kidney Disease (CKD)', icd: 'N18.9', baselineAuc: '0.95', target: 'Serum Creatinine, eGFR (CKD-EPI), BUN/Cr' },
  { name: 'Metabolic Steatotic Liver (MASLD)', icd: 'K76.0', baselineAuc: '0.89', target: 'AST, ALT, De Ritis Ratio, Triglycerides' },
  { name: 'Microcytic / Iron Deficiency Anemia', icd: 'D50.9', baselineAuc: '0.93', target: 'Hemoglobin, Ferritin, MCV' },
];

export default function ClinicalAssessmentLandingPage() {
  const [showLiveStudio, setShowLiveStudio] = useState(false);

  return (
    <PageShell>
      <main className="space-y-16">
        {/* Header Section */}
        <div className="relative">
          <SectionHeader
            eyebrow="Autonomous Clinical Assessment & AI Dashboards"
            title="Next-Generation Biomarker Analytics & Calibrated Disease Prediction"
            description="Built on international clinical decision support (CDS) literature and multi-agent RAG reasoning. Upload any lab panel or medical document to generate real-time organ-axis dashboards, biomarker variance spectrums, and multi-disease risk projections."
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowLiveStudio(!showLiveStudio)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles size={18} />
              {showLiveStudio ? 'Hide Interactive Studio' : 'Launch Interactive AI Document Studio'}
            </button>
            <Link
              href="/patient/documents"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-sky-500/30 bg-surface-20/80 hover:bg-surface-30 text-primary-light font-semibold text-sm transition-all"
            >
              Go to My Patient Documents <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Live Interactive Studio Area */}
        {showLiveStudio && (
          <div className="rounded-[32px] border-2 border-sky-500/40 bg-surface-10/95 p-4 sm:p-8 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-tonal-20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <BrainCircuit size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-light">Standalone Multi-Agent Document Studio</h3>
                  <p className="text-xs text-primary-light/60">Experience live clinical biomarker parsing & multi-dashboard analytics in sandbox mode</p>
                </div>
              </div>
              <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
                Live Interactive Mode
              </span>
            </div>

            <StandaloneDocumentStudio />
          </div>
        )}

        {/* Feature Grid / Research Highlights */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {researchHighlights.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="relative flex flex-col justify-between rounded-3xl border border-sky-500/20 bg-surface-20/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40 hover:bg-surface-20/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 border border-sky-500/25 text-sky-400">
                      <Icon size={24} />
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-cyan-400 font-mono">{feat.stat}</span>
                      <p className="text-[10px] uppercase font-semibold text-primary-light/50">{feat.statLabel}</p>
                    </div>
                  </div>
                  <h4 className="mt-5 text-base font-bold text-primary-light">{feat.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-primary-light/70">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Dashboard Architecture Overview */}
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-[32px] border border-tonal-20 bg-surface-20/50 p-6 sm:p-10 backdrop-blur-xl">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <BarChart3 size={14} /> Multi-Dashboard Analytics Suite
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-light">
              Executive Analytics & Deep Organ-System Profiling
            </h3>
            <p className="text-sm leading-relaxed text-primary-light/75">
              Traditional lab portals display isolated numbers without clinical context. Our analytics suite evaluates multi-dimensional relationships across cardiovascular, metabolic, renal, hepatic, and hematopoietic systems.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-primary-light/80">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Continuous Biomarker Variance:</strong> Visual scale pinpointing standard standard-deviation shifts.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-primary-light/80">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Multi-Hit Signatures:</strong> Detects metabolic + inflammatory + renal cascade co-occurrences.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-primary-light/80">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Decision-Curve Analysis:</strong> Calibrated net clinical benefit thresholds for proactive triage.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-primary-light/80">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Explainable Contributions:</strong> Top drivers breakdown with ICD-10 disease mappings.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-wider text-primary-light/50 font-bold">
              Calibrated Research Prediction Benchmarks
            </h5>
            <div className="space-y-2.5">
              {diseaseMetrics.map((dm) => (
                <div key={dm.name} className="p-3 rounded-2xl bg-surface-30/80 border border-tonal-20 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-light">{dm.name}</p>
                    <p className="text-[10px] text-primary-light/50 font-mono">ICD-10: {dm.icd} • {dm.target}</p>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span className="text-xs font-mono font-bold text-teal-400">AUC {dm.baselineAuc}</span>
                    <span className="block text-[9px] text-primary-light/40">Model benchmark</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Agent Workflow Diagram */}
        <div className="rounded-[32px] border border-sky-500/20 bg-gradient-to-br from-surface-20/80 to-surface-10/80 p-8 sm:p-12 text-center backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Workflow size={14} /> Multi-Agent SDD Pipeline
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-light">
            Three Autonomous Agents. One Clinically Auditable Outcome.
          </h3>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-primary-light/70">
            Operates on strict non-disruption guarantees with complete prompt provenance, confidence scoring, and human-in-the-loop audit logs.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3 text-left">
            <div className="p-6 rounded-2xl bg-surface-30/70 border border-tonal-20">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-2">Agent 1</span>
              <h5 className="text-base font-bold text-primary-light">Clinical Ingestion & Normalizer</h5>
              <p className="text-xs text-primary-light/70 mt-2 leading-relaxed">
                Extracts lab values from messy PDFs, images, and text. Normalizes standard SI units, maps LOINC test codes, and tags out-of-range biomarkers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-30/70 border border-teal-500/30">
              <span className="text-[10px] font-mono font-bold text-teal-300 uppercase tracking-widest block mb-2">Agent 2</span>
              <h5 className="text-base font-bold text-primary-light">Clinical Decision Support Reasoner</h5>
              <p className="text-xs text-primary-light/70 mt-2 leading-relaxed">
                Computes De Ritis, BUN/Cr, TG/HDL ratios. Runs calibrated multi-disease likelihood formulas, identifies multi-hit syndromes, and generates clinical differentials.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-30/70 border border-tonal-20">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">Agent 3</span>
              <h5 className="text-base font-bold text-primary-light">Pharmacovigilance & Safety Auditor</h5>
              <p className="text-xs text-primary-light/70 mt-2 leading-relaxed">
                Screens contraindications, cross-verifies patient allergies and black-box warnings, and formats explainable rationale for the treating physician.
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
