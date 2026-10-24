import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  BrainCircuit, 
  HeartPulse, 
  Stethoscope, 
  Microscope, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Flame,
  Award
} from 'lucide-react';

const worldFirsts = [
  {
    number: '01',
    badge: 'World-First Heuristic AI',
    title: '30-Year Veteran Physician Clinical Decision Heuristics',
    description: 'The first clinical engine in the world encoding senior attending physician diagnostic instincts and differential decision trees rather than relying on generic black-box text LLMs.',
    metric: '99.2%',
    metricLabel: 'Diagnostic Concordance',
    link: '/ai-doctor',
    icon: Stethoscope,
    image: '/images/healthcare/doctor-consulting.jpg'
  },
  {
    number: '02',
    badge: 'World-First Acoustic Web PCG',
    title: 'Real-Time Phonocardiogram Acoustic Heart Screening',
    description: 'Hardware-agnostic acoustic signal processing capturing phonocardiogram (PCG) heart sounds and S3/S4 gallop rhythms directly in a standard browser alongside continuous ECG wave telemetry.',
    metric: 'Sub-Minute',
    metricLabel: 'Valvular Murmur Detection',
    link: '/capabilities',
    icon: HeartPulse,
    image: '/images/healthcare/stethoscope-vitals.jpg'
  },
  {
    number: '03',
    badge: 'World-First Multi-Hit Risk Engine',
    title: 'Continuous Multi-Hit De Ritis & Cardiorenal Ratio Modeling',
    description: 'Autonomous calculation of sub-clinical organ decompensation ratios (De Ritis AST/ALT, BUN/Creatinine, and Atherogenic index) predicting metabolic collapse days before standard symptoms appear.',
    metric: '0.94 AUC',
    metricLabel: 'Cardiorenal Risk Discrimination',
    link: '/clinical-assessment',
    icon: Microscope,
    image: '/images/healthcare/medical-lab.jpg'
  },
  {
    number: '04',
    badge: 'World-First Ambient Rx Extraction',
    title: 'Zero-Error Ambient Voice-to-Dosage Prescription Copilot',
    description: 'Natural physician-patient speech-to-Rx parser that automatically extracts medicine brand names and segregates formulations and strengths (e.g., Paracetamol 500 mg) with eGFR safety contraindication blocks.',
    metric: '70% Faster',
    metricLabel: 'Consultation Documentation',
    link: '/solutions/doctors-specialists',
    icon: BrainCircuit,
    image: '/images/healthcare/healthcare-ai-future.jpg'
  }
];

export default function WorldFirstSection() {
  return (
    <section className="relative overflow-hidden py-20 border-y border-tonal-20/40 bg-surface-20/40 backdrop-blur-md">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4 shadow-sm">
            <Award size={15} />
            <span>Pioneering Medical Breakthroughs</span>
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            <span className="normal-case font-semibold text-primary-light/80">AMUIF Incubated Global Innovation</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-light tracking-tight">
            World-First Healthcare Features <br />
            <span className="bg-gradient-to-r from-amber-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Available Nowhere Else on Earth.
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-primary-light/75 leading-relaxed">
            Aivion Care bridges deep physiological IoT sensors with 30-year physician cognitive pathways. Discover the breakthrough technologies revolutionizing patient survival.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {worldFirsts.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.number}
                className="group relative overflow-hidden rounded-3xl border border-tonal-20/80 bg-surface-10 p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-10 via-surface-10/85 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                      <Sparkles size={13} /> {item.badge}
                    </span>
                    <span className="text-2xl font-black text-primary-light/20 group-hover:text-cyan-500/40 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-cyan-500 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-5 border-t border-tonal-20/60 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-cyan-500 dark:text-cyan-400">{item.metric}</span>
                    <span className="ml-2 text-xs text-primary-light/65 font-medium">{item.metricLabel}</span>
                  </div>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Experience Innovation <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
