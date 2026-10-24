'use client';

import { MedicalCategory, segmentMedicalText } from '@/lib/medical-terms';

export const MEDICAL_CATEGORY_STYLES: Record<MedicalCategory, string> = {
  drug: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold px-1 py-0.5 rounded-[4px]',
  symptom: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 font-medium px-1 py-0.5 rounded-[4px]',
  test: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30 font-medium px-1 py-0.5 rounded-[4px]',
  vital: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/30 font-medium px-1 py-0.5 rounded-[4px]',
  instruction: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-medium px-1 py-0.5 rounded-[4px]',
};

/**
 * Renders dictated transcript or clinical notes text with medical keywords categorized and highlighted in distinct colors.
 */
export function MedicalHighlightedText({
  text,
  className = '',
  enableCategoryColors = true,
}: {
  text: string;
  className?: string;
  enableCategoryColors?: boolean;
}) {
  const segments = segmentMedicalText(text);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.medical ? (
          <mark
            key={index}
            className={
              enableCategoryColors && segment.category
                ? MEDICAL_CATEGORY_STYLES[segment.category]
                : 'rounded-[4px] bg-accent/20 px-1 py-0.5 font-semibold text-primary-light ring-1 ring-inset ring-accent/40'
            }
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </span>
  );
}
