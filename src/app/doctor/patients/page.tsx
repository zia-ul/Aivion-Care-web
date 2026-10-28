'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { 
  Users, 
  Search, 
  UserPlus, 
  QrCode, 
  FileText, 
  Pill, 
  Calendar, 
  Stethoscope, 
  CheckCircle2, 
  History,
  X,
  AlertCircle,
  Eye,
  FileCheck2,
  Printer
} from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';

interface Patient { 
  patientId: number; 
  patientName: string; 
  lastAppointmentDate?: string; 
  appointmentId?: number; 
  chatRoomId?: number | null; 
  patientUserId?: number | null; 
}

interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface LabReportItem {
  id: string;
  testName: string;
  date: string;
  labName: string;
  status: string;
  summary: string;
  fileSize: string;
  details: { parameter: string; result: string; normalRange: string }[];
}

interface PreviousDoctorRecord {
  doctorId: number;
  doctorName: string;
  speciality: string;
  hospitalName: string;
  visitDate: string;
  diagnosis: string;
  notes: string;
  prescriptionNumber: string;
  prescriptions: PrescriptionItem[];
  labReports?: LabReportItem[];
}

interface ReferralRecord {
  referralCode: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  bloodGroup: string;
  contactNumber: string;
  primaryCondition: string;
  previousDoctors: PreviousDoctorRecord[];
}

