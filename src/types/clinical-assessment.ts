export interface ClinicalAssessmentRequest {
  symptoms: SymptomRequest[];
  vitals?: VitalsRequest;
  clinicalNotes?: string;
}

export interface SymptomRequest {
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  durationDays?: number;
  durationText?: string;
  onset?: 'SUDDEN' | 'GRADUAL' | 'UNKNOWN';
  frequency?: 'OCCASIONAL' | 'INTERMITTENT' | 'CONSTANT';
  progression?: 'IMPROVING' | 'STABLE' | 'WORSENING';
  notes?: string;
}

export interface VitalsRequest {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spo2?: number;
  bloodGlucose?: number;
  bmi?: number;
  weightKg?: number;
  heightCm?: number;
}

export interface ClinicalAssessmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  status: string;
  modelVersion: string;
  disclaimerVersion: string;
  createdAt: string;
  completedAt?: string;
  symptoms: SymptomResponse[];
  results: ResultResponse[];
  redFlags: RedFlag[];
  disclaimer: string;
  insufficientInformationReason?: string;
  unifiedMlPrediction?: UnifiedMlPrediction;
}

export interface UnifiedMlPrediction {
  modelVersion: string;
  executionTimeMs: number;
  riskPrediction?: {
    overallRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    deteriorationRiskScore: number;
    earlyWarningScore: number;
    vitalAnomalies?: Array<{
      metric: string;
      value: any;
      normalRange: string;
      severity: 'WARNING' | 'CRITICAL';
      message: string;
    }>;
    clinicalRecommendations?: string[];
  };
  drugSafetyPrediction?: {
    recommendedMedications?: Array<{
      genericName: string;
      brandName: string;
      standardDosage: string;
      frequency: string;
      duration: string;
      indication: string;
      confidence: number;
    }>;
    interactionWarnings?: Array<{
      drugA: string;
      drugB: string;
      severity: string;
      clinicalEffect: string;
      actionRecommendation: string;
    }>;
    contraindications?: string[];
    safeToPrescribe: boolean;
  };
  ecgPrediction?: {
    rhythmClassification: string;
    confidence: number;
    heartRateBpm?: number;
    heartRateVariabilityMs?: number;
    qrsDurationStatus?: string;
    qtStatus?: string;
    morphologicalFindings?: string[];
  };
}

export interface SymptomResponse {
  id: number;
  symptomName: string;
  severity: string;
  durationDays?: number;
  durationText?: string;
  onset?: string;
  frequency?: string;
  progression?: string;
  notes?: string;
}

export interface ResultResponse {
  id: number;
  conditionName: string;
  score: number;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  rank: number;
  supportingFactors: string[];
  missingInformation: string[];
  icdCode?: string;
  category?: string;
}

export interface RedFlag {
  type: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  recommendation: string;
}

export interface ClinicalAssessmentHistoryItem {
  id: number;
  createdAt: string;
  status: string;
  modelVersion: string;
  symptomCount: number;
  topCondition?: string;
  topScore?: number;
  topConfidence?: string;
}