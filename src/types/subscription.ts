/**
 * Shared TypeScript types for the subscription domain.
 * 
 * These types mirror the backend DTOs defined in:
 *   backend/src/main/java/com/medicore/dto/subscription/
 * 
 * See: docs/api/subscription-api.md
 * Also synced with: packages/shared-types/subscription.ts
 */

// --- Subscription Plan ---

export interface SubscriptionPlan {
  planType: string;
  planName: string;
  amount: number;
  validityDays: number;
}

// --- Subscription Status ---

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

// --- Subscription ---

export interface Subscription {
  id?: number;
  userId?: number;
  role?: string;
  planName?: string;
  planType?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  status: SubscriptionStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- Razorpay Order ---

export interface RazorpayOrderResponse {
  localId?: number;
  razorpayOrderId?: string;
  key?: string;
  amount?: number;
  amountPaise?: number;
  currency?: string;
  receipt?: string;
  description?: string;
}

// --- Payment Verify ---

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// --- Payment Record ---

export interface PaymentRecord {
  id: number;
  subscriptionId?: number;
  userId?: number;
  role?: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: string;
  paidAt?: string;
  createdAt?: string;
}

// --- Commission ---

export interface CommissionRecord {
  id: number;
  recipientUserId?: number;
  recipientRole?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt?: string;
  dueDate?: string;
}

// --- Admin Dashboard ---

export interface PlanStat {
  count: number;
  revenue: number;
}

export interface AdminSubscriptionDashboard {
  totalRevenue: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  byPlanType: Record<string, PlanStat>;
  doctorAccess: DoctorAccess[];
}

export interface DoctorAccess {
  doctorId: number;
  fullName?: string;
  email?: string;
  subscriptionActive: boolean;
  appointmentAccessWithoutSubscription: boolean;
  appointmentEnabled: boolean;
}

// --- Appointment Access Waiver ---

export interface UpdateDoctorAppointmentAccessRequest {
  appointmentAccessWithoutSubscription: boolean;
}
