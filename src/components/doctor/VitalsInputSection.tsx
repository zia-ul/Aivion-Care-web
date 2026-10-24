'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, Info, Stethoscope, Heart, Activity, Droplets, Thermometer, Gauge } from 'lucide-react';
import { FL, DarkCard, InnerCard, FormField } from '@/components/ui/FlutterTheme';

interface VitalsInputProps {
  vitals: VitalsInput;
  onChange: (vitals: VitalsInput) => void;
  existingVitals?: {
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    spo2?: number;
    bloodGlucose?: number;
    bmi?: number;
    weightKg?: number;
    heightCm?: number;
  } | null;
  disabled?: boolean;
}

export interface VitalsInput {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spo2?: number;
  bloodGlucose?: number;
  bmi?: number;
  weightKg?: number;
  heightCm?: number;
}

const VITAL_CONFIG = [
  {
    key: 'temperature',
    label: 'Temperature (°C)',
    icon: Thermometer,
    unit: '°C',
    min: 30,
    max: 43,
    step: 0.1,
    criticalLow: 35.5,
    criticalHigh: 39.5,
    warningLow: 36.1,
    warningHigh: 37.5,
    placeholder: '37.0',
  },
  {
    key: 'heartRate',
    label: 'Heart Rate (bpm)',
    icon: Heart,
    unit: 'bpm',
    min: 30,
    max: 200,
    step: 1,
    criticalLow: 50,
    criticalHigh: 110,
    warningLow: 60,
    warningHigh: 100,
    placeholder: '72',
  },
  {
    key: 'respiratoryRate',
    label: 'Respiratory Rate (/min)',
    icon: Activity,
    unit: '/min',
    min: 5,
    max: 50,
    step: 1,
    criticalLow: 10,
    criticalHigh: 24,
    warningLow: 12,
    warningHigh: 20,
    placeholder: '16',
  },
  {
    key: 'bpSystolic',
    label: 'BP Systolic (mmHg)',
    icon: Gauge,
    unit: 'mmHg',
    min: 50,
    max: 250,
    step: 1,
    criticalLow: 80,
    criticalHigh: 150,
    warningLow: 90,
    warningHigh: 130,
    placeholder: '120',
    pairKey: 'bpDiastolic',
    pairLabel: 'Diastolic',
  },
  {
    key: 'bpDiastolic',
    label: 'BP Diastolic (mmHg)',
    icon: Gauge,
    unit: 'mmHg',
    min: 30,
    max: 150,
    step: 1,
    criticalLow: 50,
    criticalHigh: 95,
    warningLow: 60,
    warningHigh: 85,
    placeholder: '80',
  },
  {
    key: 'spo2',
    label: 'SpO₂ (%)',
    icon: Droplets,
    unit: '%',
    min: 50,
    max: 100,
    step: 0.1,
    criticalLow: 90,
    criticalHigh: 100,
    warningLow: 95,
    warningHigh: 100,
    reverse: true,
    placeholder: '98',
  },
  {
    key: 'bloodGlucose',
    label: 'Blood Glucose (mg/dL)',
    icon: Stethoscope,
    unit: 'mg/dL',
    min: 20,
    max: 600,
    step: 1,
    criticalLow: 60,
    criticalHigh: 220,
    warningLow: 70,
    warningHigh: 180,
    placeholder: '100',
  },
  {
    key: 'bmi',
    label: 'BMI',
    icon: Gauge,
    unit: '',
    min: 10,
    max: 60,
    step: 0.1,
    criticalLow: 16,
    criticalHigh: 40,
    warningLow: 18.5,
    warningHigh: 25,
    placeholder: '24.5',
  },
  {
    key: 'weightKg',
    label: 'Weight (kg)',
    icon: Gauge,
    unit: 'kg',
    min: 2,
    max: 300,
    step: 0.1,
    placeholder: '70',
  },
  {
    key: 'heightCm',
    label: 'Height (cm)',
    icon: Gauge,
    unit: 'cm',
    min: 30,
    max: 250,
    step: 0.1,
    placeholder: '170',
  },
];

