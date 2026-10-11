'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, AlertTriangle, Info } from 'lucide-react';
import { FL, DarkCard, InnerCard, Pill, ActionButton, Field } from '@/components/ui/FlutterTheme';

const COMMON_SYMPTOMS = [
  'Fever', 'Cough', 'Headache', 'Chest pain', 'Shortness of breath',
  'Fatigue', 'Nausea', 'Vomiting', 'Abdominal pain', 'Diarrhea',
  'Dizziness', 'Sore throat', 'Joint pain', 'Back pain', 'Skin rash',
  'Chills', 'Sweating', 'Palpitations', 'Wheezing', 'Runny nose',
  'Nasal congestion', 'Loss of taste', 'Loss of smell', 'Muscle aches',
  'Weakness', 'Confusion', 'Fainting', 'Swelling', 'Numbness',
  'Tingling', 'Vision changes', 'Hearing changes', 'Ear pain',
  'Neck stiffness', 'Difficulty swallowing', 'Hoarseness', 'Coughing blood',
  'Blood in stool', 'Black stool', 'Blood in urine', 'Painful urination',
  'Frequent urination', 'Urgent urination', 'Weight loss', 'Weight gain',
  'Loss of appetite', 'Excessive thirst', 'Excessive urination',
];

export interface SymptomInput {
  id: string;
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  durationDays?: number;
  durationText?: string;
  onset?: 'SUDDEN' | 'GRADUAL' | 'UNKNOWN';
  frequency?: 'OCCASIONAL' | 'INTERMITTENT' | 'CONSTANT';
  progression?: 'IMPROVING' | 'STABLE' | 'WORSENING';
  notes?: string;
  isCustom?: boolean;
}

interface SymptomInputProps {
  symptoms: SymptomInput[];
  onChange: (symptoms: SymptomInput[]) => void;
  disabled?: boolean;
  patientContext?: {
    age?: number;
    sex?: string;
    chronicConditions?: string[];
  };
}

