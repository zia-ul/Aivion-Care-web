import apiClient from './client';
import {
  SubscriptionPlan,
  Subscription,
  RazorpayOrderResponse,
  PaymentVerifyRequest,
  PaymentRecord,
  CommissionRecord,
  AdminSubscriptionDashboard,
  UpdateDoctorAppointmentAccessRequest,
  FreeSubscriptionRequestResponse,
  CreateFreeSubscriptionRequest,
  ReviewFreeSubscriptionRequest,
  PaginatedResponse,
} from '@/types/subscription';
import {
  ConsultationResponse,
  ConsultationReviewResponse,
  ConsultationAiDraftResponse,
  VitalsUpdateRequest,
  InvestigationItemRequest,
} from '@/types/consultation';
import {
  PharmacyDiscoveryResponse,
  PharmacyOrderResponse,
  MedicineResponse,
  InventoryBatchResponse,
  PharmacyEstimateResponse,
  PharmacyEstimateRequest,
  PharmacyEstimateItemRequest,
  PharmacyOrderCreateRequest,
  PharmacyOrderItemRequest,
  PharmacyOrderStatusUpdateRequest,
  PharmacyOrderPaymentUpdateRequest,
  EstimateDecisionRequest,
  OrderConfirmRequest,
  PickupReadyRequest,
  PickupCompleteRequest,
  DeliveryDispatchRequest,
  DeliveryCompleteRequest,
  InventoryBatchRequest,
  PrescriptionShareRequest,
  PrescriptionShareResponse,
  MedicineScanLookupResponse,
  InventoryReservationResponse,
  PharmacyApprovalSummary,
  PharmacistApprovalSummary,
} from '@/types/pharmacy';
import {
  PathologyLabDiscoveryResponse,
  PathologyWorkflowResponse,
  PathologyRequestCreateRequest,
  PathologyBookingRequest,
  PathologyQuotationRequest,
  PathologyStatusUpdateRequest,
  PathologyPaymentUpdateRequest,
  PathologyReportShareRequest,
  PathologyReportDraftRequest,
  PathologyDashboardStatsResponse,
  PathologyApprovalSummary,
} from '@/types/pathology';
import {
  ClinicalAssessmentRequest,
  ClinicalAssessmentResponse,
  StandaloneDocumentAnalysisResponse,
} from '@/types/clinical-assessment';
import {
  PatientDocumentResponse,
  PatientDocumentUploadRequest,
  PatientDocumentFolderResponse,
  PatientDocumentFolderRequest,
  DocumentReminderDTO,
  DocumentStatsResponse,
} from '@/types/patient-documents';

