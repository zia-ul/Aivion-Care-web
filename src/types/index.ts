export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  hospitalId?: number;
  hospitalName?: string;
  hospitalLoginId?: string;
  doctorId?: number;
  patientId?: number;
  pharmacistId?: number;
  pharmacyId?: number;
  doctorApprovalStatus?: string;
  doctorApproved?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PatientRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  chronicConditions?: string;
  privacyPolicyAccepted: boolean;
}

export interface DoctorRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  speciality: string;
  licenseNumber: string;
  qualification?: string;
  experienceYears?: number;
  consultationFee?: string;
  clinicName?: string;
  hospitalId?: number;
  privacyPolicyAccepted: boolean;
}

export interface HospitalRegisterRequest {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  registrationNumber: string;
  email: string;
  phone: string;
  facilityType?: string;
  headName: string;
  headEmail: string;
  headPhone: string;
  password: string;
}

export interface Hospital {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  registrationNumber: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  status: string;
  subscriptionPlan?: string;
  hospitalLoginId?: string;
  facilityType: string;
  approvedAt?: string;
}

export interface Doctor {
  userId: number;
  fullName: string;
  email: string;
  speciality: string;
  qualification?: string;
  experienceYears?: number;
  licenseNumber: string;
  consultationFee?: string;
  availableDays?: string;
  slotDurationMinutes?: number;
  consultationStartTime?: string;
  consultationEndTime?: string;
  verificationStatus: string;
  hospitalName?: string;
  departmentName?: string;
}

export interface Appointment {
  id: number;
  hospitalId: number;
  hospitalName: string;
  patientId: number;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: number;
  doctorName: string;
  departmentId?: number;
  departmentName?: string;
  appointmentDate: string;
  slotTime: string;
  type: string;
  status: string;
  tokenNumber?: string;
  invoiceNumber?: string;
  notes?: string;
  chatRoomId?: number;
}

export interface Consultation {
  id: number;
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  finalized: boolean;
  finalizedAt?: string;
  prescriptionSent: boolean;
  prescriptionSentAt?: string;
  prescriptionTrackingStatus?: string;
  medicines?: PrescriptionItem[];
  investigations?: InvestigationItem[];
  chiefComplaints?: string;
  pastHistory?: string;
  physicalExamination?: string;
  diagnosisNotes?: string;
  advice?: string;
  allergy?: string;
  vitals?: Vitals;
}

export interface PrescriptionItem {
  id?: number;
  medicineName: string;
  dosage?: string;
  route?: string;
  schedule?: string;
  instruction?: string;
  amountPerUse?: string;
  frequency?: string;
  frequencyPerDay?: string;
  timing?: string;
  durationDays?: number;
  durationText?: string;
  instructions?: string;
  notes?: string;
  sortOrder?: number;
}

export interface InvestigationItem {
  sno?: number;
  investigationName: string;
  priority?: string;
}

export interface Vitals {
  spo2?: string;
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  bodyTemp?: string;
  bmi?: string;
  weightKg?: string;
  heightCm?: string;
  respRate?: number;
  bloodGlucose?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  sentAt: string;
  actionUrl?: string;
}

export interface DoctorAvailability {
  id: number;
  doctorId: number;
  weekday: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  consultationMode: string;
  isActive: boolean;
}

export interface SlotResponse {
  slots: string[];
  error?: string;
  message: string;
}
