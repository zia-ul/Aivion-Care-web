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
} from '@/types/subscription';
import {
  ConsultationResponse,
  ConsultationReviewResponse,
  ConsultationAiDraftResponse,
  VitalsUpdateRequest,
  InvestigationItemRequest,
} from '@/types/consultation';

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
    apiClient.post<ConsultationReviewResponse>(`/api/v1/consultations/${appointmentId}/review/discard`, {}),
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
};

export const pathologyApi = {
  getMyProfile: () => apiClient.get('/api/v1/pathology/me/profile'),
  updateMyProfile: (data: any) => apiClient.put('/api/v1/pathology/me/profile', data),
  submitForApproval: () => apiClient.post('/api/v1/pathology/me/profile/submit', {}),
  uploadDocument: (documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/pathology/me/profile/documents/${documentType}`, formData);
  },
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
};

export const notificationApi = {
  getMy: () => apiClient.get('/api/v1/notifications/my'),
  getUnreadCount: () => apiClient.get('/api/v1/notifications/my/unread-count'),
  markRead: (id: number) => apiClient.patch(`/api/v1/notifications/${id}/read`),
};

export const patientApi = {
  getVitals: (data: any) => apiClient.post('/api/v1/patient-vitals', data),
  getMedicationReminders: () => apiClient.get('/api/v1/medication-reminders/my'),
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
