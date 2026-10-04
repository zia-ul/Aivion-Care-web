import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['Capabilities', '/capabilities'],
  ['Initiatives', '/initiatives'],
  ['Team', '/team'],
  ['Recognitions', '/recognitions'],
  ['Careers', '/careers'],
  ['Contact', '/contact'],
];

const productLinks = [
  ['Aivion Care', '/products/aivion-care'],
  ['Qurbani', '/products/qurbani'],
  ['Quran', '/products/quran'],
  ['All Products', '/products'],
];

const resourceLinks = [
  ['Capabilities', '/capabilities'],
  ['FAQ', '/faq'],
  ['Privacy Policy', '/privacy-policy'],
  ['Feedback', '/feedback'],
  ['AI Confidence Cure', 'https://www.aiconfidencecure.com/'],
];

const socials = [
  ['LinkedIn', 'https://www.linkedin.com/company/ai-confidence-cure/posts/?feedView=all', Linkedin],
  ['Instagram', 'https://www.instagram.com/ai.confidence.cure/', Instagram],
] as const;

export default function LandingFooter() {
  return (
    <footer className="border-t border-tonal-20/70 bg-surface-10">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_repeat(3,1fr)] lg:px-10">
        <div>
          <Link href="/" className="flex items-center gap-3 font-bold text-primary-light">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-tonal-20/70 bg-sky-500/10 p-1 shadow-lg shadow-accent/10">
              <Image src="/aivion-care-logo.png" alt="" width={44} height={44} className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-base font-semibold leading-none tracking-tight">AI Confidence Cure</span>
              <span className="text-xs text-muted-foreground">Aivion Care | preventive health-tech</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            AI Confidence Cure Pvt Ltd, also known as Aivion Care, is building preventive health-tech
            focused on 24/7 monitoring, earlier diagnosis, and connected care.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {socials.map(([label, href, Icon]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-tonal-20/70 bg-surface-20/60 text-primary-light/70 transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <FooterGroup title="Quick Links" links={quickLinks} />
        <FooterGroup title="Products" links={productLinks} />
        <FooterGroup title="Resources" links={resourceLinks} />
      </div>

      <div className="border-t border-tonal-20/70">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-5 py-8 sm:px-8 md:grid-cols-3 lg:px-10">
          <FooterContact
            Icon={Mail}
            label="Email"
            value="support@aiconfidencecure.com"
            href="mailto:support@aiconfidencecure.com"
          />
          <FooterContact
            Icon={Phone}
            label="Phone"
            value="+91 84493 91441"
            href="tel:+918449391441"
          />
          <FooterContact
            Icon={MapPin}
            label="Office"
            value="AMU Innovation Foundation, 1st Floor Near Minto Circle School, Minto Circle Road, Aligarh, UP 202001, India"
          />
        </div>
      </div>

      <div className="border-t border-tonal-20/70 px-5 py-5 text-center text-support text-muted-foreground">
        Copyright 2026 AI Confidence Cure Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-support font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-muted-foreground transition-colors hover:text-sky-400">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-sky-400" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-support uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-primary-light/80">{value}</p>
      </div>
    </div>
  );

  if (!href) return body;
  return (
    <a href={href} className="transition-colors hover:opacity-80">
      {body}
    </a>
  );
}

