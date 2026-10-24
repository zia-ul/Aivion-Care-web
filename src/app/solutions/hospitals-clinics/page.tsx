import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Bed, 
  Calendar, 
  Users, 
  Layers, 
  HeartPulse, 
  Clock, 
  Zap,
  Activity,
  FileCheck2,
  Lock,
  UserPlus,
  ShieldAlert,
  KeyRound,
  FileText,
  BadgeCheck,
  Server
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Hospital & Clinic Management Software — Enterprise HMS, Staff Onboarding & Security | Aivion Care',
  description: 'Enterprise hospital and multi-specialty clinic management operating system (HMS/EMR). Comprehensive staff role-based onboarding (Doctors, Nurses, Receptionists, Lab, Pharmacy), real-time OPD token queues, IPD bed tracking, zero-trust cryptographic security profiles, and NABH compliance.',
  keywords: [
    'hospital management software',
    'clinic management system',
    'hospital EMR software',
    'hospital staff onboarding system',
    'hospital security profile software',
    'OPD token queue management',
    'IPD bed allocation software',
    'hospital role based access control RBAC',
    'NABH compliant hospital software',
    'multi-branch clinic management platform',
    'smart hospital operating system',
    'doctor roster and nurse shift scheduling software'
  ],
  alternates: {
    canonical: 'https://aivioncare.aiconfidencecure.com/solutions/hospitals-clinics',
  },
  openGraph: {
    title: 'Enterprise Hospital & Clinic OS — Staff Onboarding & Security Profiles | Aivion Care',
    description: 'Transform hospital operations: digital staff credentialing, automated OPD queue velocity, IPD bed telemetry, and zero-knowledge medical security.',
    url: 'https://aivioncare.aiconfidencecure.com/solutions/hospitals-clinics',
    images: ['/images/healthcare/hospital-interior.jpg'],
  },
};

const hospitalFeatures = [
  {
    title: 'Intelligent OPD Queue & Token Engine',
    desc: 'Eliminate chaotic waiting rooms. Patients receive live SMS/app queue notifications with dynamic wait-time estimation based on real doctor consultation velocity and triage priority.',
    icon: Clock,
    metric: '45% Less',
    metricLabel: 'Average Patient Waiting Time',
    image: '/images/healthcare/reception-desk.jpg'
  },
  {
    title: 'Dynamic IPD Ward & Bed Allocation',
    desc: 'Interactive 3D-style bed matrix for ICU, HDU, general, and deluxe wards. Real-time discharge forecasts, bed-turnaround tracking, transfer management, and automated sanitization alerts.',
    icon: Bed,
    metric: '99.4%',
    metricLabel: 'Bed Occupancy Accuracy',
    image: '/images/healthcare/icu-ward.jpg'
  },
  {
    title: 'AI Clinical Triage & Patient Flow Copilot',
    desc: 'Pre-screens arriving emergency and outpatient cases using validated 30-year physician triage algorithms to route high-risk vitals directly to critical care and trauma teams.',
    icon: HeartPulse,
    metric: '3.2x Faster',
    metricLabel: 'Critical Patient Escalation',
    image: '/images/healthcare/hospital-hallway.jpg'
  },
  {
    title: 'Complete Inter-Departmental Connectivity',
    desc: 'Seamless real-time order entry between doctor chambers, pathology labs, pharmacy dispensaries, and billing counters with zero paper trails.',
    icon: Layers,
    metric: '100% Digital',
    metricLabel: 'Zero Paper Prescription Loss',
    image: '/images/healthcare/modern-clinic.jpg'
  }
];

const staffManagementRoles = [
  {
    role: 'Doctors & Senior Consultants',
    desc: 'Credential verification (MCI / State Council), digital signature keys, OPD session block scheduling, and prescription pad permissioning.',
    icon: Stethoscope,
    badge: 'Physicians'
  },
  {
    role: 'Nurses & Ward Attendants',
    desc: 'Bed-side vital charting, medication administration schedules (MAR), doctor order execution, and nurse call-bell coordination.',
    icon: Activity,
    badge: 'Nursing Care'
  },
  {
    role: 'Receptionists & Front-Desk Staff',
    desc: 'Patient check-in, token generation, emergency fast-tracking, cash/UPI billing collection, and doctor availability broadcasting.',
    icon: Users,
    badge: 'Front Office'
  },
  {
    role: 'Pathology & Diagnostic Technicians',
    desc: 'Sample barcoding, analyzer machine interfacing, test requisition intake, and digital report approval routing.',
    icon: Layers,
    badge: 'Diagnostic Labs'
  },
  {
    role: 'Pharmacists & Dispensary Staff',
    desc: 'E-prescription fulfillment, batch barcode scanning, drug allergy warning reviews, and stock issuance reconciliation.',
    icon: ShieldCheck,
    badge: 'Dispensary'
  },
  {
    role: 'Hospital Administrators & Billing Heads',
    desc: 'Multi-department audit logs, revenue analytics, insurance TPA claim processing, and institutional compliance reports.',
    icon: Building2,
    badge: 'Executive Admin'
  }
];

