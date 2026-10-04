'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, HelpCircle, Stethoscope, UserRoundCheck, Video } from 'lucide-react';

const faqs = [
  {
    question: 'What is Aivion Care?',
    answer: 'Aivion Care is a smart healthcare application from AI Confidence Cure that helps patients and families manage appointments, consultations, prescriptions, reports, reminders, and personal health records in one place.',
  },
  {
    question: 'How do I book an appointment?',
    answer: 'Browse specialists, check real availability, and book a consultation in minutes through the patient portal. Same-day slots are available for urgent needs.',
  },
  {
    question: 'Can I consult a doctor remotely?',
    answer: 'Yes. Video consultations connect patients and doctors through secure digital sessions with screen sharing, recording, and transcription support.',
  },
  {
    question: 'Is my health data secure?',
    answer: 'Aivion Care uses role-based access, secure authentication, encrypted sessions, and controlled data access. We never sell personal or health data.',
  },
  {
    question: 'Who can use the platform?',
    answer: 'Patients, doctors, hospital heads, receptionists, pharmacists, pathologists, lab assistants, and super admins each get a purpose-built workspace.',
  },
  {
    question: 'How does AI assist care without replacing clinicians?',
    answer: 'AI supports healthcare professionals by organizing consultation information, summarizing documents, and surfacing structured context. Clinical judgement always stays with the treating professional.',
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">FAQs</p>
        <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
          Questions you might have
        </h2>
        <p className="mt-5 leading-7 text-primary-light/60">
          Everything you need to know about Aivion Care before getting started. Cannot find your answer? Reach out to our support team.
        </p>
      </div>

      <div className="mt-10 max-w-3xl space-y-3">
        {faqs.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={question}
              className={`overflow-hidden rounded-2xl border backdrop-blur transition ${
                isOpen
                  ? 'border-sky-400/40 bg-sky-500/10'
                  : 'border-tonal-20/70 bg-surface-20/60'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-primary-light sm:text-base">
                  <HelpCircle size={18} className="shrink-0 text-sky-400" aria-hidden="true" />
                  {question}
                </span>
                {isOpen ? (
                  <ArrowUp size={18} className="shrink-0 text-sky-400" />
                ) : (
                  <ArrowDown size={18} className="shrink-0 text-sky-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <p className="text-sm leading-7 text-primary-light/60">{answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-sky-400 transition hover:-translate-y-0.5 hover:border-accent/50">
          <Stethoscope size={16} /> Contact support
        </a>
        <a href="/privacy-policy" className="inline-flex items-center gap-2 rounded-2xl border border-sky-500/20 bg-surface-20/60 px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:-translate-y-0.5 hover:border-accent/50">
          <UserRoundCheck size={16} /> Privacy Policy
        </a>
      </div>
    </section>
  );
}
