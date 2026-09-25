/**
 * Consultation Utilities
 * Centralized helper functions for consultation management
 */

export function formatRecordingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function stopRecordingTracks(
  mediaStreamRef: { current: MediaStream | null },
  recordingTimerRef: { current: ReturnType<typeof setInterval> | null },
  mediaRecorderRef: { current: MediaRecorder | null }
) {
  if (recordingTimerRef.current) {
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  }
  mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  mediaStreamRef.current = null;
  mediaRecorderRef.current = null;
}

export function createEmptyVitals(): VitalData[] {
  return [
    { label: 'Weight', value: '', unit: 'kg' },
    { label: 'BMI', value: '', unit: 'kg/m²' },
    { label: 'B.P.', value: '', unit: 'mmHg' },
    { label: 'Pulse', value: '', unit: 'bpm' },
    { label: 'SpO2', value: '', unit: '%' },
    { label: 'Temp', value: '', unit: '°F' },
    { label: 'Respiration Rate', value: '', unit: '/min' },
    { label: 'Blood Glucose', value: '', unit: 'mg/dL' },
  ];
}

export function syncVitalsFromConsultation(consultation: any): VitalData[] {
  return [
    { label: 'Weight', value: consultation.weightKg?.toString() || '', unit: 'kg' },
    { label: 'BMI', value: consultation.bmi?.toString() || '', unit: 'kg/m²' },
    { 
      label: 'B.P.', 
      value: consultation.bpSystolic && consultation.bpDiastolic 
        ? `${consultation.bpSystolic}/${consultation.bpDiastolic}` 
        : '', 
      unit: 'mmHg' 
    },
    { label: 'Pulse', value: consultation.heartRate?.toString() || '', unit: 'bpm' },
    { label: 'SpO2', value: consultation.spo2?.toString() || '', unit: '%' },
    { label: 'Temp', value: consultation.bodyTemp?.toString() || '', unit: '°F' },
    { label: 'Respiration Rate', value: consultation.respRate?.toString() || '', unit: '/min' },
    { label: 'Blood Glucose', value: consultation.bloodGlucose?.toString() || '', unit: 'mg/dL' },
  ];
}

export function createEmptyMedication(): MedicationDetail {
  return {
    medicineName: '',
    dosage: '',
    amountPerUse: '',
    frequency: '',
    frequencyPerDay: '',
    timing: '',
    duration: '',
    instructions: '',
    notes: '',
    route: 'Oral',
  };
}

export function createEmptyInvestigation(): InvestigationItem {
  return { sno: 1, investigationName: '', priority: 'NORMAL' };
}

export function mapMedicinesFromConsultation(consultation: any): MedicationDetail[] {
  if (!consultation.medicines?.length) return [createEmptyMedication()];
  return consultation.medicines.map((m: any) => ({
    medicineName: m.medicineName || '',
    dosage: m.dosage || '',
    amountPerUse: m.amountPerUse || '',
    frequency: m.frequency || '',
    frequencyPerDay: m.frequencyPerDay || '',
    timing: m.timing || '',
    duration: m.duration || (m.durationDays ? `${m.durationDays} days` : ''),
    durationDays: m.durationDays,
    instructions: m.instructions || '',
    notes: m.notes || '',
    route: m.route || 'Oral',
    aiSuggestionId: m.aiSuggestionId,
  }));
}

export function mapInvestigationsFromConsultation(consultation: any): InvestigationItem[] {
  if (!consultation.investigations?.length) return [createEmptyInvestigation()];
  return consultation.investigations.map((iv: any, i: number) => ({
    sno: iv.sno || i + 1,
    investigationName: iv.investigationName || '',
    priority: iv.priority || 'NORMAL',
  }));
}

export function extractVitalsForApi(vitals: VitalData[]) {
  const findVital = (label: string) => vitals.find(v => v.label === label)?.value;
  return {
    heartRate: findVital('Pulse') ? Number(findVital('Pulse')) : undefined,
    bpSystolic: findVital('B.P.')?.split('/')[0] ? Number(findVital('B.P.')?.split('/')[0]) : undefined,
    bpDiastolic: findVital('B.P.')?.split('/')[1] ? Number(findVital('B.P.')?.split('/')[1]) : undefined,
    spo2: findVital('SpO2') ? Number(findVital('SpO2')) : undefined,
    bodyTemp: findVital('Temp') ? Number(findVital('Temp')) : undefined,
    weightKg: findVital('Weight') ? Number(findVital('Weight')) : undefined,
    bmi: findVital('BMI') ? Number(findVital('BMI')) : undefined,
    respRate: findVital('Respiration Rate') ? Number(findVital('Respiration Rate')) : undefined,
    bloodGlucose: findVital('Blood Glucose') ? Number(findVital('Blood Glucose')) : undefined,
  };
}

export function extractMedicationsForApi(medications: MedicationDetail[]) {
  return medications
    .filter(m => (m.medicineName || m.dosage)?.trim())
    .map(m => ({
      medicineName: m.medicineName.trim(),
      dosage: m.dosage.trim() || undefined,
      amountPerUse: m.amountPerUse.trim() || undefined,
      frequency: m.frequency.trim() || undefined,
      frequencyPerDay: m.frequencyPerDay.trim() || undefined,
      timing: m.timing.trim() || undefined,
      duration: m.duration.trim() || undefined,
      durationDays: m.durationDays,
      instructions: m.instructions.trim() || undefined,
      notes: m.notes.trim() || undefined,
      route: m.route || 'Oral',
    }));
}

export function extractInvestigationsForApi(investigations: InvestigationItem[]) {
  return investigations
    .filter(iv => iv.investigationName.trim())
    .map((iv, i) => ({
      sno: i + 1,
      investigationName: iv.investigationName.trim(),
      priority: iv.priority || 'NORMAL',
    }));
}

import { VitalData, InvestigationItem, MedicationDetail } from '@/types/consultation';