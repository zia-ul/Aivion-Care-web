import { ArrowRight, Building2, FlaskConical, GraduationCap, HeartHandshake, ShieldCheck, Stethoscope, Users, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';

const team = [
  { 
    initials: 'DP', 
    name: 'Daniya Parveen', 
    role: 'Founder & CEO', 
    bio: 'An ambitious electronics specialist and startup leader who bridges engineering, product development, and team execution, turning ideas into practical clinical solutions while driving organizational growth.', 
    skills: ['Electronics engineering', 'Product design', 'Medical IoT', 'Team leadership', 'Healthcare Innovation'], 
    linkedin: 'https://in.linkedin.com/in/daniya-parveen-siddique-4a66642a6' 
  },
  { 
    initials: 'SM', 
    name: 'Saif Malik', 
    role: 'Founder & CMO, Product Strategy and Ecosystem Partnerships', 
    bio: 'Visionary leader and mechanical engineer guiding the startup strategy, product direction, clinical institutional tie-ups, and long-term health-tech ambition.', 
    skills: ['Founder leadership', 'Product strategy', 'Innovation partnerships', 'Hospital outreach'], 
    linkedin: 'https://www.linkedin.com/in/saif-malik-%D8%B3%DB%8C%D9%81-%D9%85%D9%84%DA%A9-67b945275' 
  },
  { 
    initials: 'ZI', 
    name: 'Ziaul Islam', 
    role: 'Director & CTO, Technical Leadership', 
    bio: 'Experienced technical contributor leading engineering coordination, high-throughput distributed systems, WebRTC clinical video telemetry, and medical AI model orchestration.', 
    skills: ['Technical leadership', 'Scalable distributed systems', 'Multi-modal AI pipeline', 'WebRTC telemetry'], 
    linkedin: '' 
  },
] as const;

const foundations = [
  { 
    name: 'AMUIF (AMU Innovation Foundation)', 
    tagline: 'Incubation, Academic Research & Clinical Pilot Support', 
    text: 'Incubated under the prestigious Aligarh Muslim University Innovation Foundation, providing clinical mentorship, laboratory facilities, and institutional validation for our predictive healthcare AI systems.', 
    Icon: GraduationCap, 
    focus: ['Incubation & Mentorship', 'Clinical Pilot Facilities', 'Academic Research Partnerships'] 
  },
  { 
    name: 'VINSPIRE Foundation', 
    tagline: 'Community Health Outreach & Preventive Screening', 
    text: 'VINSPIRE Foundation collaborates on community health awareness drives, non-invasive vital screenings in underserved rural clusters, and preventive healthcare education campaigns.', 
    Icon: HeartHandshake, 
    focus: ['Health Awareness Drives', 'Preventive Care Education', 'Rural Medical Outreach'] 
  },
] as const;

export default function TeamPage() {
  return (
    <PageShell>
      <main>
        {/* HERO BANNER WITH CLINICAL COLLABORATION IMAGE */}
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-surface-20/80 p-8 sm:p-12 mb-10">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
            <Image
              src="/images/healthcare/doctor-nurse-team.jpg"
              alt="Medical and Engineering Team Together"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-10 via-surface-10/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-4">
              <Users size={14} />
              <span>Leadership & Engineering Vision</span>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-primary-light tracking-tight leading-tight">
              Bridging Electronics, AI, <br />
              <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                and Veteran Clinical Wisdom.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-light/80 leading-relaxed">
              We are a dedicated team of engineers, medical innovators, and system architects building the future of preventive healthcare.
            </p>
          </div>
        </div>

        {/* TEAM MEMBERS GRID */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {team.map(({ initials, name, role, bio, skills, linkedin }) => (
            <article 
              key={name} 
              className="group relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/70 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-teal-500/20 border border-sky-500/30 text-lg font-bold text-sky-600 dark:text-sky-400 shadow-inner group-hover:scale-105 transition-transform">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-base sm:text-lg text-primary-light group-hover:text-sky-500 transition-colors">{name}</h3>
                    <p className="truncate text-xs font-medium text-sky-600 dark:text-sky-400">{role}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-6 text-primary-light/75">{bio}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-tonal-20/50">
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
                      {skill}
                    </span>
                  ))}
                </div>

                {linkedin ? (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                    LinkedIn Profile <ArrowRight size={13} />
                  </a>
                ) : (
                  <span className="mt-5 inline-block text-xs text-primary-light/40 italic">Technical Director</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* FOUNDATIONS & INCUBATION PARTNERS WITH IMAGERY */}
        <div className="mt-16">
          <SectionHeader
            eyebrow="Our Foundation & Incubation"
            title="Supported by Leading Research & Community Foundations"
            description="Our technological innovation is grounded by clinical mentorship, rigorous ethics review, and grass-roots public health validation."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {foundations.map(({ name, tagline, text, Icon, focus }) => (
              <article key={name} className="relative overflow-hidden rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 sm:p-8 backdrop-blur-xl transition-all hover:border-sky-500/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary-light">{name}</h3>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">{tagline}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-primary-light/75">{text}</p>

                <div className="mt-5 pt-4 border-t border-tonal-20/50 flex flex-wrap gap-2">
                  {focus.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-light/70 bg-surface-10 px-2.5 py-1 rounded-md border border-tonal-20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
