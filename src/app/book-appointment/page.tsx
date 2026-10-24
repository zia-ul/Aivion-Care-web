import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Video, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Star, 
  MapPin, 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  ArrowRight,
  Filter,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Book Doctor Appointments Online — Top Verified Doctors Near You',
  description: 'Book doctor appointments online in seconds. Find verified specialists, check real-time OPD slots, choose between instant video consultation or clinic visits, and receive digital prescriptions with Aivion Care.',
  keywords: [
    'book doctor appointment online',
    'doctor appointment booking',
    'online doctor consultation',
    'find doctor near me',
    'book OPD appointment',
    'specialist doctor appointment',
    'instant video doctor consultation',
    'cardiologist appointment',
    'dermatologist online consultation',
    'pediatrician near me'
  ],
  alternates: {
    canonical: 'https://aivioncare.aiconfidencecure.com/book-appointment',
  },
  openGraph: {
    title: 'Book Doctor Appointments Online — Instant & Verified | Aivion Care',
    description: 'Instant doctor appointments with verified specialists. Choose Video Call or Clinic Visit. 24/7 continuous health ecosystem.',
    url: 'https://aivioncare.aiconfidencecure.com/book-appointment',
    images: ['/images/healthcare/doctor-consulting.jpg'],
  },
};

const specialties = [
  { name: 'General Physician', count: '120+ Doctors', icon: '🩺', desc: 'Fever, cough, flu, diabetes & general health' },
  { name: 'Cardiologist', count: '45+ Doctors', icon: '❤️', desc: 'Heart care, chest discomfort, hypertension' },
  { name: 'Dermatologist', count: '60+ Doctors', icon: '✨', desc: 'Skin, hair fall, acne, allergies' },
  { name: 'Pediatrician', count: '55+ Doctors', icon: '👶', desc: 'Child health, vaccinations, growth milestones' },
  { name: 'Gynecologist', count: '70+ Doctors', icon: '🌸', desc: 'Women\'s health, pregnancy, PCOS' },
  { name: 'Orthopedic', count: '50+ Doctors', icon: '🦴', desc: 'Joint pain, fractures, arthritis & spine' },
  { name: 'Psychiatrist / Therapist', count: '35+ Doctors', icon: '🧠', desc: 'Mental wellness, anxiety, sleep disorders' },
  { name: 'ENT Specialist', count: '40+ Doctors', icon: '👂', desc: 'Ear, nose, sinus & throat infections' },
];

const featuredDoctors = [
  {
    name: 'Dr. Sarah Khan',
    qualification: 'MBBS, MD (General Medicine)',
    specialty: 'Senior Consultant Physician',
    experience: '12+ Years Experience',
    hospital: 'Aivion Digital Hospital & Telehealth OPD',
    rating: '4.95',
    reviews: '520+ Reviews',
    nextSlot: 'Today in 15 mins',
    modes: ['Instant Video Call', 'Clinic Visit'],
    image: '/images/healthcare/doctor-consulting.jpg',
  },
  {
    name: 'Dr. Rajesh Verma',
    qualification: 'MBBS, MS, MCh (Cardiology)',
    specialty: 'Interventional Cardiologist',
    experience: '16+ Years Experience',
    hospital: 'Apex Cardio Institute',
    rating: '4.98',
    reviews: '890+ Reviews',
    nextSlot: 'Today at 04:30 PM',
    modes: ['Instant Video Call', 'Hospital Visit'],
    image: '/images/healthcare/cardiology-care.jpg',
  },
  {
    name: 'Dr. Priya Sharma',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    specialty: 'Clinical & Cosmetic Dermatologist',
    experience: '9+ Years Experience',
    hospital: 'Aivion Derma Care & Laser Centre',
    rating: '4.92',
    reviews: '410+ Reviews',
    nextSlot: 'Tomorrow at 11:00 AM',
    modes: ['Instant Video Call'],
    image: '/images/healthcare/doctor-examining.jpg',
  },
];

