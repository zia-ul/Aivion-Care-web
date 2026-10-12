import Image from 'next/image';
import { 
  ArrowRight, 
  HeartPulse, 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  Sparkles,
  Waves
} from 'lucide-react';

const capabilities = [
  {
    title: '24/7 Heart & Vitals Monitoring',
    text: 'Continuous biological surveillance keeping a live pulse on patient wellness instead of waiting for symptoms to turn critical.',
    punchline: 'Always watching. Zero stress.',
    points: ['Live streaming of 4 primary biometric vitals', 'Automatic anomaly detection algorithms', 'Proactive emergency alerts before decompensation'],
    image: '/images/healthcare/smart-monitoring.jpg',
    Icon: Activity,
    color: 'text-cyan-400',
  },
  {
    title: 'Real-Time Neural Health Insights',
    text: 'Converts chaotic biological telemetry signals into immediate clinical observations that help doctors and patients react 10x faster.',
    punchline: 'Turn raw data into pure clarity.',
    points: ['Sub-second signal categorization', 'Earlier awareness of risk patterns', 'Intuitive clinical summary dashboards'],
    image: '/images/healthcare/modern-clinic.jpg',
    Icon: BrainCircuit,
    color: 'text-teal-400',
  },
  {
    title: 'AI-Powered Diagnostic Copilot',
    text: 'Assistive clinical intelligence crafted to help doctors interpret patient telemetry with unprecedented precision.',
    punchline: 'High-IQ clinical assistance. Pure signal.',
    points: ['Doctor-in-the-loop review mechanism', 'Rapid identification of abnormal arrhythmias', 'Grounded in patient-specific longitudinal trends'],
    image: '/images/healthcare/doctor-examining.jpg',
    Icon: ShieldCheck,
    color: 'text-sky-400',
  },
  {
    title: 'Phonocardiogram (PCG) Heart Screening',
    text: 'Captures and analyzes digital acoustic heart-sound patterns alongside electrical ECG waves for next-level screening depth.',
    punchline: 'Listening to heart murmurs at 250 samples/sec.',
    points: ['Acoustic cardiac sound wave decomposition', 'Deeper cardiovascular pathology triage', 'Hospital-grade precision at community scale'],
    image: '/images/healthcare/doctor-consulting.jpg',
    Icon: HeartPulse,
    color: 'text-rose-400',
  },
] as const;

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative bg-surface-10 py-20 sm:py-28 overflow-hidden">
      {/* Background Heart Rate Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
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

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            <Sparkles size={13} className="text-teal-300" /> Advanced Capabilities
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Proactive, Connected, and <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Ultra-Reliable.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            From 24/7 cardiac monitoring to AI-assisted diagnostic support, Aivion Care delivers clinical certainty with modern aesthetics.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {capabilities.map(({ title, text, punchline, points, image, Icon, color }) => (
            <article
              key={title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-cyan-500/10"
            >
              {/* Background Hospital / Tech Image with Radiant Mask */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover opacity-25 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                  sizes="(max-width: 1024px) 100vw, 650px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
              </div>

              {/* Radiant Glow Orb */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/30 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner group-hover:border-cyan-400/40">
                    <Icon size={26} className={`${color} group-hover:scale-110 transition-transform`} />
                  </div>
                  
                  {/* Moving ECG Line SVG */}
                  <div className="h-8 w-32 text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                    <svg viewBox="0 0 140 30" className="h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M0 15 h35 l6 -12 l6 24 l6 -16 l8 4 h40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="animate-ecg-dash"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="mt-6 font-display text-xl font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                  {title}
                </h3>
                <p className="mt-1 text-xs font-bold text-teal-300 uppercase tracking-wider">
                  {punchline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {text}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                      <HeartPulse size={14} className="shrink-0 text-rose-400 animate-heartbeat" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5 text-teal-300">
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" /> Continuous Clinical Intel
                </span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Learn More →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