export const authApi = {
  login: (data: { loginId: string; password: string }) =>
    apiClient.post('/api/v1/auth/login', data),
  refreshToken: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/refresh-token', { refreshToken }),
  logout: (refreshToken?: string) =>
    apiClient.post('/api/v1/auth/logout', refreshToken ? { refreshToken } : {}),
  registerPatient: (data: any) => apiClient.post('/api/v1/auth/register-patient', data),
  registerDoctor: (data: any) => apiClient.post('/api/v1/auth/register-doctor', data),
  registerHospital: (data: any) => apiClient.post('/api/v1/auth/register-hospital', data),
  registerPharmacist: (data: any) => apiClient.post('/api/v1/auth/register-pharmacist', data),
  registerPathology: (data: any) => apiClient.post('/api/v1/auth/register-pathology', data),
  getMyProfile: () => apiClient.get('/api/v1/auth/me'),
  getHospitals: () => apiClient.get('/api/v1/auth/hospitals'),
  deleteProfile: () => apiClient.delete('/api/v1/auth/me'),
  // Zero-Cost Multi-Channel OTP Verification
  sendOtp: (data: { identifier: string; channel?: 'EMAIL' | 'MOBILE' }) =>
    apiClient.post('/api/v1/auth/verification/send-otp', data),
  verifyOtp: (data: { identifier: string; otp: string }) =>
    apiClient.post('/api/v1/auth/verification/verify-otp', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/api/v1/auth/change-password', data),
};

export const appointmentApi = {
  getMyAppointments: () => apiClient.get('/api/v1/appointments/my-appointments'),
  getDoctorToday: () => apiClient.get('/api/v1/appointments/doctor/today'),
  getDoctorWeek: () => apiClient.get('/api/v1/appointments/doctor/week'),
  getDoctorStats: (doctorId: number) => apiClient.get(`/api/v1/doctors/${doctorId}/dashboard-stats`),
  getDoctorAppointments: (doctorId: number, filter: string = 'week') =>
    apiClient.get(`/api/v1/doctors/${doctorId}/appointments`, { params: { filter } }),
  selfBook: (data: any) => apiClient.post('/api/v1/appointments/self-book', data),
  updateStatus: (id: number, data: any) => apiClient.patch(`/api/v1/appointments/${id}/status`, data),
  getInvoice: (id: number) => apiClient.get(`/api/v1/appointments/${id}/invoice`),
};

export const doctorApi = {
  search: (params?: { hospitalId?: number; speciality?: string }) =>
    apiClient.get('/api/v1/doctors', { params }),
  get: (id: number) => apiClient.get(`/api/v1/doctors/${id}`),
  getMyProfile: () => apiClient.get('/api/v1/doctors/me/profile'),
  updateMyProfile: (data: any) => apiClient.put('/api/v1/doctors/me/profile', data),
  submitForApproval: () => apiClient.post('/api/v1/doctors/me/profile/submit', {}),
  getApprovalStatus: () => apiClient.get('/api/v1/doctors/me/approval-status'),
  uploadVerificationDocument: (documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/doctors/me/profile/documents/${documentType}`, formData);
  },
  getDashboardStats: (id: number) => apiClient.get(`/api/v1/doctors/${id}/dashboard-stats`),
  getVitalsDashboard: (id: number, mode: string = 'AVERAGE') =>
    apiClient.get(`/api/v1/doctors/${id}/vitals-dashboard`, { params: { mode } }),
  getAppointments: (id: number, filter: string = 'week') =>
    apiClient.get(`/api/v1/doctors/${id}/appointments`, { params: { filter } }),
  getAvailability: (id: number) => apiClient.get(`/api/v1/doctors/${id}/availability/schedules`),
  createAvailability: (id: number, data: any) => apiClient.post(`/api/v1/doctors/${id}/availability`, data),
  updateAvailability: (doctorId: number, availabilityId: number, data: any) =>
    apiClient.put(`/api/v1/doctors/${doctorId}/availability/${availabilityId}`, data),
  deleteAvailability: (doctorId: number, availabilityId: number) =>
    apiClient.delete(`/api/v1/doctors/${doctorId}/availability/${availabilityId}`),
  getSlots: (doctorId: number, date: string) =>
    apiClient.get(`/api/v1/doctors/${doctorId}/slots`, { params: { date } }),
  getMyPatients: () => apiClient.get('/api/v1/doctors/my-patients'),
  getPatientDetails: (patientId: number) => apiClient.get(`/api/v1/doctors/patients/${patientId}`),
  listForApproval: (status?: string) =>
    apiClient.get('/api/v1/super-admin/doctors/verification', { params: status ? { status } : {} }),
  getProfileForAdmin: (doctorId: number) =>
    apiClient.get(`/api/v1/super-admin/doctors/verification/${doctorId}`),
  reviewProfile: (doctorId: number, data: any) =>
    apiClient.patch(`/api/v1/super-admin/doctors/verification/${doctorId}`, data),
  approveDoctor: (doctorId: number) =>
    apiClient.patch(`/api/v1/super-admin/doctors/verification/${doctorId}`, { action: 'APPROVE' }),
  rejectDoctor: (doctorId: number, reason: string) =>
    apiClient.patch(`/api/v1/super-admin/doctors/verification/${doctorId}`, { action: 'REJECT', reason }),
  requestResubmission: (doctorId: number, data: any) =>
    apiClient.patch(`/api/v1/super-admin/doctors/verification/${doctorId}`, { action: 'RESUBMIT', ...data }),
  getHolidays: (doctorId: number) =>
    apiClient.get(`/api/v1/doctors/${doctorId}/holidays`),
  createHoliday: (doctorId: number, data: any) =>
    apiClient.post(`/api/v1/doctors/${doctorId}/holidays`, data),
  deleteHoliday: (doctorId: number, holidayId: number) =>
    apiClient.delete(`/api/v1/doctors/${doctorId}/holidays/${holidayId}`),
  getBreaks: (doctorId: number) =>
    apiClient.get(`/api/v1/doctors/${doctorId}/breaks`),
  createBreak: (doctorId: number, data: any) =>
    apiClient.post(`/api/v1/doctors/${doctorId}/breaks`, data),
  deleteBreak: (doctorId: number, breakId: number) =>
    apiClient.delete(`/api/v1/doctors/${doctorId}/breaks/${breakId}`),
  updatePricing: (doctorId: number, data: any) =>
    apiClient.put(`/api/v1/doctors/${doctorId}/pricing`, data),
};

export const consultationApi = {
  getByAppointment: (appointmentId: number) =>
    apiClient.get<ConsultationResponse>(`/api/v1/consultations/${appointmentId}`),
  get: (id: number) => apiClient.get<ConsultationResponse>(`/api/v1/consultations/records/${id}`),
  update: (id: number, data: any) => apiClient.put(`/api/v1/consultations/${id}`, data),
  addVitals: (id: number, data: VitalsUpdateRequest) =>
    apiClient.post(`/api/v1/consultations/${id}/vitals`, data),
  finalizePrescription: (id: number, data: any) =>
    apiClient.post(`/api/v1/consultations/${id}/finalize-prescription`, data),
  sendPrescription: (id: number) => apiClient.post(`/api/v1/consultations/${id}/send-prescription`),
  markPrescriptionViewed: (id: number) => apiClient.post(`/api/v1/consultations/${id}/prescription-viewed`),
  markPrescriptionDownloaded: (id: number) => apiClient.post(`/api/v1/consultations/${id}/prescription-downloaded`),
  getPrescriptionPdf: (id: number) =>
    apiClient.get(`/api/v1/consultations/${id}/prescription-pdf`, { responseType: 'blob' }),
  uploadRecording: (appointmentId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/ai/upload-recording/${appointmentId}`, formData);
  },
  uploadRecordingAndGenerateDraft: (appointmentId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review/upload-recording`, formData);
  },
  completeRecordingAndGenerateDraft: (appointmentId: number, data: { recordingUrl: string; autoTranscribe?: boolean }) =>
    apiClient.post<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review/recording-complete`, data),
  updateLiveTranscript: (appointmentId: number, data: { transcriptText: string; isFinal?: boolean; source?: string; locale?: string }) =>
    apiClient.post(`/api/v1/consultations/${appointmentId}/review/live-transcript`, data),
  getReview: (appointmentId: number) =>
    apiClient.get<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review`),
  refreshSummary: (appointmentId: number) =>
    apiClient.post<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review/refresh-summary`, {}),
  generateAiNotes: (id: number, data: { transcript: string }) =>
    apiClient.post(`/api/v1/consultations/${id}/generate-ai-notes`, data),
  getRecords: (consultationId: number) =>
    apiClient.get<ConsultationResponse>(`/api/v1/consultations/records/${consultationId}`),
  getHistory: (patientId?: number) =>
    apiClient.get<ConsultationResponse[]>('/api/v1/consultations/history', { params: patientId ? { patientId } : {} }),
  discardDraft: (appointmentId: number) =>
    apiClient.delete<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review`),
  getAssociatedPharmacies: () =>
    apiClient.get<Array<{ id: number; name: string; address?: string; city?: string; state?: string }>>('/api/v1/consultations/pharmacies/associated'),
  sharePrescriptionWithPharmacy: (consultationId: number, data: { pharmacyId: number; notes: string }) =>
    apiClient.post(`/api/v1/consultations/${consultationId}/share-with-pharmacy`, data),
};

export const chatApi = {
  getRooms: () => apiClient.get('/api/v1/chat/rooms'),
  createRoom: (data: { type: string; participantUserIds: number[] }) =>
    apiClient.post('/api/v1/chat/rooms', data),
  getRoomByAppointment: (appointmentId: number) =>
    apiClient.get(`/api/v1/chat/appointment/${appointmentId}`),
  getMessages: (roomId: number) => apiClient.get(`/api/v1/chat/rooms/${roomId}/messages`),
  sendMessage: (roomId: number, data: { message: string; type?: string; fileUrl?: string }) =>
    apiClient.post(`/api/v1/chat/rooms/${roomId}/messages`, data),
  markRead: (roomId: number) => apiClient.put(`/api/v1/chat/rooms/${roomId}/mark-read`),
  getUnreadCount: (roomId: number) => apiClient.get(`/api/v1/chat/rooms/${roomId}/unread-count`),
  uploadFile: (roomId: number, file: File, message?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (message) formData.append('message', message);
    return apiClient.post(`/api/v1/chat/rooms/${roomId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getSignedFileUrl: (messageId: number, ttlSeconds?: number) =>
    apiClient.post(`/api/v1/chat/files/${messageId}/signed-url`, null, {
      params: ttlSeconds ? { ttlSeconds } : undefined,
    }),
};

