export interface ClinicalAssessmentRequest {
  symptoms: SymptomRequest[];
  vitals?: VitalsRequest;
  clinicalNotes?: string;
  documentIds?: number[];
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

export interface StandaloneDocumentAnalysisResponse {
  analysisId: string;
  fileName: string;
  documentType: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  engineVersion: string;
  analyzedAt: string;
  disclaimer: string;
  extractedData: {
    summary: string;
    rawText: string;
    keyValues: Array<{
      key: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      isAbnormal?: boolean;
      direction?: 'HIGH' | 'LOW' | 'NORMAL';
    }>;
    tables: Array<{
      tableName?: string;
      headers: string[];
      rows: string[][];
    }>;
    extractionMethod: string;
    totalPages: number;
    pagesWithText: number;
    extractionWarnings: string[];
  };
  abnormalValues: Array<{
    parameter: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    direction?: string;
    severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    clinicalSignificance: string;
  }>;
  findings: Array<{
    code: string;
    codeSystem: string;
    description: string;
    category?: string;
    severity?: string;
    evidence?: string;
  }>;
  contraindications: string[];
  drugInteractions: string[];
  triageRisk: {
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    riskScore: number;
    confidence: number;
    organSystem: string;
    primaryAlerts: string[];
  };
  diseasePredictions?: Array<{
    conditionName: string;
    icdCode: string;
    category: string;
    probabilityPercent: number;
    relativeRiskRatio: number;
    aucRoc: number;
    riskTier: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    keyContributingBiomarkers: string[];
    clinicalRationale: string;
  }>;
  biomarkerRatios?: Array<{
    ratioName: string;
    calculatedValue: string;
    referenceRange: string;
    interpretation: string;
    status: 'ELEVATED' | 'OPTIMAL' | 'REDUCED';
    associatedPathology: string;
  }>;
  biomarkerCombinations?: Array<{
    combinationName: string;
    parametersInvolved: string[];
    patternMatched: boolean;
    confidencePercent: number;
    clinicalSignificance: string;
    suggestedAction: string;
  }>;
  recommendations: Array<{
    type: string;
    description: string;
    priority: 'URGENT' | 'HIGH' | 'ROUTINE';
    rationale?: string;
    timeframe?: string;
  }>;
  agentExecution: {
    agent1Completed: boolean;
    agent1Status: string;
    agent2Completed: boolean;
    agent2Status: string;
    agent3Completed: boolean;
    agent3Status: string;
    durationMs: number;
    modelUsed: string;
  };
}