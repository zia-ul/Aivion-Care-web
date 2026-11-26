'use client';

import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { checkPasswordCriteria } from '@/lib/helpers/validation';

interface PasswordRequirementsProps {
  password?: string;
  confirmPassword?: string;
  className?: string;
}

export function PasswordRequirements({
  password = '',
  confirmPassword,
  className = '',
}: PasswordRequirementsProps) {
  const criteria = checkPasswordCriteria(password);
  const hasConfirm = typeof confirmPassword === 'string';
  const passwordsMatch = hasConfirm && confirmPassword.length > 0 && password === confirmPassword;

  // Calculate score (0 to 5)
  const score = [
    criteria.minLength,
    criteria.hasUppercase,
    criteria.hasLowercase,
    criteria.hasNumber,
    criteria.hasSpecial,
  ].filter(Boolean).length;

  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-emerald-500',
  ];

  const rules = [
    { label: 'At least 8 characters (up to 100)', valid: criteria.minLength },
    { label: 'One uppercase letter (A-Z)', valid: criteria.hasUppercase },
    { label: 'One lowercase letter (a-z)', valid: criteria.hasLowercase },
    { label: 'One number (0-9)', valid: criteria.hasNumber },
    { label: 'One special symbol (!@#$%^&*)', valid: criteria.hasSpecial },
  ];

  if (hasConfirm) {
    rules.push({
      label: 'Passwords match',
      valid: passwordsMatch,
    });
  }

  // Only show detailed checklist if user interacted or typed
  const isTyping = password.length > 0;

  return (
    <div
      className={`rounded-2xl border border-tonal-20/80 bg-surface-20/80 p-3.5 text-xs backdrop-blur-sm transition-all ${className}`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-primary-light">
          {criteria.allValid ? (
            <ShieldCheck size={15} className="text-emerald-500" />
          ) : (
            <ShieldAlert size={15} className="text-amber-500" />
          )}
          <span>Password Security Standards</span>
        </div>
        {isTyping && (
          <span className="font-bold text-[11px] text-primary-light/70">
            Strength:{' '}
            <span
              className={
                score <= 2
                  ? 'text-rose-500 dark:text-rose-400'
                  : score <= 4
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            >
              {strengthLabels[Math.min(score, 4)]}
            </span>
          </span>
        )}
      </div>

      {/* Progress Bars */}
      {isTyping && (
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < score ? strengthColors[Math.min(score - 1, 4)] : 'bg-tonal-20/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Criteria Checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              rule.valid
                ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                : 'text-primary-light/60'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                rule.valid
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-tonal-20/40 text-primary-light/40'
              }`}
            >
              {rule.valid ? <Check size={11} strokeWidth={2.6} /> : <X size={10} />}
            </span>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