export const hospitalApi = {
  getAll: (params?: { city?: string; speciality?: string; service?: string }) =>
    apiClient.get('/api/v1/hospitals', { params }),
  get: (id: number) => apiClient.get(`/api/v1/hospitals/${id}`),
  getServices: (id: number) => apiClient.get(`/api/v1/hospitals/${id}/services`),
  getMyProfile: () => apiClient.get('/api/v1/hospitals/me/profile'),
  updateMyProfile: (data: any) => apiClient.put('/api/v1/hospitals/me/profile', data),
  submitForApproval: () => apiClient.post('/api/v1/hospitals/me/profile/submit', {}),
  uploadDocument: (documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/hospitals/me/profile/documents/${documentType}`, formData);
  },
  // Staff Member Management (Nurse, Helper, Receptionist, Lab Assistant, Doctor)
  getStaff: (hospitalId: number) =>
    apiClient.get(`/api/v1/hospitals/${hospitalId}/staff`),
  addStaff: (hospitalId: number, data: { fullName: string; email: string; phone: string; role: string; department?: string; employeeCode?: string }) =>
    apiClient.post(`/api/v1/hospitals/${hospitalId}/staff`, data),
  deactivateStaff: (hospitalId: number, staffId: number) =>
    apiClient.delete(`/api/v1/hospitals/${hospitalId}/staff/${staffId}`),
  uploadStaffDocument: (hospitalId: number, staffId: number, documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/hospitals/${hospitalId}/staff/${staffId}/documents/${documentType}`, formData);
  },
};

