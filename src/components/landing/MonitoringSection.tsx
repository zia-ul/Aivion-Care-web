import Image from 'next/image';
import { Activity, AlertTriangle, HeartPulse, Thermometer, Waves, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MonitoringSection() {
  return (
    <section className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          <Sparkles size={13} className="text-teal-300" /> Continuous Biomarker Stream
        </p>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Turn Raw Vitals Into <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Instant Clinical Intel.</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
          No waiting for emergency bells or guessing trends. Aivion Care pairs connected telemetry hardware with deep learning models to catch anomalies before they escalate. Real-time data, zero guesswork — pure peace of mind.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {['SpO₂ Telemetry', 'HRV & Arrhythmia', 'Core Temp', 'Digital PCG', 'NEWS2 Decompensation'].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-400/40 hover:bg-white/10"
            >
              <CheckCircle2 size={13} className="text-teal-400" /> {item}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400">
            Clinical Telemetry Notice: Continuous streaming metrics provide physiological context for care teams and early warning indicators without overriding registered physician diagnosis.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        {/* Real hospital image preview */}
        <div className="relative mb-5 h-36 w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/images/healthcare/doctor-consulting.jpg"
            alt="Doctor reviewing connected telemetry"
            fill
            className="object-cover opacity-70 transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Activity size={15} /> Multi-Channel Patient Monitor
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-emerald-300 border border-emerald-500/30 uppercase">
              Connected Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">Station Ward Unit 4</p>
            <p className="mt-0.5 text-lg font-bold text-white">Live Clinical Synchrony</p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Synchronized
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {([
            ['Heart Rate', '72 bpm', HeartPulse, 'text-rose-400'],
            ['SpO₂ Oxygen', '98%', Waves, 'text-sky-400'],
            ['Core Temp', '36.6 °C', Thermometer, 'text-amber-400'],
          ] as const).map(([label, value, Icon, colorClass]) => (
            <div key={String(label)} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-cyan-400/30">
              <Icon size={19} className={colorClass} />
              <p className="mt-2.5 text-[11px] font-semibold text-slate-400">{label}</p>
              <p className="mt-0.5 text-base font-extrabold text-white sm:text-lg">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Activity size={16} className="text-cyan-400" /> Phonocardiogram (PCG) & Heart Rhythm
            </span>
            <span className="text-[11px] font-mono text-cyan-400">250 samples/sec</span>
          </div>
          <svg viewBox="0 0 700 100" className="mt-3 h-20 w-full text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" role="img" aria-label="Connected monitoring waveform" preserveAspectRatio="none">
            <path 
              d="M0 50h40l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h50l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h50l10-2 10 2 15-25 12 50 12-25h50l10-2 10 2 15-27 12 52 12-25h80" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className="animate-ecg-dash"
            />
          </svg>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} /> All biological parameters within normal variance
          </span>
          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] uppercase font-bold">
            NEWS2: 0 (Low Risk)
          </span>
        </div>
      </div>
    </section>
  );
}
