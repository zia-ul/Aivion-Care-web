'use client';

import { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, AlertTriangle, Info, 
  Shield, CheckCircle, Clock, FileText, 
  Search, Filter, Download
} from 'lucide-react';
import { FL, DarkCard, InnerCard, Pill, ActionButton } from '@/components/ui/FlutterTheme';
import type { ResultResponse, RedFlag, SymptomResponse, UnifiedMlPrediction } from '@/types/clinical-assessment';

interface AssessmentResultsProps {
  results: ResultResponse[];
  redFlags: RedFlag[];
  symptoms: SymptomResponse[];
  disclaimer: string;
  modelVersion: string;
  status: string;
  insufficientInformationReason?: string;
  unifiedMlPrediction?: UnifiedMlPrediction;
  onExport?: () => void;
  loading?: boolean;
}

const CONFIDENCE_COLORS = {
  HIGH: FL.mint,
  MODERATE: FL.gold,
  LOW: FL.pink,
};

const RED_FLAG_SEVERITY_COLORS = {
  CRITICAL: FL.pink,
  HIGH: FL.pink,
  MODERATE: FL.gold,
};

const CATEGORY_ICONS: Record<string, string> = {
  Respiratory: '🫁',
  Cardiac: '❤️',
  Infectious: '🦠',
  Gastrointestinal: '🍽️',
  Neurological: '🧠',
  Endocrine: '🧬',
  Dermatological: '🩹',
};

function ConfidenceBadge({ confidence }: { confidence: 'HIGH' | 'MODERATE' | 'LOW' }) {
  return (
    <Pill color={CONFIDENCE_COLORS[confidence]} size="sm">
      {confidence} Confidence
    </Pill>
  );
}

function ScoreCircle({ score, confidence }: { score: number; confidence: string }) {
  const color = CONFIDENCE_COLORS[confidence as keyof typeof CONFIDENCE_COLORS] || FL.gray;
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-14 h-14 transform -rotate-90">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-doctor-surface/30"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-primary-light font-bold text-lg">{score}%</span>
    </div>
  );
}

