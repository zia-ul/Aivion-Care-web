import { ArrowRight, Calendar, Clock, HeartPulse, MapPin, Stethoscope, UserRoundCheck, Video } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const initiatives = [
  { title: 'Community Health Screening Drive', description: 'Free screening camps covering blood pressure, blood sugar and basic vitals, with on-the-spot physician consultation.', points: ['Pan-India · Quarterly', 'On-the-spot consultation', 'Basic vitals screening'], Icon: HeartPulse },
  { title: 'Healthcare Awareness Seminar', description: 'Interactive sessions led by practising clinicians on prevention, chronic disease management and healthy living.', points: ['Partner colleges & hospitals', 'Practising clinicians', 'Interactive sessions'], Icon: Stethoscope },
  { title: 'MoU Partnerships', description: 'Formal collaboration with hospitals, academic institutions and non-profit organisations to extend care delivery and outreach.', points: ['Hospitals', 'Academic institutions', 'Non-profit organisations'], Icon: Calendar },
  { title: 'Preventive Care Education', description: 'Outreach and education that helps people make better everyday health decisions before issues become serious.', points: ['Community outreach', 'Preventive education', 'Everyday health'], Icon: Clock },
  { title: 'Connected Care Coordination', description: 'Bringing doctors, patients, pharmacies, and labs closer together through shared workflows and coordinated care.', points: ['Shared workflows', 'Coordinated care', 'One connected platform'], Icon: MapPin },
  { title: 'Awareness Programs', description: 'Regular health awareness drives, screening camps, and education seminars across communities and campuses.', points: ['Health awareness drives', 'Screening camps', 'Education seminars'], Icon: UserRoundCheck },
] as const;

export default function InitiativesPage() {
  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Initiatives"
          title="Events, partnerships and awareness"
          description="Aivion Care is used inside clinics and hospitals, but our commitment reaches further — into communities, campuses and public health."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map(({ title, description, points, Icon }) => (
            <article key={title} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-light/55">{description}</p>
              <ul className="mt-5 space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm text-primary-light/65">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
