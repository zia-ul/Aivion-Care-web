'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Bed,
  PhoneCall
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SurgeryOption {
  id: string;
  procedure: string;
  category: string;
  hospital: string;
  surgeon: string;
  nextAvailable: string;
  estimatedCost: string;
  stayDuration: string;
  rating: number;
}

const surgeryList: SurgeryOption[] = [
  {
    id: 'surg-1',
    procedure: 'Minimally Invasive Laparoscopic Cholecystectomy',
    category: 'General & GI Surgery',
    hospital: 'Apex Multi-Specialty Hospital',
    surgeon: 'Dr. Tariq Farooqui (MS, FRCS)',
    nextAvailable: 'Tomorrow, 10:00 AM',
    estimatedCost: '₹55,000 - ₹75,000',
    stayDuration: '1 Day Daycare',
    rating: 4.9
  },
  {
    id: 'surg-2',
    procedure: 'Coronary Angioplasty (PTCA with Drug-Eluting Stent)',
    category: 'Cardiothoracic Surgery',
    hospital: 'Apollo Heart Institute',
    surgeon: 'Dr. Sameer Khan (MD, DM Cardiology)',
    nextAvailable: '28 Oct 2026, 09:30 AM',
    estimatedCost: '₹1,40,000 - ₹1,85,000',
    stayDuration: '2 Days ICU/HDU',
    rating: 5.0
  },
  {
    id: 'surg-3',
    procedure: 'Arthroscopic Anterior Cruciate Ligament (ACL) Reconstruction',
    category: 'Orthopedic Surgery',
    hospital: 'Fortis Ortho & Joint Center',
    surgeon: 'Dr. Neha Verma (MS Ortho)',
    nextAvailable: '29 Oct 2026, 11:15 AM',
    estimatedCost: '₹85,000 - ₹1,10,000',
    stayDuration: '1-2 Days Inpatient',
    rating: 4.8
  },
  {
    id: 'surg-4',
    procedure: 'Phacoemulsification with Foldable IOL (Cataract Surgery)',
    category: 'Ophthalmic Surgery',
    hospital: 'Vision Eye Hospital & Retina Institute',
    surgeon: 'Dr. A. K. Sharma (MS Ophthalmology)',
    nextAvailable: 'Today, 03:00 PM',
    estimatedCost: '₹22,000 - ₹38,000',
    stayDuration: 'Daycare Procedure (2 hrs)',
    rating: 4.9
  },
  {
    id: 'surg-5',
    procedure: 'Robotic Radical Prostatectomy',
    category: 'Urology & Robotic Surgery',
    hospital: 'Max Super Specialty Hospital',
    surgeon: 'Dr. Zeeshan Ali (MCh Urology)',
    nextAvailable: '02 Nov 2026, 08:30 AM',
    estimatedCost: '₹2,20,000 - ₹2,90,000',
    stayDuration: '3 Days Inpatient',
    rating: 4.9
  }
];

export default function PatientSurgeriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'General & GI Surgery', 'Cardiothoracic Surgery', 'Orthopedic Surgery', 'Ophthalmic Surgery', 'Urology & Robotic Surgery'];

  const filteredSurgeries = surgeryList.filter((surg) => {
    const matchesSearch = surg.procedure.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          surg.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          surg.surgeon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || surg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookingRequest = (procedureName: string) => {
    toast.success(`Surgical consultation request submitted for: ${procedureName}`);
  };

  return (
    <AppLayout role="PATIENT" title="Surgery Care & OT Booking" subtitle="Browse, compare, and schedule surgical procedures">
      <div className="space-y-6">
        
        {/* HERO BANNER */}
        <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-surface-20 to-teal-500/10 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 mb-3">
                <ShieldCheck size={14} /> NABH Accredited Operation Theaters
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-light">
                Comprehensive Surgical Care & OT Coordination
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-primary-light/75 leading-relaxed">
                Connect directly with board-certified chief surgeons, check real-time operation theater (OT) availability, get transparent package estimates, and coordinate pre-anesthesia evaluations.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs text-primary-light/80">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Cashless Mediclaim / TPA Insurance Assistance</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Pre-Anesthesia Medical Clearance (PAC)</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Dedicated Post-Op Telemetry Tracking</span>
            </div>
          </div>
        </div>

        {/* SEARCH AND CATEGORY FILTER */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light/50" />
            <input
              type="text"
              placeholder="Search surgery, procedure, hospital, or surgeon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-tonal-20 bg-surface-10 pl-10 pr-4 py-2.5 text-sm text-primary-light placeholder:text-primary-light/40 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat 
                    ? 'bg-sky-500 text-slate-950 font-bold' 
                    : 'bg-surface-20 text-primary-light/70 hover:bg-surface-20/80 hover:text-primary-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SURGERY CARDS LIST */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSurgeries.map((surg) => (
            <Card key={surg.id} className="border border-tonal-20/80 bg-surface-10 p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md">
                    {surg.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">★ {surg.rating}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-primary-light">
                  {surg.procedure}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-primary-light/75">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-primary-light/50" />
                    <span>Hospital: <strong>{surg.hospital}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={14} className="text-primary-light/50" />
                    <span>Surgeon: <strong>{surg.surgeon}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary-light/50" />
                    <span>Next OT Slot: <strong className="text-sky-600 dark:text-sky-400">{surg.nextAvailable}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed size={14} className="text-primary-light/50" />
                    <span>Admission: <strong>{surg.stayDuration}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-tonal-20/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-primary-light/60">Estimated Cost</div>
                  <div className="text-base font-extrabold text-primary-light">{surg.estimatedCost}</div>
                </div>

                <Button
                  onClick={() => handleBookingRequest(surg.procedure)}
                  className="text-xs font-bold gap-1.5 bg-sky-500 text-slate-950 hover:bg-sky-400"
                >
                  Request Consultation <ArrowRight size={13} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* BOTTOM HELP BANNER */}
        <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-primary-light">Need assistance with surgery financing or second opinion?</div>
            <div className="text-primary-light/65 mt-0.5">Our surgical care coordinators are available 24/7 to review case records.</div>
          </div>
          <a href="tel:+918449391441" className="inline-flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400 hover:underline">
            <PhoneCall size={14} /> Call Surgical Helpdesk: +91 84493 91441
          </a>
        </div>

      </div>
    </AppLayout>
  );
}
