'use client';

import { useState } from 'react';
import { CalendarDays, FileSignature, Megaphone, MapPin } from 'lucide-react';
import {
  awareness,
  events,
  mouPartners,
  type InitiativeTab,
} from '@/components/landing/initiativesData';

const tabs = [
  { key: 'events', label: 'Events', Icon: CalendarDays },
  { key: 'mou', label: 'MoU', Icon: FileSignature },
  { key: 'awareness', label: 'Awareness Programs', Icon: Megaphone },
] as const satisfies ReadonlyArray<{
  key: InitiativeTab;
  label: string;
  Icon: typeof CalendarDays;
}>;

export default function InitiativesSection() {
  const [active, setActive] = useState<InitiativeTab>('events');

  return (
    <section id="initiatives" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">
            Beyond the platform
          </p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            Events, partnerships and awareness
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            Aivion Care is used inside clinics and hospitals, but our commitment reaches further —
            into communities, campuses and public health. Gen-Z approved. No boring health brochures.
          </p>
        </div>

        <div
          className="mt-9 flex flex-wrap gap-2 border-b border-tonal-20/70 pb-3"
          role="tablist"
          aria-label="Initiatives"
        >
          {tabs.map(({ key, label, Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`tab-${key}`}
                aria-selected={isActive}
                aria-controls={`panel-${key}`}
                onClick={() => setActive(key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-sky-500 text-sky-950 shadow-lg shadow-sky-500/20'
                    : 'text-muted-foreground hover:bg-sky-500/10 hover:text-primary-light'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {active === 'events' && (
          <div
            id="panel-events"
            role="tabpanel"
            aria-labelledby="tab-events"
            className="mt-8 grid gap-5 sm:grid-cols-2"
          >
            {events.map(({ title, text, meta, Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 transition hover:-translate-y-1 hover:border-accent/50 sm:p-6 backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-semibold text-primary-light">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-light/55">{text}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-support font-semibold text-sky-400">
                  <MapPin size={13} aria-hidden="true" />
                  {meta}
                </p>
              </article>
            ))}
          </div>
        )}

        {active === 'mou' && (
          <div id="panel-mou" role="tabpanel" aria-labelledby="tab-mou" className="mt-8">
            <div className="rounded-2xl border border-sky-500/25 bg-sky-500/10 p-5 sm:p-6 backdrop-blur">
              <div className="flex items-start gap-3">
                <FileSignature size={21} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
                <div>
                  <h3 className="text-heading font-bold text-primary-light">
                    Memoranda of Understanding
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-primary-light/60">
                    We sign MoUs with hospitals, academic institutions and non-profit organisations to
                    formalise collaboration on care delivery, research, education and outreach.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {mouPartners.map((partner) => (
                <article
                  key={partner.name}
                  className={`rounded-2xl border p-5 sm:p-6 backdrop-blur ${
                    partner.focus ? 'border-sky-400/45 bg-sky-500/10' : 'border-tonal-20/70 bg-surface-20/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-primary-light">{partner.name}</h4>
                    {partner.focus && (
                      <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-300">
                        Focus region
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-primary-light/55">{partner.text}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {active === 'awareness' && (
          <div
            id="panel-awareness"
            role="tabpanel"
            aria-labelledby="tab-awareness"
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {awareness.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 transition hover:-translate-y-1 hover:border-accent/50 sm:p-6 backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Megaphone size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-semibold text-primary-light">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-light/55">{item.text}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