export const pathologyApi = {
  getMyProfile: () => apiClient.get('/api/v1/pathology/onboarding/me'),
  updateMyProfile: (data: any) => apiClient.put('/api/v1/pathology/onboarding/me', data),
  submitForApproval: () => apiClient.post('/api/v1/pathology/onboarding/me/submit', {}),
  uploadDocument: (documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/pathology/documents/upload/${documentType}`, formData);
  },
  // Pathology workflow methods
  getLabs: () =>
    apiClient.get<PathologyLabDiscoveryResponse[]>('/api/v1/pathology/workflow/labs'),
  getMyRequests: () =>
    apiClient.get<PathologyWorkflowResponse[]>('/api/v1/pathology/workflow/requests/my'),
  getRequest: (id: number) =>
    apiClient.get<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}`),
  createRequest: (data: PathologyRequestCreateRequest) =>
    apiClient.post<PathologyWorkflowResponse>('/api/v1/pathology/workflow/requests', data),
  sendQuotation: (id: number, data: PathologyQuotationRequest) =>
    apiClient.post<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/quotation`, data),
  book: (id: number, data: PathologyBookingRequest) =>
    apiClient.post<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/book`, data),
  updatePayment: (id: number, data: PathologyPaymentUpdateRequest) =>
    apiClient.patch<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/payment`, data),
  updateStatus: (id: number, data: PathologyStatusUpdateRequest) =>
    apiClient.patch<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/status`, data),
  saveReportDraft: (id: number, data: PathologyReportDraftRequest) =>
    apiClient.put<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/report`, data),
  completeReport: (id: number) =>
    apiClient.post<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/report/complete`),
  sendReportToPatient: (id: number) =>
    apiClient.post<PathologyWorkflowResponse>(`/api/v1/pathology/workflow/requests/${id}/report/send-patient`),
  shareReportWithDoctor: (id: number, data?: PathologyReportShareRequest) =>
    apiClient.post<PathologyWorkflowResponse>(
      `/api/v1/pathology/workflow/requests/${id}/report/share-doctor`,
      data || {}
    ),
  getDashboardStats: () =>
    apiClient.get<PathologyDashboardStatsResponse>('/api/v1/pathology/workflow/dashboard/stats'),
};

