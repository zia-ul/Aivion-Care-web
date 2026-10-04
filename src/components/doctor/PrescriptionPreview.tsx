'use client';

import { useMemo } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import {
  ConsultationResponse,
  MedicineRow,
  InvestigationItem,
  VitalData,
  PatientData,
} from '@/types/consultation';
import { usePrescriptionAssetImage, doctorInitials } from './usePrescriptionAssetImage';

/* ------------------------------------------------------------------------ */
/* Helpers mirroring the Android template mapper                             */
/* ------------------------------------------------------------------------ */

const nonBlank = (value?: string | null): string => (value ?? '').trim();

const firstNonBlank = (values: Array<string | null | undefined>, fallback = ''): string => {
  for (const value of values) {
    const trimmed = nonBlank(value);
    if (trimmed) return trimmed;
  }
  return fallback;
};

const formatNumber = (value?: number | null): string => {
  if (value == null) return '';
  if (Number.isInteger(value)) return String(value);
  return Number.isInteger(Number(value.toFixed(1))) ? value.toFixed(0) : value.toFixed(1);
};

const buildSchedule = (m: { schedule?: string; frequencyPerDay?: string | number; timing?: string }): string => {
  const parts: string[] = [];
  if (nonBlank(m.schedule)) parts.push(nonBlank(m.schedule));
  if (nonBlank(String(m.frequencyPerDay ?? ''))) parts.push(`Freq: ${String(m.frequencyPerDay).trim()}`);
  if (nonBlank(m.timing)) parts.push(`Timing: ${nonBlank(m.timing)}`);
  return parts.join(' · ');
};

/* Small building blocks matching the Android preview widgets. */

function SectionTitle({ text }: { text: string }) {
  return (
    <h3 className="mb-1 text-[12px] font-bold uppercase tracking-[0.3px] text-gray-900 underline">
      {text}
    </h3>
  );
}

