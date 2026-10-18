'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  HeartPulse, 
  Stethoscope, 
  Users, 
  Building, 
  Activity, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface GalleryItem {
  title: string;
  subtitle: string;
  text: string;
  image: string;
  category: 'Hospital' | 'Clinical' | 'Doctor & Patient' | 'Diagnostic';
  tag: string;
}

const galleryItems: GalleryItem[] = [
  // 1. Hospital & In-Patient
  {
    title: 'Smart ICU & Ward Telemetry',
    subtitle: 'Continuous Bedside Intelligence',
    text: 'A unified monitoring hub for SpO2, heart rate, temperature, and digital PCG so clinical teams catch changes before symptoms peak.',
    image: '/images/healthcare/icu-ward.jpg',
    category: 'Hospital',
    tag: 'Hospital Grade',
  },
  {
    title: 'Modern Hospital Infrastructure',
    subtitle: 'Connected Facility Network',
    text: 'High-bandwidth digital architecture connecting operating theatres, patient rooms, and administrative hubs across multi-specialty buildings.',
    image: '/images/healthcare/hospital-interior.jpg',
    category: 'Hospital',
    tag: 'Facility OS',
  },
  {
    title: 'Hospital Hallway Triage Corridor',
    subtitle: 'Rapid Patient Routing',
    text: 'Real-time digital signage and token routing throughout hospital corridors, eliminating bottlenecks between departments.',
    image: '/images/healthcare/hospital-hallway.jpg',
    category: 'Hospital',
    tag: 'OPD Flow',
  },
  {
    title: 'Emergency Ambulance Response',
    subtitle: 'En-Route Telemetry Ingestion',
    text: 'Wireless telemetry streaming vital data from ambulance to the trauma team before the patient arrives at emergency admissions.',
    image: '/images/healthcare/emergency-ambulance.jpg',
    category: 'Hospital',
    tag: 'Trauma Sync',
  },
  {
    title: 'Patient Bedside Nursing Station',
    subtitle: 'Automated Bedside Triage',
    text: 'Empowering on-duty nurses with wireless vital sync, smart medication alarms, and early warning NEWS2 trend detection.',
    image: '/images/healthcare/patient-bedside.jpg',
    category: 'Hospital',
    tag: 'Bedside Care',
  },
  {
    title: 'Hospital Reception & Token Desk',
    subtitle: 'Zero-Queue Registration',
    text: 'Paperless digital registration and automated facial/OTP verification for patients entering outpatient consultations.',
    image: '/images/healthcare/reception-desk.jpg',
    category: 'Hospital',
    tag: 'Front Desk',
  },

  // 2. Clinical Care & Surgery
  {
    title: 'Precision Surgical Suites',
    subtitle: 'Intraoperative Telemetry',
    text: 'Real-time surgical theater telemetry integration, vital trends monitoring, and automated post-op triage handover checklists.',
    image: '/images/healthcare/surgery-theatre.jpg',
    category: 'Clinical',
    tag: 'Surgical Suites',
  },
  {
    title: 'Cardiology Care & Hemodynamics',
    subtitle: 'Autonomous ECG Monitoring',
    text: 'Continuous rhythm monitoring, ST-segment tracking, and instant automated arrhythmia classification with certified cardiology backup.',
    image: '/images/healthcare/cardiology-care.jpg',
    category: 'Clinical',
    tag: 'Cardiology',
  },
  {
    title: 'Pediatric Care & Gentle Monitoring',
    subtitle: 'Child-Safe Non-Invasive Vitals',
    text: 'Soft-touch biometric sensors designed for pediatric comfort, alerting parents and pediatricians without irritating the child.',
    image: '/images/healthcare/pediatric-care.jpg',
    category: 'Clinical',
    tag: 'Pediatrics',
  },
  {
    title: 'Modern Outpatient Clinic Suite',
    subtitle: 'All-in-One Practice Platform',
    text: 'Clean clinical suites equipped with Aivion Care workstations for fast patient throughput and electronic health documentation.',
    image: '/images/healthcare/modern-clinic.jpg',
    category: 'Clinical',
    tag: 'Clinic Practice',
  },
  {
    title: 'Stethoscope & Vital Diagnostics',
    subtitle: 'Digital Auscultation & Sounds',
    text: 'Digital audio recordings of lung and heart sounds captured and archived permanently inside patient records for consultation review.',
    image: '/images/healthcare/stethoscope-vitals.jpg',
    category: 'Clinical',
    tag: 'Auscultation',
  },
  {
    title: 'AI Healthcare Future Hub',
    subtitle: 'Predictive Medical Intelligence',
    text: 'Machine learning algorithms synthesizing vitals, lab biomarkers, and clinical history into actionable diagnostic hints.',
    image: '/images/healthcare/healthcare-ai-future.jpg',
    category: 'Clinical',
    tag: 'Predictive AI',
  },

  // 3. Doctors & Patients
  {
    title: 'Specialist In-Person Consultation',
    subtitle: 'Focused Doctor-Patient Engagement',
    text: 'Doctors spend 100% of their consultation talking with the patient while Aivion Care generates SOAP clinical notes automatically.',
    image: '/images/healthcare/doctor-consulting.jpg',
    category: 'Doctor & Patient',
    tag: 'Doctor Consult',
  },
  {
    title: 'Clinical Examination & Checkup',
    subtitle: 'Direct Physical Assessment',
    text: 'Comprehensive clinical examinations supported by mobile tablet telemetry that populates vitals into records on touch.',
    image: '/images/healthcare/doctor-examining.jpg',
    category: 'Doctor & Patient',
    tag: 'Examination',
  },
  {
    title: 'Collaborative Doctor & Nurse Care',
    subtitle: 'Interdisciplinary Alignment',
    text: 'Physicians and charge nurses review vital dashboards simultaneously, avoiding missed orders and prescription conflicts.',
    image: '/images/healthcare/doctor-nurse-team.jpg',
    category: 'Doctor & Patient',
    tag: 'Care Team',
  },
  {
    title: 'Patient-Centered Compassionate Care',
    subtitle: 'Continuous Family Support',
    text: 'Patients and family members stay informed with real-time updates and treatment milestones via the mobile application.',
    image: '/images/healthcare/doctor-patient-care.jpg',
    category: 'Doctor & Patient',
    tag: 'Patient Portal',
  },
  {
    title: 'Nurse Checking Vital Metrics',
    subtitle: 'Routine Bedside Verification',
    text: 'Nurses take vitals with wireless devices that log directly to the electronic medical chart without any manual paper entries.',
    image: '/images/healthcare/nurse-checking-patient.jpg',
    category: 'Doctor & Patient',
    tag: 'Nursing Care',
  },
  {
    title: 'Doctor Using Tablet Workstation',
    subtitle: 'Mobile Clinical Freedom',
    text: 'Review patient scans, approve laboratory reports, and write digital prescriptions from anywhere in the clinic or hospital.',
    image: '/images/healthcare/digital-tablet-doctor.jpg',
    category: 'Doctor & Patient',
    tag: 'Mobile EHR',
  },
  {
    title: 'HD Telemedicine Video Consultation',
    subtitle: 'Care Without Geographical Limits',
    text: 'Connect patients anywhere in India with verified top specialists with automated bandwidth optimization and video recording.',
    image: '/images/healthcare/telemedicine-call.jpg',
    category: 'Doctor & Patient',
    tag: 'Telehealth',
  },

  // 4. Diagnostics & Pharmacy
  {
    title: 'Automated Diagnostic Pathology Lab',
    subtitle: 'Fast Turnaround Testing',
    text: 'High-throughput blood and tissue analysis with digital pathologist signatures automatically notifying patient apps.',
    image: '/images/healthcare/medical-lab.jpg',
    category: 'Diagnostic',
    tag: 'Pathology Lab',
  },
  {
    title: 'Radiology MRI Imaging Suite',
    subtitle: 'High-Resolution Diagnostic Scans',
    text: 'Cloud DICOM image viewer allowing consulting physicians to inspect MRI, CT, and X-ray slices directly within the consultation portal.',
    image: '/images/healthcare/radiology-mri.jpg',
    category: 'Diagnostic',
    tag: 'MRI Radiology',
  },
  {
    title: 'CT Scan & 3D Imaging Suite',
    subtitle: 'Cross-Sectional Anatomy',
    text: 'Rapid CT imaging integrated with emergency triage queues for instantaneous diagnosis of acute internal injuries.',
    image: '/images/healthcare/ct-scan-room.jpg',
    category: 'Diagnostic',
    tag: 'CT Scanner',
  },
  {
    title: 'Clinical Laboratory Research',
    subtitle: 'Translational Health Science',
    text: 'Biomedical researchers analyzing clinical trends and patient cohorts to develop targeted preventative treatments.',
    image: '/images/healthcare/research-scientist.jpg',
    category: 'Diagnostic',
    tag: 'Bio Research',
  },
  {
    title: 'Hospital Pharmacy Inventory Hub',
    subtitle: 'Direct Prescription Fulfillment',
    text: 'Prescriptions dispatched directly from doctor workstations to the pharmacy, reserving stock and warning of drug interactions.',
    image: '/images/healthcare/pharmacy-shelf.jpg',
    category: 'Diagnostic',
    tag: 'Pharmacy Sync',
  },
  {
    title: 'Automated Medicine Dispensation',
    subtitle: 'Error-Free Medication Loops',
    text: 'Barcoded prescription validation ensuring patients receive the exact dosage, generic alternative, and timing instructions.',
    image: '/images/healthcare/medicine-bottles.jpg',
    category: 'Diagnostic',
    tag: 'Medications',
  },
  {
    title: 'Continuous ECG Monitor Waveforms',
    subtitle: 'Diagnostic Arrhythmia Alerts',
    text: 'Pan-Tompkins algorithmic filtering separating cardiac signals from noise, detecting bradycardia, tachycardia, and PVCs.',
    image: '/images/healthcare/ecg-monitor.jpg',
    category: 'Diagnostic',
    tag: 'ECG Engine',
  },
];