export const superAdminApi = {
  getHospitals: () => apiClient.get('/api/v1/super-admin/hospitals'),
  updateHospitalStatus: (id: number, data: any) =>
    apiClient.patch(`/api/v1/super-admin/hospitals/${id}/status`, data),
  getDoctorVerifications: () => apiClient.get('/api/v1/super-admin/doctors/verification'),
  updateDoctorVerification: (doctorId: number, data: any) =>
    apiClient.patch(`/api/v1/super-admin/doctors/verification/${doctorId}`, data),
  broadcastNotification: (data: any) =>
    apiClient.post('/api/v1/super-admin/broadcast-notification', data),
  getAnalytics: () => apiClient.get('/api/v1/super-admin/analytics'),
  generateLoginId: (data: any) => apiClient.post('/api/v1/super-admin/generate-login-id', data),

  // ---- Pharmacy onboarding approvals ----
  getPharmaciesForApproval: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<PharmacyApprovalSummary>>(
      '/api/v1/pharmacists/admin/pharmacies/approval',
      { params }
    ),
  getPharmacyApprovalWorkflow: (pharmacyId: number) =>
    apiClient.get(`/api/v1/pharmacists/admin/pharmacies/approval/${pharmacyId}/workflow`),
  decidePharmacyApprovalWorkflow: (
    pharmacyId: number,
    data: { action: 'APPROVE_ALL' | 'REJECT' | 'RESUBMIT_REQUIRED'; reviewNotes?: string }
  ) =>
    apiClient.patch(`/api/v1/pharmacists/admin/pharmacies/approval/${pharmacyId}/workflow`, data),

  // ---- Pharmacist onboarding approvals ----
  getPharmacistsForApproval: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<PharmacistApprovalSummary>>(
      '/api/v1/pharmacists/admin/approval',
      { params }
    ),
  reviewPharmacist: (
    pharmacistId: number,
    data: { action: 'APPROVE' | 'REJECT' | 'RESUBMIT'; reviewNotes?: string }
  ) => apiClient.patch(`/api/v1/pharmacists/admin/approval/${pharmacistId}`, data),

  // ---- Pathology onboarding approvals ----
  getPathologySubmissions: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<PathologyApprovalSummary>>(
      '/api/v1/admin/pathology/submissions',
      { params }
    ),
  getPathologySubmission: (id: number) =>
    apiClient.get(`/api/v1/admin/pathology/${id}`),
  approvePathology: (id: number) =>
    apiClient.post(`/api/v1/admin/pathology/${id}/approve`),
  rejectPathology: (id: number, data?: { reason?: string; notes?: string }) =>
    apiClient.post(`/api/v1/admin/pathology/${id}/reject`, data ?? {}),
  resubmitPathology: (id: number, data?: { reason?: string; notes?: string }) =>
    apiClient.post(`/api/v1/admin/pathology/${id}/resubmit`, data ?? {}),
  suspendPathology: (id: number, data?: { reason?: string; notes?: string }) =>
    apiClient.post(`/api/v1/admin/pathology/${id}/suspend`, data ?? {}),
};

