import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HeartPulse, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28 overflow-hidden">
      
      {/* Background Heart Rate Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/30 bg-slate-950/90 px-6 py-14 text-center sm:px-14 shadow-2xl backdrop-blur-2xl">
        
        {/* Real Hospital Clinic Visual Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/images/healthcare/doctor-patient-care.jpg"
            alt="Connected Healthcare Final CTA"
            fill
            className="object-cover opacity-20 transition-transform duration-1000 hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>

        {/* Ambient Radiant Glow Centered */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

        {/* Brand Logo with Heartbeat Animation */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/40 bg-sky-500/15 p-2 shadow-2xl shadow-sky-500/30 backdrop-blur-md">
          <Image
            src="/aivion-care-logo.png"
            alt="Aivion Care Logo"
            fill
            className="object-contain p-2 animate-heartbeat"
          />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
          <Zap size={14} className="text-cyan-300 animate-bounce" /> The Proactive Healthcare Shift
        </div>

        <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
          Connect With <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Smarter Healthcare.</span>
        </h2>

        {/* Moving Heart Rate ECG Monitor Line */}
        <div className="mx-auto mt-4 h-10 max-w-md text-cyan-400">
          <svg viewBox="0 0 320 40" className="h-full w-full drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" preserveAspectRatio="none">
            <path
              d="M0 20 h60 l8 -12 l6 24 l6 -16 l8 4 h50 l8 -12 l6 24 l6 -16 l8 4 h70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="animate-ecg-dash"
            />
          </svg>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 font-medium">
          Access verified doctor appointments, continuous 24/7 telemetry monitoring, universal medical records, and autonomous clinical intelligence through Aivion Care. <span className="text-teal-300 font-bold">Your health, connected — pure signal, zero cap.</span>
        </p>

        <div className="mt-8 flex flex-col justify-center items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-sky-500/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-cyan-400/40"
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50"
          >
            <span>Launch Care Portal</span>
          </Link>

          <a
            href={process.env.NEXT_PUBLIC_ANDROID_APK_DRIVE_URL || "https://drive.google.com/drive/folders/1aivion-care-apk-download"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/15 dark:bg-teal-500/15 px-6 py-4 text-base font-bold text-teal-800 dark:text-teal-200 transition-all duration-300 hover:bg-teal-500/25"
          >
            <span>Android APK</span>
          </a>
        </div>

        {/* Reassurance Badges */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <HeartPulse size={15} className="text-rose-400 animate-heartbeat" /> 24/7 Live Monitoring
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={15} className="text-teal-400" /> AMUIF Incubated Tech
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles size={15} className="text-cyan-400" /> Zero Cost Verification OTPs
          </span>
        </div>

      </div>
    </section>
  );
}
