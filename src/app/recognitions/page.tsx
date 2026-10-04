import { ArrowRight, Award, Building2, Globe2, Medal, Star } from 'lucide-react';
import { SectionHeader } from '@/components/landing/common';
import PageShell from '@/components/landing/PageShell';
const recognitions = [
  { title: 'Campus recognition', text: 'Recognized among the top startups at AMU for building a preventive healthcare platform rooted in AI-enabled monitoring.', Icon: Star, org: 'AMU Startup Circle', detail: 'Aligarh Muslim University' },
  { title: 'Regional recognition', text: 'Included among the Top 1000 startups in North India as the team builds affordable predictive and preventive care tools.', Icon: Medal, org: 'Top 1000 spotlight', detail: 'North India startup ecosystem' },
  { title: 'Public showcase', text: 'Presented the vision for a smart health monitoring system focused on continuous care, real-time insight, and early diagnosis.', Icon: Globe2, org: "Ideathon '26", detail: 'Ajmal Khan Tibbiya College, AMU' },
] as const;

export default function RecognitionsPage() {
  return (
    <PageShell>
      <main>
        <SectionHeader
          eyebrow="Recognitions"
          title="Recognition and momentum from the ecosystem around us."
          description="The startup is gaining visibility through AMU support, public showcases, and regional recognition as the product direction sharpens."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {recognitions.map(({ title, text, Icon, org, detail }) => (
            <article key={title} className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"><Icon size={24} aria-hidden="true" /></div>
              <h3 className="mt-5 text-heading font-bold text-primary-light">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-light/55">{text}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-sky-400"><Building2 size={14} aria-hidden="true" /><span className="font-semibold">{org}</span></div>
              <p className="mt-1 text-support text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
