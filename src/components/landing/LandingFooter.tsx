import Image from 'next/image';
import Link from 'next/link';

const productLinks = [
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['Roles', '#roles'],
  ['Monitoring', '#monitoring'],
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-tonal-20/70 bg-surface-10">
      <div className="mx-auto grid max-w-container gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-10">
        <div>
          <Link href="/" className="flex items-center gap-3 font-bold text-primary-light">
            <span className="flex h-11 w-11 items-center justify-center rounded-input bg-[#e8fbf9] p-1">
              <Image src="/aivion-care-logo.svg" alt="" width={44} height={44} />
            </span>
            <span>Aivion Care</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-primary-light/50">
            Connected healthcare powered by AI and intelligent technology.
          </p>
        </div>
        <FooterGroup title="Product" links={productLinks} />
        <FooterGroup title="Account" links={[["Sign In", '/login'], ['Register', '/register']]} />
        <FooterGroup title="Company" links={[["AI Confidence Cure", 'https://www.aiconfidencecure.com/'], ['About', '#about'], ['Contact', '#contact'], ['Support: support@aiconfidencecure.com', 'mailto:support@aiconfidencecure.com']]} />
      </div>
      <div className="border-t border-tonal-20/60 px-5 py-5 text-center text-support text-primary-light/40">
        © 2026 AI Confidence Cure. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="#" className="hover:text-primary-light">Privacy Policy</Link>
        <span className="mx-2">·</span>
        <Link href="#" className="hover:text-primary-light">Terms of Service</Link>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-support font-bold uppercase tracking-[0.12em] text-primary-light/60">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-primary-light/45 hover:text-primary-light">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
