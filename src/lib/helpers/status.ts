import { cn } from './cn';

const SUCCESS_STATES = new Set([
  'ACTIVE',
  'APPROVED',
  'COMPLETED',
  'CONFIRMED',
  'DELIVERED',
  'PAID',
  'PUBLISHED',
  'SUCCESS',
]);

const WARNING_STATES = new Set([
  'AWAITING',
  'IN_PROGRESS',
  'PENDING',
  'PROCESSING',
  'REQUESTED',
  'SCHEDULED',
  'UPCOMING',
]);

const DANGER_STATES = new Set([
  'CANCELLED',
  'DECLINED',
  'EXPIRED',
  'FAILED',
  'INACTIVE',
  'REJECTED',
]);

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'surface-20';

export function getStatusColor(status: string | null | undefined): StatusTone {
  if (!status) return 'surface-20';
  const normalized = status.trim().toUpperCase();
  if (SUCCESS_STATES.has(normalized)) return 'success';
  if (WARNING_STATES.has(normalized)) return 'warning';
  if (DANGER_STATES.has(normalized)) return 'danger';
  if (normalized === 'INFO' || normalized === 'UPCOMING_APPOINTMENT') return 'info';
  return 'surface-20';
}

export function getStatusClasses(status: string | null | undefined): string {
  const tone = getStatusColor(status);
  const classes: Record<StatusTone, string> = {
    success: 'bg-success/10 text-success-light',
    warning: 'bg-warning/10 text-warning-light',
    danger: 'bg-danger/10 text-danger-light',
    info: 'bg-info/10 text-info-light',
    'surface-20': 'bg-surface-20 text-primary-light/60',
  };
  return cn('rounded-full px-3 py-1 text-support font-medium', classes[tone]);
}
