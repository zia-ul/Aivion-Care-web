import Image from 'next/image';
import { ArrowRight, HeartPulse, Stethoscope, Users, Building, Activity, Sparkles } from 'lucide-react';

const galleryItems = [
  {
    title: 'Aivion Care In-Patient Telemetry',
    subtitle: 'Continuous Vitals Intelligence',
    text: 'A unified monitoring hub for SpO2, heart rate, temperature, and digital PCG so clinical teams catch changes before symptoms peak. Pure signal, zero latency.',
    image: '/images/healthcare/hospital-hallway.jpg',
    Icon: HeartPulse,
    tag: 'Hospital Grade',
  },
  {
    title: 'Diagnostic Signal Intelligence',
    subtitle: '4 Core Biomarkers Synchronized',
    text: 'Real-time telemetry and Pan-Tompkins QRS processing built into lightweight bedside monitors and mobile displays. No bloated hardware required.',
    image: '/images/healthcare/smart-monitoring.jpg',
    Icon: Stethoscope,
    tag: 'AI Verified',
  },
  {
    title: 'Next-Gen Clinical Coordination',
    subtitle: 'One Ecosystem Across All Roles',
    text: 'Hospitals, clinics, registered doctors, nurses, and lab techs seamlessly coordinated on a unified digital highway. Peak clinical vibes only.',
    image: '/images/healthcare/doctor-consulting.jpg',
    Icon: Users,
    tag: 'Connected Care',
  },
] as const;

export default function GallerySection() {
  return (
    <section id="gallery" className="relative bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            <Sparkles size={13} className="text-teal-300" /> Hospital Ecosystem In Action
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Visual Story: How We <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Reinvented Connected Care.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            Witness our connected healthcare operating system in real hospital wards, outpatient clinics, and mobile telemetry setups across India.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {galleryItems.map(({ title, subtitle, text, image, Icon, tag }) => (
            <article
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-cyan-500/20"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300 backdrop-blur-md">
                    {tag}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-cyan-300 border border-sky-500/20">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
                    {subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <a
                    href="/products/aivion-care"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 transition-colors hover:text-cyan-300"
                  >
                    <span>Inspect Platform</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <span className="text-[11px] text-slate-500 font-mono">24/7 Verified</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
