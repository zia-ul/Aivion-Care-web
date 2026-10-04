import Link from 'next/link';
import { ArrowRight, Activity, CalendarDays, HeartPulse, Lightbulb, Pill, Thermometer, Waves } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-dark pt-32 sm:pt-36" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28">
        <div className="relative z-10">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-support font-semibold uppercase tracking-[0.14em] text-sky-400 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-success-light animate-pulse" /> AMUIF-incubated health-tech startup
          </p>
          <h1 id="hero-title" className="max-w-xl text-headline font-bold leading-tight text-primary-light sm:text-6xl animate-fade-in-up">
            Building proactive healthcare around 24/7 monitoring and earlier diagnosis.
          </h1>
          <p className="mt-6 max-w-xl text-xl font-semibold leading-8 text-primary-light/85 animate-fade-in-up animation-delay-200">
            Aivion Care is a connected healthcare platform — available on web and mobile — shifting care from reactive treatment to preventive, always-on monitoring.
          </p>
          <p className="mt-4 max-w-xl leading-7 text-primary-light/60 animate-fade-in-up animation-delay-300">
            Whether you are on your desktop at home or on the go, Aivion Care brings appointments, consultations, prescriptions, health records, monitoring and intelligent healthcare workflows together in one connected platform. Your health, finally connected — no cap.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 animate-fade-in-up animation-delay-400">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-input bg-accent-fill px-5 py-3 font-bold text-white hover:bg-accent-fill/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20">
                Login <ArrowRight size={18} />
              </Link>
              <a href="https://www.aiconfidencecure.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-input border border-sky-500/20 bg-sky-500/5 px-5 py-3 font-semibold text-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5">
                Visit company site <ArrowRight size={18} />
              </a>
            </div>
            <p className="text-support text-primary-light/70">
              New here?{' '}
              <Link href="/register" className="font-semibold text-accent underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl animate-fade-in-up animation-delay-500">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-sky-500/20 via-transparent to-teal-500/20 blur-xl opacity-60" />
      <div className="relative rounded-card border border-sky-500/20 bg-surface-10 p-4 shadow-soft sm:p-6 backdrop-blur">
        <div className="flex items-center justify-between border-b border-tonal-20/70 pb-4">
          <div>
            <p className="text-support uppercase tracking-[0.14em] text-primary-light/45">Patient overview</p>
            <p className="mt-1 font-semibold text-primary-light">Good morning, Alex</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success-light">
            <Activity size={18} />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {([
            ['Heart rate', '72', 'bpm', HeartPulse],
            ['SpO₂', '98', '%', Waves],
            ['Temperature', '36.6', '°C', Thermometer],
          ] as const).map(([label, value, unit, Icon]) => (
            <div key={String(label)} className="rounded-input bg-surface-20 p-3 transition-all hover:-translate-y-0.5 hover:border-sky-400/30">
              <Icon size={16} className="text-sky-400" />
              <p className="mt-3 text-support text-primary-light/50">{label}</p>
              <p className="mt-1 text-lg font-bold text-primary-light">
                {value}<span className="ml-1 text-support font-normal text-primary-light/50">{unit}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-input bg-surface-20 p-4">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">ECG / PCG signal</p>
              <span className="flex items-center gap-1 text-support text-success-light">
                <span className="h-1.5 w-1.5 rounded-full bg-success-light animate-pulse" /> Live
              </span>
            </div>
            <div className="mt-4 flex h-16 items-center overflow-hidden text-sky-400">
              <svg viewBox="0 0 360 70" className="h-full w-full" role="img" aria-label="Live health signal waveform" preserveAspectRatio="none">
                <path d="M0 37h38l8-1 8 1 8-19 8 38 8-20h30l8 1 8-1 8-18 8 37 8-19h38l8-1 8 1 8-18 8 37 8-19h30l8 1 8-1 8-18 8 37 8-19h38" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
              </svg>
            </div>
            <p className="mt-2 text-support text-primary-light/45">Updated just now</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-input border border-warning/25 bg-warning/10 p-3">
              <div className="flex items-center gap-2 text-warning-light">
                <Lightbulb size={16} /><span className="text-support font-semibold">AI insight</span>
              </div>
              <p className="mt-2 text-support leading-5 text-primary-light/65">Your latest readings are within your usual range.</p>
            </div>
            <div className="rounded-input bg-surface-20 p-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-sky-400" /><span className="text-support font-semibold">Next appointment</span>
              </div>
              <p className="mt-2 text-support text-primary-light/65">Today · 10:30 AM</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-input border border-success/20 bg-success/10 p-3 text-support text-success-light">
          <Pill size={16} /> Medication reminder · Take after breakfast
        </div>
      </div>
    </div>
  );
}

