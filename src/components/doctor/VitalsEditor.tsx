'use client';

import { useMemo } from 'react';
import { Field, inputClass } from '@/components/ui/FlutterTheme';

interface VitalData {
  label: string;
  value: string;
  unit: string;
}

interface VitalsEditorProps {
  vitals: VitalData[];
  onChange: (vitals: VitalData[]) => void;
  disabled?: boolean;
}

const VITAL_DEFINITIONS = [
  { label: 'Weight', unit: 'kg', key: 'weightKg', type: 'number', step: 0.1, placeholder: 'e.g. 70' },
  { label: 'BMI', unit: 'kg/m²', key: 'bmi', type: 'number', step: 0.1, placeholder: 'e.g. 24.5' },
  { label: 'B.P.', unit: 'mmHg', key: 'bp', type: 'bp', placeholder: '120/80' },
  { label: 'Pulse', unit: 'bpm', key: 'heartRate', type: 'number', step: 1, placeholder: 'e.g. 72' },
  { label: 'SpO2', unit: '%', key: 'spo2', type: 'number', step: 0.1, placeholder: 'e.g. 98' },
  { label: 'Temp', unit: '°F', key: 'bodyTemp', type: 'number', step: 0.1, placeholder: 'e.g. 98.6' },
  { label: 'Respiration', unit: '/min', key: 'respRate', type: 'number', step: 1, placeholder: 'e.g. 16' },
  { label: 'Blood Glucose', unit: 'mg/dL', key: 'bloodGlucose', type: 'number', step: 1, placeholder: 'e.g. 95' },
] as const;

export function VitalsEditor({ vitals, onChange, disabled = false }: VitalsEditorProps) {
  const vitalMap = useMemo(() => {
    const map = new Map<string, string>();
    vitals.forEach((v) => map.set(v.label, v.value));
    return map;
  }, [vitals]);

  const handleValueChange = (label: string, value: string) => {
    const updated = vitals.map((v) => (v.label === label ? { ...v, value } : v));
    onChange(updated);
  };

  const handleBPChange = (systolic: string, diastolic: string) => {
    const value = `${systolic}/${diastolic}`;
    const updated = vitals.map((v) => (v.label === 'B.P.' ? { ...v, value } : v));
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {VITAL_DEFINITIONS.map((def) => {
        const currentValue = vitalMap.get(def.label) || '';

        if (def.key === 'bp') {
          const [systolic, diastolic] = currentValue.split('/');
          return (
            <div key={def.label} className="sm:col-span-2 lg:col-span-1">
              <Field label={def.label}>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={systolic || ''}
                    onChange={(e) => handleBPChange(e.target.value, diastolic || '')}
                    disabled={disabled}
                    className={`${inputClass} w-1/2`}
                    min="0"
                    max="300"
                  />
                  <span className="flex items-center text-doctor-muted">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={diastolic || ''}
                    onChange={(e) => handleBPChange(systolic || '', e.target.value)}
                    disabled={disabled}
                    className={`${inputClass} w-1/2`}
                    min="0"
                    max="200"
                  />
                </div>
              </Field>
            </div>
          );
        }

        return (
          <div key={def.label}>
            <Field label={def.label}>
              <div className="relative">
                <input
                  type={def.type === 'number' ? 'number' : 'text'}
                  placeholder={def.placeholder}
                  value={currentValue}
                  onChange={(e) => handleValueChange(def.label, e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                  step={def.step}
                  min={def.type === 'number' ? '0' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-doctor-muted">
                  {def.unit}
                </span>
              </div>
            </Field>
          </div>
        );
      })}
    </div>
  );
}