export const subscriptionApi = {
  getPlans: () => apiClient.get<SubscriptionPlan[]>('/api/v1/subscriptions/plans/doctor'),
  getMine: () => apiClient.get<Subscription>('/api/v1/subscriptions/me'),
  createDoctorOrder: (planType: string) =>
    apiClient.post<RazorpayOrderResponse>('/api/v1/subscriptions/doctor/order', { planType }),
  verifyDoctorPayment: (data: PaymentVerifyRequest) =>
    apiClient.post<Subscription>('/api/v1/subscriptions/doctor/verify', data),
  getMyPayments: () => apiClient.get<PaymentRecord[]>('/api/v1/subscriptions/payments/my'),
  getMyCommissions: () => apiClient.get<CommissionRecord[]>('/api/v1/subscriptions/commissions/my'),
  createCommissionOrder: (commissionId: number) =>
    apiClient.post<RazorpayOrderResponse>(`/api/v1/subscriptions/commissions/${commissionId}/order`),
  verifyCommission: (commissionId: number, data: PaymentVerifyRequest) =>
    apiClient.post<CommissionRecord>(`/api/v1/subscriptions/commissions/${commissionId}/verify`, data),
  getAdminDashboard: (params?: {
    from?: string;
    to?: string;
    planType?: string;
    status?: string;
  }) => apiClient.get<AdminSubscriptionDashboard>('/api/v1/subscriptions/admin/dashboard', { params }),
  setDoctorAppointmentWaiver: (doctorId: number, data: UpdateDoctorAppointmentAccessRequest) =>
    apiClient.put(`/api/v1/subscriptions/admin/doctors/${doctorId}/appointment-access`, data),
  // Free subscription requests
  createFreeRequest: (data: CreateFreeSubscriptionRequest) =>
    apiClient.post<FreeSubscriptionRequestResponse>('/api/v1/subscriptions/free-request', data),
  getMyFreeRequest: () => apiClient.get<FreeSubscriptionRequestResponse>('/api/v1/subscriptions/free-request/me'),
  getAllFreeRequests: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<FreeSubscriptionRequestResponse>>('/api/v1/subscriptions/free-request', { params }),
  getFreeRequest: (requestId: number) =>
    apiClient.get<FreeSubscriptionRequestResponse>(`/api/v1/subscriptions/free-request/${requestId}`),
  reviewFreeRequest: (requestId: number, data: ReviewFreeSubscriptionRequest) =>
    apiClient.put<FreeSubscriptionRequestResponse>(`/api/v1/subscriptions/free-request/${requestId}/review`, data),
};

export const notificationApi = {
  getMy: () => apiClient.get('/api/v1/notifications/my'),
  getUnreadCount: () => apiClient.get('/api/v1/notifications/my/unread-count'),
  markRead: (id: number) => apiClient.patch(`/api/v1/notifications/${id}/read`),
};

export const patientApi = {
  getVitals: (data: any) => apiClient.post('/api/v1/patient-vitals', data),
  getMedicationReminders: () => apiClient.get('/api/v1/medication-reminders/my'),
  createMedicationReminder: (data: {
    medicineName: string;
    dosage?: string;
    amountPerUse?: string;
    frequencyPerDay?: string;
    timing?: string;
    duration?: string;
    notes?: string;
    startDate?: string;
    scheduleTimes?: string[];
  }) => apiClient.post('/api/v1/medication-reminders', data),
  startMedicationReminder: (id: number) =>
    apiClient.post(`/api/v1/medication-reminders/${id}/start`),
  logAdherence: (id: number, data: any) =>
    apiClient.post(`/api/v1/medication-reminders/${id}/adherence`, data),
};

export const aiApi = {
  patientChat: (data: any) => apiClient.post('/api/v1/ai/patient-chat', data),
};

export const billingApi = {
  getInvoice: (id: number) => apiClient.get(`/api/v1/billing/invoices/${id}`),
  getInvoicePdf: (id: number) =>
    apiClient.get(`/api/v1/billing/invoices/${id}/pdf`, { responseType: 'blob' }),
};

