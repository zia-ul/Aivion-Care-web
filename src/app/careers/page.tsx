import { ArrowRight, Calendar, Clock, HeartPulse, Stethoscope, UserRoundCheck, Users } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const openings = [
  { title: 'AI Product Development Intern', duration: '4 months', focus: 'Hands-on product exposure across AI product development, full-stack engineering, and database design.', Icon: HeartPulse },
  { title: 'Full-Stack Engineering Intern', duration: '4 months', focus: 'Build real product features, ship code, and learn by doing in an early-stage team.', Icon: Users },
  { title: 'Database Design Intern', duration: '4 months', focus: 'Design and optimise the data layer behind the connected healthcare platform.', Icon: Stethoscope },
] as const;

export default function CareersPage() {
  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Careers"
          title="Join a student-led team building affordable preventive health-tech."
          description="AICC is running hands-on 4-month internships for students who want real product exposure across AI product development, full-stack engineering, and database design."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {openings.map(({ title, duration, focus, Icon }) => (
            <article key={title} className="flex flex-col rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><Icon size={24} aria-hidden="true" /></div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /> {duration}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-primary-light/55">{focus}</p>
              <a href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                Apply now <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6 sm:p-8 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-heading font-bold text-primary-light">We build for preventive care</h3>
              <p className="mt-2 text-sm text-primary-light/60">Every feature is oriented toward earlier visibility, better coordination, and more affordable access.</p>
            </div>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400">
              View internship openings <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
