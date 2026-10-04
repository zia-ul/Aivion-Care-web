import { Lock, Mail, Phone, ShieldCheck, Stethoscope, UserRoundCheck } from 'lucide-react';
import PageShell from '@/components/landing/PageShell';
const sections = [
  {
    title: 'Information We Collect',
    text: 'We collect information you provide directly — name, contact details, medical history, appointments, prescriptions, lab reports, and consultation notes — plus usage data such as device information, IP address, and interaction timestamps.',
    Icon: UserRoundCheck,
  },
  {
    title: 'How We Use It',
    text: 'To deliver the care workflows you use: appointments, teleconsultations, prescriptions, lab reports, medication reminders, health alerts, and AI-assisted clinical support. We also use it to improve the platform, secure it, and comply with legal obligations.',
    Icon: Stethoscope,
  },
  {
    title: 'Sharing & Disclosure',
    text: 'We share information only with the clinicians, hospitals, laboratories, pharmacies and care teams you authorise, plus service providers who help us operate the platform under strict confidentiality obligations. We never sell personal or health data.',
    Icon: Lock,
  },
  {
    title: 'Security',
    text: 'Role-based access, secure authentication, encrypted sessions, and controlled data access keep clinical information protected. Security is an ongoing product responsibility, not a certification claim.',
    Icon: ShieldCheck,
  },
  {
    title: 'Your Rights',
    text: 'You may request access to, correction of, or deletion of your personal information, subject to legal and clinical record-keeping obligations. Contact us to exercise these rights.',
    Icon: Mail,
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <main>
        <div className="max-w-3xl">
          <p className="text-support font-semibold uppercase tracking-[0.16em] text-sky-400">Legal</p>
          <h1 className="mt-3 text-section font-bold text-primary-light sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 leading-7 text-primary-light/60">How Aivion Care collects, uses, protects and shares the information that powers your care journey. Last updated: October 2026.</p>
        </div>

        <div className="mt-12 space-y-6">
          {sections.map(({ title, text, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-sky-500/15 bg-surface-20/60 p-6 backdrop-blur sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h2 className="text-heading font-bold text-primary-light">{title}</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-primary-light/60">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6 sm:p-8 backdrop-blur">
          <h2 className="text-heading font-bold text-primary-light">Contact us</h2>
          <p className="mt-3 text-sm leading-7 text-primary-light/60">If you have questions about this privacy policy or want to exercise your rights, reach out to us.</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-sky-400">
            <a href="mailto:support@aiconfidencecure.com" className="inline-flex items-center gap-2">
              <Mail size={16} /> support@aiconfidencecure.com
            </a>
            <a href="tel:+918449391441" className="inline-flex items-center gap-2">
              <Phone size={16} /> +91 84493 91441
            </a>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
