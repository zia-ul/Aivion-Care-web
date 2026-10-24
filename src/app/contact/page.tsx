'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, CalendarDays, Mail, MapPin, Phone, Send, Target, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
import { CONTACT_CHANNELS, CONTACT_EMAILS, mailto } from '@/lib/contact-emails';

const contactPoints = [
  { label: 'Phone Support', value: '+91 84493 91441', Icon: Phone, href: 'tel:+918449391441' },
  { label: 'Direct Email', value: 'contact@aiconfidencecure.com', Icon: Mail, href: 'mailto:contact@aiconfidencecure.com' },
  { label: 'Headquarters', value: 'AMU Innovation Foundation, 1st Floor Near Minto Circle School, Minto Circle Road, Aligarh, UP 202001, India', Icon: Building2, href: null },
] as const;

const facts = [
  { value: '24/7', label: 'Ecosystem Telemetry', sub: 'Always monitoring' },
  { value: 'Aligarh & Delhi NCR', label: 'Headquarters & Lab', sub: 'AMUIF Incubated' },
  { value: '< 2 Hours', label: 'Inquiry Response Time', sub: 'Fast support' },
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
        {/* HERO SECTION WITH IMAGE BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-surface-20/80 p-8 sm:p-12 mb-10">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
            <Image
              src="/images/healthcare/telemedicine-call.jpg"
              alt="Contact Aivion Care Team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-10 via-surface-10/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-4">
              <Mail size={14} />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary-light tracking-tight leading-tight">
              Get in Touch with Our <br />
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                Clinical & Technology Team.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-light/80 leading-relaxed">
              Whether you are exploring hospital deployment, clinic onboarding, pharmacy integration, academic research, or career opportunities, our team responds swiftly.
            </p>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">{fact.value}</div>
              <div className="mt-1 text-sm font-semibold text-primary-light">{fact.label}</div>
              <div className="text-xs text-primary-light/60 mt-0.5">{fact.sub}</div>
            </div>
          ))}
        </div>

        {/* TWO-COLUMN CONTACT FORM & INFO */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* CONTACT FORM */}
          <div className="rounded-2xl border border-sky-500/20 bg-surface-20/80 p-6 sm:p-8 backdrop-blur lg:col-span-7">
            <h2 className="text-xl font-bold text-primary-light flex items-center gap-2">
              <Send size={18} className="text-sky-500" /> Send Us a Message
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-primary-light/70">
              Fill out the form below and an engineering or clinical lead will get back to you within 2 business hours.
            </p>

            <form onSubmit={submitContact} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-primary-light mb-1.5">Your Full Name</label>
                  <input
                    name="name"
                    required
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary-light mb-1.5">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="doctor@hospital.org"
                    className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-primary-light mb-1.5">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary-light mb-1.5">Organization / Role</label>
                  <select
                    name="role"
                    className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light focus:border-sky-500 focus:outline-none"
                  >
                    <option value="doctor">Medical Doctor / Specialist</option>
                    <option value="hospital">Hospital / Clinic Administration</option>
                    <option value="pharmacy">Pharmacy / Retail Chemist</option>
                    <option value="pathology">Diagnostic / Pathology Lab</option>
                    <option value="patient">Patient / Family Inquirer</option>
                    <option value="other">Other / Investor / Research</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary-light mb-1.5">Your Message / Inquiry</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us how we can assist your hospital or practice..."
                  className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} /> Thank you! Your message has been sent successfully. We will reach out shortly.
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-500">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-50"
              >
                {status === 'sending' ? 'Transmitting Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* CONTACT CARDS */}
          <div className="space-y-4 lg:col-span-5">
            {contactPoints.map((point) => {
              const IconComponent = point.Icon;
              return (
                <div key={point.label} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-5 backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">{point.label}</h3>
                      {point.href ? (
                        <a href={point.href} className="mt-1 block text-sm font-semibold text-primary-light hover:underline">
                          {point.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-xs sm:text-sm text-primary-light/80 leading-relaxed">{point.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* QUICK ROLE ONBOARDING LINKS */}
            <div className="rounded-2xl border border-tonal-20/70 bg-surface-10 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-light/60 mb-3">Instant Registration</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link href="/register/doctor" className="rounded-lg bg-surface-20 p-2.5 text-center font-medium hover:border-sky-500 border border-transparent transition">
                  Doctor Sign Up
                </Link>
                <Link href="/register/hospital" className="rounded-lg bg-surface-20 p-2.5 text-center font-medium hover:border-sky-500 border border-transparent transition">
                  Hospital Sign Up
                </Link>
                <Link href="/register/pharmacist" className="rounded-lg bg-surface-20 p-2.5 text-center font-medium hover:border-sky-500 border border-transparent transition">
                  Pharmacy Sign Up
                </Link>
                <Link href="/register/pathology" className="rounded-lg bg-surface-20 p-2.5 text-center font-medium hover:border-sky-500 border border-transparent transition">
                  Lab Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
