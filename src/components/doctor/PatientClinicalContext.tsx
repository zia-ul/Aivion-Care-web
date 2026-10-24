'use client';

import { useMemo } from 'react';
import { 
  User, Heart, Pill as PillIcon, AlertTriangle, Stethoscope, 
  Calendar, FileText, Droplets, Activity, Thermometer, 
  Gauge, Shield, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { FL, DarkCard, InnerCard, Pill } from '@/components/ui/FlutterTheme';

interface PatientClinicalContextProps {
  patient: {
    id: number;
    name: string;
    age?: number;
    sex?: string;
    bloodGroup?: string;
    bmi?: number;
    heightCm?: number;
    weightKg?: number;
    allergies?: string;
    chronicConditions?: string;
    patientCode?: string;
  };
  existingData: {
    medications?: string[];
    previousDiagnoses?: string[];
    recentVitals?: {
      temperature?: number;
      heartRate?: number;
      respiratoryRate?: number;
      bpSystolic?: number;
      bpDiastolic?: number;
      spo2?: number;
      bloodGlucose?: number;
      measuredAt?: string;
    };
    recentConsultations?: Array<{
      id: number;
      date: string;
      chiefComplaints?: string;
      diagnosisNotes?: string;
    }>;
    clinicalNotes?: Array<{
      id: number;
      date: string;
      suggestedDiagnosis?: string;
      chiefComplaints?: string;
    }>;
  };
  collapsed?: Record<string, boolean>;
  onToggleSection?: (section: string) => void;
}

function SectionCard({
  title,
  icon,
  children,
  count,
  isEmpty,
  collapsed,
  onToggle,
  color = FL.blue,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  count?: number;
  isEmpty?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  color?: string;
}) {
  return (
    <InnerCard className="space-y-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-doctor-surface/30 transition-colors"
        disabled={isEmpty}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-doctor-muted bg-doctor-surface/30">
            {icon}
          </div>
          <div>
            <h4 className="text-primary-light font-medium text-sm">{title}</h4>
            <p className="text-xs text-doctor-muted">
              {isEmpty ? 'No data available' : count !== undefined ? `${count} item${count !== 1 ? 's' : ''}` : 'Available'}
            </p>
          </div>
        </div>
        {onToggle && (
          <div className={`w-6 h-6 flex items-center justify-center text-doctor-muted transition-transform ${collapsed ? '-rotate-90' : ''}`}>
            <ChevronDown size={16} />
          </div>
        )}
      </button>
      {!collapsed && !isEmpty && <div className="pt-2 border-t border-doctor-border-soft/30">{children}</div>}
    </InnerCard>
  );
}

function InfoRow({ label, value, icon, status }: { label: string; value: string; icon?: React.ReactNode; status?: 'normal' | 'warning' | 'critical' }) {
  const statusColors = {
    normal: FL.mint,
    warning: FL.gold,
    critical: FL.pink,
  };
  return (
    <div className="flex items-center gap-3 py-2">
      {icon && <span className="w-6 h-6 flex items-center justify-center text-doctor-muted">{icon}</span>}
      <span className="text-xs text-doctor-muted w-32">{label}</span>
      <span className={`text-sm font-medium ${status ? `text-${statusColors[status]}` : 'text-primary-light'}`}>
        {value}
      </span>
    </div>
  );
}

function TagList({ items, color = FL.lavender }: { items: string[]; color?: string }) {
  if (!items.length) return <p className="text-xs text-doctor-muted">None recorded</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <Pill key={i} color={color} size="xs">{item}</Pill>
      ))}
    </div>
  );
}