export function SymptomInputSection({
  symptoms,
  onChange,
  disabled = false,
  patientContext,
}: SymptomInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SymptomInput>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSymptoms = useMemo(() => {
    return COMMON_SYMPTOMS.filter(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSymptom = (name: string, isCustom = false) => {
    const newSymptom: SymptomInput = {
      id: crypto.randomUUID(),
      name,
      severity: 'MODERATE',
      isCustom,
    };
    onChange([...symptoms, newSymptom]);
    setSearchQuery('');
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleRemoveSymptom = (index: number) => {
    const updated = symptoms.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...symptoms[index] });
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], ...editForm } as SymptomInput;
    onChange(updated);
    setEditingIndex(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const severityColors: Record<string, string> = {
    MILD: FL.mint,
    MODERATE: FL.gold,
    SEVERE: FL.pink,
  };

  const severityOrder = { MILD: 1, MODERATE: 2, SEVERE: 3 };

  return (
    <DarkCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-light font-semibold text-lg">Current Symptoms</h3>
        {patientContext && (
          <Pill color={FL.lavender} size="sm">
            {patientContext.chronicConditions?.length ? `${patientContext.chronicConditions.length} chronic conditions` : 'No chronic conditions'}
          </Pill>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-doctor-muted" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or type a symptom (e.g., fever, cough)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleAddSymptom(searchQuery.trim(), true);
              }
              if (e.key === 'Escape') setShowDropdown(false);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-2xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50 focus:border-transparent disabled:opacity-50"
            disabled={disabled}
            autoComplete="off"
          />
        </div>

        {showDropdown && searchQuery && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-doctor-surface border border-doctor-border-soft/50 rounded-2xl shadow-xl z-20 overflow-hidden"
          >
            {filteredSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => handleAddSymptom(symptom)}
                className="w-full px-4 py-3 text-left text-primary-light hover:bg-doctor-lavender/10 transition-colors flex items-center gap-3"
              >
                <span>{symptom}</span>
                <span className="text-xs text-doctor-muted ml-auto">Common</span>
              </button>
            ))}
            {filteredSymptoms.length === 0 && searchQuery.trim() && (
              <button
                onClick={() => handleAddSymptom(searchQuery.trim(), true)}
                className="w-full px-4 py-3 text-left text-doctor-lavender hover:bg-doctor-lavender/10 transition-colors flex items-center gap-3"
              >
                <span>Add "{searchQuery}" as custom symptom</span>
              </button>
            )}
          </div>
        )}
      </div>

      {symptoms.length === 0 && (
        <div className="text-center py-8 text-doctor-muted">
          <Info className="mx-auto text-doctor-dim" size={32} />
          <p className="mt-2 text-sm">No symptoms added yet. Search above or type a custom symptom.</p>
        </div>
      )}

      <div className="space-y-3">
        {symptoms.map((symptom, index) => (
          <div
            key={symptom.id}
            className={`rounded-2xl border p-4 transition-all ${
              editingIndex === index
                ? 'border-doctor-lavender/50 bg-doctor-lavender/5'
                : 'border-doctor-border-soft/50'
            }`}
          >
            {editingIndex === index ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Field label="Symptom" required>
                    <input
                      type="text"
                      value={editForm.name || symptom.name}
                      onChange={e => updateEditForm('name', e.target.value)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    />
                  </Field>
                  <Field label="Severity" required>
                    <select
                      value={editForm.severity || symptom.severity}
                      onChange={e => updateEditForm('severity', e.target.value)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    >
                      <option value="MILD">Mild</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="SEVERE">Severe</option>
                    </select>
                  </Field>
                  <Field label="Duration (days)">
                    <input
                      type="number"
                      min="0"
                      value={editForm.durationDays ?? symptom.durationDays ?? ''}
                      onChange={e => updateEditForm('durationDays', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    />
                  </Field>
                  <Field label="Onset">
                    <select
                      value={editForm.onset || symptom.onset || ''}
                      onChange={e => updateEditForm('onset', e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    >
                      <option value="">Select</option>
                      <option value="SUDDEN">Sudden</option>
                      <option value="GRADUAL">Gradual</option>
                      <option value="UNKNOWN">Unknown</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Field label="Frequency">
                    <select
                      value={editForm.frequency || symptom.frequency || ''}
                      onChange={e => updateEditForm('frequency', e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    >
                      <option value="">Select</option>
                      <option value="OCCASIONAL">Occasional</option>
                      <option value="INTERMITTENT">Intermittent</option>
                      <option value="CONSTANT">Constant</option>
                    </select>
                  </Field>
                  <Field label="Progression">
                    <select
                      value={editForm.progression || symptom.progression || ''}
                      onChange={e => updateEditForm('progression', e.target.value || undefined)}
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    >
                      <option value="">Select</option>
                      <option value="IMPROVING">Improving</option>
                      <option value="STABLE">Stable</option>
                      <option value="WORSENING">Worsening</option>
                    </select>
                  </Field>
                  <Field label="Duration text">
                    <input
                      type="text"
                      value={editForm.durationText || symptom.durationText || ''}
                      onChange={e => updateEditForm('durationText', e.target.value || undefined)}
                      placeholder="e.g., 3 days, 1 week"
                      className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                    />
                  </Field>
                </div>

                <Field label="Notes">
                  <textarea
                    value={editForm.notes || symptom.notes || ''}
                    onChange={e => updateEditForm('notes', e.target.value || undefined)}
                    placeholder="Additional notes..."
                    rows={2}
                    className="w-full px-3 py-2 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                  />
                </Field>

                <div className="flex gap-2 justify-end">
                  <ActionButton variant="ghost" onClick={handleCancelEdit}>Cancel</ActionButton>
                  <ActionButton onClick={() => handleSaveEdit(index)}>Save</ActionButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-primary-light font-medium truncate">{symptom.name}</span>
                    {symptom.isCustom && (
                      <Pill color={FL.lavender} size="xs">Custom</Pill>
                    )}
                    <Pill
                      color={severityColors[symptom.severity] || FL.gray}
                      size="sm"
                    >
                      {symptom.severity}
                    </Pill>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-doctor-muted mt-1">
                    {symptom.durationDays !== undefined && (
                      <span className="px-2 py-0.5 bg-doctor-surface/30 rounded-full">📅 {symptom.durationDays} days</span>
                    )}
                    {symptom.durationText && (
                      <span className="px-2 py-0.5 bg-doctor-surface/30 rounded-full">⏱ {symptom.durationText}</span>
                    )}
                    {symptom.onset && (
                      <span className="px-2 py-0.5 bg-doctor-surface/30 rounded-full">🎯 {symptom.onset}</span>
                    )}
                    {symptom.frequency && (
                      <span className="px-2 py-0.5 bg-doctor-surface/30 rounded-full">🔄 {symptom.frequency}</span>
                    )}
                    {symptom.progression && (
                      <span className={`px-2 py-0.5 bg-doctor-surface/30 rounded-full ${
                        symptom.progression === 'WORSENING' ? 'text-doctor-pink' :
                        symptom.progression === 'IMPROVING' ? 'text-doctor-mint' :
                        'text-doctor-gold'
                      }`}>
                        📈 {symptom.progression}
                      </span>
                    )}
                  </div>
                  {symptom.notes && (
                    <p className="text-xs text-doctor-muted mt-1 italic">{symptom.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(index)}
                    disabled={disabled}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    className="text-doctor-pink hover:text-doctor-pink"
                    onClick={() => handleRemoveSymptom(index)}
                    disabled={disabled}
                  >
                    <X size={14} />
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {symptoms.length > 0 && (
        <div className="pt-2 border-t border-doctor-border-soft/30">
          <p className="text-xs text-doctor-muted flex items-center gap-1">
            <Info size={12} />
            {symptoms.filter(s => s.severity === 'SEVERE').length} severe,{' '}
            {symptoms.filter(s => s.severity === 'MODERATE').length} moderate,{' '}
            {symptoms.filter(s => s.severity === 'MILD').length} mild
          </p>
        </div>
      )}
    </DarkCard>
  );
}