function ResultCard({
  result,
  index,
  isExpanded,
  onToggle,
}: {
  result: ResultResponse;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}) {
  const categoryIcon = CATEGORY_ICONS[result.category || ''] || '🏥';

  return (
    <div className="rounded-2xl border border-doctor-border-soft/50 overflow-hidden transition-all">
      <button
        onClick={() => onToggle(index)}
        className="w-full p-4 flex items-center gap-4 hover:bg-doctor-surface/30 transition-colors text-left"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-doctor-surface/30 rounded-xl text-xl">
          {categoryIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-primary-light font-semibold truncate">{result.conditionName}</h4>
            {result.icdCode && (
              <span className="text-xs text-doctor-muted bg-doctor-surface/30 px-2 py-0.5 rounded-full">
                {result.icdCode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <ConfidenceBadge confidence={result.confidence} />
            {result.category && (
              <span className="text-xs text-doctor-muted px-2 py-0.5 bg-doctor-surface/30 rounded-full">
                {result.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ScoreCircle score={result.score} confidence={result.confidence} />
          <div className="w-6 h-6 flex items-center justify-center text-doctor-muted">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-doctor-border-soft/30 p-4 space-y-4 bg-doctor-surface/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-doctor-muted text-xs uppercase tracking-wider mb-2">Supporting Factors</h5>
              <ul className="space-y-1">
                {result.supportingFactors.length > 0 ? (
                  result.supportingFactors.map((factor, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-primary-light">
                      <CheckCircle className={`text-xs ${CONFIDENCE_COLORS[result.confidence]}`} size={14} />
                      {factor}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-doctor-muted">No specific supporting factors identified</li>
                )}
              </ul>
            </div>
            <div>
              <h5 className="text-doctor-muted text-xs uppercase tracking-wider mb-2">Missing Information</h5>
              <ul className="space-y-1">
                {result.missingInformation.length > 0 ? (
                  result.missingInformation.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-doctor-gold">
                      <Clock className="text-xs" size={14} />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-doctor-muted">No critical missing information</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RedFlagBanner({ redFlags }: { redFlags: RedFlag[] }) {
  if (redFlags.length === 0) return null;

  const hasCritical = redFlags.some(f => f.severity === 'CRITICAL');

  return (
    <div className={`rounded-2xl p-4 border-2 ${hasCritical ? 'border-doctor-pink/50 bg-doctor-pink/10' : 'border-doctor-gold/50 bg-doctor-gold/10'}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${hasCritical ? 'bg-doctor-pink/20 text-doctor-pink' : 'bg-doctor-gold/20 text-doctor-gold'}`}>
          <AlertTriangle size={22} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${hasCritical ? 'text-doctor-pink' : 'text-doctor-gold'}`}>
            {hasCritical ? '⚠️ Potential Clinical Red Flag(s) Detected' : '⚠️ Clinical Attention Recommended'}
          </h4>
          <p className="text-sm text-doctor-muted mt-1">
            {hasCritical 
              ? 'The entered information may indicate a potentially urgent condition. The clinician should evaluate the patient promptly.'
              : 'Review the flagged items below for clinical consideration.'}
          </p>
          <div className="mt-3 space-y-2">
            {redFlags.map((flag, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-doctor-surface/30 rounded-xl">
                <span className={`text-xs px-2 py-0.5 rounded-full ${RED_FLAG_SEVERITY_COLORS[flag.severity as keyof typeof RED_FLAG_SEVERITY_COLORS]}/20 text-${RED_FLAG_SEVERITY_COLORS[flag.severity as keyof typeof RED_FLAG_SEVERITY_COLORS]}`}>
                  {flag.severity}
                </span>
                <span className="text-sm text-primary-light font-medium">{flag.type}</span>
                <span className="text-sm text-doctor-muted flex-1">{flag.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssessmentResultsDisplay({
  results,
  redFlags,
  symptoms,
  disclaimer,
  modelVersion,
  status,
  insufficientInformationReason,
  unifiedMlPrediction,
  onExport,
  loading = false,
}: AssessmentResultsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <DarkCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-doctor-lavender border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-primary-light font-medium">Analyzing clinical information...</p>
            <p className="text-sm text-doctor-muted">Processing symptoms, vitals, and patient history</p>
          </div>
        </div>
      </DarkCard>
    );
  }

  if (status === 'insufficient_information') {
    return (
      <DarkCard className="space-y-4 border-doctor-gold/30 bg-doctor-gold/5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-doctor-gold/20 text-doctor-gold flex items-center justify-center">
            <Info size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-doctor-gold">Insufficient Clinical Information</h4>
            <p className="text-sm text-doctor-muted mt-1">
              {insufficientInformationReason || 'The current information is not sufficient to generate a reliable assessment.'}
            </p>
            <div className="mt-3 p-3 bg-doctor-surface/30 rounded-xl">
              <p className="text-xs text-doctor-muted font-medium mb-2">Consider adding:</p>
              <ul className="text-xs text-doctor-muted space-y-1 list-disc list-inside">
                <li>Symptom duration and progression</li>
                <li>Vital signs (temperature, heart rate, SpO₂, blood pressure)</li>
                <li>Relevant physical examination findings</li>
                <li>Recent laboratory or imaging results</li>
              </ul>
            </div>
          </div>
        </div>
      </DarkCard>
    );
  }

  if (results.length === 0) {
    return (
      <DarkCard className="space-y-4">
        <div className="text-center py-8 text-doctor-muted">
          <FileText className="mx-auto text-doctor-dim" size={32} />
          <p className="mt-2 text-sm">No matching conditions found with the current information.</p>
          <p className="text-xs text-doctor-dim mt-1">Try adding more symptoms or clinical details.</p>
        </div>
      </DarkCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Unified ML Patient Deterioration Risk & Early Warning Score */}
      {unifiedMlPrediction?.riskPrediction && (
        <DarkCard className="space-y-3 border-doctor-blue/30 bg-doctor-surface/40">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h4 className="font-bold text-primary-light text-sm">Patient Deterioration Risk & Early Warning ML</h4>
                <Pill
                  color={
                    unifiedMlPrediction.riskPrediction.overallRiskLevel === 'CRITICAL' ? FL.pink :
                    unifiedMlPrediction.riskPrediction.overallRiskLevel === 'HIGH' ? FL.coral :
                    unifiedMlPrediction.riskPrediction.overallRiskLevel === 'MODERATE' ? FL.gold : FL.mint
                  }
                  size="xs"
                >
                  {unifiedMlPrediction.riskPrediction.overallRiskLevel} RISK
                </Pill>
              </div>
              <p className="text-xs text-doctor-muted mt-0.5">
                NEWS2 Score: <strong className="text-primary-light">{unifiedMlPrediction.riskPrediction.earlyWarningScore}</strong> • Deterioration Probability: <strong className="text-primary-light">{unifiedMlPrediction.riskPrediction.deteriorationRiskScore}%</strong>
              </p>
            </div>
            <Pill color={FL.blue} size="xs">ML Engine: {unifiedMlPrediction.modelVersion}</Pill>
          </div>

          {/* Vital Anomalies */}
          {unifiedMlPrediction.riskPrediction.vitalAnomalies && unifiedMlPrediction.riskPrediction.vitalAnomalies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {unifiedMlPrediction.riskPrediction.vitalAnomalies.map((anom, i) => (
                <div key={i} className="p-2 rounded-xl bg-doctor-surface/60 border border-doctor-border-soft/40 text-xs flex items-start gap-2">
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${anom.severity === 'CRITICAL' ? 'bg-danger/20 text-danger-light' : 'bg-warning/20 text-warning-light'}`}>
                    {anom.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary-light">{anom.metric}: <span className="font-bold">{String(anom.value)}</span> (Normal: {anom.normalRange})</p>
                    <p className="text-doctor-muted mt-0.5 text-[11px]">{anom.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clinical Action Recommendations */}
          {unifiedMlPrediction.riskPrediction.clinicalRecommendations && (
            <div className="text-xs text-doctor-muted pt-1 border-t border-doctor-border-soft/20">
              {unifiedMlPrediction.riskPrediction.clinicalRecommendations.map((rec, i) => (
                <p key={i} className="flex items-center gap-1.5 py-0.5">
                  <span className="text-doctor-mint">✓</span> {rec}
                </p>
              ))}
            </div>
          )}
        </DarkCard>
      )}

      {/* 2. Drug Safety & Drug-Drug Interaction Warnings */}
      {unifiedMlPrediction?.drugSafetyPrediction && (
        <DarkCard className="space-y-3 border-doctor-mint/30 bg-doctor-surface/40">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💊</span>
              <h4 className="font-bold text-primary-light text-sm">Pharmacovigilance & Drug Safety ML</h4>
              <Pill color={unifiedMlPrediction.drugSafetyPrediction.safeToPrescribe ? FL.mint : FL.pink} size="xs">
                {unifiedMlPrediction.drugSafetyPrediction.safeToPrescribe ? 'SAFE TO PRESCRIBE' : 'CAUTION ADVISED'}
              </Pill>
            </div>
          </div>

          {/* Interaction Warnings */}
          {unifiedMlPrediction.drugSafetyPrediction.interactionWarnings && unifiedMlPrediction.drugSafetyPrediction.interactionWarnings.length > 0 && (
            <div className="space-y-1.5">
              {unifiedMlPrediction.drugSafetyPrediction.interactionWarnings.map((w, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-danger/10 border border-danger/30 text-xs">
                  <p className="font-bold text-danger-light">⚠️ [{w.severity}] {w.drugA.toUpperCase()} + {w.drugB.toUpperCase()}</p>
                  <p className="text-primary-light/80 mt-0.5">{w.clinicalEffect}</p>
                  <p className="text-doctor-muted mt-0.5 font-medium">Recommendation: {w.actionRecommendation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Medications with confidence */}
          {unifiedMlPrediction.drugSafetyPrediction.recommendedMedications && unifiedMlPrediction.drugSafetyPrediction.recommendedMedications.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-doctor-muted mb-1.5">Evidence-Based Treatment Recommendations:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {unifiedMlPrediction.drugSafetyPrediction.recommendedMedications.map((med, i) => (
                  <div key={i} className="p-2 rounded-xl bg-doctor-surface/50 border border-doctor-border-soft/40 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-light">{med.genericName} ({med.brandName})</span>
                      <span className="text-[10px] text-doctor-mint font-semibold">{Math.round(med.confidence * 100)}% match</span>
                    </div>
                    <p className="text-doctor-muted text-[11px] mt-0.5">{med.standardDosage} • {med.frequency} • {med.duration}</p>
                    <p className="text-doctor-dim text-[10px] mt-0.5 italic">{med.indication}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DarkCard>
      )}

      {/* 3. ECG Arrhythmia & Cardiac Rhythm ML */}
      {unifiedMlPrediction?.ecgPrediction && (
        <DarkCard className="space-y-2 border-doctor-pink/30 bg-doctor-surface/40">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">❤️</span>
              <h4 className="font-bold text-primary-light text-sm">ECG Rhythm & Arrhythmia Classification ML</h4>
              <Pill color={FL.pink} size="xs">{unifiedMlPrediction.ecgPrediction.rhythmClassification.replace(/_/g, ' ')}</Pill>
            </div>
            <span className="text-xs text-doctor-muted font-medium">
              Confidence: {Math.round(unifiedMlPrediction.ecgPrediction.confidence * 100)}%
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-doctor-muted pt-1">
            <span>HR: <strong className="text-primary-light">{unifiedMlPrediction.ecgPrediction.heartRateBpm ?? '—'} bpm</strong></span>
            <span>HRV: <strong className="text-primary-light">{unifiedMlPrediction.ecgPrediction.heartRateVariabilityMs ?? '—'} ms</strong></span>
            <span>QRS: <strong className="text-primary-light">{unifiedMlPrediction.ecgPrediction.qrsDurationStatus ?? 'NORMAL'}</strong></span>
            <span>QT: <strong className="text-primary-light">{unifiedMlPrediction.ecgPrediction.qtStatus ?? 'NORMAL'}</strong></span>
          </div>
        </DarkCard>
      )}

      <RedFlagBanner redFlags={redFlags} />

      <DarkCard className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-primary-light font-semibold text-lg">AI-Assisted Clinical Assessment</h3>
            <p className="text-xs text-doctor-muted">
              Based on {symptoms.length} symptom(s) and available clinical data
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <ActionButton variant="outline" size="sm" onClick={onExport}>
                <Download size={14} className="mr-1" />
                Export
              </ActionButton>
            )}
            <Pill color={FL.lavender} size="xs">
              Model: {modelVersion}
            </Pill>
          </div>
        </div>

        <div className="space-y-3">
          {results.slice(0, 5).map((result, index) => (
            <ResultCard
              key={result.id}
              result={result}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={setExpandedIndex}
            />
          ))}
        </div>

{results.length > 5 && (
          <div className="text-center pt-2">
            <p className="text-xs text-doctor-muted">
              Showing top 5 of {results.length} conditions
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-doctor-border-soft/30">
          <p className="text-xs text-doctor-muted text-center">
            <Shield className="inline mr-1" size={10} />
            {disclaimer}
          </p>
        </div>
      </DarkCard>
    </div>
  );
}
