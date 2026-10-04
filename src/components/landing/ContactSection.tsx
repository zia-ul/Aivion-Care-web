import { ArrowRight, Mail, MapPin, Phone, Send } from 'lucide-react';

const contactPoints = [
  { label: 'Email', value: 'support@aiconfidencecure.com', Icon: Mail, href: 'mailto:support@aiconfidencecure.com' },
  { label: 'Phone', value: '+91 84493 91441', Icon: Phone, href: 'tel:+918449391441' },
  { label: 'Address', value: 'AMU Innovation Foundation, 1st Floor Near Minto Circle School, Minto Circle Road, Aligarh, UP 202001, India', Icon: MapPin, href: null },
] as const;

export default function ContactSection() {
  return (
    <section id="contact" className="bg-surface-10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">Contact Us</p>
          <h2 className="mt-3 text-section font-bold text-primary-light sm:text-subtitle">
            Tell us where preventive, connected care can create impact.
          </h2>
          <p className="mt-5 leading-7 text-primary-light/60">
            We collaborate with healthcare supporters, student builders, and ecosystem partners to move Aivion Care from concept toward meaningful deployment.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {contactPoints.map(({ label, value, Icon, href }) => {
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-accent/50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-support font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-medium text-primary-light">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="block">
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}

            <div className="flex gap-3 pt-2">
              <a href="https://www.linkedin.com/company/ai-confidence-cure/posts/?feedView=all" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 transition hover:-translate-y-1 hover:border-accent/50" aria-label="LinkedIn">
                <Mail size={18} />
              </a>
              <a href="https://www.instagram.com/ai.confidence.cure/" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 transition hover:-translate-y-1 hover:border-accent/50" aria-label="Instagram">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 sm:p-6 backdrop-blur">
            <div className="flex items-start gap-3">
              <Send size={22} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
              <div>
                <h3 className="text-heading font-bold text-primary-light">Start a conversation</h3>
                <p className="mt-2 text-sm text-primary-light/55">Whether you are a mentor, partner, intern, or early collaborator, the team is open to meaningful conversations.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-sky-950 shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-400">
                Contact AI Confidence Cure <ArrowRight size={17} />
              </a>
              <a href="/capabilities" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-500/20 bg-background/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-sky-500/10 hover:text-foreground">
                Review capabilities
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

