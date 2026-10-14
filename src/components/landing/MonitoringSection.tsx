'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Activity, AlertTriangle, HeartPulse, Thermometer, Waves, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MonitoringSection() {
  const [bpm, setBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [temp, setTemp] = useState(36.6);

  useEffect(() => {
    const timer = setInterval(() => {
      setBpm((prev) => {
        const delta = (Math.random() - 0.49) * 3;
        return Math.max(68, Math.min(82, Math.round(prev + delta)));
      });
      setSpo2((prev) => {
        const delta = Math.random() > 0.6 ? 1 : -1;
        return Math.max(97, Math.min(100, prev + delta));
      });
      setTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Number((Math.max(36.4, Math.min(37.0, prev + delta))).toFixed(1));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
          <Sparkles size={13} className="text-teal-600 dark:text-teal-300" /> Continuous Biomarker Stream
        </p>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary-light sm:text-4xl lg:text-5xl">
          Turn Raw Vitals Into <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">Instant Clinical Intel.</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-primary-light/85 sm:text-lg">
          No waiting for emergency bells or guessing trends. Aivion Care pairs connected telemetry hardware with deep learning models to catch anomalies before they escalate. Real-time data, zero guesswork — pure peace of mind.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {['SpO₂ Telemetry', 'HRV & Arrhythmia', 'Core Temp', 'Digital PCG', 'NEWS2 Decompensation'].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-tonal-20 bg-surface-20 px-3.5 py-1.5 text-xs font-semibold text-primary-light/80 transition-all hover:border-cyan-400/50 hover:bg-surface-30"
            >
              <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400" /> {item}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-tonal-20 bg-surface-20/60 p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-primary-light/60">
            Clinical Telemetry Notice: Continuous streaming metrics provide physiological context for care teams and early warning indicators without overriding registered physician diagnosis.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-tonal-20 bg-surface-20/95 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        {/* Real hospital image preview */}
        <div className="relative mb-5 h-36 w-full overflow-hidden rounded-2xl border border-tonal-20">
          <Image
            src="/images/healthcare/doctor-consulting.jpg"
            alt="Doctor reviewing connected telemetry"
            fill
            className="object-cover opacity-70 transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-10 via-surface-10/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
              <Activity size={15} /> Multi-Channel Patient Monitor
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase">
              Connected Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-tonal-20 pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Station Ward Unit 4</p>
            <p className="mt-0.5 text-lg font-bold text-primary-light">Live Clinical Synchrony</p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Synchronized
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {([
            ['Heart Rate', `${bpm} bpm`, HeartPulse, 'text-rose-500 dark:text-rose-400'],
            ['SpO₂ Oxygen', `${spo2}%`, Waves, 'text-sky-600 dark:text-sky-400'],
            ['Core Temp', `${temp} °C`, Thermometer, 'text-amber-600 dark:text-amber-400'],
          ] as const).map(([label, value, Icon, colorClass]) => (
            <div key={String(label)} className="rounded-2xl border border-tonal-20 bg-surface-30/60 p-2.5 sm:p-3.5 transition-all duration-300 hover:border-cyan-400/40">
              <Icon size={19} className={colorClass} />
              <p className="mt-2 text-[11px] font-semibold leading-tight text-primary-light/60">{label}</p>
              <p className="mt-0.5 text-sm sm:text-base font-extrabold text-primary-light font-mono transition-all duration-300">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-tonal-20 bg-surface-30/70 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-light/85">
              <Activity size={16} className="text-cyan-600 dark:text-cyan-400" /> Phonocardiogram (PCG) & Heart Rhythm
            </span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">250 samples/sec</span>
          </div>
          <svg viewBox="0 0 700 100" className="mt-3 h-20 w-full text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" role="img" aria-label="Connected monitoring waveform" preserveAspectRatio="none">
            <path 
              d="M0 50h40l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h50l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h50l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h80" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className="animate-ecg-dash"
            />
          </svg>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} /> All biological parameters within normal variance
          </span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] uppercase font-bold">
            NEWS2: 0 (Low Risk)
          </span>
        </div>
      </div>
    </section>
  );
}