const securityProfiles = [
  {
    title: 'Zero-Knowledge Role-Based Access Control (RBAC)',
    description: 'Granular least-privilege permissions ensure nurses, receptionists, and billing staff only view relevant medical records without accessing private diagnostic notes or clinical transcripts.',
    icon: KeyRound,
    stat: 'Granular RBAC'
  },
  {
    title: 'End-to-End Cryptographic Security (AES-256 & TLS 1.3)',
    description: 'All patient biometrics, audio/video consultation streams, and EMR database records are secured with military-grade encryption at rest and in transit.',
    icon: Lock,
    stat: 'AES-256 Bit'
  },
  {
    title: 'Immutable Audit Trails & Forensic Logging',
    description: 'Every chart access, prescription edit, lab report download, and credential modification is logged with immutable cryptographic timestamps to satisfy strict NABH, HIPAA, and ABDM audits.',
    icon: FileCheck2,
    stat: '100% Traceable'
  },
  {
    title: 'Automated Failover & Multi-Branch Cloud Isolation',
    description: '99.99% high-availability uptime SLA with distributed multi-region failover, ensuring emergency departments never experience downtime during localized internet outages.',
    icon: Server,
    stat: '99.99% Uptime'
  }
];

const faqList = [
  {
    q: 'Can our hospital onboard hundreds of doctors, nurses, and receptionists easily?',
    a: 'Yes. Hospital administrators have a dedicated "Staff Management" console where you can generate secure invite links, bulk-upload doctor credentials, assign custom ward permissions, and activate role profiles with one click.'
  },
  {
    q: 'How does Aivion Care ensure hospital data security and privacy compliance?',
    a: 'We implement zero-trust role-based access control (RBAC), tamper-evident audit logs, AES-256 encryption, and ABDM/HIPAA compliance standards. Front-desk staff never see sensitive clinical diagnoses, and diagnostic labs only see relevant specimen orders.'
  },
  {
    q: 'Can the software be deployed in a small 5-doctor clinic as well as a 500-bed hospital?',
    a: 'Yes. The modular architecture scales dynamically. Small clinics use the OPD queue and prescription pad features, while multi-specialty hospitals turn on the IPD bed matrix, ICU telemetry, pharmacy inventory, and lab machine interfacing.'
  },
  {
    q: 'How does the OPD token queue reduce patient waiting times?',
    a: 'Patients receive digital tokens via SMS/WhatsApp with live wait-time updates. If a doctor is delayed in surgery or an emergency occurs, the queue automatically recalibrates and alerts waiting patients in real-time.'
  }
];

