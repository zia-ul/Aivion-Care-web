import type { ReactNode } from 'react';

interface RegistrationSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function RegistrationSection({
  eyebrow,
  title,
  description,
  icon,
  children,
}: RegistrationSectionProps) {
  return (
    <section className="overflow-hidden rounded-card border border-accent/15 bg-surface-10/80 shadow-soft">
      <div className="flex items-start gap-4 border-b border-tonal-20/60 bg-gradient-to-r from-accent/[0.09] to-transparent px-5 py-5 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input border border-accent/25 bg-accent/10 text-accent">
          {icon}
        </div>
        <div>
          <p className="text-support font-semibold uppercase tracking-[0.14em] text-success-light">{eyebrow}</p>
          <h2 className="mt-1 text-heading font-bold text-primary-light">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-primary-light/55">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
