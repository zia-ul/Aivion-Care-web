'use client';

import { useMemo } from 'react';
import {
  Download,
  Printer,
  FileText,
  Stethoscope,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Award,
  Shield,
  Pill,
  FileText as FileTextIcon,
  HeartPulse,
  Thermometer,
  Droplet,
  Weight,
  Activity,
} from 'lucide-react';
import {
  ConsultationResponse,
  MedicineRow,
  InvestigationItem,
  VitalData,
  PatientData,
} from '@/types/consultation';

const getVitalIcon = (label: string) => {
  switch (label) {
    case 'Weight': return <Weight className="h-3 w-3" />;
    case 'BMI': return <Activity className="h-3 w-3" />;
    case 'B.P.': return <HeartPulse className="h-3 w-3" />;
    case 'Pulse': return <HeartPulse className="h-3 w-3" />;
    case 'SpO2': return <Droplet className="h-3 w-3" />;
    case 'Temp': return <Thermometer className="h-3 w-3" />;
    case 'Respiration Rate': return <Activity className="h-3 w-3" />;
    case 'Blood Glucose': return <Droplet className="h-3 w-3" />;
    default: return <Activity className="h-3 w-3" />;
  }
};

interface PrescriptionPreviewProps {
  consultation: ConsultationResponse;
  onDownloadPdf?: () => void;
  onPrint?: () => void;
  className?: string;
}

