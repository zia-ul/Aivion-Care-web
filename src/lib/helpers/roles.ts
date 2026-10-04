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
 * Resolve the landing page for a role, falling back to the patient dashboard
 * for unknown or missing roles so navigation always has a valid target.
 */
export function getRoleHomePath(role?: string | null): string {
  if (!role) return ROLE_HOME.PATIENT;
  return ROLE_HOME[role] ?? ROLE_HOME.PATIENT;
}