export const pharmacyApi = {
  getNearby: (params?: { city?: string }) =>
    apiClient.get<PharmacyDiscoveryResponse[]>('/api/v1/pharmacy/nearby', { params }),
  getDoctorAssociated: () =>
    apiClient.get<PharmacyDiscoveryResponse[]>('/api/v1/pharmacy/doctor-associated'),
  searchMedicines: (params: { hospitalId: number; q?: string }) =>
    apiClient.get<MedicineResponse[]>('/api/v1/pharmacy/search', { params }),
  scanLookup: (params: { code: string; hospitalId?: number; format?: string }) =>
    apiClient.get<MedicineScanLookupResponse>('/api/v1/pharmacy/inventory/scan-lookup', { params }),
  getInventoryForPharmacy: (pharmacyId: number, q?: string) =>
    apiClient.get<InventoryBatchResponse[]>('/api/v1/pharmacy/inventory/batches', {
      params: { pharmacyId, q },
    }),
  myInventoryBatches: () =>
    apiClient.get<InventoryBatchResponse[]>('/api/v1/pharmacy/inventory/batches/my'),
  saveInventoryBatch: (data: InventoryBatchRequest) =>
    apiClient.post<InventoryBatchResponse>('/api/v1/pharmacy/inventory/batches', data),
  releaseReservation: (reservationId: number) =>
    apiClient.post<InventoryReservationResponse>(
      `/api/v1/pharmacy/inventory/reservations/${reservationId}/release`
    ),
  createOrder: (data: PharmacyOrderCreateRequest) =>
    apiClient.post<PharmacyOrderResponse>('/api/v1/pharmacy/orders', data),
  myOrders: () => apiClient.get<PharmacyOrderResponse[]>('/api/v1/pharmacy/orders/my'),
  updateOrderStatus: (id: number, data: PharmacyOrderStatusUpdateRequest) =>
    apiClient.patch<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/status`, data),
  updateOrderItems: (id: number, items: PharmacyOrderItemRequest[]) =>
    apiClient.put<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/items`, items),
  updatePaymentStatus: (id: number, data: PharmacyOrderPaymentUpdateRequest) =>
    apiClient.patch<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/payment`, data),
  confirmOrder: (id: number, data?: OrderConfirmRequest) =>
    apiClient.post<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/confirm`, data),
  pickupReady: (id: number, data?: PickupReadyRequest) =>
    apiClient.post<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/pickup/ready`, data),
  pickupComplete: (id: number, data?: PickupCompleteRequest) =>
    apiClient.post<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/pickup/complete`, data),
  dispatchDelivery: (id: number, data?: DeliveryDispatchRequest) =>
    apiClient.post<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/delivery/dispatch`, data),
  completeDelivery: (id: number, data?: DeliveryCompleteRequest) =>
    apiClient.post<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/delivery/complete`, data),
  createEstimate: (data: PharmacyEstimateRequest) =>
    apiClient.post<PharmacyEstimateResponse>('/api/v1/pharmacy/estimates', data),
  updateEstimate: (estimateId: number, data: PharmacyEstimateRequest) =>
    apiClient.put<PharmacyEstimateResponse>(`/api/v1/pharmacy/estimates/${estimateId}`, data),
  sendEstimate: (estimateId: number) =>
    apiClient.post<PharmacyEstimateResponse>(`/api/v1/pharmacy/estimates/${estimateId}/send`),
  decideEstimate: (estimateId: number, data: EstimateDecisionRequest) =>
    apiClient.post<PharmacyEstimateResponse>(`/api/v1/pharmacy/estimates/${estimateId}/decision`, data),
  sharePrescription: (data: PrescriptionShareRequest) =>
    apiClient.post<PrescriptionShareResponse>('/api/v1/pharmacy/prescriptions/share', data),
};

export const labApi = {
  search: (hospitalId: number) =>
    apiClient.get<any[]>('/api/v1/labs/search', { params: { hospitalId } }),
  getTests: (hospitalId: number) =>
    apiClient.get<any[]>(`/api/v1/labs/${hospitalId}/tests`),
  book: (data: any) => apiClient.post('/api/v1/labs/bookings', data),
  uploadReport: (id: number, data: { reportUrl: string }) =>
    apiClient.post(`/api/v1/labs/bookings/${id}/upload-report`, data),
};

