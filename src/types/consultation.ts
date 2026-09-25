/**
 * Consultation & Prescription Types
 * Matches backend DTOs in:
 * - backend/src/main/java/com/medicore/dto/consultation/
 * - backend/src/main/java/com/medicore/dto/ai/
 */

// --- Constants (shared) ---
export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'High' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'LOW', label: 'Low' },
] as const;

export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Thrice daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Weekly',
] as const;

export const TIMING_OPTIONS = [
  'Before breakfast',
  'After breakfast',
  'Before lunch',
  'After lunch',
  'Before dinner',
  'After dinner',
  'At bedtime',
  'With food',
  'Empty stomach',
] as const;

export const ROUTE_OPTIONS = [
  'Oral',
  'Sublingual',
  'Topical',
  'Inhalation',
  'Injection',
  'Rectal',
  'Ophthalmic',
  'Otic',
  'Nasal',
] as const;

// --- Vitals ---
export interface VitalData {
  label: string;
  value: string;
  unit: string;
}

export interface VitalsUpdateRequest {
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spo2?: number;
  bodyTemp?: number;
  weightKg?: number;
  bmi?: number;
  respRate?: number;
  bloodGlucose?: number;
}

export interface VitalsResponse {
  weightKg?: number;
  bmi?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  spo2?: number;
  bodyTemp?: number;
  respRate?: number;
  bloodGlucose?: number;
}

