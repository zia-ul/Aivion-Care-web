/**
 * Enterprise Form & Input Validation Helpers
 * Comprehensive boundary checks, regex filters, sanitization,
 * and error messaging for healthcare workflows.
 */

// Strict Gmail pattern: 6 to 30 characters before @gmail.com
export const GMAIL_REGEX = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){4,29}@gmail\.com$/i;

// Standard RFC-5322 compliant email regex
export const EMAIL_REGEX = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

// Alphabets only (letters and spaces)
export const ALPHABETS_ONLY_REGEX = /^[a-zA-Z\s]+$/;

// Alphanumeric with safe healthcare symbols (periods, dashes, spaces)
export const ALPHANUMERIC_SAFE_REGEX = /^[a-zA-Z0-9\s.\-_]+$/;

// Pure numeric digits
export const NUMERIC_ONLY_REGEX = /^\d+$/;

// Phone number (10 to 15 digits, optional + prefix)
export const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noSpaces: boolean;
  allValid: boolean;
}

export const checkPasswordCriteria = (password: string): PasswordCriteria => {
  const p = password || '';
  const minLength = p.length >= 8 && p.length <= 100;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(p);
  const noSpaces = !/\s/.test(p) && p.length > 0;
  const allValid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && noSpaces;

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    noSpaces,
    allValid,
  };
};

export const ValidationHelpers = {
  /**
   * Validates alphabetic only names (e.g. Doctor Full Name, Patient Name)
   */
  validateAlphabeticName: (name: string, fieldName = 'Name', minLen = 2, maxLen = 70): ValidationResult => {
    if (!name || !name.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = name.trim();
    if (trimmed.length < minLen) {
      return { isValid: false, error: `${fieldName} must be at least ${minLen} characters.` };
    }
    if (trimmed.length > maxLen) {
      return { isValid: false, error: `${fieldName} cannot exceed ${maxLen} characters.` };
    }
    if (!ALPHABETS_ONLY_REGEX.test(trimmed)) {
      return { isValid: false, error: `${fieldName} must contain alphabets only (no numbers or special characters).` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },

  /**
   * Validates standard email address
   */
  validateEmail: (email: string, fieldName = 'Email'): ValidationResult => {
    if (!email || !email.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = email.trim().toLowerCase();
    if (trimmed.length > 100) {
      return { isValid: false, error: `${fieldName} cannot exceed 100 characters.` };
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return { isValid: false, error: `Please enter a valid ${fieldName} address.` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },

  /**
   * Validates strict Gmail address
   */
  validateGmail: (email: string, fieldName = 'Gmail Address'): ValidationResult => {
    if (!email || !email.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = email.trim().toLowerCase();
    if (!GMAIL_REGEX.test(trimmed)) {
      return { isValid: false, error: `${fieldName} must be a valid @gmail.com address (6-30 chars).` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },

  /**
   * Validates phone numbers
   */
  validatePhone: (phone: string, fieldName = 'Phone number'): ValidationResult => {
    if (!phone || !phone.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const clean = phone.replace(/[\s\-()]/g, '');
    if (!PHONE_REGEX.test(clean)) {
      return { isValid: false, error: `${fieldName} must be a valid 10 to 15 digit phone number.` };
    }
    return { isValid: true, sanitizedValue: clean };
  },

  /**
   * Validates numeric digits string (e.g. OTP, PIN, License digits)
   */
  validateNumericDigits: (digits: string, fieldName = 'Field', minLen = 1, maxLen = 20): ValidationResult => {
    if (!digits || !digits.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = digits.trim();
    if (!NUMERIC_ONLY_REGEX.test(trimmed)) {
      return { isValid: false, error: `${fieldName} must contain numbers only.` };
    }
    if (trimmed.length < minLen || trimmed.length > maxLen) {
      return { isValid: false, error: `${fieldName} must be between ${minLen} and ${maxLen} digits.` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },

  /**
   * Validates bounded numbers (e.g. Age, Vitals, Fees)
   */
  validateNumberRange: (val: number | string, fieldName = 'Value', min: number, max: number): ValidationResult => {
    if (val === undefined || val === null || val === '') {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} must be a valid numeric number.` };
    }
    if (num < min || num > max) {
      return { isValid: false, error: `${fieldName} must be between ${min} and ${max}.` };
    }
    return { isValid: true };
  },

  /**
   * Validates passwords for security (8-100 characters, uppercase, lowercase, number, special character, no spaces)
   */
  validatePassword: (password: string, fieldName = 'Password'): ValidationResult => {
    if (!password) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    if (password.length < 8) {
      return { isValid: false, error: `${fieldName} must be at least 8 characters long.` };
    }
    if (password.length > 100) {
      return { isValid: false, error: `${fieldName} cannot exceed 100 characters.` };
    }
    if (/\s/.test(password)) {
      return { isValid: false, error: `${fieldName} cannot contain spaces.` };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: `${fieldName} must contain at least one uppercase letter (A-Z).` };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: `${fieldName} must contain at least one lowercase letter (a-z).` };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: `${fieldName} must contain at least one number (0-9).` };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      return { isValid: false, error: `${fieldName} must contain at least one special symbol (!@#$%^&*).` };
    }
    return { isValid: true };
  },

  /**
   * Filter and enforce numeric-only input on user typing
   */
  filterNumeric: (val: string): string => {
    return val.replace(/[^\d]/g, '');
  },

  /**
   * Filter and enforce phone input (optional + at start, then digits only)
   */
  filterPhone: (val: string): string => {
    if (!val) return '';
    const hasPlus = val.startsWith('+');
    const digits = val.replace(/[^\d]/g, '');
    return hasPlus ? `+${digits}` : digits;
  },

  /**
   * Filter and enforce alphabetic letters and spaces only
   */
  filterAlphabets: (val: string): string => {
    return val.replace(/[^a-zA-Z\s]/g, '');
  },

  /**
   * Validates general text length
   */
  validateTextLength: (text: string, fieldName: string, minLen = 1, maxLen = 100, required = true): ValidationResult => {
    if (!text || !text.trim()) {
      if (!required) return { isValid: true, sanitizedValue: '' };
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = text.trim();
    if (trimmed.length < minLen) {
      return { isValid: false, error: `${fieldName} must be at least ${minLen} characters.` };
    }
    if (trimmed.length > maxLen) {
      return { isValid: false, error: `${fieldName} cannot exceed ${maxLen} characters.` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },

  /**
   * Validates postal / PIN code
   */
  validatePincode: (pin: string, fieldName = 'PIN code'): ValidationResult => {
    if (!pin || !pin.trim()) {
      return { isValid: false, error: `${fieldName} is required.` };
    }
    const trimmed = pin.trim();
    if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(trimmed)) {
      return { isValid: false, error: `${fieldName} must be 4 to 10 alphanumeric characters.` };
    }
    return { isValid: true, sanitizedValue: trimmed };
  },
};