const faqs = [
  {
    q: 'How do I book a doctor appointment online on Aivion Care?',
    a: 'Simply choose your required medical specialty or search for your doctor, pick your preferred mode (Instant Video Call or Hospital Clinic OPD visit), select an available time slot, and confirm. You will immediately receive confirmation and calendar notifications.',
  },
  {
    q: 'Can I consult with a doctor through video call immediately?',
    a: 'Yes! Aivion Care supports instant telehealth sessions. Connected doctors with live queue availability can join an encrypted HD consultation within 5 to 15 minutes right from your phone or browser.',
  },
  {
    q: 'Are the doctors verified and licensed?',
    a: 'All practitioners on Aivion Care are strictly verified against State Medical Council and National Medical Commission registrations with credentials thoroughly audited before being granted practice privileges.',
  },
  {
    q: 'How will I receive my prescription after the appointment?',
    a: 'After the appointment, your digital QR-verified prescription is instantly available in your Patient Portal, sent via secure SMS/WhatsApp, and can be directly routed to our pharmacy partners for home delivery.',
  },
];

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-bg text-primary-light">
      <LandingNavbar />

      {/* JSON-LD Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: 'Book Doctor Appointments Online — Top Verified Doctors Near You',
            url: 'https://aivioncare.aiconfidencecure.com/book-appointment',
            description: 'Online doctor appointment booking with verified medical specialists. Real-time slots, instant video consults and clinic OPD visits.',
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            },
          }),
        }}
      />

      <main className="relative pt-24 sm:pt-28 pb-16">
        {/* Ambient background glows with healthcare image overlay */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-teal-500/15 via-sky-500/15 to-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-2xl" />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300 shadow-sm mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-teal-600 dark:text-teal-300" />
            <span>Instant & Verified Medical Consultations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-light max-w-4xl mx-auto leading-tight sm:leading-tight">
            Book Verified <span className="bg-gradient-to-r from-teal-600 via-sky-500 to-teal-500 dark:from-teal-300 dark:via-sky-300 dark:to-teal-200 bg-clip-text text-transparent">Doctor Appointments</span> Online
          </h1>

          <p className="mt-5 text-base sm:text-lg text-primary-light/75 max-w-2xl mx-auto leading-relaxed">
            Consult top specialists via HD Video Call from your home or book in-clinic OPD appointments with zero waiting line. Over 250+ verified doctors across India.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-tonal-20/80 bg-surface-20/90 p-3 sm:p-4 shadow-xl shadow-accent/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light/45" />
                <input
                  type="text"
                  placeholder="Specialty, Doctor name or Symptom..."
                  className="w-full rounded-xl bg-surface-10 border border-tonal-20 px-3.5 pl-10 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-4 relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light/45" />
                <input
                  type="text"
                  defaultValue="All India / Online Video"
                  className="w-full rounded-xl bg-surface-10 border border-tonal-20 px-3.5 pl-10 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-3">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
                >
                  <Calendar size={15} />
                  <span>Find Slots</span>
                </Link>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="mt-3 pt-3 border-t border-tonal-20/50 flex flex-wrap items-center justify-center gap-3 text-xs text-primary-light/65">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-teal-600 dark:text-teal-400" /> NMC / SMC Verified Doctors</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Video size={14} className="text-sky-500 dark:text-sky-400" /> Instant Video Consultation</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><HeartPulse size={14} className="text-emerald-600 dark:text-emerald-400" /> Live Vitals Telemetry Ready</span>
            </div>
          </div>
        </section>

        {/* Popular Specialties Section */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-light">
              Choose from 25+ Medical Specialties
            </h2>
            <p className="mt-2 text-sm text-primary-light/70">
              Consult with top rated specialists for every healthcare need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {specialties.map((spec) => (
              <Link
                key={spec.name}
                href="/login"
                className="group relative rounded-2xl border border-tonal-20/80 bg-surface-20/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{spec.icon}</div>
                  <h3 className="text-base font-bold text-primary-light group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-primary-light/65 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-tonal-20/50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal-700 dark:text-teal-300">{spec.count}</span>
                  <span className="inline-flex items-center gap-1 text-primary-light/70 group-hover:text-primary-light group-hover:translate-x-1 transition-all">
                    Book <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Top-Rated Doctors with Background Image Card */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-300">Available Today</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-light mt-1">
                Top Rated Specialist Doctors
              </h2>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline"
            >
              View All 250+ Doctors <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.name}
                className="relative rounded-3xl border border-tonal-20/80 bg-surface-20/80 overflow-hidden shadow-lg transition-all hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-surface-10">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/30 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-surface-10/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-amber-500 shadow">
                    <Star size={13} fill="currentColor" />
                    <span>{doc.rating}</span>
                    <span className="text-primary-light/50 font-normal">({doc.reviews})</span>
                  </div>

                  {/* Next slot pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <Clock size={12} />
                    <span>Next: {doc.nextSlot}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary-light">{doc.name}</h3>
                    <p className="text-xs font-medium text-teal-700 dark:text-teal-300 mt-0.5">{doc.specialty}</p>
                    <p className="text-xs text-primary-light/60 mt-1">{doc.qualification} • {doc.experience}</p>
                    
                    <p className="text-xs text-primary-light/75 mt-2 flex items-center gap-1.5">
                      <MapPin size={12} className="text-primary-light/50 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-tonal-20/60 flex items-center gap-2">
                    <Link
                      href="/login"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 py-2.5 text-xs font-bold text-slate-950 shadow transition-all hover:scale-[1.02]"
                    >
                      <Calendar size={14} />
                      <span>Book Appointment</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Step Booking Process */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-tonal-20/80 bg-surface-20/60 p-6 sm:p-10 backdrop-blur-xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-300">Fast & Seamless</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-light mt-1">
                How Online Booking Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative text-center p-5 rounded-2xl bg-surface-10/70 border border-tonal-20/60">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-teal-500/30">
                  1
                </div>
                <h3 className="font-bold text-base text-primary-light">Choose Doctor & Slot</h3>
                <p className="mt-2 text-xs text-primary-light/70 leading-relaxed">
                  Search by specialty, condition, or hospital. Review verified ratings, fees, and open real-time slots.
                </p>
              </div>

              <div className="relative text-center p-5 rounded-2xl bg-surface-10/70 border border-tonal-20/60">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-sky-500/30">
                  2
                </div>
                <h3 className="font-bold text-base text-primary-light">Consult In-Clinic or Video</h3>
                <p className="mt-2 text-xs text-primary-light/70 leading-relaxed">
                  Join a secure, encrypted HD video call right from your browser or walk in with prioritized OPD token queue.
                </p>
              </div>

              <div className="relative text-center p-5 rounded-2xl bg-surface-10/70 border border-tonal-20/60">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-emerald-500/30">
                  3
                </div>
                <h3 className="font-bold text-base text-primary-light">Digital Rx & Delivery</h3>
                <p className="mt-2 text-xs text-primary-light/70 leading-relaxed">
                  Receive instant digital prescriptions, order prescribed medicines for home delivery, and auto-sync vitals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Google Rich SEO FAQs (Targets PAA - People Also Ask) */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-300">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-light mt-1">
              Everything You Need to Know About Appointment Booking
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-tonal-20/70 bg-surface-20/80 p-5 shadow-sm backdrop-blur-sm"
              >
                <h3 className="text-base font-semibold text-primary-light flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 pl-7 text-sm text-primary-light/75 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Booking CTA */}
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl bg-gradient-to-r from-teal-900/60 via-slate-900/80 to-sky-900/60 border border-teal-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Ready to Consult a Verified Doctor?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-teal-100/80">
                Book in seconds. No waiting lines, no crowded clinic halls. Connect with doctors right now.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-gradient-to-r from-teal-400 to-sky-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
                >
                  Book Instant Appointment Now
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-teal-400/40 bg-surface-10/40 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white hover:bg-surface-10/70 transition-all"
                >
                  Are You a Doctor? Join Network
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
