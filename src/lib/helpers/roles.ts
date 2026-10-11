/**
 * Role navigation helpers.
 *
 * Each role has a single landing page that is guaranteed to exist in
 * `src/app`. Redirects (login, fallbacks) must use these paths so a user is
 * never sent to a route their role cannot open — `AppLayout` redirects any
 * mismatched role back to `/login`, which would strand the account.
 */

export const ROLE_HOME: Record<string, string> = {
  PATIENT: '/patient/dashboard',
  DOCTOR: '/doctor/dashboard',
  SUPER_ADMIN: '/super-admin/hospitals',
  HOSPITAL_HEAD: '/hospital-head/dashboard',
  PHARMACY: '/pharmacist/dashboard',
  PATHOLOGY: '/pathology/dashboard',
  LAB_ASSISTANT: '/lab-assistant/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
};

/**
 * Resolve the landing page for a role, applying verification and approval gates
 * identical to the Android WrapperScreen.
 *
 * Android logic:
 * - DOCTOR: if !doctorApproved => /verification (with option to view /approval-pending)
 * - HOSPITAL_HEAD:
 *     - if !documentsSubmitted || hospitalStatus == 'RESUBMIT' => /hospital-head/status
 *     - if hospitalStatus == 'PENDING' => /approval-pending
 *     - if hospitalStatus == 'APPROVED' => /hospital-head/dashboard
 * - PHARMACY: if !pharmacistApproved || !pharmacyApproved => /approval-pending
 * - PATHOLOGY: if !pathologyApproved => /verification
 * - PATIENT, SUPER_ADMIN, RECEPTIONIST, LAB_ASSISTANT => their dashboards directly
 */
export function getRoleHomePathWithGate(user?: {
  role?: string | null;
  doctorApproved?: boolean;
  doctorApprovalStatus?: string;
  pharmacistApproved?: boolean;
  pharmacyApproved?: boolean;
  pathologyApproved?: boolean;
  pathologistApproved?: boolean;
  pathologistId?: number;
  pathologistApprovalStatus?: string;
  hospitalStatus?: string;
  documentsSubmitted?: boolean;
} | null): string {
  if (!user || !user.role) return ROLE_HOME.PATIENT;

  const role = user.role.trim().toUpperCase();

  switch (role) {
    case 'DOCTOR':
      if (user.doctorApproved !== true) {
        // If doctor has submitted and is waiting, or needs document verification:
        return user.doctorApprovalStatus === 'PENDING' ? '/approval-pending' : '/verification';
      }
      return ROLE_HOME.DOCTOR;

    case 'HOSPITAL_HEAD':
      if (user.documentsSubmitted === false || user.hospitalStatus === 'RESUBMIT') {
        return '/hospital-head/status';
      }
      if (user.hospitalStatus === 'PENDING') {
        return '/approval-pending';
      }
      return ROLE_HOME.HOSPITAL_HEAD;

    case 'PHARMACY':
      if (user.pharmacistApproved !== true || user.pharmacyApproved !== true) {
        return '/approval-pending';
      }
      return ROLE_HOME.PHARMACY;

    case 'PATHOLOGY':
      if (user.pathologyApproved !== true) {
        return '/verification';
      }
      return ROLE_HOME.PATHOLOGY;

    default:
      return getRoleHomePath(role);
  }
}

/**
 * Resolve the default landing page for a role without gates.
 */
export function getRoleHomePath(role?: string | null): string {
  if (!role) return ROLE_HOME.PATIENT;
  return ROLE_HOME[role] ?? ROLE_HOME.PATIENT;
}