// --- Investigations ---
export interface InvestigationItem {
  sno: number;
  investigationName: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface InvestigationItemRequest {
  sno: number;
  investigationName: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
}

// --- Patient Data ---
export interface PatientData {
  name: string;
  age: string;
  sex: string;
  maxId: string;
  doctor: string;
  department: string;
  location: string;
  dateTime: string;
  invoiceNo: string;
  referredBy: string;
  speciality: string;
  callInfo: string;
}

// --- Medicine Row (for display) ---
export interface MedicineRow {
  sno: number;
  name: string;
  dosage: string;
  schedule: string;
  instruction: string;
  route: string;
  duration: string;
}

// --- Medications ---
export interface ConsultationAiMedicationResponse {
  aiSuggestionId?: number;
  medicineName: string;
  dosage: string;
  amountPerUse: string;
  frequency: string;
  frequencyPerDay: string;
  timing: string;
  duration: string;
  durationDays?: number;
  instructions: string;
  notes: string;
  conditionKeyword?: string;
}

export interface MedicationDetail {
  medicineName: string;
  dosage: string;
  amountPerUse: string;
  frequency: string;
  frequencyPerDay: string;
  timing: string;
  duration: string;
  durationDays?: number;
  instructions: string;
  notes: string;
  route?: string;
  aiSuggestionId?: number;
}

export interface MedicineRow {
  sno: number;
  name: string;
  dosage: string;
  schedule: string;
  instruction: string;
  route: string;
  duration: string;
}

// --- AI Suggestions ---
export interface ConsultationMedicationSuggestionResponse {
  aiSuggestionId: number;
  medicineName: string;
  dosage: string;
  amountPerUse: string;
  frequency: string;
  frequencyPerDay: string;
  timing: string;
  duration: string;
  durationDays?: number;
  instructions: string;
  notes: string;
  conditionKeyword: string;
  route?: string;
}

export interface ConsultationMedicationSuggestionGroupResponse {
  conditionKeyword: string;
  suggestions: ConsultationMedicationSuggestionResponse[];
}

// --- AI Draft ---
export interface ConsultationAiDraftResponse {
  transcript: string;
  transcriptSummary: string;
  symptoms: string;
  diagnosis: string;
  severity: string;
  lifestyleAdvice: string;
  followUp: string;
  clinicalNotes: string;
  allergy: string;
  pastHistory: string;
  physicalExamination: string;
  advice: string;
  patientMaxId: string;
  patientLocation: string;
  referredBy: string;
  speciality: string;
  medications: ConsultationAiMedicationResponse[];
  vitals: VitalsResponse;
  investigations: InvestigationItem[];
}

// --- Review ---
export interface ConsultationReviewResponse {
  appointmentId: number;
  consultationId?: number;
  draft: ConsultationAiDraftResponse | null;
  transcript: string;
  transcriptSummary: string;
  summaryProvider: string;
  recordingUrl?: string;
  liveTranscriptAvailable: boolean;
  analysisPending: boolean;
  medicationSuggestions: ConsultationMedicationSuggestionGroupResponse[];
  patientHistory: Array<{ pastHistory: string }>;
  finalized: boolean;
}

// --- Full Consultation ---
export interface ConsultationResponse {
  id: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  doctorName: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  departmentName: string;
  speciality: string;
  patientMaxId: string;
  patientLocation: string;
  referredBy: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail: string;
  hospitalRegNumber: string;
  hospitalLogoUrl: string;
  doctorQualification: string;
  doctorSpecialization: string;
  doctorPhone: string;
  doctorAddress: string;
  doctorRegNumber: string;
  doctorStampUrl: string;
  doctorSignatureUrl: string;
  doctorLogoUrl: string;
  chiefComplaints: string;
  pastHistory: string;
  physicalExamination: string;
  diagnosisNotes: string;
  investigationAdvised: string;
  clinicalNotes: string;
  advice: string;
  allergy: string;
  severity: string;
  lifestyleAdvice: string;
  followUp: string;
  finalized: boolean;
  prescriptionSent: boolean;
  finalizedAt?: string;
  createdAt: string;
  updatedAt: string;
  invoiceNumber: string;
  consultationDate: string;
  appointmentType?: string;
  symptoms?: string;
  diagnosis?: string;
  // Vitals (flat for backward compatibility with existing page)
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spo2?: number;
  bodyTemp?: number;
  weightKg?: number;
  bmi?: number;
  respRate?: number;
  bloodGlucose?: number;
  investigations: InvestigationItem[];
  medicines: Array<{
    medicineName: string;
    dosage: string;
    amountPerUse: string;
    frequency: string;
    frequencyPerDay: string;
    timing: string;
    duration: string;
    durationDays?: number;
    instructions: string;
    notes: string;
    route?: string;
    schedule?: string;
  }>;
  aiDraft?: ConsultationAiDraftResponse;
}

// --- Prescription ---
export interface DoctorPrescriptionResponse {
  patientName: string;
  patientAge: string;
  patientGender: string;
  diagnosis: string;
  transcript: string;
  date: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    frequencyPerDay: string;
    timing: string;
    duration: string;
    durationDays?: number;
    instructions: string;
    route: string;
    schedule: string;
  }>;
  doctorName: string;
  doctorQualification: string;
  doctorSpecialization: string;
  doctorPhone: string;
  doctorAddress: string;
  doctorRegNumber: string;
  doctorStampUrl: string;
  doctorSignatureUrl: string;
  doctorLogoUrl: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail: string;
  hospitalRegNumber: string;
  hospitalLogoUrl: string;
}

// --- Requests ---
export interface FinalizePrescriptionRequest {
  diagnosis: string;
  symptoms: string;
  chiefComplaints: string;
  pastHistory: string;
  physicalExamination: string;
  severity: string;
  lifestyleAdvice: string;
  followUp: string;
  transcriptSummary: string;
  doctorNotes: string;
  medications: Array<{
    medicineName: string;
    dosage: string;
    amountPerUse: string;
    frequency: string;
    frequencyPerDay: string;
    timing: string;
    duration: string;
    durationDays?: number;
    instructions: string;
    notes: string;
    route?: string;
  }>;
  maxId: string;
  location: string;
  referredBy: string;
  speciality: string;
  advice: string;
  allergy: string;
  invoiceNumber: string;
  consultationDate: string;
  vitals: VitalsUpdateRequest;
  investigations: InvestigationItemRequest[];
}

export interface UploadRecordingRequest {
  file: File;
}

export interface CompleteRecordingRequest {
  recordingUrl: string;
  autoTranscribe: boolean;
}

export interface UpdateLiveTranscriptRequest {
  transcriptText: string;
  isFinal: boolean;
  source: string;
  locale: string;
}

export interface GenerateAiNotesRequest {
  transcript: string;
}

export interface SharePrescriptionRequest {
  pharmacyId: number;
  notes: string;
}