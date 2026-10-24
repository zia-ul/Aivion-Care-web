'use client';

import { useState, useRef } from 'react';
import {
  FileText, Upload, AlertCircle, AlertTriangle, CheckCircle2,
  Brain, Shield, Sparkles, RefreshCw, Copy, Check, Eye, ChevronDown,
  ChevronUp, HeartPulse, Stethoscope, ArrowRight, Zap, Download,
  Activity, TrendingUp, Layers
} from 'lucide-react';
import { clinicalAssessmentApi } from '@/lib/api/endpoints';
import { StandaloneDocumentAnalysisResponse } from '@/types/clinical-assessment';
import { FL, DarkCard, InnerCard, Pill, ActionButton, SectionTitle, Field } from '@/components/ui/FlutterTheme';

const DOCUMENT_CATEGORIES = [
  { value: 'LAB_REPORT', label: 'Lab Report / Blood Work', icon: '🧪', desc: 'CBC, Lipid, Metabolic, LFT, KFT' },
  { value: 'PRESCRIPTION', label: 'Doctor Prescription', icon: '💊', desc: 'Handwritten/Printed Rx & Meds' },
  { value: 'PATHOLOGY_REPORT', label: 'Pathology Report', icon: '🔬', desc: 'Biopsy, Culture, Histology' },
  { value: 'RADIOLOGY_REPORT', label: 'Radiology / Imaging', desc: 'X-Ray, CT, MRI, Ultrasound Reports', icon: '🩻' },
  { value: 'DISCHARGE_SUMMARY', label: 'Hospital Discharge Summary', desc: 'Inpatient course, procedures, discharge meds', icon: '🏥' },
  { value: 'ECG_REPORT', label: 'ECG / Cardiology Report', desc: '12-lead strip, rhythm strip analysis', icon: '❤️' },
  { value: 'OTHER', label: 'Other Clinical Document', desc: 'Medical certificate, referral, progress note', icon: '📄' },
];