const categories = ['All', 'Hospital', 'Clinical', 'Doctor & Patient', 'Diagnostic'] as const;

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [activeSlide, setActiveSlide] = useState(0);

  const filtered = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="relative bg-surface-10 py-20 sm:py-28 overflow-hidden">
      
      {/* Moving Ambient Heart Rate Waveform */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(34, 211, 238, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34, 211, 238, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
              <Sparkles size={13} className="text-cyan-600 dark:text-cyan-300 animate-pulse" /> 26+ Real Clinical Environments
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary-light sm:text-4xl lg:text-5xl">
              Visual Gallery: <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-cyan-600 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">Hospitals, Clinics, Doctors & Patients.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-primary-light/70 sm:text-lg">
              Explore how Aivion Care powers hospitals, emergency suites, doctors, operating theatres, laboratories, and outpatient clinics across India with one unified operating system.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-3 rounded-2xl border border-tonal-20 bg-surface-20/80 p-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80">
            <HeartPulse size={20} className="text-rose-500 animate-heartbeat dark:text-rose-400" />
            <div>
              <p className="text-xs font-bold text-primary-light">26 Clinical Environments</p>
              <p className="text-[11px] font-mono text-teal-600 dark:text-teal-300">100% Connected Workflow</p>
            </div>
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveFilter(cat);
                setActiveSlide(0);
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 shadow-lg shadow-sky-500/25 scale-105'
                  : 'border border-tonal-20 bg-surface-20/70 dark:bg-slate-950/60 text-primary-light/80 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:text-primary-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Gallery Grid (All 26+ Images Visible) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <article
              key={item.title + idx}
              className="group relative flex flex-col overflow-hidden rounded-[26px] border border-tonal-20 bg-surface-20/85 dark:bg-slate-950/80 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:shadow-cyan-500/20"
            >
              {/* Image Box with Radiant Border Effect */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover opacity-90 dark:opacity-100 transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
                
                {/* Top Category and Tag Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full border border-cyan-500/30 bg-surface-20/85 dark:border-white/15 dark:bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 backdrop-blur-md">
                    {item.category}
                  </span>
                  <span className="rounded-full border border-teal-500/30 bg-surface-20/85 dark:border-teal-400/30 dark:bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>

                {/* Animated ECG Heartbeat waveform on hover */}
                <div className="absolute bottom-2 left-4 right-4 h-6 text-cyan-600 dark:text-cyan-400/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg viewBox="0 0 300 20" className="h-full w-full drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" preserveAspectRatio="none">
                    <path
                      d="M0 10 h50 l8 -8 l6 16 l6 -12 l8 4 h50 l8 -8 l6 16 l6 -12 l8 4 h100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="animate-ecg-dash"
                    />
                  </svg>
                </div>
              </div>

              {/* Card Body with Radiant Effect */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary-light group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors break-words">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-teal-600 dark:text-teal-300 uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-primary-light/75">
                    {item.text}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-tonal-20 flex items-center justify-between">
                  <a
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span>Connect Care</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-primary-light/60">
                    <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400" /> Verified
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