export function PrescriptionPreview({
  consultation,
  onDownloadPdf,
  onPrint,
  className = '',
}: PrescriptionPreviewProps) {
  const patient = useMemo((): PatientData => ({
    name: consultation.patientName,
    age: consultation.patientAge,
    sex: consultation.patientGender,
    maxId: consultation.patientMaxId,
    doctor: consultation.doctorName,
    department: consultation.departmentName,
    location: consultation.patientLocation,
    dateTime: new Date(consultation.consultationDate || consultation.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    invoiceNo: consultation.invoiceNumber,
    referredBy: consultation.referredBy,
    speciality: consultation.speciality,
    callInfo: consultation.appointmentType || 'In-Clinic',
  }), [consultation]);

  const medicines = useMemo((): MedicineRow[] => {
    return (consultation.medicines || []).map((m: any, i: number) => ({
      sno: i + 1,
      name: m.medicineName,
      dosage: m.dosage,
      schedule: m.schedule || m.frequencyPerDay ? `${m.frequencyPerDay}x/day ${m.timing ? `(${m.timing})` : ''}` : m.frequency,
      instruction: m.instructions || m.notes || 'Take as directed',
      route: m.route || 'Oral',
      duration: m.duration || (m.durationDays ? `${m.durationDays} days` : 'As needed'),
    }));
  }, [consultation.medicines]);

  const investigations = useMemo((): InvestigationItem[] => {
    return (consultation.investigations || []).map((inv: any, i: number) => ({
      sno: inv.sno || i + 1,
      investigationName: inv.investigationName,
      priority: inv.priority,
    }));
  }, [consultation.investigations]);

  const vitals = useMemo((): VitalData[] => {
    const v = consultation;
    const vitalList: VitalData[] = [
      { label: 'Weight', value: v.weightKg?.toString() || '', unit: 'kg' },
      { label: 'BMI', value: v.bmi?.toString() || '', unit: 'kg/m²' },
      { label: 'B.P.', value: v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic}` : '', unit: 'mmHg' },
      { label: 'Pulse', value: v.heartRate?.toString() || '', unit: 'bpm' },
      { label: 'SpO2', value: v.spo2?.toString() || '', unit: '%' },
      { label: 'Temp', value: v.bodyTemp?.toString() || '', unit: '°F' },
      { label: 'Respiration Rate', value: v.respRate?.toString() || '', unit: '/min' },
      { label: 'Blood Glucose', value: v.bloodGlucose?.toString() || '', unit: 'mg/dL' },
    ];
    return vitalList.filter((vital) => vital.value);
  }, [consultation]);

  const printPreview = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  const downloadPdf = () => {
    if (onDownloadPdf) onDownloadPdf();
    else window.print();
  };

  return (
    <div className={`bg-white text-gray-900 p-6 md:p-8 ${className}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center text-white">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{consultation.hospitalName || 'Hospital'}</h1>
              <p className="text-gray-600">{consultation.hospitalAddress || ''}</p>
<p className="text-gray-600 text-sm">
                <>
                  {consultation.hospitalPhone && <><Phone className="h-3 w-3 inline mr-1" />{consultation.hospitalPhone}</>}
                  {consultation.hospitalPhone && consultation.hospitalEmail && <span className="mx-2">•</span>}
                  {consultation.hospitalEmail && <><Mail className="h-3 w-3 inline mr-1" />{consultation.hospitalEmail}</>}
                </>
              </p>
              {consultation.hospitalRegNumber && (
                <p className="text-xs text-gray-500 mt-1">Reg: {consultation.hospitalRegNumber}</p>
              )}
            </div>
          </div>
          {consultation.hospitalLogoUrl && (
            <img src={consultation.hospitalLogoUrl} alt="Hospital Logo" className="h-16 w-auto rounded-lg" />
          )}
        </div>

        <div className="border-t-2 border-green-600 mb-4" />
      </div>

      {/* Prescription Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Prescription</h2>
        <p className="text-gray-600 mt-1">Patient Consultation Record</p>
      </div>

      {/* Patient & Doctor Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-700 font-semibold uppercase">Patient</p>
          <p className="font-medium text-gray-900">{patient.name}</p>
          <p className="text-gray-600">{patient.age} yrs • {patient.sex}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold uppercase">Doctor</p>
          <p className="font-medium text-gray-900">{consultation.doctorName}</p>
          <p className="text-gray-600">{consultation.doctorSpecialization}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-700 font-semibold uppercase">Date</p>
          <p className="font-medium text-gray-900">{patient.dateTime}</p>
          <p className="text-gray-600">{patient.callInfo}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <p className="text-xs text-orange-700 font-semibold uppercase">Invoice</p>
          <p className="font-medium text-gray-900">{patient.invoiceNo}</p>
          <p className="text-gray-600">Max ID: {patient.maxId || '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
        <div>
          <p className="text-xs text-gray-500 uppercase">Department</p>
          <p className="font-medium">{patient.department}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Referred By</p>
          <p className="font-medium">{patient.referredBy || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Speciality</p>
          <p className="font-medium">{patient.speciality}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Location</p>
          <p className="font-medium">{patient.location}</p>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1"><Award className="h-4 w-4" />{consultation.doctorQualification}</div>
          <div className="flex items-center gap-1"><Shield className="h-4 w-4" />Reg: {consultation.doctorRegNumber}</div>
          <div className="flex items-center gap-1"><Phone className="h-4 w-4" />{consultation.doctorPhone}</div>
          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{consultation.doctorAddress}</div>
        </div>
      </div>

      {/* Vitals */}
      {vitals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-green-600" /> Vital Signs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {vitals.map((vital) => (
              <div key={vital.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  {getVitalIcon(vital.label)}
                  {vital.label}
                </div>
                <p className="text-lg font-bold text-gray-900">{vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chief Complaints */}
      {(consultation.chiefComplaints || consultation.symptoms) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" /> Chief Complaints
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-gray-800 whitespace-pre-wrap">{consultation.chiefComplaints || consultation.symptoms}</p>
          </div>
        </div>
      )}

      {/* Diagnosis */}
      {(consultation.diagnosisNotes || consultation.diagnosis) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" /> Diagnosis
          </h3>
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <p className="text-gray-800 whitespace-pre-wrap font-medium">{consultation.diagnosisNotes || consultation.diagnosis}</p>
          </div>
        </div>
      )}

      {/* Investigations */}
      {investigations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-purple-600" /> Investigations Advised
          </h3>
          <div className="space-y-2">
            {investigations.map((inv) => (
              <div key={inv.sno} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-gray-400 font-medium">{inv.sno}.</span>
                  <span className="font-medium text-gray-900">{inv.investigationName}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  inv.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  inv.priority === 'LOW' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {inv.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medicines */}
      {medicines.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Pill className="h-5 w-5 text-orange-600" /> Medicines Prescribed
          </h3>
          <div className="space-y-3">
            {medicines.map((med) => (
              <div key={med.sno} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">{med.sno}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5">{med.schedule}</span>
                    <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">{med.route}</span>
                    <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5">{med.duration}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">Instruction</p>
                    <p className="font-medium text-gray-900">{med.instruction}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">Route</p>
                    <p className="font-medium text-gray-900">{med.route}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase">Duration</p>
                    <p className="font-medium text-gray-900">{med.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {(consultation.pastHistory || consultation.pastHistory) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Past History</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{consultation.pastHistory}</p>
          </div>
        )}
        {(consultation.physicalExamination || consultation.physicalExamination) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Physical Examination</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{consultation.physicalExamination}</p>
          </div>
        )}
        {(consultation.advice || consultation.advice) && (
          <div className="md:col-span-2 bg-green-50 rounded-lg p-4 border border-green-100">
            <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <Shield className="h-4 w-4" /> Advice
            </h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{consultation.advice}</p>
          </div>
        )}
        {(consultation.lifestyleAdvice || consultation.lifestyleAdvice) && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">Lifestyle Advice</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{consultation.lifestyleAdvice}</p>
          </div>
        )}
        {(consultation.followUp || consultation.followUp) && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Follow-up
            </h4>
            <p className="text-sm text-gray-800">{consultation.followUp}</p>
          </div>
        )}
        {(consultation.allergy || consultation.allergy) && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <Shield className="h-4 w-4" /> Allergies
            </h4>
            <p className="text-sm text-gray-800">{consultation.allergy}</p>
          </div>
        )}
        {(consultation.clinicalNotes || consultation.clinicalNotes) && (
          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Clinical Notes</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{consultation.clinicalNotes}</p>
          </div>
        )}
      </div>

      {/* Footer - Doctor Signature & Stamp */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mt-1">Doctor&apos;s Signature</p>
            <div className="h-20 border-b border-gray-400 flex items-end justify-center">
              {consultation.doctorSignatureUrl && (
                <img src={consultation.doctorSignatureUrl} alt="Signature" className="h-full max-w-xs" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mt-1">{consultation.doctorName}</p>
            <p className="text-xs text-gray-500">{consultation.doctorQualification}</p>
            <p className="text-xs text-gray-500">Reg: {consultation.doctorRegNumber}</p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Hospital Stamp</p>
            <div className="h-20 border-2 border-gray-400 rounded-full flex items-center justify-center">
              {consultation.hospitalLogoUrl ? (
                <img src={consultation.hospitalLogoUrl} alt="Stamp" className="h-full w-auto p-2" />
              ) : (
                <span className="text-gray-400">Hospital Stamp</span>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
          <p className="font-semibold mb-1">Disclaimer:</p>
          <p>This prescription is generated electronically and is valid without physical signature as per IT Act 2000. 
          Medicines should be taken strictly as advised. Consult your doctor for any adverse effects.</p>
        </div>
      </div>

      {/* Action Buttons (Screen Only) */}
      <div className="no-print mt-6 flex flex-wrap gap-3 justify-center">
        {onDownloadPdf && (
          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        )}
        {onPrint && (
          <button
            onClick={printPreview}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        )}
      </div>
    </div>
  );
}