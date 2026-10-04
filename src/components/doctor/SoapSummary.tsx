'use client';

import { ConsultationSoapSectionResponse } from '@/types/consultation';

/* ------------------------------------------------------------------------ */
/* SOAP palette                                                              */
/*                                                                           */
/* Colours are theme tokens declared in globals.css for both themes. They are  */
/* stored as space-separated RGB channels, so they must be wrapped in rgb().    */
/*                                                                           */
/* Four distinct hues so no two sections read alike:                    */
/* S Subjective blue, O Objective purple, A Assessment yellow, P Plan green. */
/* ------------------------------------------------------------------------ */

export interface SoapTheme {
  /** Card background. */
  tint: string;
  /** Letter badge fill, left rail, section heading, bullet dots. */
  accent: string;
  /** Body copy inside the card. */
  text: string;
}

export const SOAP_THEME: Record<string, SoapTheme> = {
  S: { tint: 'rgb(var(--soap-s-tint))', accent: 'rgb(var(--soap-s))', text: 'rgb(var(--soap-s-text))' },
  O: { tint: 'rgb(var(--soap-o-tint))', accent: 'rgb(var(--soap-o))', text: 'rgb(var(--soap-o-text))' },
  A: { tint: 'rgb(var(--soap-a-tint))', accent: 'rgb(var(--soap-a))', text: 'rgb(var(--soap-a-text))' },
  P: { tint: 'rgb(var(--soap-p-tint))', accent: 'rgb(var(--soap-p))', text: 'rgb(var(--soap-p-text))' },
  NOTE: { tint: 'rgb(var(--soap-note-tint))', accent: 'rgb(var(--soap-note))', text: 'rgb(var(--soap-note-text))' },
};

const FALLBACK = SOAP_THEME.NOTE;

export function soapTheme(code?: string | null) {
  return (code && SOAP_THEME[code]) || FALLBACK;
}

const hasText = (value?: string | null) => Boolean(value && value.trim());

/**
 * Canonical SOAP order. Labels and descriptions match the backend
 * `SoapSummaryParser` so a synthesised empty section is worded identically.
 */
const SOAP_ORDER: ReadonlyArray<{ code: string; label: string; description: string }> = [
  { code: 'S', label: 'Subjective', description: 'History and symptoms reported by the patient' },
  { code: 'O', label: 'Objective', description: 'Vitals and findings observed during the consultation' },
  { code: 'A', label: 'Assessment', description: "Doctor's assessment or suspected diagnosis" },
  { code: 'P', label: 'Plan', description: 'Medicines, tests, advice and follow-up' },
];

export interface SoapSummaryProps {
  sections?: ConsultationSoapSectionResponse[] | null;
  className?: string;
  /** Renders the letter badge. Turn off for very compact layouts. */
  showBadge?: boolean;
  /**
   * Always render all four sections, marking the ones the AI found nothing for as
   * "Not mentioned". Without this only the populated sections appear, so the
   * four-colour scheme collapses to whichever colours happen to have data.
   */
  showAllSections?: boolean;
}

/**
 * Renders the AI transcript summary as colour coded SOAP cards. Falls back to the
 * raw summary text when the backend has not produced sections yet.
 */
export function SoapSummary({
  sections,
  className = '',
  showBadge = true,
  showAllSections = false,
}: SoapSummaryProps) {
  const populated = (sections ?? []).filter(
    (section) => section && (section.items ?? []).some((item) => hasText(item?.text)),
  );

  let visible: ConsultationSoapSectionResponse[];
  if (showAllSections && populated.some((section) => SOAP_ORDER.some((s) => s.code === section.code))) {
    const byCode = new Map(populated.map((section) => [section.code, section]));
    visible = SOAP_ORDER.map((meta) => {
      const existing = byCode.get(meta.code);
      if (existing) return { ...existing, label: existing.label || meta.label };
      return {
        code: meta.code,
        label: meta.label,
        description: meta.description,
        items: [],
      } satisfies ConsultationSoapSectionResponse;
    });
  } else {
    visible = populated;
  }

  if (visible.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 gap-2.5 ${className}`}>
      {visible.map((section) => (
        <SoapCard
          key={section.code + (section.label ?? '')}
          section={section}
          showBadge={showBadge}
          allowEmpty={showAllSections}
        />
      ))}
    </div>
  );
}

function SoapCard({
  section,
  showBadge,
  allowEmpty = false,
}: {
  section: ConsultationSoapSectionResponse;
  showBadge: boolean;
  allowEmpty?: boolean;
}) {
  const theme = soapTheme(section.code);
  const items = (section.items ?? []).filter((item) => hasText(item?.text));
  if (items.length === 0 && !allowEmpty) return null;

  return (
    <section
      className="rounded-[10px] border-l-[3px] px-3 py-2.5"
      style={{ borderLeftColor: theme.accent, backgroundColor: theme.tint, color: theme.text }}
    >
      <header className="mb-1.5 flex items-center gap-2">
        {showBadge && (
          <span
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold"
            // The badge uses the tint as its text colour: the accent and tint sit
            // at opposite ends of the scale in each theme, so this always reads.
            style={{ backgroundColor: theme.accent, color: theme.tint }}
          >
            {section.code === 'NOTE' ? '•' : section.code}
          </span>
        )}
        <h4 className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
          {section.label}
        </h4>
        {section.description && (
          <span className="truncate text-[10px] opacity-70">{section.description}</span>
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-[12px] italic opacity-70">Not mentioned</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${section.code}-${index}`} className="flex gap-1.5 text-[12px] leading-[1.45]">
              <span aria-hidden className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: theme.accent }} />
              <div className="min-w-0 flex-1">
                {hasText(item.label) && (
                  <span className="font-bold" style={{ color: theme.accent }}>
                    {item.label}:{' '}
                  </span>
                )}
                <StructuredItem text={item.text} accent={theme.accent} surface={theme.tint} body={theme.text} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface Field {
  key?: string;
  value: string;
}

/**
 * Splits the summarizer's pipe-delimited medicine format into its parts:
 * "Paracetamol 500 mg | dose: 1 tablet | frequency: twice daily" becomes a name
 * plus labelled chips. Falls back to plain text when there is no pipe.
 */
function parseFields(text: string): { head: string; fields: Field[] } {
  const parts = text
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { head: text, fields: [] };

  const [head, ...rest] = parts;
  const fields = rest.map((part) => {
    const separator = part.indexOf(':');
    if (separator <= 0) return { value: part };
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    return value ? { key, value } : { value: part };
  });
  // Only treat it as structured when the tail really is key/value pairs.
  const structured = fields.length > 0 && fields.every((field) => field.key);
  return { head, fields: structured ? fields : [] };
}

function StructuredItem({
  text,
  accent,
  surface,
  body,
}: {
  text: string;
  accent: string;
  surface: string;
  body: string;
}) {
  const { head, fields } = parseFields(text);

  if (fields.length === 0) return <span>{text}</span>;

  return (
    <div>
      <p className="font-semibold">{head}</p>
      <ul className="mt-1 flex flex-wrap gap-1">
        {fields.map((field, index) => (
          <li
            key={`${field.key ?? 'f'}-${index}`}
            className="rounded-[5px] px-1.5 py-[1px] text-[11px] leading-[1.5]"
            style={{ backgroundColor: surface, border: `1px solid ${accent}` }}
          >
            {field.key && (
              <span className="font-semibold" style={{ color: accent }}>
                {field.key}:{' '}
              </span>
            )}
            <span style={{ color: body }}>{field.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
