export interface PharmacyDiscoveryResponse {
  id: number;
  hospitalId?: number;
  clinicId?: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  openingHours: string;
  delivery: string;
}

export interface PharmacyOrderItemResponse {
  id?: number;
  medicineName?: string;
  dosage?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
}

export interface PharmacyOrderResponse {
  id: number;
  hospitalId?: number;
  patientId?: number;
  pharmacistUserId?: number;
  prescriptionId?: number;
  estimateId?: number;
  pharmacyId?: number;
  doctorId?: number;
  bookedByUserId?: number;
  source?: string;
  patientName?: string;
  createdByName?: string;
  status: string;
  deliveryAddress?: string;
  totalAmount?: number;
  paymentStatus?: string;
  orderedAt?: string;
  confirmedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  orderType?: string;
  fulfillmentType?: string;
  pickupCode?: string;
  items?: PharmacyOrderItemResponse[];
}

export interface MedicineResponse {
  id?: number;
  name?: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  form?: string;
  strength?: string;
  price?: number;
  unitPrice?: number;
  stockQuantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  description?: string;
}

export interface InventoryBatchResponse {
  id?: number;
  medicineName?: string;
  batchNumber?: string;
  expiryDate?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface PharmacyEstimateItemRequest {
  medicineId?: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PharmacyEstimateRequest {
  pharmacyId?: number;
  consultationId?: number;
  items: PharmacyEstimateItemRequest[];
  discount?: number;
  notes?: string;
}

export interface PharmacyEstimateItemResponse {
  id?: number;
  medicineName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface PharmacyEstimateResponse {
  id: number;
  pharmacyId?: number;
  consultationId?: number;
  status?: string;
  totalAmount?: number;
  discount?: number;
  notes?: string;
  items?: PharmacyEstimateItemResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PharmacyOrderCreateRequest {
  pharmacyId: number;
  items: PharmacyOrderItemRequest[];
  deliveryAddress?: string;
  notes?: string;
}

export interface PharmacyOrderItemRequest {
  medicineName: string;
  quantity: number;
  dosage?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface PharmacyOrderStatusUpdateRequest {
  status: string;
  notes?: string;
}

export interface PharmacyOrderPaymentUpdateRequest {
  paymentStatus: string;
}

export interface EstimateDecisionRequest {
  accepted: boolean;
}

export interface OrderConfirmRequest {
  notes?: string;
}

export interface PickupReadyRequest {
  pickupCode?: string;
  notes?: string;
}

export interface PickupCompleteRequest {
  notes?: string;
}

export interface DeliveryDispatchRequest {
  trackingNumber?: string;
  notes?: string;
}

export interface DeliveryCompleteRequest {
  notes?: string;
}

export interface InventoryBatchRequest {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
}

export interface PrescriptionShareRequest {
  targetType: string;
  targetId: number;
  notes?: string;
}

export interface PrescriptionShareResponse {
  id: number;
  status: string;
  orderId?: number;
  message?: string;
}

export interface MedicineScanLookupResponse {
  medicineId?: number;
  name?: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  form?: string;
  strength?: string;
  quantity?: number;
  unitPrice?: number;
  batchNumber?: string;
  expiryDate?: string;
  description?: string;
  found?: boolean;
  message?: string;
  source?: string;
}

export interface InventoryReservationResponse {
  id: number;
  status: string;
  reservationCode?: string;
  medicineName?: string;
  quantity?: number;
}
