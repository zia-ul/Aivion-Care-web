import { ArrowRight, Building2, FlaskConical, GraduationCap, HeartHandshake, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const team = [
  { initials: 'DP', name: 'Daniya Parveen', role: 'Founder & CEO', bio: 'An ambitious electronics specialist and startup leader who bridges engineering, product development, and team execution, turning ideas into practical solutions while driving organizational growth.', skills: ['Electronics engineering', 'Product design', 'Brand marketing', 'Team leadership', 'Innovation'], linkedin: 'https://in.linkedin.com/in/daniya-parveen-siddique-4a66642a6' },
  { initials: 'SM', name: 'Saif Malik', role: 'Founder & CMO, Product Strategy and Ecosystem Partnerships', bio: 'Visionary leader and mechanical engineer guiding the startup strategy, product direction, and long-term health-tech ambition.', skills: ['Founder leadership', 'Product strategy', 'Innovation partnerships'], linkedin: 'https://www.linkedin.com/in/saif-malik-%D8%B3%DB%8C%D9%81-%D9%85%D9%84%DA%A9-67b945275' },
  { initials: 'ZI', name: 'Ziaul Islam', role: 'Director & CTO, Technical Leadership', bio: 'Experienced technical contributor leading engineering coordination, system architecture discussions, and development execution across core product initiatives.', skills: ['Technical leadership', 'Scalable systems', 'Engineering execution'], linkedin: '' },
] as const;

const foundations = [
  { name: 'AMUIF', tagline: 'Academic support and medical education', text: 'AMUIF supports academic growth in medicine and allied health fields through scholarships, mentorship and educational initiatives for students and early-career practitioners.', Icon: GraduationCap, focus: ['Scholarships & financial aid', 'Mentorship programmes', 'Academic workshops'] },
  { name: 'VINSPIRE Foundation', tagline: 'Community health and awareness', text: 'VINSPIRE Foundation works on community health awareness, preventive care education and outreach that helps people make better everyday health decisions.', Icon: HeartHandshake, focus: ['Health awareness drives', 'Preventive care education', 'Community outreach'] },
] as const;

export default function TeamPage() {
  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Meet The Team"
          title="The founding and execution team building Aivion Care."
          description="A student-led group spanning engineering, electronics, development, and technical HR is turning the idea into a working health-tech venture."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {team.map(({ initials, name, role, bio, skills, linkedin }) => (
            <article key={name} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-lg font-bold text-sky-400">{initials}</span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-primary-light">{name}</h3>
                  <p className="truncate text-sm text-sky-400">{role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-primary-light/55">{bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-300">{skill}</span>
                ))}
              </div>
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
                  LinkedIn <ArrowRight size={15} />
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeader
            eyebrow="Our foundations"
            title="Working alongside AMUIF and VINSPIRE Foundation"
            description="Alongside our platform work, we support initiatives that improve healthcare knowledge and reach."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {foundations.map(({ name, tagline, text, Icon, focus }) => (
              <article key={name} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><Icon size={22} aria-hidden="true" /></span>
                  <div>
                    <h3 className="text-heading font-bold text-primary-light">{name}</h3>
                    <p className="text-sm text-sky-400">{tagline}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-primary-light/55">{text}</p>
                <ul className="mt-5 space-y-2">
                  {focus.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-primary-light/65">
                      <ShieldCheck size={14} className="shrink-0 text-success-light" aria-hidden="true" />{item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
