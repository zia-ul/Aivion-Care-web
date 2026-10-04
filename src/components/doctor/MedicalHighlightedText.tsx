'use client';

import { segmentMedicalText } from '@/lib/medical-terms';

/**
 * Renders dictated transcript text with clinical vocabulary highlighted.
 *
 * Purely presentational: the underlying string is untouched, so anything that
 * submits the transcript still sends the original text.
 */
export function MedicalHighlightedText({
  text,
  className = '',
  highlightClassName = 'rounded-[4px] bg-accent/20 px-[3px] font-semibold text-primary-light ring-1 ring-inset ring-accent/40',
}: {
  text: string;
  className?: string;
  highlightClassName?: string;
}) {
  const segments = segmentMedicalText(text);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.medical ? (
          <mark key={index} className={`${highlightClassName} bg-transparent text-inherit`}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </span>
  );
}