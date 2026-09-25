import { formatDate, formatTime, getStatusColor, getStatusClasses, cn } from '@/lib/helpers';

describe('formatDate', () => {
  it('formats valid ISO date string', () => {
    expect(formatDate('2024-12-25')).toBe('Dec 25, 2024');
  });

  it('handles empty string', () => {
    expect(formatDate('')).toBe('Invalid Date');
  });

  it('handles invalid date', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });

  it('handles null', () => {
    expect(formatDate(null as any)).toBe('Invalid Date');
  });

  it('handles undefined', () => {
    expect(formatDate(undefined as any)).toBe('Invalid Date');
  });

  it('formats date with time component', () => {
    expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('Jan 1, 2024');
  });

  it('handles leap year date', () => {
    expect(formatDate('2024-02-29')).toBe('Feb 29, 2024');
  });

  it('handles end of year', () => {
    expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
  });

  it('handles start of year', () => {
    expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
  });
});

describe('formatTime', () => {
  it('formats valid time string', () => {
    expect(formatTime('14:30:00')).toBe('2:30 PM');
  });

  it('formats midnight', () => {
    expect(formatTime('00:00:00')).toBe('12:00 AM');
  });

  it('formats noon', () => {
    expect(formatTime('12:00:00')).toBe('12:00 PM');
  });

  it('handles empty string', () => {
    expect(formatTime('')).toBe('Invalid Time');
  });

  it('handles invalid time', () => {
    expect(formatTime('not-a-time')).toBe('Invalid Time');
  });

  it('handles null', () => {
    expect(formatTime(null as any)).toBe('Invalid Time');
  });

  it('handles undefined', () => {
    expect(formatTime(undefined as any)).toBe('Invalid Time');
  });

  it('handles single digit hour', () => {
    expect(formatTime('09:05:00')).toBe('9:05 AM');
  });

  it('handles boundary hour 23', () => {
    expect(formatTime('23:59:00')).toBe('11:59 PM');
  });

  it('handles boundary minute 0', () => {
    expect(formatTime('01:00:00')).toBe('1:00 AM');
  });

  it('handles boundary minute 59', () => {
    expect(formatTime('01:59:00')).toBe('1:59 AM');
  });
});

describe('getStatusColor', () => {
  it('returns correct color for CONFIRMED', () => {
    expect(getStatusColor('CONFIRMED')).toBe('success');
  });

  it('returns correct color for PENDING', () => {
    expect(getStatusColor('PENDING')).toBe('warning');
  });

  it('returns correct color for COMPLETED', () => {
    expect(getStatusColor('COMPLETED')).toBe('success');
  });

  it('returns correct color for CANCELLED', () => {
    expect(getStatusColor('CANCELLED')).toBe('danger');
  });

  it('returns correct color for REJECTED', () => {
    expect(getStatusColor('REJECTED')).toBe('danger');
  });

  it('returns correct color for APPROVED', () => {
    expect(getStatusColor('APPROVED')).toBe('success');
  });

  it('returns correct color for default case', () => {
    expect(getStatusColor('UNKNOWN')).toBe('surface-20');
  });

  it('handles empty string', () => {
    expect(getStatusColor('')).toBe('surface-20');
  });

  it('handles null', () => {
    expect(getStatusColor(null as any)).toBe('surface-20');
  });

  it('handles undefined', () => {
    expect(getStatusColor(undefined as any)).toBe('surface-20');
  });

  it('is case insensitive for CONFIRMED', () => {
    expect(getStatusColor('confirmed')).toBe('success');
  });

  it('is case insensitive for PENDING', () => {
    expect(getStatusColor('pending')).toBe('warning');
  });
});

describe('getStatusClasses', () => {
  it('returns correct classes for CONFIRMED', () => {
    expect(getStatusClasses('CONFIRMED')).toContain('bg-success/10');
    expect(getStatusClasses('CONFIRMED')).toContain('text-success-light');
  });

  it('returns correct classes for PENDING', () => {
    expect(getStatusClasses('PENDING')).toContain('bg-warning/10');
    expect(getStatusClasses('PENDING')).toContain('text-warning-light');
  });

  it('returns correct classes for CANCELLED', () => {
    expect(getStatusClasses('CANCELLED')).toContain('bg-danger/10');
    expect(getStatusClasses('CANCELLED')).toContain('text-danger-light');
  });

  it('returns correct classes for default', () => {
    expect(getStatusClasses('UNKNOWN')).toContain('bg-surface-20');
    expect(getStatusClasses('UNKNOWN')).toContain('text-primary-light/60');
  });

  it('always includes base classes', () => {
    const classes = getStatusClasses('CONFIRMED');
    expect(classes).toContain('px-3');
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('font-medium');
  });

  it('handles null status', () => {
    expect(getStatusClasses(null as any)).toContain('bg-surface-20');
  });

  it('handles undefined status', () => {
    expect(getStatusClasses(undefined as any)).toContain('bg-surface-20');
  });

  it('handles empty string status', () => {
    expect(getStatusClasses('')).toContain('bg-surface-20');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles empty inputs', () => {
    expect(cn('', '')).toBe('');
  });

  it('handles undefined and null', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });
});
