'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Activity, 
  HeartPulse, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Clock,
  Waves,
  Building2,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  image: string;
  problemBadge: string;
  problemText: string;
  solutionBadge: string;
  solutionTitle: string;
  solutionPunchline: string;
  description: string;
  stats: string;
  statsLabel: string;
  actionText: string;
  actionHref: string;
}

const slides: Slide[] = [
  {
    id: 'emergency-prevention',
    tag: 'Continuous Biometric Surveillance',
    image: '/images/healthcare/smart-monitoring.jpg',
    problemBadge: 'The Problem: Waiting till it hurts',
    problemText: 'Delayed ER visits & sudden cardiac decompensation happen because routine checkups only capture 1 minute of your year.',
    solutionBadge: 'Aivion Care Solution · Zero Cap',
    solutionTitle: '24/7 Live Telemetry Engine',
    solutionPunchline: 'Pure signal. Zero panic. Catch anomalies before emergencies.',
    description: 'Autonomous ECG, HRV, SpO₂ and temperature streaming connected to licensed clinical care teams in real time.',
    stats: '99.8%',
    statsLabel: 'Real-time Signal Integrity',
    actionText: 'Experience Live Telemetry',
    actionHref: '/login',
  },
  {
    id: 'doctor-queue',
    tag: 'Next-Gen Doctor Consultations',
    image: '/images/healthcare/doctor-consulting.jpg',
    problemBadge: 'The Problem: Endless paperwork & queues',
    problemText: 'Spending 3 hours in crowded waiting rooms just to repeat your medical history over and over again.',
    solutionBadge: 'Aivion Care Solution · Instant Access',
    solutionTitle: 'Instant Digital Doctor Loop',
    solutionPunchline: 'Direct specialist access in minutes. Your health hits different.',
    description: 'Book verified MDs, join secure HD video consults, and auto-share live biometric charts without touching a paper folder.',
    stats: '< 5 Mins',
    statsLabel: 'Average Consultation Queue',
    actionText: 'Connect With Doctors',
    actionHref: '/login',
  },
  {
    id: 'icu-monitoring',
    tag: 'Smart ICU & Ward Telemetry',
    image: '/images/healthcare/icu-ward.jpg',
    problemBadge: 'The Problem: Critical care blind spots',
    problemText: 'Nurses manual rounds every 2 hours leave 110 minutes of unmonitored risk where subtle vital decompensation begins.',
    solutionBadge: 'Aivion Care Solution · Smart ICU',
    solutionTitle: 'Autonomous Ward Telemetry Hub',
    solutionPunchline: 'Always monitoring every bed. No blind spots, ever.',
    description: 'Continuous bedside telemetry, wireless telemetry badges, and early warning NEWS2 risk scoring directly on ward monitors.',
    stats: '24/7/365',
    statsLabel: 'Continuous Bedside Vigilance',
    actionText: 'Explore Hospital Telemetry',
    actionHref: '/register',
  },
  {
    id: 'clinical-ai',
    tag: 'Physician-Copilot Intelligence',
    image: '/images/healthcare/digital-tablet-doctor.jpg',
    problemBadge: 'The Problem: Clinician Burnout & Errors',
    problemText: 'Doctors spend up to 45% of their working day manually typing notes, risking diagnostic fatigue and missed contraindications.',
    solutionBadge: 'Aivion Care Solution · Neural Copilot',
    solutionTitle: 'Autonomous Neural SOAP & Safety',
    solutionPunchline: 'AI handles the charting. Doctors handle the healing.',
    description: 'Real-time voice-to-SOAP generation and CYP450 drug interaction screening verified by certified doctors.',
    stats: '180ms',
    statsLabel: 'Safety Cross-Reference Speed',
    actionText: 'Launch Clinical AI',
    actionHref: '/register',
  },
  {
    id: 'surgery-theatre',
    tag: 'Surgical & Post-Op Recovery',
    image: '/images/healthcare/surgery-theatre.jpg',
    problemBadge: 'The Problem: Post-op complications at home',
    problemText: 'Discharged surgical patients often fail to recognise early signs of internal infection or cardiovascular strain.',
    solutionBadge: 'Aivion Care Solution · Post-Op Loop',
    solutionTitle: 'Digital Post-Op Discharge Shield',
    solutionPunchline: 'Hospital-level precision that follows you all the way home.',
    description: 'Continuous biometric monitoring and automated daily post-surgical symptom checklists sent directly to the surgical team.',
    stats: '-65%',
    statsLabel: 'Readmission Risk Reduction',
    actionText: 'Surgical Post-Op Care',
    actionHref: '/login',
  },
  {
    id: 'connected-hospital',
    tag: 'Whole-Facility Synchronization',
    image: '/images/healthcare/hospital-interior.jpg',
    problemBadge: 'The Problem: Siloed Healthcare Deserts',
    problemText: 'Hospitals, standalone labs, and pharmacies rarely talk to each other, creating disconnected records and lost reports.',
    solutionBadge: 'Aivion Care Solution · Unified System',
    solutionTitle: 'One Ecosystem. One Record.',
    solutionPunchline: 'Hospitals, labs, beds & pharmacies on one live dashboard.',
    description: 'Role-based access for nurses, receptionists, surgeons and patients with automatic WhatsApp & email notifications.',
    stats: '100%',
    statsLabel: 'Unified Clinical Synchronization',
    actionText: 'Hospital Onboarding',
    actionHref: '/register',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-dark pt-28 sm:pt-32 pb-16 sm:pb-24" aria-labelledby="hero-title">
      
      {/* Heart Rate Monitor Ambient Grid Background with Moving Glowing Lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Animated Scanline moving top to bottom like medical oscilloscope */}
        <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scanline" />
      </div>

      {/* Ambient Radial AI Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 transform-gpu rounded-full bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-cyan-500/15 blur-3xl" />

      {/* Top Floating Logo & Brand Banner */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-3.5 sm:px-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Downloaded Aivion Care Logo with heartbeat pulse */}
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-2xl border border-sky-400/40 bg-sky-500/10 p-1.5 shadow-lg shadow-sky-500/25">
              <Image
                src="/aivion-care-logo.png"
                alt="Aivion Care Logo"
                fill
                className="object-contain animate-heartbeat p-1"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Aivion Care
                </span>
                <span className="rounded-full bg-teal-500/20 border border-teal-500/40 px-2 py-0.5 text-[10px] font-bold text-teal-300 uppercase tracking-widest">
                  AMUIF Incubated
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Connected Clinical Operating System · Pure Signal, Zero Cap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live ECG heartbeat ticker */}
            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cyan-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <HeartPulse size={16} className="text-rose-400 animate-heartbeat-fast" />
              <span className="font-mono font-bold">72 BPM</span>
              <span className="text-slate-400 text-[11px]">Normal Sinus</span>
            </div>

            {/* Slide Controller */}
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                aria-label="Previous story slide"
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                className="p-1.5 rounded-xl text-cyan-300 hover:text-white hover:bg-white/10 transition"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                aria-label="Next story slide"
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Hero / Problem & Solution Video-Style Slider */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-slate-950/85 shadow-2xl backdrop-blur-2xl">
          
          {/* Ambient Corner Radiance */}
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />

          {/* Continuous Moving Heart Rate Monitor Header Strip */}
          <div className="relative flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                {slide.tag}
              </span>
            </div>

            {/* Moving Heart Rate ECG SVG Line (Continuous Animation) */}
            <div className="hidden md:flex items-center h-8 w-72 text-cyan-400 overflow-hidden">
              <svg viewBox="0 0 280 40" className="h-full w-full drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" preserveAspectRatio="none">
                <path 
                  d="M0 20 h40 l8 -12 l6 24 l6 -16 l8 4 h30 l8 -12 l6 24 l6 -16 l8 4 h30 l8 -12 l6 24 l6 -16 l8 4 h60" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  className="animate-ecg-dash"
                />
              </svg>
            </div>

            {/* Slide Index Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-gradient-to-r from-sky-400 to-teal-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Grid Layout: Visual Showcase (Video & Hospital Scene) + Gen-Z Punchline Narrative */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-6 sm:p-10 lg:p-12 items-center">
            
            {/* Visual Screen Box with Background Image and Live Overlay */}
            <div className="flex flex-col gap-3">
              <div className="relative group overflow-hidden rounded-[30px] border border-cyan-400/30 bg-slate-900/95 shadow-2xl h-[380px] sm:h-[450px]">
                
                {/* High-res Clinical Background Image with Enhanced Visibility */}
                <Image
                  src={slide.image}
                  alt={slide.solutionTitle}
                  fill
                  className="object-cover opacity-85 transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 650px"
                  priority
                />

                {/* Subtle Vignette so text stays ultra-readable while image remains vibrant */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/20" />

                {/* Heart Rate Monitor Oscilloscope Grid Overlay */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Top Banner inside visual box */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-slate-950/80 px-3.5 py-1 text-xs font-bold text-rose-300 backdrop-blur-md shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" /> {slide.problemBadge}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/50 bg-slate-950/80 px-3.5 py-1 text-xs font-extrabold text-teal-300 backdrop-blur-md uppercase tracking-wider shadow-lg">
                    <CheckCircle2 size={14} className="text-teal-400" /> Solved by AI
                  </span>
                </div>

                {/* Middle Problem Box */}
                <div className="absolute top-16 left-4 right-4 rounded-2xl border border-white/15 bg-slate-950/85 p-3.5 backdrop-blur-md shadow-xl z-10">
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                    ⚠️ {slide.problemText}
                  </p>
                </div>

                {/* Bottom Telemetry Card: Live Waveform & Heart Pulse */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-400/40 bg-slate-950/92 p-4 backdrop-blur-xl shadow-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                        <Image
                          src="/aivion-care-logo.png"
                          alt="Logo"
                          width={28}
                          height={28}
                          className="object-contain animate-heartbeat"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {slide.solutionBadge}
                        </p>
                        <p className="text-sm font-extrabold text-white">
                          {slide.solutionTitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-teal-300 font-mono">
                        {slide.stats}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        {slide.statsLabel}
                      </p>
                    </div>
                  </div>

                  {/* Moving SVG ECG Line */}
                  <div className="mt-2.5 h-12 w-full text-cyan-400">
                    <svg viewBox="0 0 500 50" className="h-full w-full drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" preserveAspectRatio="none">
                      <path 
                        d="M0 25 h80 l10 -15 l8 32 l8 -22 l10 5 h80 l10 -15 l8 32 l8 -22 l10 5 h80 l10 -15 l8 32 l8 -22 l10 5 h140" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        className="animate-ecg-dash"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Slider Thumbnails Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`group relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105' 
                        : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <Image
                      src={s.image}
                      alt={s.solutionTitle}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Narrative Box: Gen-Z Punchlines, Clarity, Call to Action */}
            <div className="flex flex-col justify-center">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-300 w-fit">
                <Zap size={14} className="text-cyan-300 animate-bounce" /> {slide.solutionBadge}
              </div>

              <h1 id="hero-title" className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                {slide.solutionTitle}
              </h1>

              {/* Gen-Z Punchline */}
              <p className="mt-4 text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                &ldquo;{slide.solutionPunchline}&rdquo;
              </p>

              <p className="mt-4 text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                {slide.description}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Aivion Care connects patients, doctors, hospitals, labs, and pharmacies into one unified live feed. No cap, no silos, just seamless care.
              </p>

              {/* Call to Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={slide.actionHref}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-400/35"
                >
                  <span>{slide.actionText}</span>
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APK_DRIVE_URL || "https://drive.google.com/drive/folders/1aivion-care-apk-download"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-6 py-4 text-sm font-bold text-teal-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-teal-500/20"
                >
                  <Smartphone size={17} /> Download Android App
                </a>

                <a
                  href="https://www.aiconfidencecure.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
                >
                  <span>Company Site</span>
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Bottom Quick Feature Highlights with Heartbeat Icon */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <HeartPulse size={16} className="text-rose-400 animate-heartbeat" />
                  <span>24/7 Heartbeat Loop</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Activity size={16} className="text-cyan-400" />
                  <span>Moving ECG Lines</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck size={16} className="text-teal-400" />
                  <span>Doctor Verified</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
