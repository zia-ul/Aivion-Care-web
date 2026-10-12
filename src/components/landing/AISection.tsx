import Image from 'next/image';
import { ArrowDown, BrainCircuit, ClipboardCheck, FileText, Lightbulb, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function AISection() {
  return (
    <section className="relative overflow-hidden bg-surface-10 py-20 sm:py-28">
      {/* Background AI ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl" aria-hidden="true">
        <div className="aspect-[1000/600] w-[60rem] bg-gradient-to-tr from-sky-600/15 via-teal-500/15 to-transparent opacity-40" />
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            <BrainCircuit size={14} className="text-teal-300" /> Clinical AI Inference
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Autonomous Clinical Intelligence <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">That Actually Cooked.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            Say goodbye to endless paperwork and charting fatigue. Our multi-agent Bayesian NLP model listens, organizes consultation facts, parses pharmacovigilance safety graphs, and crafts structured SOAP notes in seconds.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {['Pan-Tompkins QRS Engine', 'CYP450 Drug Safety Check', 'ICD-10 Mapping', 'SOAP Note Generation'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-slate-300">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm text-slate-300 backdrop-blur-md">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong className="text-white">Physician First Mandate:</strong> Our AI models serve as clinical copilots. The treating licensed doctor always maintains 100% diagnostic and prescription authority.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          {/* Hospital Clinic Environment Image */}
          <div className="relative mb-5 h-36 w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/healthcare/modern-clinic.jpg"
              alt="Connected Healthcare Facility"
              fill
              className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-300">
                <Sparkles size={14} /> Neural SOAP Pipeline
              </span>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-cyan-300 border border-cyan-500/30 uppercase">
                Latency: 180ms
              </span>
            </div>
          </div>

          <Step
            icon={<FileText size={18} />}
            title="1. Multi-Modal Intake"
            text="Doctor notes, voice transcripts, lab panels, and connected sensor streams."
          />
          
          <div className="my-2 flex justify-center">
            <ArrowDown className="animate-bounce text-cyan-400" size={18} aria-hidden="true" />
          </div>

          <Step
            icon={<BrainCircuit size={18} />}
            title="2. Neural Inference & Safety Filter"
            text="Cross-references adverse drug interaction graphs & early warning deterioration scores."
          />
          
          <div className="my-2 flex justify-center">
            <ArrowDown className="animate-bounce text-cyan-400" size={18} aria-hidden="true" />
          </div>

          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <ClipboardCheck size={18} aria-hidden="true" /> Structured Clinical SOAP Note
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30">
                Verified
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Subjective</span>
                <span className="mt-0.5 block font-medium text-slate-200">Patient reported mild fatigue, normal breathing</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Objective</span>
                <span className="mt-0.5 block font-medium text-slate-200">SpO2 98%, HR 72 bpm, Sinus Rhythm</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assessment</span>
                <span className="mt-0.5 block font-medium text-teal-300">Low deterioration probability (NEWS2: 0)</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</span>
                <span className="mt-0.5 block font-medium text-slate-200">Follow-up check-in in 7 days, hydrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-cyan-300 border border-sky-500/20">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{text}</p>
      </div>
    </div>
  );
}
