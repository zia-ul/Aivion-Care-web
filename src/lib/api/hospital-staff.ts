import apiClient from './client';
import {
  PharmacyOrderResponse,
  PharmacyOrderStatusUpdateRequest,
  PharmacyOrderPaymentUpdateRequest,
} from '@/types/pharmacy';

export interface SurgeryResponse {
  id: number;
  hospitalId?: number;
  patientId?: number;
  patientName?: string;
  surgeonId?: number;
  surgeonName?: string;
  departmentId?: number;
  departmentName?: string;
  scheduledDate?: string;
  operationTheatreNo?: number;
  surgeryType?: string;
  status?: string;
  preOpNotes?: string;
  postOpNotes?: string;
  createdAt?: string;
}

export interface SurgeryBookingRequest {
  hospitalId: number;
  patientId: number;
  surgeonUserId: number;
  departmentId?: number;
  scheduledDate: string;
  operationTheatreNo?: number;
  surgeryType?: string;
  preOpNotes?: string;
}

export interface StaffAppointmentBookingRequest {
  hospitalId: number;
  patientId: number;
  doctorId: number;
  departmentId?: number;
  appointmentDate: string;
  slotTime: string;
  notes?: string;
}

export const surgeryApi = {
  getMySurgeries: () => apiClient.get<SurgeryResponse[]>('/api/v1/surgery/my-surgeries'),
  getOperationTheaters: () => apiClient.get<number[]>('/api/v1/surgery/operation-theaters'),
  book: (data: SurgeryBookingRequest) =>
    apiClient.post<SurgeryResponse>('/api/v1/surgery/book', data),
  updateStatus: (id: number, data: { status: string }) =>
    apiClient.patch<SurgeryResponse>(`/api/v1/surgery/${id}/status`, data),
};

export const staffAppointmentApi = {
  staffBook: (data: StaffAppointmentBookingRequest) =>
    apiClient.post('/api/v1/appointments/staff-book', data),
};

export const staffOrderApi = {
  updateOrderStatus: (id: number, data: PharmacyOrderStatusUpdateRequest) =>
    apiClient.patch<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/status`, data),
  updatePaymentStatus: (id: number, data: PharmacyOrderPaymentUpdateRequest) =>
    apiClient.patch<PharmacyOrderResponse>(`/api/v1/pharmacy/orders/${id}/payment`, data),
};

export interface StaffRegistrationRequest {
  hospitalId: number;
  email: string;
  password: string;
  phone: string;
  labName?: string;
  pharmacyName?: string;
}

export const staffRegistrationApi = {
  registerLabAssistant: (data: StaffRegistrationRequest) =>
    apiClient.post<{ loginId: string }>('/api/v1/labs/register', data),
  registerPharmacy: (data: StaffRegistrationRequest) =>
    apiClient.post<{ loginId: string }>('/api/v1/pharmacy/register', data),
};

export interface PrescriptionShareDto {
  id?: number;
  prescriptionId?: number;
  sharedByName?: string;
  sharedWithEntityType?: string;
  sharedWithEntityId?: number;
  sharedWithUserName?: string;
  sharedWithPharmacyName?: string;
  accessType?: string;
  sharedAt?: string;
  expiresAt?: string;
  isActive?: boolean;
  reason?: string;
}

export const prescriptionApi = {
  getAccessList: (id: number) =>
    apiClient.get<PrescriptionShareDto[]>(`/api/v1/prescriptions/${id}/access-list`),
  checkAccess: (id: number) =>
    apiClient.get<{ hasAccess: boolean }>(`/api/v1/prescriptions/${id}/access-check`),
};

export interface HospitalProfile {
  id: number;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  status?: string;
  facilityType?: string;
  hospitalLoginId?: string;
}

export const hospitalProfileApi = {
  get: (id: number) => apiClient.get<HospitalProfile>(`/api/v1/hospitals/${id}`),
  update: (id: number, data: Partial<HospitalProfile>) =>
    apiClient.put<HospitalProfile>(`/api/v1/hospitals/${id}`, data),
  getServices: (id: number) => apiClient.get<string[]>(`/api/v1/hospitals/${id}/services`),
};

export const labDirectoryApi = {
  searchLabAssistants: (hospitalId: number) =>
    apiClient.get<Array<{ userId: number; name?: string; email?: string; phone?: string; hospitalId?: number }>>(
      '/api/v1/labs/search',
      { params: { hospitalId } },
    ),
};

export const pharmacyDirectoryApi = {
  list: (city?: string) =>
    apiClient.get<Array<{ id: number; hospitalId?: number; name?: string; city?: string; state?: string; phone?: string }>>(
      '/api/v1/pharmacy/nearby',
      { params: city ? { city } : undefined },
    ),
};
