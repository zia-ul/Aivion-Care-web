'use client';

import { ArrowRight } from 'lucide-react';
import FeedbackForm from '@/components/landing/FeedbackForm';
import PageShell from '@/components/landing/PageShell';import { SectionHeader } from '@/components/landing/common';

export const dynamic = 'force-dynamic';

export default function FeedbackPage() {
  return (
    <PageShell>
      <main>
        <div className="max-w-2xl">
          <SectionHeader
            eyebrow="Feedback"
            title="Tell us how we are doing"
            description="Your feedback helps us improve Aivion Care for patients, doctors, hospitals and communities. It only takes a minute."
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <FeedbackForm
            title="Share your experience"
            description="Rate your experience and tell us what is working or what we can improve."
            showRating
            showEmail
            submitLabel="Submit feedback"
            onSubmit={async (data) => {
              // TODO: wire to /api/feedback endpoint
              console.log('Feedback submitted:', data);
            }}
          />

          <div className="space-y-6">
            <div className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <h3 className="text-heading font-bold text-primary-light">Why we ask</h3>
              <p className="mt-3 text-sm leading-6 text-primary-light/60">
                Every piece of feedback shapes the roadmap. Whether you are a patient, doctor, hospital staff member or community partner, your voice matters.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <h3 className="text-heading font-bold text-primary-light">Need help instead?</h3>
              <p className="mt-3 text-sm leading-6 text-primary-light/60">
                Start a conversation with our 24/7 chatbot or contact the support team directly.
              </p>
              <a href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Contact support <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
