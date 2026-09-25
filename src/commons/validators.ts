export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function sanitizeInput(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength);
}