const mockReferrals: Record<string, ReferralRecord> = {
  'REF-7892': {
    referralCode: 'REF-7892',
    patientName: 'Aarav Sharma',
    patientAge: 46,
    patientGender: 'Male',
    bloodGroup: 'O+',
    contactNumber: '+91 98765 43210',
    primaryCondition: 'Hypertensive Heart Disease & Secondary Angina',
    previousDoctors: [
      {
        doctorId: 101,
        doctorName: 'Dr. Vikram Sethi, MD',
        speciality: 'Interventional Cardiology',
        hospitalName: 'AMU Institute of Cardiology',
        visitDate: '2026-09-14',
        prescriptionNumber: 'RX-2026-CARD-8921',
        diagnosis: 'Grade II Essential Hypertension with recurrent exertional chest pain',
        notes: 'Resting ECG showed sinus bradycardia with mild LVH. Patient advised telemetry and sodium reduction.',
        prescriptions: [
          { medicineName: 'Telmisartan 40mg', dosage: '1 Tablet', frequency: 'Once daily (Morning)', duration: '30 Days', instructions: 'After breakfast' },
          { medicineName: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: 'Once daily (Night)', duration: '30 Days', instructions: 'Before bed' },
          { medicineName: 'Rosuvastatin 10mg', dosage: '1 Tablet', frequency: 'Once daily (Night)', duration: '60 Days', instructions: 'Post-dinner lipid management' }
        ],
        labReports: [
          { 
            id: 'REP-901',
            testName: 'Comprehensive Lipid Profile & hs-CRP', 
            date: '2026-09-12', 
            labName: 'Aivion Central Pathology',
            status: 'Abnormal', 
            summary: 'Total Cholesterol: 224 mg/dL, LDL: 142 mg/dL, hs-CRP: 2.4 mg/L (Elevated cardiovascular risk)',
            fileSize: '1.4 MB',
            details: [
              { parameter: 'Total Cholesterol', result: '224 mg/dL', normalRange: '< 200 mg/dL' },
              { parameter: 'HDL Cholesterol', result: '38 mg/dL', normalRange: '> 40 mg/dL' },
              { parameter: 'LDL Cholesterol', result: '142 mg/dL', normalRange: '< 100 mg/dL' },
              { parameter: 'Triglycerides', result: '185 mg/dL', normalRange: '< 150 mg/dL' },
              { parameter: 'High Sensitivity CRP', result: '2.4 mg/L', normalRange: '< 1.0 mg/L' }
            ]
          },
          { 
            id: 'REP-902',
            testName: 'Renal Function & Serum Electrolytes', 
            date: '2026-09-12', 
            labName: 'AMUIF Diagnostic Wing',
            status: 'Normal', 
            summary: 'Creatinine: 0.9 mg/dL, eGFR: >90 mL/min/1.73m², Potassium: 4.2 mEq/L',
            fileSize: '850 KB',
            details: [
              { parameter: 'Serum Creatinine', result: '0.9 mg/dL', normalRange: '0.7 - 1.3 mg/dL' },
              { parameter: 'Blood Urea Nitrogen (BUN)', result: '14 mg/dL', normalRange: '7 - 20 mg/dL' },
              { parameter: 'eGFR', result: '94 mL/min', normalRange: '> 90 mL/min' },
              { parameter: 'Potassium', result: '4.2 mEq/L', normalRange: '3.5 - 5.0 mEq/L' }
            ]
          }
        ]
      },
      {
        doctorId: 104,
        doctorName: 'Dr. Priya Nandini, MBBS, DNB',
        speciality: 'General & Internal Medicine',
        hospitalName: 'City Care Clinic',
        visitDate: '2026-07-22',
        prescriptionNumber: 'RX-2026-MED-4412',
        diagnosis: 'Acute Bronchial Spasm & Generalized Malaise',
        notes: 'Seasonal exacerbation treated. Blood pressure was borderline (138/88 mmHg). Advised follow-up with cardiologist.',
        prescriptions: [
          { medicineName: 'Montelukast + Levocetirizine', dosage: '1 Tablet', frequency: 'Once daily (Night)', duration: '10 Days', instructions: 'At bedtime' },
          { medicineName: 'Budesonide Inhaler 200mcg', dosage: '2 Puffs', frequency: 'Twice daily', duration: '14 Days', instructions: 'Rinse mouth after inhalation' }
        ],
        labReports: [
          {
            id: 'REP-804',
            testName: 'Complete Blood Count (CBC) with Differential',
            date: '2026-07-21',
            labName: 'City Care Pathology Labs',
            status: 'Normal',
            summary: 'Hemoglobin: 14.8 g/dL, Total Leukocyte Count (TLC): 7,800 /uL, Absolute Eosinophils: 420 /uL',
            fileSize: '920 KB',
            details: [
              { parameter: 'Hemoglobin', result: '14.8 g/dL', normalRange: '13.5 - 17.5 g/dL' },
              { parameter: 'WBC Count', result: '7,800 /uL', normalRange: '4,500 - 11,000 /uL' },
              { parameter: 'Platelet Count', result: '240,000 /uL', normalRange: '150,000 - 450,000 /uL' },
              { parameter: 'Absolute Eosinophils', result: '420 /uL', normalRange: '30 - 350 /uL (Mild Allergic)' }
            ]
          }
        ]
      }
    ]
  },
  'REF-4410': {
    referralCode: 'REF-4410',
    patientName: 'Meera Patel',
    patientAge: 38,
    patientGender: 'Female',
    bloodGroup: 'B+',
    contactNumber: '+91 91234 56789',
    primaryCondition: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
    previousDoctors: [
      {
        doctorId: 108,
        doctorName: 'Dr. Rajesh K. Gupta, MD',
        speciality: 'Endocrinology & Diabetology',
        hospitalName: 'Apollo Health Centre',
        visitDate: '2026-08-30',
        prescriptionNumber: 'RX-2026-ENDO-3301',
        diagnosis: 'Uncontrolled Hyperglycemia with Early Peripheral Sensation Loss',
        notes: 'HbA1c reported at 8.4%. Switched to combination oral hypoglycemic therapy.',
        prescriptions: [
          { medicineName: 'Metformin 500mg SR', dosage: '1 Tablet', frequency: 'Twice daily', duration: '90 Days', instructions: 'With meals' },
          { medicineName: 'Dapagliflozin 10mg', dosage: '1 Tablet', frequency: 'Once daily (Morning)', duration: '90 Days', instructions: 'Morning before food' },
          { medicineName: 'Methylcobalamin + Pregabalin', dosage: '1 Capsule', frequency: 'Once daily (Night)', duration: '30 Days', instructions: 'Bedtime for neuropathy' }
        ],
        labReports: [
          { 
            id: 'REP-712',
            testName: 'Glycated Hemoglobin (HbA1c) & Fasting Plasma Sugar', 
            date: '2026-08-28', 
            labName: 'Apollo Diagnostics',
            status: 'High', 
            summary: 'HbA1c: 8.4%, Fasting Glucose: 168 mg/dL, Post-Prandial Glucose: 242 mg/dL',
            fileSize: '1.1 MB',
            details: [
              { parameter: 'HbA1c', result: '8.4 %', normalRange: '< 5.7 % (Normal), < 7.0 % (Target)' },
              { parameter: 'Fasting Blood Sugar', result: '168 mg/dL', normalRange: '70 - 99 mg/dL' },
              { parameter: 'Post-Prandial Blood Sugar', result: '242 mg/dL', normalRange: '< 140 mg/dL' },
              { parameter: 'Urine Microalbumin', result: '38 mg/L', normalRange: '< 20 mg/L (Microalbuminuria)' }
            ]
          }
        ]
      }
    ]
  }
};