function InfoRow({ label, value, bold = false, danger = false }: {
  label: string; value: string; bold?: boolean; danger?: boolean;
}) {
  return (
    <div className="flex items-start gap-1 py-[1.5px] text-[11px] leading-[1.25]">
      <span className="w-[82px] shrink-0 font-bold text-gray-600">{label}</span>
      <span className="font-bold text-gray-600">:{' '}</span>
      <span className={`flex-1 ${bold ? 'font-bold' : 'font-normal'} ${danger ? 'font-bold text-[#C0392B]' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1.5">
      <SectionTitle text={title} />
      {children}
    </div>
  );
}

function AssetImage({ rawUrl, width = 42, height = 42, alt, fallback }: {
  rawUrl?: string | null; width?: number; height?: number; alt: string;
  fallback: React.ReactNode;
}) {
  const { src, failed } = usePrescriptionAssetImage(rawUrl);
  if (failed || !src) return <>{fallback}</>;
  return (
    <img src={src} alt={alt} width={width} height={height} className="object-contain" style={{ width, height }} />
  );
}

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
    dateTime: new Date(consultation.finalizedAt || consultation.consultationDate || consultation.createdAt).toLocaleString('en-IN', {
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
    return (consultation.medicines || [])
      .filter((m: { medicineName?: string; dosage?: string; amountPerUse?: string; frequency?: string; frequencyPerDay?: string | number; timing?: string; duration?: string; instructions?: string; notes?: string }) =>
        nonBlank(m.medicineName) || nonBlank(m.dosage) || nonBlank(m.amountPerUse)
        || nonBlank(m.frequency) || nonBlank(String(m.frequencyPerDay ?? ''))
        || nonBlank(m.timing) || nonBlank(m.duration)
        || nonBlank(m.instructions) || nonBlank(m.notes))
      .map((m: { medicineName?: string; dosage?: string; amountPerUse?: string; frequency?: string; frequencyPerDay?: string | number; timing?: string; duration?: string; durationDays?: number; instructions?: string; notes?: string; schedule?: string; route?: string }, i: number) => ({
        sno: i + 1,
        name: firstNonBlank([m.medicineName]),
        dosage: firstNonBlank([m.dosage, m.amountPerUse]),
        schedule: buildSchedule(m),
        instruction: firstNonBlank([m.instructions, m.notes]),
        route: firstNonBlank([m.route], 'Oral'),
        duration: firstNonBlank([m.duration, m.durationDays != null ? `${m.durationDays} days` : '']),
      }));
  }, [consultation.medicines]);

  const investigations = useMemo((): InvestigationItem[] => {
    return (consultation.investigations || []).map((inv: { sno?: number; investigationName?: string; priority?: 'HIGH' | 'NORMAL' | 'LOW' }, i: number) => ({
      sno: inv.sno || i + 1,
      investigationName: firstNonBlank([inv.investigationName]),
      priority: (firstNonBlank([inv.priority as string], 'NORMAL') as 'HIGH' | 'NORMAL' | 'LOW'),
    }));
  }, [consultation.investigations]);

  const vitals = useMemo((): VitalData[] => {    const v = consultation;
    const vitalList: VitalData[] = [
      { label: 'Weight', value: v.weightKg?.toString() || '', unit: 'kg' },
      { label: 'BMI', value: v.bmi?.toString() || '', unit: 'kg/m²' },
      { label: 'B.P.', value: v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic}` : '', unit: 'mmHg' },
      { label: 'Pulse', value: v.heartRate?.toString() || '', unit: 'bpm' },
      { label: 'SpO2', value: formatNumber(v.spo2) ? `${formatNumber(v.spo2)} %` : '', unit: '' },
      { label: 'Temp', value: formatNumber(v.bodyTemp) ? `${formatNumber(v.bodyTemp)} F` : '', unit: '' },
      { label: 'RR', value: v.respRate ? `${v.respRate} /min` : '', unit: '' },
      {
        label: 'Glucose',
        value: v.bloodGlucose != null ? `${formatNumber(v.bloodGlucose)} mg/dL` : '',
        unit: '',
      },
    ];
    return vitalList.filter((vital) => vital.value);
  }, [consultation]);

  /* Header identity with the same fallback chains as the Android mapper. */
  const doctorName = firstNonBlank([consultation.doctorName], 'Doctor');
  const doctorSpecialization = firstNonBlank([
    (consultation as unknown as { doctorSpecialization?: string }).doctorSpecialization,
    consultation.departmentName,
    consultation.speciality,
  ]);
  const doctorPhone = firstNonBlank([consultation.doctorPhone, consultation.hospitalPhone]);
  const doctorAddress = firstNonBlank([consultation.doctorAddress, consultation.hospitalAddress]);
  const doctorRegNumber = firstNonBlank([consultation.doctorRegNumber, consultation.hospitalRegNumber]);
  const hospitalName = firstNonBlank([consultation.hospitalName], 'Hospital');
  const logoUrl = firstNonBlank([consultation.doctorLogoUrl, consultation.hospitalLogoUrl]) || undefined;
  const signatureUrl = firstNonBlank([consultation.doctorSignatureUrl, consultation.doctorStampUrl]) || undefined;

  const advice = firstNonBlank([consultation.advice, consultation.lifestyleAdvice, consultation.followUp], 'Follow up as advised');
  const allergy = nonBlank(consultation.allergy) ? nonBlank(consultation.allergy) : 'None reported';
  const complaints = firstNonBlank([consultation.chiefComplaints], 'Not specified');
  const pastHistory = firstNonBlank([consultation.pastHistory], 'Not specified');
  const physicalExam = firstNonBlank([consultation.physicalExamination], 'Not specified');
  const clinicalNotes = firstNonBlank([consultation.clinicalNotes], 'Not specified');
  const diagnosisNotes = firstNonBlank([consultation.diagnosisNotes, consultation.diagnosis || ''], 'Not specified');

  const printPreview = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  const downloadPdf = () => {
    if (onDownloadPdf) onDownloadPdf();
    else window.print();
  };

  return (
    <div className={`bg-white text-gray-900 p-0 ${className}`} style={{ fontFamily: 'Arial, system-ui, sans-serif', maxWidth: 794 }}>
      {/* Header (Android PrescriptionHeader) */}
      <div className="border-b-[2.5px] border-[#005A8E] px-[14px] pt-2 pb-1.5">
        <div className="flex items-start gap-3">
          <div className="flex-[6]">
            <div className="flex items-center gap-2.5">
              <AssetImage
                rawUrl={logoUrl}
                width={42}
                height={42}
                alt="Hospital logo"
                fallback={(
                  <div className="flex h-12 w-[72px] flex-col items-center justify-center rounded-md bg-[#005A8E] text-white">
                    <span className="text-[15px] font-bold leading-none">{doctorInitials(doctorName)}</span>
                    <span className="mt-0.5 text-[7px] font-bold">MAX</span>
                  </div>
                )}
              />
              <div className="min-w-0">
                <h1 className="text-[16px] font-bold tracking-[0.5px] text-[#005A8E]">{hospitalName}</h1>
                <p className="text-[9px] tracking-[0.3px] text-gray-500">Super Speciality Hospital</p>
              </div>
            </div>
            <div className="mt-1.5 flex items-start gap-2">
              <div className="h-7 w-7 shrink-0 rounded-full bg-[#E8F2F9] flex items-center justify-center text-[13px] font-bold text-[#005A8E]">℞</div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">Dr. {doctorName}</p>
                {consultation.doctorQualification && (
                  <p className="text-[10.5px] font-bold text-[#005A8E]">{consultation.doctorQualification}</p>
                )}
                {doctorSpecialization && <p className="text-[10px] text-gray-900">{doctorSpecialization}</p>}
                <p className="text-[9px] font-bold text-[#C8960C]">Senior Consultant</p>
              </div>
            </div>
          </div>
          <div className="flex-[4] text-right">
            <p className="text-[13px] font-bold text-gray-900">{doctorName}</p>
            {consultation.doctorQualification && (
              <p className="text-[10.5px] font-bold text-[#005A8E]">{consultation.doctorQualification}</p>
            )}
            {doctorSpecialization && <p className="text-[10px] text-gray-900">{doctorSpecialization}</p>}
            <p className="text-[9px] font-bold text-[#C8960C]">Senior Consultant</p>
            <p className="mt-1 text-[10px] text-gray-600">{doctorAddress || consultation.hospitalAddress}</p>
            <p className="text-[10px] text-gray-600">Phone: {doctorPhone}</p>
            <p className="text-[10px] text-gray-600">Hospital: {hospitalName} | No: {consultation.hospitalRegNumber}</p>
          </div>
        </div>
      </div>

      {/* Blue strip */}
      <div className="bg-[#005A8E] py-[3px] text-center text-[10px] font-bold uppercase tracking-[1px] text-white">
        Outpatient Prescription / Clinical Summary
      </div>

      {/* Patient info grid */}
      <div className="border-b border-gray-300 px-[14px] py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <div>
            <InfoRow label="Patient Name" value={patient.name} bold />
            <InfoRow label="Age / Sex" value={`${patient.age} Years / ${patient.sex}`} />
            <InfoRow label="Max ID" value={patient.maxId} />
            <InfoRow label="Consultant" value={patient.doctor} />
            <InfoRow label="Department" value={patient.department} />
          </div>
          <div>
            <InfoRow label="Location" value={patient.location} />
            <InfoRow label="Date & Time" value={patient.dateTime} />
            <InfoRow label="Invoice No." value={patient.invoiceNo} />
            <InfoRow label="Referred By" value={patient.referredBy} />
            <InfoRow label="Speciality" value={patient.speciality} />
            <InfoRow label="Call Info" value={patient.callInfo} />
          </div>
        </div>
      </div>


      {/* Vitals bar */}
      {vitals.length > 0 && (
        <div className="mx-[14px] mt-2 rounded-[3px] border border-[#005A8E] bg-[#F5FAFF] px-2 py-1.5">
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {vitals.map((vital) => (
              <span key={vital.label} className="inline-block w-[84px] text-[10px] leading-[1.3] text-gray-900">
                <span className="font-bold">{vital.label}:</span> {vital.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical sections: Allergy + Chief Complaints, Past History + Physical, Clinical Notes, Diagnosis */}
      <div className="px-[14px] pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <SectionBlock title="Allergy">
            <p className={`text-[12px] ${allergy !== 'None reported' ? 'font-bold text-[#C0392B]' : 'text-gray-900'}`}>
              {allergy}
            </p>
          </SectionBlock>
          <SectionBlock title="Chief Complaints">
            <p className="text-[12px] text-gray-900">{complaints}</p>
          </SectionBlock>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <SectionBlock title="Past History">
            <p className="text-[12px] text-gray-900">{pastHistory}</p>
          </SectionBlock>
          <SectionBlock title="Physical Examination">
            <p className="text-[12px] text-gray-900">{physicalExam}</p>
          </SectionBlock>
        </div>
        <SectionBlock title="Clinical Notes / Old Reports">
          <p className="text-[12px] text-gray-900">{clinicalNotes}</p>
        </SectionBlock>
        <SectionBlock title="Diagnosis Notes">
          <p className="text-[12px] text-gray-900">{diagnosisNotes}</p>
        </SectionBlock>
      </div>


      {/*
        Android order: Allergy+Complaints, Past+Physical, Clinical, Diagnosis,
        divider, Investigations table, Medicine table, Advice box.
        (Replaces the previous web-only card sections below.)
      */}
      <div className="px-[14px] pb-1">
        <hr className="h-px border-0 bg-gray-300 my-2" />

        <SectionBlock title="Investigation Advised">
          {investigations.length === 0 ? (
            <p className="text-[11px] text-gray-500">No investigations advised.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-[10px]">
              <thead>
                <tr className="bg-[#005A8E] text-white">
                  <th className="px-1.5 py-1 text-center font-bold w-[34px]">S.No</th>
                  <th className="px-1.5 py-1 text-left font-bold">Investigation</th>
                  <th className="px-1.5 py-1 text-left font-bold w-24">Priority</th>
                </tr>
              </thead>
              <tbody>
                {investigations.map((inv) => (
                  <tr key={inv.sno} className="border-t border-gray-300">
                    <td className="px-1.5 py-1 text-center text-gray-500">{inv.sno}</td>
                    <td className="px-1.5 py-1 text-gray-900">{inv.investigationName}</td>
                    <td className={`px-1.5 py-1 font-bold ${
                      inv.priority === 'HIGH' ? 'text-[#C0392B]' :
                      inv.priority === 'LOW' ? 'text-gray-500' : 'text-[#2980B9]'
                    }`}>
                      {inv.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionBlock>

        <SectionBlock title="Medicine Advised">
          {medicines.length === 0 ? (
            <p className="text-[11px] text-gray-500">No medicines advised.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-[10px]">
              <thead>
                <tr className="bg-[#005A8E] text-white">
                  <th className="px-1.5 py-1 text-center font-bold w-[34px]">S.No</th>
                  <th className="px-1.5 py-1 text-left font-bold">Medicine</th>
                  <th className="px-1.5 py-1 text-left font-bold w-[82px]">Schedule</th>
                  <th className="px-1.5 py-1 text-left font-bold">Instruction</th>
                  <th className="px-1.5 py-1 text-center font-bold w-12">Route</th>
                  <th className="px-1.5 py-1 text-center font-bold w-[38px]">Days</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.sno} className="border-t border-gray-300 align-top">
                    <td className="px-1.5 py-1 text-center text-gray-500">{med.sno}</td>
                    <td className="px-1.5 py-1">
                      <p className="font-bold text-[10.5px] text-gray-900">{med.name}</p>
                      <p className="text-[9.5px] text-gray-500">{med.dosage}</p>
                    </td>
                    <td className="px-1.5 py-1 text-gray-900">{med.schedule}</td>
                    <td className="px-1.5 py-1 text-gray-900">{med.instruction}</td>
                    <td className="px-1.5 py-1 text-center text-gray-900">{med.route}</td>
                    <td className="px-1.5 py-1 text-center text-gray-900">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionBlock>

        <div className="mb-2.5 rounded-[3px] border border-gray-300 bg-[#FFFDF5] p-[7px]">
          <SectionTitle text="Advice / Follow-up Instructions" />
          <p className="text-[11px] text-gray-900">{advice}</p>
        </div>
      </div>


      {/*
        Android legacy sections (Past History, Physical Examination, Advice,
        Lifestyle Advice, Follow-up, Allergy, Clinical Notes) are rendered in
        the canonical Android layout above; this duplicate card grid is removed
        so the preview matches the Android order/section set exactly.
      */}

      {/* Footer - Doctor Signature & Stamp (Android PrescriptionFooter) */}
      <div className="border-t-[2.5px] border-[#005A8E] px-[14px] pt-2 pb-1.5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-900">
              {hospitalName}{consultation.hospitalAddress ? ` - ${consultation.hospitalAddress.split(',')[0].trim()}` : ''}
            </p>
            <p className="text-[10px] text-gray-500">{consultation.hospitalAddress}</p>
            <p className="text-[10px] text-gray-500">Tel: {doctorPhone} | Emergency: {doctorPhone}</p>
            <p className="text-[10px] text-gray-500">Hospital No.: {consultation.hospitalRegNumber}</p>
            <p className="text-[10px] text-gray-500">Email: {consultation.hospitalEmail}</p>
          </div>
          <div className="w-32 text-center">
            <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center">
              {signatureUrl ? (
                <AssetImage
                  rawUrl={signatureUrl}
                  width={60}
                  height={60}
                  alt="Doctor signature or stamp"
                  fallback={<span className="text-[9px] text-gray-500">STAMP</span>}
                />
              ) : (
                <span className="flex h-[62px] w-[62px] items-center justify-center rounded-[10px] border border-gray-300 text-[9px] text-gray-500">STAMP</span>
              )}
            </div>
            <p className="mt-1 text-[11px] font-bold text-gray-900">{doctorName}</p>
            <p className="text-[10px] text-gray-500">{consultation.doctorQualification}</p>
            <p className="text-[10px] text-gray-500">Reg. No.: {doctorRegNumber}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C5DDEF] bg-[#F5FAFF] px-2 py-1 text-center text-[9.5px] tracking-[0.2px] text-[#005A8E]">
        For appointments & queries: {doctorPhone} | This prescription is valid for 30 days from date of issue | {hospitalName} - committed to your health
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