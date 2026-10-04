import { ArrowDown, BrainCircuit, ClipboardCheck, FileText, Lightbulb } from 'lucide-react';

export default function AISection() {
  return (
    <section className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">AI-assisted workflows</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">Intelligence That Supports Better Care</h2>
          <p className="mt-5 leading-7 text-primary-light/60">Organize consultation information, summarize medical documents and surface structured context so healthcare professionals can focus on the person in front of them.</p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-lighter">
            <Lightbulb size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>AI supports healthcare professionals and does not replace clinical judgment. Clinician always has the final say.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 sm:p-6 backdrop-blur">
          <Step icon={<FileText size={18} />} title="Doctor input" text="Symptoms, observations and consultation context" />
          <ArrowDown className="mx-auto my-2 text-sky-400/60" size={19} aria-hidden="true" />
          <Step icon={<BrainCircuit size={18} />} title="AI processing" text="Organizes information into a clear clinical structure" />
          <ArrowDown className="mx-auto my-2 text-sky-400/60" size={19} aria-hidden="true" />
          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
              <ClipboardCheck size={18} aria-hidden="true" /> Structured clinical notes
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-support">
              <p><span className="block text-primary-light/45">Symptoms</span><span className="text-primary-light/80">Reported fatigue</span></p>
              <p><span className="block text-primary-light/45">Observations</span><span className="text-primary-light/80">Within context</span></p>
              <p><span className="block text-primary-light/45">Assessment</span><span className="text-primary-light/80">Clinician reviewed</span></p>
              <p><span className="block text-primary-light/45">Plan</span><span className="text-primary-light/80">Follow-up care</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-20/70 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-primary-light">{title}</p>
        <p className="mt-1 text-support text-primary-light/50">{text}</p>
      </div>
    </div>
  );
}

