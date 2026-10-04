export interface PathologyLabDiscoveryResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  homeCollectionAvailable: boolean;
  openingDays: string;
  openingHours: string;
}

export interface PathologyWorkflowResponse {
  id: number;
  patientId?: number;
  patientName?: string;
  doctorId?: number;
  doctorName?: string;
  pathologyLabId?: number;
  pathologyLabName?: string;
  pathologistId?: number;
  pathologistName?: string;
  prescriptionId?: number;
  prescriptionFileUrl?: string;
  sourceType?: string;
  preferredMode?: string;
  status?: string;
  requestNote?: string;
  rejectionReason?: string;
  totalAmount?: number;
  paymentStatus?: string;
  bookingMode?: string;
  bookingStatus?: string;
  scheduledDateTime?: string;
  createdAt?: string;
  updatedAt?: string;
  quotation?: PathologyQuotationResponse;
  booking?: PathologyBookingResponse;
  report?: PathologyReportResponse;
  tests?: PathologyRequestTestResponse[];
  timeline?: PathologyTimelineEventResponse[];
}

export interface PathologyQuotationResponse {
  id?: number;
  status?: string;
  totalAmount?: number;
  discount?: number;
  notes?: string;
  items?: PathologyQuotationItemResponse[];
  createdAt?: string;
}

export interface PathologyQuotationItemResponse {
  testName?: string;
  rate?: number;
  quantity?: number;
  totalPrice?: number;
}

export interface PathologyBookingResponse {
  id?: number;
  bookingMode?: string;
  scheduledDateTime?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  status?: string;
  paymentMode?: string;
  createdAt?: string;
}

export interface PathologyReportResponse {
  id?: number;
  reportTitle?: string;
  overallSummary?: string;
  status?: string;
  pages?: PathologyReportPageResponse[];
  createdAt?: string;
  completedAt?: string;
}

export interface PathologyReportPageResponse {
  id?: number;
  pageNumber?: number;
  pageType?: string;
  title?: string;
  contentJson?: string;
}

export interface PathologyRequestTestResponse {
  id?: number;
  testName?: string;
  status?: string;
  result?: string;
  flag?: string;
  unit?: string;
  referenceRange?: string;
}

export interface PathologyTimelineEventResponse {
  id?: number;
  eventType?: string;
  description?: string;
  performedBy?: string;
  createdAt?: string;
}

export interface PathologyRequestCreateRequest {
  pathologyLabId: number;
  patientId?: number;
  doctorId?: number;
  prescriptionId?: number;
  preferredMode?: string;
  requestNote?: string;
  prescriptionFileUrl?: string;
}

export interface PathologyBookingRequest {
  bookingMode: string;
  addressText?: string;
  contactName?: string;
  contactPhone?: string;
  paymentMode?: string;
}

export interface PathologyQuotationRequest {
  tests: PathologyTestItemRequest[];
  discount?: number;
  notes?: string;
}

export interface PathologyTestItemRequest {
  testName: string;
  rate: number;
  quantity: number;
}

export interface PathologyStatusUpdateRequest {
  status: string;
  notes?: string;
}

export interface PathologyPaymentUpdateRequest {
  paymentStatus: string;
}

export interface PathologyReportShareRequest {
  doctorId?: number;
}

export interface PathologyReportDraftRequest {
  reportTitle: string;
  overallSummary: string;
  pages?: PathologyReportPageRequest[];
  results?: PathologyReportResultRequest[];
}

export interface PathologyReportPageRequest {
  pageNumber?: number;
  pageType?: string;
  title?: string;
  contentJson?: string;
}

export interface PathologyReportResultRequest {
  testName?: string;
  result?: string;
  unit?: string;
  referenceRange?: string;
  flag?: string;
}

export interface PathologyDashboardStatsResponse {
  totalRequests?: number;
  pendingQuotations?: number;
  pendingReports?: number;
  completedToday?: number;
  totalRevenue?: number;
}
