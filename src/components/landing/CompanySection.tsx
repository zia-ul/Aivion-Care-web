'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Activity, ArrowUpRight, Building2, HeartPulse, Loader2, Radio, Send } from 'lucide-react';

const capabilities = [
  ['Artificial intelligence', Activity],
  ['Medical technology', Building2],
  ['Connected healthcare', Radio],
  ['Digital health', HeartPulse],
] as const;

export default function CompanySection() {
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
    <section id="contact" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto grid max-w-container items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-success-light">AI Confidence Cure</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">Building Medical Technology With AI</h2>
          <p className="mt-5 leading-7 text-primary-light/60">AI Confidence Cure is building healthcare technology that combines artificial intelligence, connected devices and software to improve how healthcare information is collected, managed and used.</p>
          <Link href="https://www.aiconfidencecure.com/" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary-50">Visit AI Confidence Cure <ArrowUpRight size={16} /></Link>
          <div className="mt-8 grid grid-cols-2 gap-3">{capabilities.map(([label, Icon]) => <div key={label} className="rounded-card border border-tonal-20/70 bg-tonal-0 p-4"><Icon size={20} className="text-accent" /><p className="mt-5 text-sm font-semibold text-primary-light">{label}</p></div>)}</div>
        </div>

        <form method="post" action="/api/contact" onSubmit={submitContact} className="rounded-card border border-tonal-20/70 bg-tonal-0 p-5 shadow-soft sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-support font-semibold uppercase tracking-[0.14em] text-success-light">Contact support</p><h3 className="mt-2 text-heading font-bold text-primary-light">Have a question or issue?</h3><p className="mt-2 text-sm leading-6 text-primary-light/55">Send us a message and our team will reply at your email address.</p></div><Send className="mt-1 shrink-0 text-accent" size={21} /></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="name" label="Name" placeholder="Your name" /><Field name="email" label="Email" type="email" placeholder="you@example.com" /></div>
          <div className="mt-4"><Field name="subject" label="Subject" placeholder="What can we help with?" /></div>
          <label className="mt-4 block text-sm font-medium text-primary-light">Query or issue<textarea name="message" required rows={5} placeholder="Tell us how we can help..." className="mt-2 w-full resize-y rounded-input border border-tonal-20 bg-surface-20 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-accent" /></label>
          <button type="submit" disabled={status === 'sending'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-input bg-accent px-5 py-3.5 font-bold text-tonal-0 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60">{status === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send message'}</button>
          {status === 'success' && <p className="mt-4 rounded-input bg-success/10 p-3 text-sm text-success-light" role="status">Your message was sent. We will get back to you soon.</p>}
          {status === 'error' && <p className="mt-4 rounded-input bg-danger/10 p-3 text-sm text-danger-light" role="alert">{errorMessage || 'We could not send your message. Please try again or email support@aiconfidencecure.com.'}</p>}
        </form>
      </div>
    </section>
  );
}

function Field({ name, label, placeholder, type = 'text' }: { name: string; label: string; placeholder: string; type?: string }) {
  return <label className="block text-sm font-medium text-primary-light">{label}<input name={name} type={type} required placeholder={placeholder} className="mt-2 w-full rounded-input border border-tonal-20 bg-surface-20 px-4 py-3 text-sm text-primary-light outline-none placeholder:text-primary-light/35 focus:border-accent" /></label>;
}