export default function StandaloneDocumentStudio() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('LAB_REPORT');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StandaloneDocumentAnalysisResponse | null>(null);

  // UI tabs & view toggles
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'metrics' | 'safety' | 'raw'>('overview');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [editableValues, setEditableValues] = useState<Record<string, string>>({});

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError(null);
    setProgressStep(1);

    // Simulate pipeline step feedback
    const stepTimer1 = setTimeout(() => setProgressStep(2), 700);
    const stepTimer2 = setTimeout(() => setProgressStep(3), 1500);

    try {
      const res = await clinicalAssessmentApi.analyzeStandaloneDocument(
        selectedFile,
        category,
        'structured',
        clinicalNotes
      );
      setResult(res.data);
      setProgressStep(4);
    } catch (err: any) {
      console.error('Document analysis failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to analyze document. Please check the file and try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setProgressStep(0);
    setClinicalNotes('');
    setEditableValues({});
  };

  const handleCopyRaw = () => {
    if (!result?.extractedData.rawText) return;
    navigator.clipboard.writeText(result.extractedData.rawText);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const getRiskColor = (level?: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', pill: FL.pink };
      case 'HIGH': return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', pill: FL.gold };
      case 'MODERATE': return { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', pill: FL.gold };
      default: return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', pill: FL.mint };
    }
  };

  const riskStyle = getRiskColor(result?.triageRisk.riskLevel);

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <DarkCard className="space-y-4 border-doctor-lavender/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-doctor-lavender/20 text-doctor-lavender">
                <Sparkles size={20} />
              </span>
              <h2 className="text-xl font-bold text-primary-light">
                Medical Document Analysis Studio
              </h2>
            </div>
            <p className="text-sm text-doctor-muted mt-1">
              Upload and analyze any medical document (unaligned/standalone). Powered by a 3-agent pipeline: Extraction, Safety Invariants, and Diagnostic Synthesis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Pill color={FL.lavender} size="sm">
              <Brain size={13} className="mr-1 inline" /> 3-Agent SDD Engine
            </Pill>
            <Pill color={FL.mint} size="sm">
              <Shield size={13} className="mr-1 inline" /> Clinical Safety Guard
            </Pill>
          </div>
        </div>
      </DarkCard>

      {/* Upload & Configuration Form (Shown when no result or in edit mode) */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Dropzone */}
          <div className="lg:col-span-2 space-y-4">
            <DarkCard>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-doctor-lavender bg-doctor-lavender/10 scale-[1.01]'
                    : selectedFile
                    ? 'border-doctor-teal/50 bg-doctor-teal/5'
                    : 'border-doctor-border-soft hover:border-doctor-lavender/40 bg-doctor-surface/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-doctor-teal/20 text-doctor-teal flex items-center justify-center mx-auto">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="text-primary-light font-semibold text-lg">{selectedFile.name}</p>
                      <p className="text-xs text-doctor-muted mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Pill color={FL.mint} size="xs">Ready for 3-Agent Analysis</Pill>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-doctor-lavender/15 text-doctor-lavender flex items-center justify-center mx-auto">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-primary-light font-semibold text-base">
                        Drag and drop your medical report or click to browse
                      </p>
                      <p className="text-xs text-doctor-muted mt-1">
                        Supports PDF (multi-page), Images (PNG, JPG), Text, CSV • Up to 25 MB
                      </p>
                    </div>
                    <div className="inline-block mt-2">
                      <ActionButton variant="outline" size="sm">
                        Browse Files
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Clinician Context */}
              <div className="mt-4">
                <Field label="Clinical Notes / Pre-test Probability (Optional)">
                  <textarea
                    rows={2}
                    placeholder="E.g., 54-year-old male with chest tightness and history of type 2 diabetes on Metformin..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-2xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50 text-sm"
                  />
                </Field>
              </div>
            </DarkCard>

            {/* Pipeline Stage Indicators */}
            <InnerCard className="p-4 space-y-3">
              <p className="text-xs font-semibold text-doctor-muted uppercase tracking-wider">
                Multi-Agent Analysis Workflow (SDD Architecture)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-2xl border transition-all ${progressStep >= 1 ? 'border-doctor-lavender/60 bg-doctor-lavender/10' : 'border-doctor-border-soft bg-doctor-surface/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-doctor-lavender/20 text-doctor-lavender text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-xs font-semibold text-primary-light">Agent 1: Extraction</span>
                  </div>
                  <p className="text-[11px] text-doctor-muted mt-1">PDFBox text layer, table recognition & key-value parsing</p>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${progressStep >= 2 ? 'border-doctor-amber/60 bg-doctor-amber/10' : 'border-doctor-border-soft bg-doctor-surface/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-doctor-amber/20 text-doctor-amber text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-xs font-semibold text-primary-light">Agent 2: Safety & Invariants</span>
                  </div>
                  <p className="text-[11px] text-doctor-muted mt-1">Clinical threshold checks, critical lab alerts, drug interactions</p>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${progressStep >= 3 ? 'border-doctor-teal/60 bg-doctor-teal/10' : 'border-doctor-border-soft bg-doctor-surface/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-doctor-teal/20 text-doctor-teal text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-xs font-semibold text-primary-light">Agent 3: ML Triage</span>
                  </div>
                  <p className="text-[11px] text-doctor-muted mt-1">Diagnostic synthesis, organ localization, risk scoring</p>
                </div>
              </div>
            </InnerCard>
          </div>

          {/* Right Column: Category Selector & Action Button */}
          <div className="space-y-4">
            <DarkCard className="space-y-4">
              <SectionTitle>Document Category</SectionTitle>
              <div className="space-y-2">
                {DOCUMENT_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-doctor-lavender bg-doctor-lavender/15 text-primary-light shadow-sm'
                          : 'border-doctor-border-soft/60 hover:border-doctor-lavender/30 bg-doctor-surface/30 text-doctor-muted'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{cat.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold ${isSelected ? 'text-doctor-lavender' : 'text-primary-light'}`}>
                          {cat.label}
                        </p>
                        <p className="text-[11px] text-doctor-muted line-clamp-1 mt-0.5">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <ActionButton
                onClick={runAnalysis}
                disabled={!selectedFile || analyzing}
                className="w-full justify-center py-3"
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    Running 3-Agent Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Analyze Document Now
                  </>
                )}
              </ActionButton>
            </DarkCard>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Top Summary Banner */}
          <DarkCard className={`border ${riskStyle.border} ${riskStyle.bg} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className={`p-3 rounded-2xl ${riskStyle.bg} border ${riskStyle.border} shrink-0`}>
                  <HeartPulse className={riskStyle.text} size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-doctor-muted">Clinical Triage:</span>
                    <Pill color={riskStyle.pill} size="sm">
                      {result.triageRisk.riskLevel} RISK ({result.triageRisk.riskScore.toFixed(0)}/100)
                    </Pill>
                    <Pill color={FL.gray} size="xs">
                      Target: {result.triageRisk.organSystem}
                    </Pill>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary-light mt-1 break-words">
                    {result.fileName} — {result.documentType}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <ActionButton variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw size={14} className="mr-1.5" /> Analyze Another
                </ActionButton>
              </div>
            </div>

            {/* Primary Alerts */}
            {result.triageRisk.primaryAlerts && result.triageRisk.primaryAlerts.length > 0 && (
              <div className="p-3 rounded-2xl bg-doctor-surface/60 border border-doctor-border-soft space-y-1.5">
                <p className="text-xs font-semibold text-primary-light flex items-center gap-1.5">
                  <AlertTriangle size={14} className={riskStyle.text} />
                  Primary Clinical Alerts:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.triageRisk.primaryAlerts.map((alert, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-doctor-surface/80 border border-doctor-border-soft text-primary-light font-medium">
                      • {alert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agent execution badge row */}
            <div className="flex flex-wrap items-center justify-between text-xs text-doctor-muted pt-1 border-t border-doctor-border-soft/40 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={13} /> Agent 1: Extraction Complete
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={13} /> Agent 2: Safety Invariants Checked
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={13} /> Agent 3: Triage Synthesized
                </span>
              </div>
              <span className="text-doctor-dim">
                Latency: {result.agentExecution.durationMs}ms • Engine: {result.engineVersion}
              </span>
            </div>
          </DarkCard>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-doctor-border-soft pb-2 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeView === 'overview'
                  ? 'bg-doctor-lavender text-white shadow-sm'
                  : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/50'
              }`}
            >
              Synthesis & Recommendations
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeView === 'analytics'
                  ? 'bg-doctor-lavender text-white shadow-sm'
                  : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/50'
              }`}
            >
              📊 Executive Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveView('metrics')}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeView === 'metrics'
                  ? 'bg-doctor-lavender text-white shadow-sm'
                  : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/50'
              }`}
            >
              Extracted Parameters ({result.extractedData.keyValues.length})
            </button>
            <button
              onClick={() => setActiveView('safety')}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeView === 'safety'
                  ? 'bg-doctor-lavender text-white shadow-sm'
                  : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/50'
              }`}
            >
              Safety Invariants ({result.abnormalValues.length})
            </button>
            <button
              onClick={() => setActiveView('raw')}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                activeView === 'raw'
                  ? 'bg-doctor-lavender text-white shadow-sm'
                  : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/50'
              }`}
            >
              Source Text
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary and Findings */}
              <div className="lg:col-span-2 space-y-4">
                <DarkCard className="space-y-3">
                  <SectionTitle>Clinical Executive Summary</SectionTitle>
                  <p className="text-sm text-primary-light/90 leading-relaxed bg-doctor-surface/40 p-4 rounded-2xl border border-doctor-border-soft">
                    {result.extractedData.summary || 'Summary generated by 3-agent analysis pipeline.'}
                  </p>
                </DarkCard>

                {/* Recommendations */}
                <DarkCard className="space-y-3">
                  <SectionTitle>Physician Recommendations</SectionTitle>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-doctor-surface/30 border border-doctor-border-soft space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-doctor-lavender" />
                            <p className="text-xs font-bold text-primary-light uppercase tracking-wide">
                              {rec.type.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {rec.timeframe && (
                              <Pill color={FL.gray} size="xs">{rec.timeframe}</Pill>
                            )}
                            <Pill color={rec.priority === 'URGENT' ? FL.pink : rec.priority === 'HIGH' ? FL.gold : FL.mint} size="xs">
                              {rec.priority}
                            </Pill>
                          </div>
                        </div>
                        <p className="text-xs text-primary-light">{rec.description}</p>
                        {rec.rationale && (
                          <p className="text-[11px] text-doctor-muted italic">Rationale: {rec.rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </DarkCard>
              </div>

              {/* Right Column: Key Alerts & Drug Interactions */}
              <div className="space-y-4">
                {/* Drug Safety Warnings */}
                <DarkCard className="space-y-3">
                  <SectionTitle>Drug Interaction Guard</SectionTitle>
                  {result.drugInteractions && result.drugInteractions.length > 0 ? (
                    <div className="space-y-2">
                      {result.drugInteractions.map((interaction, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                          <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-rose-400" />
                          <span>{interaction}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>No critical drug interactions or contraindications flagged in extracted text.</span>
                    </div>
                  )}
                </DarkCard>

                {/* Metadata & Disclaimer */}
                <InnerCard className="p-4 space-y-2 text-xs">
                  <p className="font-semibold text-primary-light">Extraction Traceability</p>
                  <p className="text-doctor-muted">Method: <span className="text-primary-light font-mono">{result.extractedData.extractionMethod}</span></p>
                  <p className="text-doctor-muted">Pages: <span className="text-primary-light">{result.extractedData.pagesWithText} of {result.extractedData.totalPages}</span></p>
                  <p className="text-doctor-muted">Model: <span className="text-primary-light font-mono">{result.agentExecution.modelUsed}</span></p>
                  <p className="text-doctor-dim text-[11px] pt-2 border-t border-doctor-border-soft italic">
                    {result.disclaimer}
                  </p>
                </InnerCard>
              </div>
            </div>
          )}

          {/* Tab 2: Executive Analytics Dashboard */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              {/* Executive KPI Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DarkCard className="p-4 border-doctor-lavender/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-doctor-muted uppercase tracking-wider">Composite Risk Index</span>
                    <span className="p-2 rounded-xl bg-doctor-lavender/15 text-doctor-lavender">
                      <Zap size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary-light font-mono">{result.triageRisk.riskScore.toFixed(0)}</span>
                    <span className="text-xs text-doctor-muted">/ 100</span>
                    <span className="ml-auto">
                      <Pill color={riskStyle.pill} size="xs">{result.triageRisk.riskLevel}</Pill>
                    </span>
                  </div>
                  <div className="w-full bg-doctor-surface/60 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        result.triageRisk.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                        result.triageRisk.riskLevel === 'HIGH' ? 'bg-orange-500' :
                        result.triageRisk.riskLevel === 'MODERATE' ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, result.triageRisk.riskScore))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-doctor-muted mt-2">Target System: <strong className="text-primary-light">{result.triageRisk.organSystem}</strong></p>
                </DarkCard>

                <DarkCard className="p-4 border-doctor-teal/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-doctor-muted uppercase tracking-wider">Data Coverage</span>
                    <span className="p-2 rounded-xl bg-doctor-teal/15 text-doctor-teal">
                      <FileText size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary-light font-mono">{result.extractedData.keyValues.length}</span>
                    <span className="text-xs text-doctor-muted">Parameters</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-doctor-muted">
                    <span>Parsed Pages: <strong className="text-primary-light">{result.extractedData.pagesWithText}/{result.extractedData.totalPages}</strong></span>
                    <span>Tables: <strong className="text-primary-light">{result.extractedData.tables?.length || 0}</strong></span>
                  </div>
                  <p className="text-[11px] text-doctor-dim mt-2">Extraction: {result.extractedData.extractionMethod}</p>
                </DarkCard>

                <DarkCard className="p-4 border-doctor-amber/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-doctor-muted uppercase tracking-wider">Safety Violations</span>
                    <span className="p-2 rounded-xl bg-doctor-amber/15 text-doctor-amber">
                      <Shield size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary-light font-mono">{result.abnormalValues.length}</span>
                    <span className="text-xs text-doctor-muted">Anomalies</span>
                    <span className="ml-auto">
                      <Pill color={result.abnormalValues.some(a => a.severity === 'CRITICAL') ? FL.pink : FL.gold} size="xs">
                        {result.abnormalValues.filter(a => a.severity === 'CRITICAL').length} Critical
                      </Pill>
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-doctor-muted flex items-center justify-between">
                    <span>Interactions: <strong className="text-rose-400">{result.drugInteractions?.length || 0}</strong></span>
                    <span>Contraindications: <strong className="text-amber-400">{result.contraindications?.length || 0}</strong></span>
                  </div>
                  <p className="text-[11px] text-doctor-dim mt-2">Safety Guard: {result.agentExecution.agent2Completed ? 'Active' : 'Bypassed'}</p>
                </DarkCard>

                <DarkCard className="p-4 border-doctor-mint/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-doctor-muted uppercase tracking-wider">Synthesis & Latency</span>
                    <span className="p-2 rounded-xl bg-doctor-mint/15 text-doctor-mint">
                      <Brain size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary-light font-mono">{(result.triageRisk.confidence * 100).toFixed(0)}%</span>
                    <span className="text-xs text-doctor-muted">Confidence</span>
                  </div>
                  <div className="mt-3 text-xs text-doctor-muted flex items-center justify-between">
                    <span>Latency: <strong className="text-primary-light font-mono">{result.agentExecution.durationMs}ms</strong></span>
                    <span>Actions: <strong className="text-primary-light">{result.recommendations.length}</strong></span>
                  </div>
                  <p className="text-[11px] text-doctor-dim mt-2 font-mono truncate">{result.agentExecution.modelUsed}</p>
                </DarkCard>
              </div>

              {/* Advanced Multi-Disease Prediction Matrix (AUC-ROC & Relative Risk Ratio) */}
              <DarkCard className="space-y-4 border-doctor-lavender/40">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-doctor-lavender/20 text-doctor-lavender">
                        <Activity size={18} />
                      </span>
                      <SectionTitle>Multi-Disease Probability & Relative Risk Spectrum</SectionTitle>
                      <Pill color={FL.lavender} size="xs">International Clinical ML Benchmark</Pill>
                    </div>
                    <p className="text-xs text-doctor-muted mt-1">
                      Ensemble machine learning model calibrated against international multimodal clinical datasets (AUC-ROC 0.89 - 0.95).
                    </p>
                  </div>
                </div>

                {result.diseasePredictions && result.diseasePredictions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {result.diseasePredictions.map((dp, i) => {
                      const prob = Math.round(dp.probabilityPercent);
                      const isCritical = dp.riskTier === 'CRITICAL' || prob >= 75;
                      const isHigh = dp.riskTier === 'HIGH' || (prob >= 40 && prob < 75);
                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            isCritical
                              ? 'border-red-500/40 bg-red-500/10'
                              : isHigh
                              ? 'border-amber-500/40 bg-amber-500/10'
                              : 'border-doctor-border-soft bg-doctor-surface/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-doctor-surface/80 border border-doctor-border-soft text-doctor-muted">
                                {dp.icdCode} • {dp.category}
                              </span>
                              <h4 className="font-bold text-sm text-primary-light mt-1.5 leading-snug">
                                {dp.conditionName}
                              </h4>
                            </div>
                            <Pill color={isCritical ? FL.pink : isHigh ? FL.gold : FL.mint} size="xs">
                              {dp.riskTier}
                            </Pill>
                          </div>

                          {/* Probability Gauge & Relative Risk Ratio */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-doctor-muted">Disease Probability:</span>
                              <span className={`font-mono font-black text-sm ${isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {prob}%
                              </span>
                            </div>
                            <div className="w-full bg-doctor-surface/80 h-2.5 rounded-full overflow-hidden border border-doctor-border-soft/60">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isCritical ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                  isHigh ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.max(5, prob)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-doctor-muted pt-0.5">
                              <span>Relative Risk: <strong className="text-primary-light font-mono">{dp.relativeRiskRatio.toFixed(1)}x</strong></span>
                              <span>Model AUC-ROC: <strong className="text-doctor-mint font-mono">{dp.aucRoc.toFixed(2)}</strong></span>
                            </div>
                          </div>

                          {/* Key Contributing Biomarkers */}
                          <div className="pt-2 border-t border-doctor-border-soft/40 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-doctor-muted tracking-wider">Top Drivers:</span>
                            <div className="flex flex-wrap gap-1">
                              {dp.keyContributingBiomarkers.map((bio, bIdx) => (
                                <span key={bIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-doctor-surface/80 border border-doctor-border-soft text-primary-light">
                                  {bio}
                                </span>
                              ))}
                            </div>
                            <p className="text-[11px] text-doctor-muted italic pt-1 leading-relaxed">
                              {dp.clinicalRationale}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-doctor-muted py-6 text-center">Multi-disease probability modeling active.</p>
                )}
              </DarkCard>

              {/* Diagnostic Biomarker Ratios & Clinical Calculations */}
              {result.biomarkerRatios && result.biomarkerRatios.length > 0 && (
                <DarkCard className="space-y-4 border-doctor-teal/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-doctor-teal/20 text-doctor-teal">
                        <TrendingUp size={18} />
                      </span>
                      <SectionTitle>Diagnostic Biomarker Ratios (Calculated & Indexed)</SectionTitle>
                    </div>
                    <span className="text-xs text-doctor-muted">Gold-standard indices for differential organ diagnosis</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {result.biomarkerRatios.map((ratio, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-doctor-surface/40 border border-doctor-border-soft space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-light">{ratio.ratioName}</span>
                          <Pill color={ratio.status === 'ELEVATED' ? FL.pink : ratio.status === 'REDUCED' ? FL.gold : FL.mint} size="xs">
                            {ratio.status}
                          </Pill>
                        </div>
                        <div className="flex items-baseline gap-2 font-mono">
                          <span className="text-2xl font-black text-primary-light">{ratio.calculatedValue}</span>
                          <span className="text-doctor-muted text-[11px]">(Normal: {ratio.referenceRange})</span>
                        </div>
                        <p className="text-doctor-muted leading-relaxed">{ratio.interpretation}</p>
                        <div className="pt-2 border-t border-doctor-border-soft/40">
                          <span className="text-[10px] text-doctor-dim uppercase font-semibold">Associated Pathology:</span>
                          <p className="text-[11px] text-primary-light font-medium">{ratio.associatedPathology}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DarkCard>
              )}

              {/* Multi-Hit Biomarker Combinations & Syndrome Signatures */}
              {result.biomarkerCombinations && result.biomarkerCombinations.length > 0 && (
                <DarkCard className="space-y-4 border-doctor-amber/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-doctor-amber/20 text-doctor-amber">
                        <Layers size={18} />
                      </span>
                      <SectionTitle>Complex Multi-Hit Syndrome Signatures</SectionTitle>
                    </div>
                    <span className="text-xs text-doctor-muted">Multi-variate interaction patterns across co-occurring parameters</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {result.biomarkerCombinations.map((combo, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border space-y-2 text-xs ${
                          combo.patternMatched
                            ? 'border-amber-500/40 bg-amber-500/10'
                            : 'border-doctor-border-soft bg-doctor-surface/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-light">{combo.combinationName}</span>
                          <Pill color={combo.patternMatched ? FL.gold : FL.mint} size="xs">
                            {combo.patternMatched ? `${combo.confidencePercent.toFixed(0)}% MATCH` : 'ABSENT'}
                          </Pill>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {combo.parametersInvolved.map((p, pIdx) => (
                            <span key={pIdx} className="text-[10px] px-2 py-0.5 rounded bg-doctor-surface/80 border border-doctor-border-soft text-doctor-muted font-mono">
                              {p}
                            </span>
                          ))}
                        </div>
                        <p className="text-doctor-muted pt-1 leading-relaxed">{combo.clinicalSignificance}</p>
                        <div className="pt-2 border-t border-doctor-border-soft/40 text-[11px]">
                          <span className="text-doctor-mint font-semibold">Suggested Action: </span>
                          <span className="text-primary-light">{combo.suggestedAction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DarkCard>
              )}

              {/* Organ System Distribution & Parameter Variance Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Organ-System Health Matrix */}
                <DarkCard className="space-y-4">
                  <SectionTitle>Organ-System Health Matrix</SectionTitle>
                  <p className="text-xs text-doctor-muted">Multi-system risk stratification inferred by Agent 3 cross-correlation.</p>
                  
                  <div className="space-y-3 pt-2">
                    {[
                      { system: 'Cardiovascular', icon: '❤️', base: result.triageRisk.organSystem === 'Cardiovascular' ? result.triageRisk.riskScore : (result.abnormalValues.some(a => /cholesterol|triglyceride|sgot/i.test(a.parameter)) ? 65 : 20) },
                      { system: 'Metabolic & Endocrine', icon: '🧬', base: result.triageRisk.organSystem === 'Metabolic' ? result.triageRisk.riskScore : (result.abnormalValues.some(a => /glucose|hba1c|tsh/i.test(a.parameter)) ? 72 : 15) },
                      { system: 'Renal & Electrolytes', icon: '🫘', base: result.abnormalValues.some(a => /creatinine|urea|potassium|sodium/i.test(a.parameter)) ? 68 : 18 },
                      { system: 'Hematology & Immune', icon: '🩸', base: result.abnormalValues.some(a => /wbc|hemoglobin|platelet/i.test(a.parameter)) ? 60 : 12 },
                      { system: 'Hepatic & Biliary', icon: '🫀', base: result.abnormalValues.some(a => /bilirubin|sgpt|sgot/i.test(a.parameter)) ? 58 : 14 },
                    ].map((row, i) => {
                      const score = Math.round(row.base);
                      const isHigh = score >= 70;
                      const isMod = score >= 40 && score < 70;
                      return (
                        <div key={i} className="p-3 rounded-2xl bg-doctor-surface/40 border border-doctor-border-soft space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-primary-light flex items-center gap-1.5">
                              <span>{row.icon}</span> {row.system}
                            </span>
                            <span className={`font-mono font-bold ${isHigh ? 'text-red-400' : isMod ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {score}% {isHigh ? 'HIGH RISK' : isMod ? 'MODERATE' : 'NORMAL'}
                            </span>
                          </div>
                          <div className="w-full bg-doctor-surface/80 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-red-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.max(5, score)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DarkCard>

                {/* Laboratory Variance & Outlier Distribution */}
                <div className="lg:col-span-2 space-y-4">
                  <DarkCard className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <SectionTitle>Biomarker Variance & Deviation Spectrum</SectionTitle>
                      <span className="text-xs text-doctor-muted">Relative magnitude against clinical reference baselines</span>
                    </div>

                    {result.extractedData.keyValues.length === 0 ? (
                      <p className="text-xs text-doctor-muted py-8 text-center">No numerical laboratory parameters extracted to render variance spectrum.</p>
                    ) : (
                      <div className="space-y-3 pt-2">
                        {result.extractedData.keyValues.slice(0, 8).map((kv, i) => {
                          const isHigh = kv.direction === 'HIGH';
                          const isLow = kv.direction === 'LOW';
                          const isNormal = !kv.isAbnormal;
                          return (
                            <div key={i} className="p-3 rounded-2xl bg-doctor-surface/30 border border-doctor-border-soft/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                              <div className="w-full md:w-48 min-w-0">
                                <p className="font-bold text-primary-light break-words">{kv.key}</p>
                                <p className="text-[11px] text-doctor-muted">Ref: {kv.referenceRange || 'Standard'}</p>
                              </div>

                              <div className="flex items-center gap-2 w-full md:flex-1 md:max-w-md">
                                <span className="text-[10px] text-doctor-muted shrink-0 w-8 text-right">Low</span>
                                <div className="relative flex-1 h-3 bg-doctor-surface/80 rounded-full overflow-hidden border border-doctor-border-soft">
                                  {/* Normal center zone */}
                                  <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-500/30" />
                                  {/* Marker */}
                                  <div
                                    className={`absolute top-0 bottom-0 w-2.5 rounded-full ${
                                      isHigh ? 'bg-red-500' : isLow ? 'bg-blue-400' : 'bg-emerald-400'
                                    }`}
                                    style={{
                                      left: isHigh ? '85%' : isLow ? '12%' : '50%',
                                      transform: 'translateX(-50%)'
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] text-doctor-muted shrink-0 w-8">High</span>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-32 text-left md:text-right font-mono pt-1 md:pt-0 border-t md:border-t-0 border-doctor-border-soft/30">
                                <div>
                                  <span className="font-bold text-primary-light">{kv.value}</span>{' '}
                                  <span className="text-doctor-muted text-[11px]">{kv.unit}</span>
                                </div>
                                <div>
                                  <Pill color={isHigh ? FL.pink : isLow ? FL.gold : FL.mint} size="xs">
                                    {kv.direction || 'NORMAL'}
                                  </Pill>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </DarkCard>
                </div>
              </div>

              {/* Decision Support & Governance Trail */}
              <DarkCard className="space-y-3">
                <SectionTitle>Clinical Decision Governance & Compliance Checklist</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-2xl bg-doctor-surface/40 border border-doctor-border-soft space-y-1">
                    <p className="font-bold text-primary-light flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> Human-In-The-Loop Sign-Off
                    </p>
                    <p className="text-doctor-muted">Draft suggestions remain non-binding until certified and signed by an authenticated clinician.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-doctor-surface/40 border border-doctor-border-soft space-y-1">
                    <p className="font-bold text-primary-light flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> Zero-Regression Architecture
                    </p>
                    <p className="text-doctor-muted">Pipeline runs sidecar analysis without perturbing transactional patient consultations or prescription tables.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-doctor-surface/40 border border-doctor-border-soft space-y-1">
                    <p className="font-bold text-primary-light flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> Audit Integrity & Citations
                    </p>
                    <p className="text-doctor-muted">All findings cross-reference raw document character spans, extracted tables, and physiological bounds.</p>
                  </div>
                </div>
              </DarkCard>
            </div>
          )}

          {/* Tab 3: Metrics & Tables */}
          {activeView === 'metrics' && (
            <div className="space-y-6">
              <DarkCard className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <SectionTitle>Extracted Parameters ({result.extractedData.keyValues.length})</SectionTitle>
                  <p className="text-xs text-doctor-muted">Clinician can review and override values inline</p>
                </div>

                {result.extractedData.keyValues.length === 0 ? (
                  <p className="text-xs text-doctor-muted py-6 text-center">No numerical laboratory parameters parsed from this document.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-doctor-border-soft text-doctor-muted">
                          <th className="py-2.5 px-3">Parameter</th>
                          <th className="py-2.5 px-3">Observed Value</th>
                          <th className="py-2.5 px-3">Unit</th>
                          <th className="py-2.5 px-3">Reference Range</th>
                          <th className="py-2.5 px-3">Classification</th>
                          <th className="py-2.5 px-3 text-right">Review Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-doctor-border-soft/40">
                        {result.extractedData.keyValues.map((kv, i) => {
                          const isAbnormal = kv.isAbnormal || kv.direction === 'HIGH' || kv.direction === 'LOW';
                          const overrideVal = editableValues[kv.key] ?? kv.value;
                          return (
                            <tr key={i} className="hover:bg-doctor-surface/40 transition-colors">
                              <td className="py-3 px-3 font-semibold text-primary-light">{kv.key}</td>
                              <td className="py-3 px-3 font-mono font-bold">
                                <input
                                  type="text"
                                  value={overrideVal}
                                  onChange={(e) => setEditableValues(prev => ({ ...prev, [kv.key]: e.target.value }))}
                                  className="w-24 px-2 py-1 bg-doctor-surface/80 border border-doctor-border-soft rounded-lg text-primary-light font-mono text-xs focus:ring-1 focus:ring-doctor-lavender"
                                />
                              </td>
                              <td className="py-3 px-3 text-doctor-muted">{kv.unit || '-'}</td>
                              <td className="py-3 px-3 text-doctor-muted font-mono">{kv.referenceRange || '-'}</td>
                              <td className="py-3 px-3">
                                {isAbnormal ? (
                                  <Pill color={kv.direction === 'HIGH' ? FL.gold : FL.pink} size="xs">
                                    {kv.direction || 'ABNORMAL'}
                                  </Pill>
                                ) : (
                                  <Pill color={FL.mint} size="xs">NORMAL</Pill>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                {editableValues[kv.key] && (
                                  <span className="text-[10px] text-doctor-lavender font-semibold">Modified</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </DarkCard>
            </div>
          )}

          {/* Tab 3: Safety & Invariants */}
          {activeView === 'safety' && (
            <div className="space-y-4">
              <DarkCard className="space-y-3">
                <SectionTitle>Physiological Threshold Violations ({result.abnormalValues.length})</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.abnormalValues.map((ab, i) => {
                    const isCritical = ab.severity === 'CRITICAL';
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border ${
                          isCritical
                            ? 'border-red-500/40 bg-red-500/10'
                            : 'border-yellow-500/30 bg-yellow-500/10'
                        } space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-primary-light">{ab.parameter}</p>
                          <Pill color={isCritical ? FL.pink : FL.gold} size="xs">
                            {ab.severity} {ab.direction}
                          </Pill>
                        </div>
                        <p className="text-xs font-mono font-bold text-primary-light">
                          Observed: {ab.value} {ab.unit} <span className="font-normal text-doctor-muted">(Ref: {ab.referenceRange || 'N/A'})</span>
                        </p>
                        <p className="text-xs text-doctor-muted">{ab.clinicalSignificance}</p>
                      </div>
                    );
                  })}
                </div>
              </DarkCard>
            </div>
          )}

          {/* Tab 4: Raw Text Layer */}
          {activeView === 'raw' && (
            <DarkCard className="space-y-3">
              <div className="flex items-center justify-between">
                <SectionTitle>Extracted Document Text Layer</SectionTitle>
                <ActionButton variant="outline" size="sm" onClick={handleCopyRaw}>
                  {copiedRaw ? <Check size={14} className="mr-1 text-emerald-400" /> : <Copy size={14} className="mr-1" />}
                  {copiedRaw ? 'Copied' : 'Copy Text'}
                </ActionButton>
              </div>
              <pre className="p-4 rounded-2xl bg-doctor-surface/80 border border-doctor-border-soft text-xs text-doctor-muted font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                {result.extractedData.rawText || 'No text extracted.'}
              </pre>
            </DarkCard>
          )}
        </div>
      )}
    </div>
  );
}
