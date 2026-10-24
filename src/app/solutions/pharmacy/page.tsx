import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Pill, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Boxes, 
  FileSpreadsheet, 
  Clock, 
  Zap, 
  HeartPulse, 
  Layers, 
  ScanLine,
  Truck
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Pharmacy Management Software & E-Prescription Dispensing — AI Contraindication Check | Aivion Care',
  description: 'Smart retail and hospital pharmacy management system. Real-time digital prescription sync, automated drug-drug interaction warning, inventory batch & expiry tracking, and instant patient refill alerts.',
  keywords: [
    'pharmacy management software',
    'hospital pharmacy system',
    'e-prescription dispensing system',
    'drug interaction checker software',
    'pharmacy inventory management',
    'expiry date medicine tracking',
    'digital prescription fulfillment',
    'retail pharmacy billing software',
    'pharmacy ERP software'
  ],
  alternates: {
    canonical: 'https://www.aiconfidencecure.com/solutions/pharmacy',
  },
  openGraph: {
    title: 'Smart Pharmacy Management & E-Prescription Dispensing | Aivion Care',
    description: 'Instant e-prescription transmission, AI contraindication checks, automated inventory expiry tracking, and seamless patient fulfillment.',
    url: 'https://www.aiconfidencecure.com/solutions/pharmacy',
    images: ['/images/healthcare/pharmacy-shelf.jpg'],
  },
};

const pharmacyFeatures = [
  {
    title: 'Instant E-Prescription Transmission',
    desc: 'Receive digital prescriptions directly from doctors’ consultation chambers in real time. Eliminates illegible handwriting errors and prevents forged drug requests.',
    icon: ScanLine,
    metric: 'Zero Error',
    metricLabel: 'Prescription Handwriting Misreads',
    image: '/images/healthcare/pharmacy-shelf.jpg'
  },
  {
    title: 'Autonomous AI Drug Interaction Screener',
    desc: 'Flags dangerous drug-drug contraindications, dosage overshoots, renal clearance adjustments, and cross-reactive allergies before medicine is dispensed.',
    icon: ShieldAlert,
    metric: '100% Screened',
    metricLabel: 'Dispensation Safety Verification',
    image: '/images/healthcare/medicine-bottles.jpg'
  },
  {
    title: 'Smart Batch & Expiry Management',
    desc: 'Automated FEFO (First-Expired, First-Out) inventory dispatching, minimum re-order thresholds, and distributor purchase order automation.',
    icon: Boxes,
    metric: '35% Saved',
    metricLabel: 'Expired Medicine Waste Reduction',
    image: '/images/healthcare/digital-tablet-doctor.jpg'
  },
  {
    title: 'Automated Chronic Refill Reminders',
    desc: 'Keep hypertensive, diabetic, and cardiac patients compliant. Automated WhatsApp/SMS alerts when regular medicine courses are due for refill.',
    icon: Clock,
    metric: '28% Higher',
    metricLabel: 'Patient Medication Adherence',
    image: '/images/healthcare/doctor-patient-care.jpg'
  }
];

export default function PharmacyPage() {
  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/pharmacy-shelf.jpg"
              alt="Digital Pharmacy Management System"
              fill
              className="object-cover object-center opacity-20 dark:opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/70 via-surface-10/95 to-surface-10" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-md mb-6">
                <Pill size={15} />
                <span>Smart Pharmacy & Dispensary Cloud</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Modern Pharmacy Management, <br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent">
                  Secured with AI Prescription Safety.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Connect your retail or hospital pharmacy to verified doctor consultations. Enjoy real-time digital prescription orders, AI contraindication defense, and automated FEFO inventory management.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register/pharmacist"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5"
                >
                  <Pill size={16} /> Register Pharmacy
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition hover:bg-surface-20"
                >
                  Pharmacist Login <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Automated Drug Allergy Alerts</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Fast Barcode POS Billing</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Expiry Loss Prevention</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Pharmacy Capabilities
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Engineered for Safe, Rapid, and Profitable Dispensary Workflows
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {pharmacyFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40"
                  >
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {feat.metric} — {feat.metricLabel}
                          </span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <IconComp size={22} />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-emerald-500 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                          {feat.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-tonal-20/60">
                        <Link href="/register/pharmacist" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                          Register Pharmacy <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="border-t border-tonal-20/40 bg-surface-20/40 py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Power Your Pharmacy with Connected Healthcare
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Receive patient prescriptions immediately upon doctor sign-off and serve your community faster.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register/pharmacist" className="rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
                Connect Your Pharmacy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