export default function DoctorPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Referral UI state
  const [referralInput, setReferralInput] = useState('');
  const [activeReferral, setActiveReferral] = useState<ReferralRecord | null>(null);
  const [searchError, setSearchError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Document Viewer Modals
  const [viewingPrescription, setViewingPrescription] = useState<{
    doc: PreviousDoctorRecord;
    patient: ReferralRecord;
  } | null>(null);

  const [viewingLabReport, setViewingLabReport] = useState<{
    report: LabReportItem;
    doc: PreviousDoctorRecord;
    patient: ReferralRecord;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await doctorApi.getMyPatients();
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLookupReferral = (codeToLookup?: string) => {
    const code = (codeToLookup || referralInput).trim().toUpperCase();
    if (!code) {
      setSearchError('Please enter a referral code (e.g. REF-7892 or REF-4410)');
      return;
    }

    if (mockReferrals[code]) {
      setActiveReferral(mockReferrals[code]);
      setSearchError('');
    } else {
      setSearchError(`No patient found for code "${code}". Try sample codes REF-7892 or REF-4410`);
      setActiveReferral(null);
    }
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `REF-${randomNum}`;
    
    mockReferrals[code] = {
      referralCode: code,
      patientName: newPatientName,
      patientAge: 42,
      patientGender: 'Unspecified',
      bloodGroup: 'Pending',
      contactNumber: '+91 99000 11223',
      primaryCondition: newCondition || 'Referred Clinical Case',
      previousDoctors: [
        {
          doctorId: 999,
          doctorName: 'Referring Physician (Current Session)',
          speciality: 'General Consultation',
          hospitalName: 'Aivion Care Network',
          visitDate: new Date().toISOString().split('T')[0],
          prescriptionNumber: `RX-${randomNum}-GEN`,
          diagnosis: newCondition || 'Initial Clinical Referral',
          notes: 'Patient referred for secondary specialist assessment.',
          prescriptions: [
            { medicineName: 'Multivitamin & Minerals', dosage: '1 Tablet', frequency: 'Once daily', duration: '15 Days', instructions: 'Post-breakfast' }
          ],
          labReports: [
            {
              id: `REP-${randomNum}`,
              testName: 'Routine Vitals & Basic Biochemical Panel',
              date: new Date().toISOString().split('T')[0],
              labName: 'Aivion Care Diagnostic Partner',
              status: 'Normal',
              summary: 'Vitals normal, referred for full secondary evaluation.',
              fileSize: '720 KB',
              details: [
                { parameter: 'Resting Heart Rate', result: '78 BPM', normalRange: '60 - 100 BPM' },
                { parameter: 'Random Blood Glucose', result: '112 mg/dL', normalRange: '< 140 mg/dL' }
              ]
            }
          ]
        }
      ]
    };

    setGeneratedCode(code);
  };

  return (
    <AppLayout role="DOCTOR" title="Patients & Referrals" subtitle="Manage your patient registry and inspect cross-doctor referral history">
      <div className="space-y-6">

        {/* Top Referral Quick Search Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-surface-20/85 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-300">
                <QrCode size={13} /> Referral Code Engine
              </div>
              <h2 className="mt-2 text-xl font-bold text-primary-light">
                Inspect Complete Multi-Doctor Patient History
              </h2>
              <p className="mt-1 text-xs text-primary-light/70 max-w-xl">
                Enter a patient referral code to see all past attending doctors, view formal signed prescriptions, and inspect diagnostic lab test documents in one unified feed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(true);
                  setGeneratedCode(null);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:scale-[1.02] transition"
              >
                <UserPlus size={15} /> Add Referral Patient
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light/50" />
              <input
                type="text"
                placeholder="Enter patient referral code (e.g. REF-7892 or REF-4410)"
                value={referralInput}
                onChange={(e) => {
                  setReferralInput(e.target.value);
                  setSearchError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookupReferral();
                }}
                className="w-full rounded-2xl border border-tonal-20 bg-surface-10/80 pl-10 pr-4 py-2.5 text-xs text-primary-light placeholder:text-primary-light/40 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleLookupReferral()}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm"
            >
              <Search size={14} /> Search Code
            </button>
          </div>

          {/* Sample quick pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-primary-light/60">
            <span>Quick test codes:</span>
            <button
              type="button"
              onClick={() => {
                setReferralInput('REF-7892');
                handleLookupReferral('REF-7892');
              }}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono font-bold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              REF-7892 (Cardiology + 2 Docs)
            </button>
            <button
              type="button"
              onClick={() => {
                setReferralInput('REF-4410');
                handleLookupReferral('REF-4410');
              }}
              className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 font-mono font-bold text-teal-600 dark:text-teal-300 hover:bg-teal-500/20 transition"
            >
              REF-4410 (Diabetology & Labs)
            </button>
          </div>

          {searchError && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-medium">
              <AlertCircle size={14} /> {searchError}
            </p>
          )}
        </div>

        {/* Referral Patient Deep-Dive Detail View */}
        {activeReferral && (
          <div className="rounded-3xl border border-cyan-500/40 bg-surface-20 p-6 shadow-2xl space-y-6">
            
            {/* Patient Header Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-tonal-20">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-xl font-black text-white shadow-md">
                  {activeReferral.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold text-primary-light">
                      {activeReferral.patientName}
                    </h3>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                      {activeReferral.referralCode}
                    </span>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                      Universal Medical Record
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-primary-light/70">
                    Age: {activeReferral.patientAge} yrs • Gender: {activeReferral.patientGender} • Blood: {activeReferral.bloodGroup} • Phone: {activeReferral.contactNumber}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    Chief Complaint: {activeReferral.primaryCondition}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReferral(null)}
                  className="rounded-2xl border border-tonal-20 bg-surface-10 px-4 py-2 text-xs font-semibold text-primary-light/70 hover:text-primary-light transition"
                >
                  Close History
                </button>
              </div>
            </div>

            {/* Doctors Count & Timeline Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-10 border border-tonal-20">
                <p className="text-[11px] font-semibold text-primary-light/60">Attending Physicians</p>
                <p className="mt-1 text-xl font-black text-primary-light">{activeReferral.previousDoctors.length} Doctors</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-10 border border-tonal-20">
                <p className="text-[11px] font-semibold text-primary-light/60">Active Prescriptions</p>
                <p className="mt-1 text-xl font-black text-teal-600 dark:text-teal-300">
                  {activeReferral.previousDoctors.reduce((acc, doc) => acc + doc.prescriptions.length, 0)} Meds
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-10 border border-tonal-20">
                <p className="text-[11px] font-semibold text-primary-light/60">Diagnostic Lab Tests</p>
                <p className="mt-1 text-xl font-black text-cyan-600 dark:text-cyan-300">
                  {activeReferral.previousDoctors.reduce((acc, doc) => acc + (doc.labReports?.length || 0), 0)} Reports
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-10 border border-tonal-20">
                <p className="text-[11px] font-semibold text-primary-light/60">Clinical Continuity</p>
                <p className="mt-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">100% Synced</p>
              </div>
            </div>

            {/* Previous Doctors Clinical Timeline */}
            <div>
              <h4 className="text-base font-bold text-primary-light flex items-center gap-2 mb-4">
                <History size={16} className="text-cyan-500" /> Complete Multi-Doctor Care & Prescriptions History
              </h4>

              <div className="space-y-5">
                {activeReferral.previousDoctors.map((doc, dIdx) => (
                  <div key={dIdx} className="rounded-2xl border border-tonal-20 bg-surface-10/70 p-5 space-y-4">
                    
                    {/* Doctor Header & Prescription Document Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-tonal-20/60">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Stethoscope size={16} className="text-sky-500" />
                          <h5 className="font-extrabold text-sm sm:text-base text-primary-light">{doc.doctorName}</h5>
                          <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-300">
                            {doc.speciality}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-primary-light/60">{doc.hospitalName}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-mono text-primary-light/60 mr-2">
                          <Calendar size={13} /> {doc.visitDate}
                        </span>

                        {/* View Formal Prescription Document Button */}
                        <button
                          type="button"
                          onClick={() => setViewingPrescription({ doc, patient: activeReferral })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 transition"
                        >
                          <FileCheck2 size={13} /> View Prescription Doc
                        </button>
                      </div>
                    </div>

                    {/* Diagnosis & Attending Notes */}
                    <div className="p-3.5 rounded-xl bg-surface-20/60 border border-tonal-20/40 text-xs">
                      <p className="font-bold text-primary-light">Clinical Assessment / Diagnosis:</p>
                      <p className="mt-1 text-primary-light/80">{doc.diagnosis}</p>
                      {doc.notes && (
                        <p className="mt-2 text-primary-light/65 italic">&ldquo;{doc.notes}&rdquo;</p>
                      )}
                    </div>

                    {/* Prescriptions Given by this Doctor */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                          <Pill size={14} /> Prescribed Medications ({doc.prescriptions.length} items):
                        </p>
                        <span className="text-[11px] font-mono text-primary-light/50">Doc Ref: {doc.prescriptionNumber}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {doc.prescriptions.map((med, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-extrabold text-primary-light">{med.medicineName}</p>
                              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">Rx Item #{mIdx + 1}</span>
                            </div>
                            <p className="text-teal-700 dark:text-teal-300 font-medium">Dosage: {med.dosage} • {med.frequency}</p>
                            <p className="text-[11px] text-primary-light/60">Duration: {med.duration}</p>
                            <p className="text-[11px] text-primary-light/75 italic">{med.instructions}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Associated Diagnostic Lab Reports */}
                    {doc.labReports && doc.labReports.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                          <FileText size={14} /> Clinical Diagnostic Lab Reports ({doc.labReports.length}):
                        </p>
                        <div className="space-y-2">
                          {doc.labReports.map((lab, lIdx) => (
                            <div key={lIdx} className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-primary-light">{lab.testName}</p>
                                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">({lab.date})</span>
                                  <span className="text-[10px] text-primary-light/50 font-mono">• {lab.fileSize}</span>
                                </div>
                                <p className="mt-0.5 text-primary-light/70">{lab.summary}</p>
                                <p className="text-[10px] text-primary-light/50 font-mono mt-0.5">Facility: {lab.labName}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  lab.status === 'Abnormal' || lab.status === 'High'
                                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300'
                                    : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                                }`}>
                                  {lab.status}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => setViewingLabReport({ report: lab, doc, patient: activeReferral })}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-sm"
                                >
                                  <Eye size={13} /> Inspect Report
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Existing Doctor Patients Registry */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading font-bold text-primary-light">Current Registered Patients</h3>
            <span className="text-xs font-semibold text-primary-light/60">{patients.length} Active Patients</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-body text-primary-light/60">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <EmptyState icon={Users} title="No direct consultations yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {patients.map((patient) => (
                <div key={patient.patientId} className="p-4 bg-surface-10/50 rounded-xl border border-tonal-20/30 hover:border-cyan-500/40 transition">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary-light">{patient.patientName}</p>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      ID #{patient.patientId}
                    </span>
                  </div>
                  {patient.lastAppointmentDate && (
                    <p className="mt-2 text-support text-primary-light/60">Last visit: {patient.lastAppointmentDate}</p>
                  )}
                  {patient.chatRoomId && (
                    <p className="text-support text-primary-light/50">Chat Room #{patient.chatRoomId}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal: Full Prescription Document Viewer */}
        {viewingPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-teal-500/40 bg-surface-20 p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-tonal-20">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={20} className="text-teal-500" />
                  <h3 className="text-base sm:text-lg font-bold text-primary-light">Official Prescription Document</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingPrescription(null)}
                  className="rounded-full p-1 text-primary-light/60 hover:text-primary-light hover:bg-surface-30 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Prescription Formal Letterhead */}
              <div className="rounded-2xl border border-tonal-20 bg-surface-10 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-tonal-20/60 gap-2">
                  <div>
                    <h4 className="font-black text-base text-primary-light">{viewingPrescription.doc.doctorName}</h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{viewingPrescription.doc.speciality}</p>
                    <p className="text-[11px] text-primary-light/60">{viewingPrescription.doc.hospitalName}</p>
                  </div>
                  <div className="text-left sm:text-right font-mono text-xs">
                    <p className="text-primary-light font-bold">Rx No: {viewingPrescription.doc.prescriptionNumber}</p>
                    <p className="text-primary-light/60">Date: {viewingPrescription.doc.visitDate}</p>
                    <p className="text-teal-600 dark:text-teal-400 font-bold">Aivion Network Verified</p>
                  </div>
                </div>

                {/* Patient Bar */}
                <div className="p-3 rounded-xl bg-surface-20/80 border border-tonal-20/40 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-primary-light/50 block">Patient Name:</span>
                    <span className="font-bold text-primary-light">{viewingPrescription.patient.patientName}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Age / Gender:</span>
                    <span className="font-bold text-primary-light">{viewingPrescription.patient.patientAge} yrs / {viewingPrescription.patient.patientGender}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Ref Code:</span>
                    <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{viewingPrescription.patient.referralCode}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Blood Group:</span>
                    <span className="font-bold text-primary-light">{viewingPrescription.patient.bloodGroup}</span>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="text-xs">
                  <span className="font-bold text-primary-light">Clinical Diagnosis:</span>
                  <p className="mt-0.5 text-primary-light/80 bg-surface-20/50 p-2.5 rounded-lg border border-tonal-20/30">
                    {viewingPrescription.doc.diagnosis}
                  </p>
                </div>

                {/* Prescribed Items Table */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                    Prescribed Medications (Rx):
                  </span>
                  <div className="rounded-xl border border-tonal-20 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-surface-20 border-b border-tonal-20 text-[11px] text-primary-light/70 uppercase">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Medicine</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-tonal-20/40 bg-surface-10/50">
                        {viewingPrescription.doc.prescriptions.map((m, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-mono text-primary-light/50">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-primary-light">{m.medicineName}</td>
                            <td className="p-2.5 text-teal-600 dark:text-teal-300 font-medium">{m.dosage} ({m.frequency})</td>
                            <td className="p-2.5 text-primary-light/70">{m.duration}</td>
                            <td className="p-2.5 text-primary-light/70 italic">{m.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="pt-3 border-t border-tonal-20 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-primary-light/50">
                    Electronic Medical Prescription • Legally verified under Indian Telemedicine Guidelines 2020
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic font-bold text-teal-600 dark:text-teal-400 block">{viewingPrescription.doc.doctorName}</span>
                    <span className="text-[10px] font-mono text-primary-light/50">Digital Signature Verified</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-tonal-20 bg-surface-10 text-xs font-semibold text-primary-light hover:bg-surface-30 transition"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPrescription(null)}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow"
                >
                  Close Document
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Full Lab Diagnostic Report Viewer */}
        {viewingLabReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/40 bg-surface-20 p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-tonal-20">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-cyan-500" />
                  <h3 className="text-base sm:text-lg font-bold text-primary-light">Diagnostic Pathology Report</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingLabReport(null)}
                  className="rounded-full p-1 text-primary-light/60 hover:text-primary-light hover:bg-surface-30 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Report Formal View */}
              <div className="rounded-2xl border border-tonal-20 bg-surface-10 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-tonal-20/60 gap-2">
                  <div>
                    <h4 className="font-black text-base text-primary-light">{viewingLabReport.report.testName}</h4>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">{viewingLabReport.report.labName}</p>
                    <p className="text-[11px] text-primary-light/60">Referring: {viewingLabReport.doc.doctorName}</p>
                  </div>
                  <div className="text-left sm:text-right font-mono text-xs">
                    <p className="text-primary-light font-bold">Report ID: {viewingLabReport.report.id}</p>
                    <p className="text-primary-light/60">Sample Date: {viewingLabReport.report.date}</p>
                    <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      viewingLabReport.report.status === 'Abnormal' || viewingLabReport.report.status === 'High'
                        ? 'bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : 'bg-teal-500/20 border border-teal-500/30 text-teal-700 dark:text-teal-300'
                    }`}>
                      Overall: {viewingLabReport.report.status}
                    </span>
                  </div>
                </div>

                {/* Patient Bar */}
                <div className="p-3 rounded-xl bg-surface-20/80 border border-tonal-20/40 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-primary-light/50 block">Patient Name:</span>
                    <span className="font-bold text-primary-light">{viewingLabReport.patient.patientName}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Age / Gender:</span>
                    <span className="font-bold text-primary-light">{viewingLabReport.patient.patientAge} yrs / {viewingLabReport.patient.patientGender}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Ref Code:</span>
                    <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{viewingLabReport.patient.referralCode}</span>
                  </div>
                  <div>
                    <span className="text-primary-light/50 block">Blood Group:</span>
                    <span className="font-bold text-primary-light">{viewingLabReport.patient.bloodGroup}</span>
                  </div>
                </div>

                {/* Pathologist Summary */}
                <div className="p-3 rounded-xl bg-surface-20/60 border border-tonal-20/40 text-xs">
                  <p className="font-bold text-primary-light">Biochemical & Clinical Summary:</p>
                  <p className="mt-1 text-primary-light/80">{viewingLabReport.report.summary}</p>
                </div>

                {/* Parameter Details Table */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                    Detailed Lab Parameters & Bio-Markers:
                  </span>
                  <div className="rounded-xl border border-tonal-20 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-surface-20 border-b border-tonal-20 text-[11px] text-primary-light/70 uppercase">
                        <tr>
                          <th className="p-2.5">Investigation Parameter</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Biological Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-tonal-20/40 bg-surface-10/50 font-mono">
                        {viewingLabReport.report.details.map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-sans font-semibold text-primary-light">{row.parameter}</td>
                            <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-300">{row.result}</td>
                            <td className="p-2.5 text-primary-light/60">{row.normalRange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Verified Pathologist footer */}
                <div className="pt-3 border-t border-tonal-20 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-primary-light/50">
                    Quality Controlled • ISO 15189 & NABL Standards Compliant
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block">Aivion Verified Lab Director</span>
                    <span className="text-[10px] font-mono text-primary-light/50">Pathology Stamp Verified</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-tonal-20 bg-surface-10 text-xs font-semibold text-primary-light hover:bg-surface-30 transition"
                >
                  <Printer size={14} /> Print / Download Report
                </button>
                <button
                  type="button"
                  onClick={() => setViewingLabReport(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow"
                >
                  Close Report
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Add Referral Patient & Generate Code */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-surface-20 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-tonal-20">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-cyan-500" />
                  <h3 className="text-lg font-bold text-primary-light">Refer a New Patient</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full p-1 text-primary-light/60 hover:text-primary-light hover:bg-surface-30 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {!generatedCode ? (
                <form onSubmit={handleCreateReferral} className="mt-4 space-y-4">
                  <p className="text-xs text-primary-light/70">
                    Create a cross-doctor referral record. The generated code enables any doctor on the Aivion Care network to instantly inspect past diagnosis and prescriptions.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-primary-light mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zaid Khan"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-3.5 py-2 text-xs text-primary-light focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary-light mb-1">Primary Clinical Reason / Condition</label>
                    <input
                      type="text"
                      placeholder="e.g. Persistent Tachycardia & Suspected Valvular Murmur"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="w-full rounded-xl border border-tonal-20 bg-surface-10 px-3.5 py-2 text-xs text-primary-light focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-primary-light/70 rounded-xl hover:bg-surface-30 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-teal-500 rounded-xl shadow-md hover:scale-[1.02] transition"
                    >
                      Generate Referral Code
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-500 border border-teal-500/30">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-primary-light">Referral Code Created!</h4>
                    <p className="mt-1 text-xs text-primary-light/70">
                      Share this code with the patient or receiving specialist:
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-2xl font-black tracking-widest text-cyan-600 dark:text-cyan-300">
                    {generatedCode}
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setReferralInput(generatedCode);
                        handleLookupReferral(generatedCode);
                      }}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition shadow"
                    >
                      View Generated History
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-primary-light/70 rounded-xl hover:bg-surface-30 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