export const clinicalAssessmentApi = {
  create: (patientId: number, data: ClinicalAssessmentRequest) =>
    apiClient.post<ClinicalAssessmentResponse>(`/api/v1/patients/${patientId}/clinical-assessments`, data),
  getHistory: (patientId: number) =>
    apiClient.get<ClinicalAssessmentResponse[]>(`/api/v1/patients/${patientId}/clinical-assessments`),
  getById: (patientId: number, assessmentId: number) =>
    apiClient.get<ClinicalAssessmentResponse>(`/api/v1/patients/${patientId}/clinical-assessments/${assessmentId}`),
  analyzeStandaloneDocument: (file: File, category: string = 'LAB_REPORT', extractionMode: string = 'structured', notes?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<StandaloneDocumentAnalysisResponse>(
      '/api/v1/doctor/clinical-assessment/analyze-document',
      formData,
      {
        params: { category, extractionMode, notes },
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },
};

export const patientDocumentApi = {
  upload: (file: File, request: PatientDocumentUploadRequest) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    return apiClient.post<PatientDocumentResponse>('/api/v1/patients/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (params?: {
    category?: string;
    folderId?: number;
    favorite?: boolean;
    search?: string;
    page?: number;
    size?: number;
  }) => apiClient.get<PatientDocumentResponse[]>('/api/v1/patients/me/documents', { params }),
  getStats: () => apiClient.get<DocumentStatsResponse>('/api/v1/patients/me/documents/stats'),
  search: (q: string, page = 0, size = 20) =>
    apiClient.get<PatientDocumentResponse[]>(`/api/v1/patients/me/documents/search`, { params: { q, page, size } }),
  getById: (documentId: number) => apiClient.get<PatientDocumentResponse>(`/api/v1/patients/me/documents/${documentId}`),
  download: (documentId: number) => apiClient.get(`/api/v1/patients/me/documents/${documentId}/download`, { responseType: 'blob' }),
  analyze: (documentId: number, request?: any) =>
    apiClient.post<{ documentId: number; documentType: string; status: string; extractedText?: string; summary?: string; findings?: any[]; abnormalValues?: any[]; recommendations?: any[]; warnings?: string[]; confidence?: any; disclaimer?: string }>(
      `/api/v1/patients/me/documents/${documentId}/analyze`, request || {}),
  update: (documentId: number, request: PatientDocumentUploadRequest) =>
    apiClient.put<PatientDocumentResponse>(`/api/v1/patients/me/documents/${documentId}`, request),
  delete: (documentId: number) => apiClient.delete(`/api/v1/patients/me/documents/${documentId}`),
  toggleFavorite: (documentId: number) =>
    apiClient.post<PatientDocumentResponse>(`/api/v1/patients/me/documents/${documentId}/favorite`),

  // Folders
  createFolder: (request: PatientDocumentFolderRequest) =>
    apiClient.post<PatientDocumentFolderResponse>('/api/v1/patients/me/documents/folders', request),
  getFolders: () => apiClient.get<PatientDocumentFolderResponse[]>('/api/v1/patients/me/documents/folders'),
  deleteFolder: (folderId: number) => apiClient.delete(`/api/v1/patients/me/documents/folders/${folderId}`),

  // Reminders
  createReminder: (documentId: number, request: DocumentReminderDTO.ReminderRequest) =>
    apiClient.post<DocumentReminderDTO.ReminderResponse>(`/api/v1/patients/me/documents/${documentId}/reminders`, request),
  getReminders: (documentId: number) => apiClient.get<DocumentReminderDTO.ReminderResponse[]>(`/api/v1/patients/me/documents/${documentId}/reminders`),
  deleteReminder: (reminderId: number) => apiClient.delete(`/api/v1/patients/me/documents/reminders/${reminderId}`),
  updateReminderStatus: (reminderId: number, status: string) =>
    apiClient.put<DocumentReminderDTO.ReminderResponse>(`/api/v1/patients/me/documents/reminders/${reminderId}/status`, { status }),
};

export const verificationApi = {
  sendOtp: (identifier: string) =>
    apiClient.post('/api/v1/auth/verification/send-otp', { identifier }),
  verifyOtp: (identifier: string, otp: string) =>
    apiClient.post('/api/v1/auth/verification/verify-otp', { identifier, otp }),
  resetPassword: (data: { identifier: string; otp: string; newPassword: string }) =>
    apiClient.post('/api/v1/auth/verification/reset-password', data),
};

