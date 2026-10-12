import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Activity, CalendarDays, HeartPulse, Sparkles, Pill, Thermometer, Waves, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-dark pt-32 sm:pt-36" aria-labelledby="hero-title">
      {/* Dynamic ambient AI glow background */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#14b8a6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 shadow-sm shadow-sky-500/10 backdrop-blur-md animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            AMUIF-incubated health-tech startup
          </div>

          <h1 id="hero-title" className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1] animate-fade-in-up">
            Building proactive healthcare around <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">24/7 AI monitoring</span> and earlier diagnosis.
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-200 sm:text-xl animate-fade-in-up animation-delay-200">
            Aivion Care is the next-gen clinical operating system — shifting care from reactive treatment to always-on continuous monitoring. <span className="text-teal-300 font-bold">Pure signal, zero cap.</span>
          </p>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base animate-fade-in-up animation-delay-300">
            Real-time biometric telemetry, instant digital doctor queues, and autonomous clinical intelligence unified into one ecosystem. Your health journey hits different when AI has your back 24/7.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 animate-fade-in-up animation-delay-400">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-400/30"
              >
                <span>Launch Portal</span>
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <a
                href={process.env.NEXT_PUBLIC_ANDROID_APK_DRIVE_URL || "https://drive.google.com/drive/folders/1aivion-care-apk-download"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-6 py-3.5 text-sm font-bold text-teal-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-teal-500/20"
              >
                <Smartphone size={17} /> Get Android APK
              </a>

              <a
                href="https://www.aiconfidencecure.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
              >
                <span>Company Site</span>
                <ArrowRight size={15} />
              </a>
            </div>

            <p className="text-xs text-slate-400 sm:text-sm">
              Ready to upgrade your care?{' '}
              <Link href="/register" className="font-semibold text-sky-400 underline-offset-4 hover:underline">
                Create free account
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
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/30 via-teal-500/20 to-cyan-500/30 blur-2xl opacity-70" />
      
      <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        
        {/* Subtle Hospital Tech Background Banner with Gradient Mask */}
        <div className="relative mb-5 h-28 w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/images/healthcare/smart-monitoring.jpg"
            alt="AI Clinical Telemetry & Monitoring"
            fill
            className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 550px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Zap size={14} className="animate-bounce" /> Live Telemetry Feed
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-emerald-300 border border-emerald-500/30 uppercase">
              100% Signal Integrity
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">Continuous Vitals Loop</p>
            <p className="mt-0.5 text-lg font-bold text-white">Alex Morgan (ID #4092)</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/20">
            <Activity size={20} />
          </span>
        </div>

        {/* 3 Metric Tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
          {([
            ['Heart Rate', '72', 'bpm', HeartPulse, 'text-rose-400'],
            ['SpO₂', '98', '%', Waves, 'text-sky-400'],
            ['Core Temp', '36.6', '°C', Thermometer, 'text-amber-400'],
          ] as const).map(([label, value, unit, Icon, colorClass]) => (
            <div
              key={String(label)}
              className="group rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.06]"
            >
              <Icon size={18} className={colorClass} />
              <p className="mt-2.5 text-[11px] font-semibold text-slate-400">{label}</p>
              <p className="mt-0.5 text-base font-extrabold text-white sm:text-lg">
                {value}<span className="ml-1 text-xs font-normal text-slate-400">{unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ECG Live Stream & Insights */}
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">ECG / PCG Waveform</p>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Streaming
              </span>
            </div>
            
            <div className="mt-3 flex h-16 items-center overflow-hidden text-cyan-400">
              <svg viewBox="0 0 360 70" className="h-full w-full drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" role="img" aria-label="Live cardiac telemetry" preserveAspectRatio="none">
                <path d="M0 37h38l8-1 8 1 8-19 8 38 8-20h30l8 1 8-1 8-18 8 37 8-19h38l8-1 8 1 8-18 8 37 8-19h30l8 1 8-1 8-18 8 37 8-19h38" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Pan-Tompkins verified · Normal sinus rhythm</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Sparkles size={14} /> AI Copilot
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                Stable vitals across all continuous parameters.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <CalendarDays size={14} className="text-teal-400" /> Next Check-in
              </div>
              <p className="mt-1 text-xs text-slate-200 font-semibold">Today · 10:30 AM (Confirmed)</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
          <Pill size={16} /> Medication Reminder: Amoxicillin 500mg taken after breakfast.
        </div>
      </div>
    </div>
  );
}
