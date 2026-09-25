'use client';

import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/FlutterTheme';
import { MedicationDetail, ConsultationMedicationSuggestionResponse } from '@/types/consultation';
import { FREQUENCY_OPTIONS, TIMING_OPTIONS, ROUTE_OPTIONS } from '@/types/consultation';

interface MedicationEditorProps {
  medications: MedicationDetail[];
  onChange: (medications: MedicationDetail[]) => void;
  suggestions?: ConsultationMedicationSuggestionResponse[];
  onAddSuggestions?: (suggestionIds: number[]) => void;
  disabled?: boolean;
}

export function MedicationEditor({
  medications,
  onChange,
  suggestions = [],
  onAddSuggestions,
  disabled = false,
}: MedicationEditorProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  const handleMedChange = (index: number, field: keyof MedicationDetail, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...medications,
      {
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
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (medications.length <= 1) return;
    const updated = medications.filter((_, i) => i !== index);
    onChange(updated);
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      // Shift indexes down
      return new Set(Array.from(next).map((i) => (i > index ? i - 1 : i)));
    });
  };

  const handleAddSuggestions = () => {
    if (!onAddSuggestions) return;
    const selectedIds = suggestions
      .filter((s) => s.aiSuggestionId && medications.some((m) => m.notes.includes(`ai:${s.aiSuggestionId}`)))
      .map((s) => s.aiSuggestionId!);
    // Actually, we need a different approach - let suggestions panel handle this
  };

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#F3C979]" />
          Medicines ({medications.length})
        </h3>
        {suggestions.length > 0 && onAddSuggestions && (
          <button
            type="button"
            onClick={() => onAddSuggestions(suggestions.map((s) => s.aiSuggestionId!).filter(Boolean))}
            disabled={disabled}
            className="flex items-center gap-1.5 text-sm text-[#F3C979] hover:underline"
          >
            <Sparkles className="h-4 w-4" />
            Add {suggestions.length} AI suggestions
          </button>
        )}
      </div>

      <div className="space-y-3">
        {medications.map((med, idx) => (
          <div
            key={idx}
            className={`rounded-2xl bg-[#2A3D50] p-4 transition-all ${
              expandedIndexes.has(idx) ? 'bg-[#2A3D50]' : 'bg-[#1A2A3A]'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <Field label="Medicine name">
                  <input
                    value={med.medicineName}
                    onChange={(e) => handleMedChange(idx, 'medicineName', e.target.value)}
                    disabled={disabled}
                    className={inputClass}
                    placeholder="e.g. Paracetamol"
                  />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  disabled={disabled}
                  className="p-1.5 rounded-lg bg-[#3F8FE0]/10 text-[#3F8FE0] hover:bg-[#3F8FE0]/20"
                  aria-label={expandedIndexes.has(idx) ? 'Collapse' : 'Expand'}
                >
                  {expandedIndexes.has(idx) ? '−' : '+'} Details
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  disabled={disabled || medications.length <= 1}
                  className="p-1.5 rounded-lg bg-[#C25A5A]/10 text-[#C25A5A] hover:bg-[#C25A5A]/20 disabled:opacity-50"
                  aria-label="Remove medicine"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Core Fields - Always Visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <Field label="Dosage">
                <input
                  value={med.dosage}
                  onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                  placeholder="e.g. 500 mg"
                />
              </Field>

              <Field label="Frequency">
                <select
                  value={med.frequency}
                  onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                >
                  <option value="">Select frequency</option>
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </Field>

              <Field label="Freq/Day">
                <input
                  type="number"
                  value={med.frequencyPerDay}
                  onChange={(e) => handleMedChange(idx, 'frequencyPerDay', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                  placeholder="e.g. 2"
                  min="0"
                />
              </Field>

              <Field label="Timing">
                <select
                  value={med.timing}
                  onChange={(e) => handleMedChange(idx, 'timing', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                >
                  <option value="">Select timing</option>
                  {TIMING_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Extended Fields - Collapsible */}
            {expandedIndexes.has(idx) && (
              <div className="space-y-3 border-t border-[#3F8FE0]/10 pt-3 animate-slide-down">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Field label="Amount/Use">
                    <input
                      value={med.amountPerUse}
                      onChange={(e) => handleMedChange(idx, 'amountPerUse', e.target.value)}
                      disabled={disabled}
                      className={inputClass}
                      placeholder="e.g. 1 tablet"
                    />
                  </Field>

                  <Field label="Duration">
                    <input
                      value={med.duration}
                      onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                      disabled={disabled}
                      className={inputClass}
                      placeholder="e.g. 5 days"
                    />
                  </Field>

                  <Field label="Route">
                    <select
                      value={med.route || 'Oral'}
                      onChange={(e) => handleMedChange(idx, 'route', e.target.value)}
                      disabled={disabled}
                      className={inputClass}
                    >
                      {ROUTE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Duration (days)">
                    <input
                      type="number"
                      value={med.durationDays || ''}
                      onChange={(e) => handleMedChange(idx, 'durationDays', e.target.value)}
                      disabled={disabled}
                      className={inputClass}
                      placeholder="e.g. 5"
                      min="0"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Instructions">
                    <textarea
                      value={med.instructions}
                      onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                      disabled={disabled}
                      className={`${inputClass} min-h-[80px]`}
                      placeholder="e.g. Take with water after meals"
                      rows={2}
                    />
                  </Field>

                  <Field label="Notes">
                    <textarea
                      value={med.notes}
                      onChange={(e) => handleMedChange(idx, 'notes', e.target.value)}
                      disabled={disabled}
                      className={`${inputClass} min-h-[80px]`}
                      placeholder="Additional notes, precautions, etc."
                      rows={2}
                    />
                  </Field>
                </div>

                {med.aiSuggestionId && (
                  <div className="rounded-lg bg-[#F3C979]/10 border border-[#F3C979]/30 p-2 text-xs text-[#F3C979]">
                    AI Suggestion ID: {med.aiSuggestionId}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#3F8FE0]/30 bg-transparent px-4 py-2.5 font-semibold text-[#3F8FE0] hover:bg-[#3F8FE0]/10 disabled:opacity-50"
      >
        <Plus className="h-5 w-5" />
        Add Medicine
      </button>
    </div>
  );
}