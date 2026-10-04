'use client';

import { Plus, Trash2, FileText } from 'lucide-react';
import { Field, inputClass } from '@/components/ui/FlutterTheme';
import { InvestigationItem } from '@/types/consultation';
import { PRIORITY_OPTIONS } from '@/types/consultation';

interface InvestigationEditorProps {
  investigations: InvestigationItem[];
  onChange: (investigations: InvestigationItem[]) => void;
  disabled?: boolean;
}

/** Keeps bound inputs controlled even when a draft omits a field. */
const text = (value: unknown): string => (value == null ? '' : String(value));

export function InvestigationEditor({
  investigations,
  onChange,
  disabled = false,
}: InvestigationEditorProps) {
  const handleChange = (index: number, field: keyof InvestigationItem, value: string | number) => {
    const updated = [...investigations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    const nextSno = investigations.length > 0
      ? Math.max(...investigations.map((i) => i.sno)) + 1
      : 1;
    onChange([...investigations, { sno: nextSno, investigationName: '', priority: 'NORMAL' }]);
  };

  const handleRemove = (index: number) => {
    if (investigations.length <= 1) return;
    const updated = investigations
      .filter((_, i) => i !== index)
      .map((inv, i) => ({ ...inv, sno: i + 1 }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-doctor-slate" />
          Investigations ({investigations.length})
        </h3>
      </div>

      <div className="space-y-3">
        {investigations.map((inv, idx) => (
          <div key={idx} className="rounded-xl bg-doctor-raised p-4 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 min-w-0">
              <Field label="Investigation">
                <input
                  value={text(inv.investigationName)}
                  onChange={(e) => handleChange(idx, 'investigationName', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                  placeholder="e.g. Complete Blood Count, X-Ray Chest"
                />
              </Field>
            </div>

            <div className="w-40 sm:w-48">
              <Field label="Priority">
                <select
                  value={text(inv.priority) || 'NORMAL'}
                  onChange={(e) => handleChange(idx, 'priority', e.target.value)}
                  disabled={disabled}
                  className={inputClass}
                >
                  {PRIORITY_OPTIONS_SELECT.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="w-10">
              <Field label="S.No">
                <input
                  type="number"
                  value={text(inv.sno)}
                  onChange={(e) => handleChange(idx, 'sno', parseInt(e.target.value) || idx + 1)}
                  disabled={disabled}
                  className={inputClass}
                  readOnly
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(idx)}
              disabled={disabled || investigations.length <= 1}
              className="p-2 rounded-lg bg-doctor-red/10 text-doctor-red hover:bg-doctor-red/20 disabled:opacity-50 flex-shrink-0"
              aria-label="Remove investigation"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-doctor-slate/30 bg-transparent px-4 py-2.5 font-semibold text-doctor-slate hover:bg-doctor-slate/10 disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          Add Investigation
        </button>
      </div>
    </div>
  );
}

const PRIORITY_OPTIONS_DISPLAY = [
  { value: 'HIGH', label: 'High', color: 'text-doctor-red' },
  { value: 'NORMAL', label: 'Normal', color: 'text-doctor-gold' },
  { value: 'LOW', label: 'Low', color: 'text-doctor-mint' },
];

const PRIORITY_OPTIONS_SELECT = PRIORITY_OPTIONS.map((p) => ({ value: p.value, label: p.label }));