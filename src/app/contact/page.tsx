'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Building2, CalendarDays, Mail, MapPin, Phone, Send, Target } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const contactPoints = [
  { label: 'Email', value: 'support@aiconfidencecure.com', Icon: Mail, href: 'mailto:support@aiconfidencecure.com' },
  { label: 'Phone', value: '+91 84493 91441', Icon: Phone, href: 'tel:+918449391441' },
  { label: 'Office', value: 'AMU Innovation Foundation, 1st Floor Near Minto Circle School, Minto Circle Road, Aligarh, UP 202001, India', Icon: Building2, href: null },
] as const;

const facts = [
  { value: 'Early', label: 'Startup stage' },
  { value: 'Aligarh', label: 'Based in' },
  { value: 'Preventive care', label: 'Focus' },
] as const;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message || 'Contact request failed');
      }
      form.reset();
      setStatus('success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'We could not send your message.');
      setStatus('error');
    }
  }

  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Contact"
          title="Reach the team behind Aivion Care."
          description="Whether you are exploring pilots, internships, incubation support, or collaborations, the team would love to hear from you."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="animate-fade-in-up rounded-2xl border border-sky-500/15 bg-surface-20/60 p-5 text-center backdrop-blur">
              <p className="text-xl font-bold text-sky-400">{fact.value}</p>
              <p className="mt-1 text-support text-muted-foreground">{fact.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <h2 className="text-heading font-bold text-primary-light">Office Details</h2>
            <div className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-5 backdrop-blur">
              <p className="flex items-start gap-3 text-sm leading-6 text-primary-light/70">
                <MapPin size={17} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
                {contactPoints[2].value}
              </p>
              <p className="mt-3 flex items-start gap-3 text-sm leading-6 text-primary-light/70">
                <CalendarDays size={17} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
                Saturday - Sunday, 10:00 AM to 4:00 PM
              </p>
            </div>

            <h2 className="pt-2 text-heading font-bold text-primary-light">Location</h2>
            <div className="relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <div className="absolute inset-0 opacity-40" aria-hidden="true">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-sky-500/20" />
                <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full border border-teal-500/20" />
              </div>
              <div className="relative">
                <h3 className="font-semibold text-primary-light">AMU Innovation Foundation, Aligarh</h3>
                <p className="mt-2 text-sm leading-6 text-primary-light/55">
                  This section is ready for an embedded map whenever the contact flow moves from starter site to a production operations setup.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-heading font-bold text-primary-light">Inquiry Form</h2>
            <p className="mt-2 text-sm leading-6 text-primary-light/60">
              Tell us how you want to collaborate. Use the form to reach out about pilots, partnerships, media, mentorship, or internship interest.
            </p>

            <form onSubmit={submitContact} className="mt-6 rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-primary-light">
                  Name
                  <input name="name" type="text" required placeholder="Your name" className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400" />
                </label>
                <label className="block text-sm font-medium text-primary-light">
                  Email
                  <input name="email" type="email" required placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400" />
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-primary-light">
                  Phone
                  <input name="phone" type="tel" placeholder="+91" className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400" />
                </label>
                <label className="block text-sm font-medium text-primary-light">
                  Company
                  <input name="company" type="text" placeholder="Organisation" className="mt-2 w-full rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400" />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium text-primary-light">
                Message
                <textarea name="message" required rows={6} placeholder="Tell us how you want to collaborate..." className="mt-2 w-full resize-y rounded-2xl border border-sky-500/20 bg-surface-10 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-sky-400" />
              </label>
              <button type="submit" disabled={status === 'sending'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3.5 font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
                {status !== 'sending' && <ArrowRight size={17} />}
              </button>
              {status === 'success' && (
                <p className="mt-4 rounded-2xl bg-success/10 p-3 text-sm text-success-light" role="status">Your inquiry was sent. We will get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="mt-4 rounded-2xl bg-danger/10 p-3 text-sm text-danger-light" role="alert">{errorMessage || 'We could not send your message. Please try again or email support@aiconfidencecure.com.'}</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6 text-center backdrop-blur sm:p-10">
          <h2 className="text-section font-bold text-primary-light">Let us build preventive healthcare with stronger visibility and better coordination.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-light/60">
            The team is open to conversations about product pilots, ecosystem partnerships, startup support, and internship collaboration.
          </p>
          <a href="mailto:support@aiconfidencecure.com" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400">
            Send Inquiry <ArrowRight size={17} />
          </a>
        </div>
      </main>
    </PageShell>
  );
}

