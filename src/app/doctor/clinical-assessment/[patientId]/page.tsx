'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, Stethoscope, AlertTriangle, Info, 
  RefreshCw, Download, ChevronLeft, ChevronRight,
  Clock, FileText, Plus, History, Shield,
  ChevronUp, ChevronDown
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { clinicalAssessmentApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { 
  FL, DarkCard, InnerCard, Pill, ActionButton, SectionTitle,
  Field, FormField, LoadingState
} from '@/components/ui/FlutterTheme';
import { SymptomInputSection, SymptomInput } from '@/components/doctor/SymptomInputSection';
import { VitalsInputSection, VitalsInput } from '@/components/doctor/VitalsInputSection';
import { PatientClinicalContext } from '@/components/doctor/PatientClinicalContext';
import { AssessmentResultsDisplay } from '@/components/doctor/AssessmentResultsDisplay';
import type { 
  ClinicalAssessmentRequest, 
  ClinicalAssessmentResponse,
  ClinicalAssessmentHistoryItem 
} from '@/types/clinical-assessment';

interface PatientInfo {
  id: number;
  name: string;
  age?: number;
  sex?: string;
  bloodGroup?: string;
  bmi?: number;
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  chronicConditions?: string;
  patientCode?: string;
}

interface ExistingClinicalData {
  medications?: string[];
  previousDiagnoses?: string[];
  recentVitals?: {
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    spo2?: number;
    bloodGlucose?: number;
    measuredAt?: string;
  };
  recentConsultations?: Array<{
    id: number;
    date: string;
    chiefComplaints?: string;
    diagnosisNotes?: string;
  }>;
  clinicalNotes?: Array<{
    id: number;
    date: string;
    suggestedDiagnosis?: string;
    chiefComplaints?: string;
  }>;
}

const INITIAL_SYMPTOMS: SymptomInput[] = [];
const INITIAL_VITALS: VitalsInput = {};

const INITIAL_CLINICAL_DATA: ExistingClinicalData = {
  medications: [],
  previousDiagnoses: [],
  recentVitals: {},
  recentConsultations: [],
  clinicalNotes: [],
};

export default function ClinicalAssessmentPage({ 
  params }: { params: Promise<{ patientId: string }> } 
) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [patientId, setPatientId] = useState<number>(0);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [existingData, setExistingData] = useState<ExistingClinicalData>(INITIAL_CLINICAL_DATA);
  const [symptoms, setSymptoms] = useState<SymptomInput[]>(INITIAL_SYMPTOMS);
  const [vitals, setVitals] = useState<VitalsInput>(INITIAL_VITALS);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [assessment, setAssessment] = useState<ClinicalAssessmentResponse | null>(null);
  const [history, setHistory] = useState<ClinicalAssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    medicalHistory: false,
    medications: false,
    diagnoses: false,
    vitals: true,
    consultations: true,
    clinicalNotes: true,
  });

  const handleToggleSection = useCallback((section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  useEffect(() => {
    params.then(p => {
      const id = parseInt(p.patientId, 10);
      setPatientId(id);
      loadPatientData(id);
      loadHistory(id);
    });
  }, []);

  const loadPatientData = async (id: number) => {
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll use mock data or fetch from existing patient endpoints
      const response = await fetch(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        // Mock existing clinical data - in reality this would come from the backend
        setExistingData({
          medications: ['Metformin 500mg', 'Amlodipine 5mg'],
          previousDiagnoses: ['Type 2 Diabetes', 'Hypertension'],
          recentVitals: {
            temperature: 37.2,
            heartRate: 78,
            respiratoryRate: 16,
            bpSystolic: 132,
            bpDiastolic: 84,
            spo2: 98,
            bloodGlucose: 145,
            measuredAt: new Date().toISOString(),
          },
          recentConsultations: [
            { id: 1, date: '2026-09-15', chiefComplaints: 'Follow-up diabetes', diagnosisNotes: 'HbA1c 7.2%' },
            { id: 2, date: '2026-08-20', chiefComplaints: 'Hypertension check', diagnosisNotes: 'BP controlled' },
          ],
          clinicalNotes: [
            { id: 1, date: '2026-09-15', suggestedDiagnosis: 'Diabetes follow-up', chiefComplaints: 'Routine check' },
          ],
        });
      }
    } catch (e) {
      console.error('Failed to load patient data:', e);
    }
  };

  const loadHistory = async (id: number) => {
    setLoadingHistory(true);
    try {
      const res = await clinicalAssessmentApi.getHistory(id);
      const data = res.data || [];
      setHistory(data.map((a: any) => ({
        id: a.id,
        createdAt: a.createdAt,
        status: a.status,
        modelVersion: a.modelVersion,
        symptomCount: a.symptoms?.length || 0,
        topCondition: a.results?.[0]?.conditionName,
        topScore: a.results?.[0]?.score,
        topConfidence: a.results?.[0]?.confidence,
      })));
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRunAssessment = async () => {
    if (symptoms.length === 0 && Object.values(vitals).every(v => v === undefined)) {
      setError('Please add at least one symptom or vital sign');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: ClinicalAssessmentRequest = {
        symptoms: symptoms.map(s => ({
          name: s.name,
          severity: s.severity,
          durationDays: s.durationDays,
          durationText: s.durationText,
          onset: s.onset,
          frequency: s.frequency,
          progression: s.progression,
          notes: s.notes,
        })),
        vitals: Object.keys(vitals).some(k => vitals[k as keyof VitalsInput] !== undefined) ? vitals : undefined,
        clinicalNotes: clinicalNotes || undefined,
      };

      const response = await clinicalAssessmentApi.create(patientId, request);
      setAssessment(response.data);
      // Refresh history
      loadHistory(patientId);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Assessment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!assessment) return;
    const blob = new Blob([JSON.stringify(assessment, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-assessment-${assessment.patientId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewHistory = (item: ClinicalAssessmentHistoryItem) => {
    // Navigate to history detail or show modal
    console.log('View history:', item);
  };

  if (!patient) {
    return (
      <AppLayout role="DOCTOR" title="Clinical Assessment" subtitle="Loading patient...">
        <LoadingState message="Loading patient information..." />
      </AppLayout>
    );
  }

  const canAssess = symptoms.length > 0 || Object.values(vitals).some(v => v !== undefined);

  return (
    <AppLayout 
      role="DOCTOR" 
      title="AI Clinical Assessment" 
      subtitle={`Patient: ${patient.name} • ${patient.age ? `${patient.age}y ${patient.sex || ''}` : ''}`}
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {error && (
          <div className="rounded-2xl bg-doctor-pink/10 border border-doctor-pink/30 p-4 flex items-start gap-3">
            <AlertTriangle className="text-doctor-pink mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-primary-light font-medium">Assessment Error</p>
              <p className="text-sm text-doctor-muted mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-doctor-muted hover:text-primary-light">
              <ChevronLeft size={20} />
            </button>
          </div>
        )}

        {/* Patient Context - Auto-loaded */}
        <PatientClinicalContext
          patient={patient}
          existingData={existingData}
          collapsed={collapsedSections}
          onToggleSection={handleToggleSection}
        />

        {/* Symptom Input */}
        <SymptomInputSection
          symptoms={symptoms}
          onChange={setSymptoms}
          disabled={loading}
          patientContext={{
            age: patient.age,
            sex: patient.sex,
            chronicConditions: patient.chronicConditions?.split(/[,;]/).map(s => s.trim()).filter(Boolean),
          }}
        />

        {/* Vitals Input */}
        <VitalsInputSection
          vitals={vitals}
          onChange={setVitals}
          existingVitals={existingData.recentVitals}
          disabled={loading}
        />

        {/* Clinical Notes */}
        <DarkCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-primary-light font-semibold text-lg">Additional Clinical Information</h3>
            <Pill color={FL.lavender} size="xs">Optional</Pill>
          </div>
          <FormField label="Clinical Notes / Observations">
            <textarea
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              placeholder="Enter any additional clinical observations, physical examination findings, relevant test results, or imaging findings..."
              rows={4}
              className="w-full px-4 py-3 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-2xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50 disabled:opacity-50"
              disabled={loading}
            />
          </FormField>
        </DarkCard>

        {/* Run Assessment Button */}
        <div className="flex gap-3">
          <ActionButton
            size="lg"
            onClick={handleRunAssessment}
            disabled={loading || !canAssess}
            className="flex-1"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-primary-light border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Clinical Information...
              </>
            ) : (
              <>
                <Brain size={18} className="mr-2" />
                Run AI Assessment
              </>
            )}
          </ActionButton>
          {assessment && (
            <ActionButton variant="outline" onClick={handleExport} size="lg">
              <Download size={16} className="mr-1" />
              Export
            </ActionButton>
          )}
        </div>

        {/* Assessment Results */}
        {assessment && (
          <AssessmentResultsDisplay
            results={assessment.results}
            redFlags={assessment.redFlags}
            symptoms={assessment.symptoms}
            disclaimer={assessment.disclaimer}
            modelVersion={assessment.modelVersion}
            status={assessment.status}
            insufficientInformationReason={assessment.insufficientInformationReason}
            unifiedMlPrediction={assessment.unifiedMlPrediction}
            onExport={handleExport}
            loading={false}
          />
        )}

        {/* Assessment History */}
        <div className="flex items-center justify-between">
          <SectionTitle action={
            <ActionButton variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showHistory ? 'Hide' : 'Show'} History
            </ActionButton>
          }>
            Assessment History
          </SectionTitle>
        </div>

        {showHistory && (
          <DarkCard>
            {loadingHistory ? (
              <LoadingState message="Loading history..." />
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-doctor-muted">
                <History className="mx-auto text-doctor-dim" size={32} />
                <p className="mt-2 text-sm">No previous assessments for this patient.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <InnerCard key={item.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-doctor-lavender/15 flex items-center justify-center">
                        <Brain className="text-doctor-lavender" size={18} />
                      </div>
                      <div>
                        <p className="text-primary-light font-medium">
                          {item.topCondition || 'Assessment completed'}
                        </p>
                        <p className="text-xs text-doctor-muted">
                          {new Date(item.createdAt).toLocaleString()} • {item.symptomCount} symptoms • v{item.modelVersion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.topScore !== undefined && (
                        <div className="text-right">
                          <p className="text-primary-light font-bold">{item.topScore}%</p>
                          <p className="text-xs text-doctor-muted">{item.topConfidence} Confidence</p>
                        </div>
                      )}
                      <ActionButton variant="ghost" size="sm" onClick={() => handleViewHistory(item)}>
                        View
                      </ActionButton>
                    </div>
                  </InnerCard>
                ))}
              </div>
            )}
          </DarkCard>
        )}

        {/* Disclaimer */}
        <div className="rounded-2xl bg-doctor-surface/30 border border-doctor-border-soft/30 p-4 text-center">
          <p className="text-xs text-doctor-muted">
            <Shield className="inline mr-1" size={10} />
            This AI-assisted clinical assessment is for decision support only and is not a definitive diagnosis.
            The AI Matching Score represents the model&apos;s estimated match based on available information and should not be
            interpreted as a confirmed diagnosis or absolute probability. Final clinical decisions must be made by a qualified
            healthcare professional.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}