function getStatus(
  value: number | undefined,
  config: typeof VITAL_CONFIG[0]
): 'normal' | 'warning' | 'critical' | 'none' {
  if (value === undefined || value === null) return 'none';
  const cLow = config.criticalLow ?? -Infinity;
  const cHigh = config.criticalHigh ?? Infinity;
  const wLow = config.warningLow ?? -Infinity;
  const wHigh = config.warningHigh ?? Infinity;

  if (config.reverse) {
    if (value < cLow) return 'critical';
    if (value < wLow) return 'warning';
    return 'normal';
  }
  if (value < cLow || value > cHigh) return 'critical';
  if (value < wLow || value > wHigh) return 'warning';
  return 'normal';
}

function VitalRow({
  config,
  value,
  onChange,
  existingValue,
  disabled,
}: {
  config: typeof VITAL_CONFIG[0];
  value: number | undefined;
  onChange: (key: string, val: number | undefined) => void;
  existingValue?: number | undefined;
  disabled?: boolean;
}) {
  const status = getStatus(value, config);
  const existingStatus = existingValue !== undefined ? getStatus(existingValue, config) : 'none';

  const statusColors = {
    critical: FL.pink,
    warning: FL.gold,
    normal: FL.mint,
    none: FL.gray,
  };

  const displayValue = value !== undefined ? value : existingValue;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-doctor-surface/30 border border-doctor-border-soft/30">
      <config.icon className={`text-doctor-muted ${status !== 'none' ? `text-${statusColors[status]}` : ''}`} size={20} />
      <div className="flex-1 min-w-0">
        <label className="text-xs text-doctor-muted">{config.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value !== undefined ? value : ''}
            onChange={e => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              onChange(config.key, val);
            }}
            placeholder={config.placeholder}
            disabled={disabled}
            className={`w-24 px-3 py-2 bg-doctor-surface/50 border rounded-xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50 disabled:opacity-50 ${
              status === 'critical' ? 'border-doctor-pink/50' :
              status === 'warning' ? 'border-doctor-gold/50' :
              status === 'normal' ? 'border-doctor-mint/50' :
              'border-doctor-border-soft/50'
            }`}
          />
          <span className="text-sm text-doctor-muted">{config.unit}</span>
          {existingValue !== undefined && value === undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              existingStatus === 'critical' ? 'bg-doctor-pink/20 text-doctor-pink' :
              existingStatus === 'warning' ? 'bg-doctor-gold/20 text-doctor-gold' :
              existingStatus === 'normal' ? 'bg-doctor-mint/20 text-doctor-mint' :
              'bg-doctor-surface/30 text-doctor-muted'
            }`}>
              Previous: {existingValue}{config.unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function VitalsInputSection({ vitals, onChange, existingVitals, disabled = false }: VitalsInputProps) {
  const handleChange = (key: string, val: number | undefined) => {
    onChange({ ...vitals, [key]: val });
  };

  const hasAnyVitals = useMemo(() => 
    Object.values(vitals).some(v => v !== undefined), [vitals]);

  return (
    <DarkCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-light font-semibold text-lg">Vital Signs</h3>
        {existingVitals && (
          <span className="text-xs text-doctor-muted">Auto-filled from recent records</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {VITAL_CONFIG.map(config => (
          <VitalRow
            key={config.key}
            config={config}
            value={vitals[config.key as keyof VitalsInput]}
            onChange={handleChange}
            existingValue={existingVitals?.[config.key as keyof typeof existingVitals]}
            disabled={disabled}
          />
        ))}
      </div>

      {!hasAnyVitals && !existingVitals && (
        <div className="text-center py-4 text-doctor-muted">
          <Info className="mx-auto text-doctor-dim" size={24} />
          <p className="mt-2 text-sm">No vital signs entered. Add values above or they will be auto-filled from recent records.</p>
        </div>
      )}

      <p className="text-xs text-doctor-muted flex items-center gap-1">
        <Info size={12} />
        Values outside normal ranges are highlighted. Red = critical, Yellow = moderate deviation, Green = normal.
      </p>
    </DarkCard>
  );
}
