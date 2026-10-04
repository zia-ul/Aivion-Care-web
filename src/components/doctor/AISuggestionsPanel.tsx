'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Sparkles, ChevronDown, ChevronUp, Pill } from 'lucide-react';
import { ConsultationMedicationSuggestionGroupResponse, ConsultationMedicationSuggestionResponse } from '@/types/consultation';
import { Field, inputClass } from '@/components/ui/FlutterTheme';

interface AISuggestionsPanelProps {
  suggestions: ConsultationMedicationSuggestionGroupResponse[];
  selectedSuggestionIds: Set<number>;
  onToggleSuggestion: (suggestionId: number, selected: boolean) => void;
  onAddSelected: () => void;
  onSetCorrectionReason: (suggestionId: number, reason: string) => void;
  correctionReasons: Record<number, string>;
  disabled?: boolean;
}

export function AISuggestionsPanel({
  suggestions,
  selectedSuggestionIds,
  onToggleSuggestion,
  onAddSelected,
  onSetCorrectionReason,
  correctionReasons,
  disabled = false,
}: AISuggestionsPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const totalSuggestions = suggestions.reduce((sum, g) => sum + g.suggestions.length, 0);
  const selectedCount = Array.from(selectedSuggestionIds).length;

  const toggleGroup = (conditionKeyword: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(conditionKeyword)) next.delete(conditionKeyword);
      else next.add(conditionKeyword);
      return next;
    });
  };

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl border border-doctor-blue/20 bg-doctor-panel/50 p-4">
        <div className="flex items-center gap-2 text-doctor-muted">
          <Sparkles className="h-5 w-5" />
          <span>No AI medication suggestions available for this consultation.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-doctor-lavender" />
          AI Medication Suggestions
          <span className="rounded-full bg-doctor-lavender/20 px-2 py-0.5 text-xs font-semibold text-doctor-lavender">
            {totalSuggestions} total • {selectedCount} selected
          </span>
        </h3>
        {selectedCount > 0 && !disabled && (
          <button
            type="button"
            onClick={onAddSelected}
            className="flex items-center gap-1.5 rounded-lg bg-doctor-lavender-fill px-3 py-1.5 text-sm font-semibold text-white hover:bg-doctor-lavender/90"
          >
            <CheckCircle className="h-4 w-4" />
            Add {selectedCount} to Prescription
          </button>
        )}
      </div>

      <div className="space-y-2">
        {suggestions.map((group) => {
          const isExpanded = expandedGroups.has(group.conditionKeyword);
          const groupSelectedCount = group.suggestions.filter((s) =>
            selectedSuggestionIds.has(s.aiSuggestionId!)
          ).length;

          return (
            <div key={group.conditionKeyword} className="rounded-xl border border-doctor-lavender/20 bg-doctor-panel/50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGroup(group.conditionKeyword)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-doctor-lavender/20 px-2 py-0.5 text-xs font-semibold text-doctor-lavender">
                    {group.conditionKeyword}
                  </span>
                  <span className="text-sm text-doctor-muted">
                    {group.suggestions.length} suggestion{group.suggestions.length !== 1 ? 's' : ''}
                    {groupSelectedCount > 0 && ` • ${groupSelectedCount} selected`}
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-doctor-muted" /> : <ChevronDown className="h-5 w-5 text-doctor-muted" />}
              </button>

              {isExpanded && (
                <div className="border-t border-doctor-lavender/10 p-3 space-y-2">
                  {group.suggestions.map((suggestion) => {
                    const isSelected = suggestion.aiSuggestionId && selectedSuggestionIds.has(suggestion.aiSuggestionId);
                    const reason = correctionReasons[suggestion.aiSuggestionId!] || '';

                    return (
                      <div
                        key={suggestion.aiSuggestionId}
                        className={`rounded-lg p-3 transition-colors ${isSelected ? 'bg-doctor-lavender/10 border border-doctor-lavender/30' : 'bg-doctor-panel border border-doctor-blue/10'}`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleSuggestion(suggestion.aiSuggestionId!, !isSelected)}
                            disabled={disabled}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-doctor-lavender-fill border-doctor-lavender text-white'
                                : 'border-doctor-blue/30 text-doctor-muted hover:border-doctor-lavender/50'
                            }`}
                          >
                            {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">{suggestion.medicineName}</span>
                              <span className="text-xs text-doctor-muted">{suggestion.dosage}</span>
                              <span className="rounded-full bg-doctor-blue/20 px-1.5 py-0.5 text-xs text-doctor-blue">
                                {suggestion.frequencyPerDay}x/day
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-doctor-muted">
                              <span>{suggestion.timing}</span>
                              <span>{suggestion.duration}</span>
                              <span>{suggestion.route || 'Oral'}</span>
                            </div>
                            {suggestion.notes && (
                              <p className="mt-1 text-sm text-doctor-muted/80">{suggestion.notes}</p>
                            )}
                          </div>
                        </div>

                        {/* Correction Reason Input */}
                        <div className="mt-2 flex items-center gap-2">
                          <label className="text-xs text-doctor-muted w-20">Correction:</label>
                          <input
                            type="text"
                            value={reason}
                            onChange={(e) => onSetCorrectionReason(suggestion.aiSuggestionId!, e.target.value)}
                            disabled={disabled}
                            className="flex-1 rounded-lg bg-doctor-panel border border-doctor-blue/20 px-3 py-1.5 text-sm text-primary-light placeholder:text-doctor-muted/50 focus:border-doctor-lavender/50 focus:outline-none focus:ring-1 focus:ring-doctor-lavender/50"
                            placeholder="e.g. Change dosage to 250mg"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}