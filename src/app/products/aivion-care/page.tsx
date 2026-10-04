import { Activity, BellRing, CalendarDays, FileText, HeartPulse, Pill, Stethoscope, Video } from 'lucide-react';
import ProductPageTemplate, { type ProductDetail } from '@/components/landing/ProductPageTemplate';

const product: ProductDetail = {
  eyebrow: 'HealthTech Application',
  title: 'Aivion Care',
  tagline: 'Connected healthcare for patients, doctors, hospitals and pharmacies.',
  description:
    'Aivion Care is a smart healthcare application that helps patients and families manage appointments, consultations, prescriptions, reports, reminders, and personal health records in one place. Clinical judgement stays with the treating professional; technology makes the connection reliable.',
  status: 'Featured product',
  Icon: HeartPulse,
  highlights: [
    'Appointments, teleconsultations, prescriptions and lab reports in one place',
    '24/7 monitoring with real-time health signals',
    'AI-assisted clinical workflows reviewed by the clinician',
    'Role-based workspaces for every person in the care journey',
  ],
  features: [
    { title: 'Smart Appointments', text: 'Book and manage appointments, schedules, queues and doctor availability from one platform.' },
    { title: 'Video Consultations', text: 'Connect patients and doctors through secure digital consultations with real-time communication.' },
    { title: 'AI Clinical Assistance', text: 'Use AI-assisted workflows to organize consultation information, notes and healthcare insights.' },
    { title: 'Digital Prescriptions', text: 'Create, manage and access digital prescriptions and medication information instantly.' },
    { title: 'Health Records', text: 'Keep medical history, reports, prescriptions and patient information organized in one place.' },
    { title: 'Real-Time Alerts', text: 'Receive appointment reminders, medication reminders and important healthcare notifications.' },
  ],
  specs: [
    { label: 'Category', value: 'HealthTech Application' },
    { label: 'Platforms', value: 'Web application, Android app, iOS app' },
    { label: 'Core signals', value: 'Heart rate, SpO2, Temperature, PCG' },
    { label: 'Roles supported', value: 'Patient, Doctor, Hospital, Pharmacy, Laboratory, Admin' },
    { label: 'Availability', value: '24/7 connected monitoring' },
    { label: 'Status', value: 'Live platform' },
  ],
  platforms: ['Web', 'Android', 'iOS', 'Tablet'],
  ctaLabel: 'Start Using Aivion Care',
};

export default function AivionCareProductPage() {
  return <ProductPageTemplate product={product} />;
}