export function PatientClinicalContext({ 
  patient, 
  existingData, 
  collapsed = {},
  onToggleSection 
}: PatientClinicalContextProps) {
  const medications = useMemo(() => existingData.medications || [], [existingData.medications]);
  const diagnoses = useMemo(() => existingData.previousDiagnoses || [], [existingData.previousDiagnoses]);
  const vitals = existingData.recentVitals;
  const consultations = existingData.recentConsultations || [];
  const clinicalNotes = existingData.clinicalNotes || [];

  const hasVitals = useMemo(() => 
    vitals && Object.values(vitals).some(v => v !== undefined && v !== null), [vitals]);

  return (
    <div className="space-y-4">
      <DarkCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-doctor-lavender/15 flex items-center justify-center">
              <User className="text-doctor-lavender" size={24} />
            </div>
            <div>
              <h3 className="text-primary-light font-semibold text-lg">{patient.name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-doctor-muted mt-1">
                {patient.age !== undefined && <span>Age: {patient.age}</span>}
                {patient.sex && <span>Sex: {patient.sex}</span>}
                {patient.bloodGroup && <span>Blood: {patient.bloodGroup}</span>}
                {patient.bmi && <span>BMI: {patient.bmi}</span>}
                {patient.patientCode && <span>ID: {patient.patientCode}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <SectionCard
            title="Medical History"
            icon={<FileText size={16} />}
            count={((patient.chronicConditions?.split(/[,;]/).filter(Boolean).length || 0) + 
                    (patient.allergies?.split(/[,;]/).filter(Boolean).length || 0))}
            collapsed={collapsed.medicalHistory}
            onToggle={() => onToggleSection?.('medicalHistory')}
            color={FL.pink}
          >
            <div className="space-y-3">
              {patient.allergies ? (
                <div>
                  <p className="text-xs text-doctor-muted font-medium mb-1">Allergies</p>
                  <TagList items={patient.allergies.split(/[,;]/).map(s => s.trim()).filter(Boolean)} color={FL.pink} />
                </div>
              ) : null}
              {patient.chronicConditions ? (
                <div>
                  <p className="text-xs text-doctor-muted font-medium mb-1">Chronic Conditions</p>
                  <TagList items={patient.chronicConditions.split(/[,;]/).map(s => s.trim()).filter(Boolean)} color={FL.gold} />
                </div>
              ) : null}
              {(patient.heightCm || patient.weightKg) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {patient.heightCm && (
                    <InfoRow label="Height" value={`${patient.heightCm} cm`} icon={<Gauge size={14} />} />
                  )}
                  {patient.weightKg && (
                    <InfoRow label="Weight" value={`${patient.weightKg} kg`} icon={<Gauge size={14} />} />
                  )}
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Current Medications"
            icon={<PillIcon size={16} />}
            count={medications.length}
            isEmpty={medications.length === 0}
            collapsed={collapsed.medications}
            onToggle={() => onToggleSection?.('medications')}
            color={FL.blue}
          >
            <TagList items={medications} color={FL.blue} />
          </SectionCard>

          <SectionCard
            title="Previous Diagnoses"
            icon={<FileText size={16} />}
            count={diagnoses.length}
            isEmpty={diagnoses.length === 0}
            collapsed={collapsed.diagnoses}
            onToggle={() => onToggleSection?.('diagnoses')}
            color={FL.mint}
          >
            <TagList items={diagnoses} color={FL.mint} />
          </SectionCard>

          <SectionCard
            title="Recent Vitals"
            icon={<Activity size={16} />}
            count={hasVitals ? 1 : 0}
            isEmpty={!hasVitals}
            collapsed={collapsed.vitals}
            onToggle={() => onToggleSection?.('vitals')}
            color={FL.gold}
          >
            {hasVitals && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {vitals?.temperature !== undefined && (
                  <InfoRow 
                    label="Temp" 
                    value={`${vitals.temperature}°C`} 
                    icon={<Thermometer size={12} />}
                    status={vitals.temperature > 38 ? 'warning' : vitals.temperature > 39.5 ? 'critical' : 'normal'}
                  />
                )}
                {vitals?.heartRate !== undefined && (
                  <InfoRow 
                    label="HR" 
                    value={`${vitals.heartRate} bpm`} 
                    icon={<Heart size={12} />}
                    status={vitals.heartRate > 100 ? 'warning' : vitals.heartRate > 110 ? 'critical' : 'normal'}
                  />
                )}
                {vitals?.bpSystolic !== undefined && vitals?.bpDiastolic !== undefined && (
                  <InfoRow 
                    label="BP" 
                    value={`${vitals.bpSystolic}/${vitals.bpDiastolic}`} 
                    icon={<Gauge size={12} />}
                    status={vitals.bpSystolic > 140 ? 'warning' : vitals.bpSystolic > 150 ? 'critical' : 'normal'}
                  />
                )}
                {vitals?.spo2 !== undefined && (
                  <InfoRow 
                    label="SpO₂" 
                    value={`${vitals.spo2}%`} 
                    icon={<Droplets size={12} />}
                    status={vitals.spo2 < 95 ? 'warning' : vitals.spo2 < 90 ? 'critical' : 'normal'}
                  />
                )}
                {vitals?.respiratoryRate !== undefined && (
                  <InfoRow 
                    label="RR" 
                    value={`${vitals.respiratoryRate}/min`} 
                    icon={<Activity size={12} />}
                    status={vitals.respiratoryRate > 20 ? 'warning' : vitals.respiratoryRate > 24 ? 'critical' : 'normal'}
                  />
                )}
                {vitals?.bloodGlucose !== undefined && (
                  <InfoRow 
                    label="Glucose" 
                    value={`${vitals.bloodGlucose} mg/dL`} 
                    icon={<Droplets size={12} />}
                    status={vitals.bloodGlucose > 180 ? 'warning' : vitals.bloodGlucose > 220 ? 'critical' : 'normal'}
                  />
                )}
                <div className="col-span-full text-xs text-doctor-muted">
                  Last measured: {vitals?.measuredAt ? new Date(vitals.measuredAt).toLocaleString() : 'Unknown'}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Recent Consultations"
            icon={<Calendar size={16} />}
            count={consultations.length}
            isEmpty={consultations.length === 0}
            collapsed={collapsed.consultations}
            onToggle={() => onToggleSection?.('consultations')}
            color={FL.lavender}
          >
            <div className="space-y-2">
              {consultations.slice(0, 3).map((c, i) => (
                <div key={i} className="p-2 bg-doctor-surface/30 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-doctor-muted">{new Date(c.date).toLocaleDateString()}</span>
                    <span className="text-primary-light font-medium truncate max-w-[200px]">
                      {c.chiefComplaints || c.diagnosisNotes || 'Consultation'}
                    </span>
                  </div>
                </div>
              ))}
              {consultations.length > 3 && (
                <p className="text-xs text-doctor-muted text-center">+{consultations.length - 3} more</p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Clinical Notes"
            icon={<Stethoscope size={16} />}
            count={clinicalNotes.length}
            isEmpty={clinicalNotes.length === 0}
            collapsed={collapsed.clinicalNotes}
            onToggle={() => onToggleSection?.('clinicalNotes')}
            color={FL.coral}
          >
            <div className="space-y-2">
              {clinicalNotes.slice(0, 3).map((n, i) => (
                <div key={i} className="p-2 bg-doctor-surface/30 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-doctor-muted">{new Date(n.date).toLocaleDateString()}</span>
                    <span className="text-primary-light font-medium truncate max-w-[200px]">
                      {n.suggestedDiagnosis || n.chiefComplaints || 'Clinical note'}
                    </span>
                  </div>
                </div>
              ))}
              {clinicalNotes.length > 3 && (
                <p className="text-xs text-doctor-muted text-center">+{clinicalNotes.length - 3} more</p>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="pt-2 border-t border-doctor-border-soft/30">
          <p className="text-xs text-doctor-muted flex items-center gap-1">
            <Info size={12} />
            This information is automatically loaded from the patient&apos;s existing records. Only enter new or changed information below.
          </p>
        </div>
      </DarkCard>
    </div>
  );
}