export default function HospitalsClinicsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://aivioncare.aiconfidencecure.com/solutions/hospitals-clinics/#webpage',
        url: 'https://aivioncare.aiconfidencecure.com/solutions/hospitals-clinics',
        name: 'Hospital & Clinic Management Software | Aivion Care',
        description: 'Comprehensive enterprise hospital and clinic operating system with digital OPD token queues, IPD bed allocation, staff onboarding, and cryptographic security profiles.',
        medicalAudience: 'Hospitals, Clinics, Chief Medical Officers, and Health Administrators'
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://aivioncare.aiconfidencecure.com/solutions/hospitals-clinics/#faq',
        mainEntity: faqList.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    ]
  };

  return (
    <div className="min-h-screen bg-surface-10 text-primary-light antialiased transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-tonal-20/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/healthcare/hospital-interior.jpg"
              alt="Smart Hospital Operating System"
              fill
              className="object-cover object-center opacity-20 dark:opacity-15 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-10/70 via-surface-10/95 to-surface-10" />
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 backdrop-blur-md mb-6">
                <Building2 size={15} />
                <span>Enterprise Hospital OS & Multi-Specialty Clinic Suite</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary-light leading-tight">
                Modern Hospital & Clinic Management, <br />
                <span className="bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
                  Driven by Real-Time Clinical AI & Zero-Trust Security.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-primary-light/80 leading-relaxed">
                Connect your OPD, IPD, ICU, Pharmacy, Diagnostics, and Staff onboarding in a unified, cloud-native platform. Built for single-doctor clinics up to 1,000-bed hospital networks.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register/hospital"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
                >
                  <Building2 size={16} /> Register Hospital / Clinic
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-tonal-20/80 bg-surface-20/80 px-6 py-3.5 text-sm font-semibold text-primary-light backdrop-blur-md transition hover:bg-surface-20"
                >
                  Schedule an Enterprise Demo <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-tonal-20/60 text-xs text-primary-light/70 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> NABH, ABDM & ISO 27001 Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Multi-Branch Cloud Architecture</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Granular Staff Role Permissions</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE CLINICAL & WORKFLOW ENGINES */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Hospital Workflow Engine
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Built to Power Every Wing of Your Medical Facility
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {hospitalFeatures.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group relative overflow-hidden rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/40"
                  >
                    <div className="absolute inset-0 z-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {feat.metric} — {feat.metricLabel}
                          </span>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                            <IconComp size={22} />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-primary-light group-hover:text-sky-500 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-primary-light/75">
                          {feat.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-tonal-20/60">
                        <Link href="/register/hospital" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                          Get Started for Hospitals <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STAFF MANAGEMENT & ROLE ONBOARDING SUITE */}
        <section className="border-t border-tonal-20/40 bg-surface-20/40 py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <UserPlus size={14} /> Comprehensive Staff Administration
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-primary-light">
                Effortless Onboarding for All Medical & Administrative Roles
              </h2>
              <p className="mt-4 text-base text-primary-light/70">
                Hospital administrators can generate staff credentials, track shift attendance, and maintain department rosters without complex IT overhead.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staffManagementRoles.map((role) => {
                const IconComp = role.icon;
                return (
                  <div key={role.role} className="rounded-2xl border border-tonal-20/80 bg-surface-10 p-6 shadow-sm hover:border-sky-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <IconComp size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                        {role.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-primary-light">{role.role}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-primary-light/75">
                      {role.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOSPITAL SECURITY PROFILES & AUDIT TRAILS */}
        <section className="border-t border-tonal-20/40 py-16 sm:py-24">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                  <ShieldCheck size={14} /> Zero-Trust Security Architecture
                </div>
                <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
                  Bank-Grade Cryptographic Security & Medical Privacy Profiles
                </h2>
                <p className="mt-4 text-base leading-relaxed text-primary-light/75">
                  Protecting patient health records is non-negotiable. Aivion Care implements end-to-end encryption, strict role-based data partitioning, and tamper-evident audit trails that fulfill global healthcare governance benchmarks.
                </p>

                <div className="mt-8 space-y-5">
                  {securityProfiles.map((sec) => {
                    const SecIcon = sec.icon;
                    return (
                      <div key={sec.title} className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <SecIcon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-primary-light">{sec.title}</h4>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              {sec.stat}
                            </span>
                          </div>
                          <p className="text-xs text-primary-light/70 mt-1 leading-relaxed">{sec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-tonal-20/80 shadow-2xl">
                <Image
                  src="/images/healthcare/digital-tablet-doctor.jpg"
                  alt="Secure Hospital EMR Profile"
                  width={680}
                  height={520}
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg">Hospital Security & Governance Dashboard</div>
                    <div className="text-xs text-white/80">AES-256 Bit Encryption · Role-Based Medical Access · Real-Time Breach Prevention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLINICAL FAQ SECTION FOR SEO */}
        <section className="py-16 border-t border-tonal-20/40 bg-surface-20/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Hospital Administration FAQ
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-primary-light sm:text-4xl">
                Frequently Asked Hospital & Clinic Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqList.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-tonal-20/70 bg-surface-10 p-6 shadow-sm">
                  <h3 className="font-bold text-primary-light text-base sm:text-lg flex items-center gap-2">
                    <Building2 size={16} className="text-sky-500 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-primary-light/75 pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="border-t border-tonal-20/40 py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-extrabold text-primary-light sm:text-4xl">
              Elevate Your Hospital’s Clinical & Administrative Efficiency
            </h2>
            <p className="mt-4 text-base text-primary-light/75">
              Empower your doctors, nurses, receptionists, and hospital administrators with AI intelligence, paperless coordination, and ironclad security.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register/hospital" className="rounded-xl bg-sky-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400">
                Onboard Hospital Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
