'use client';

import { useCallback, useEffect, useRef, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { chatApi, consultationApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, inputClass, Field } from '@/components/ui/FlutterTheme';
import { 
  User, Stethoscope, Activity, MessageCircle, Plus, Trash2, FileText, Download, Send, 
  Sparkles, Pill as PillIcon, Check, Mic, Square, Upload, Link2, RefreshCw, Globe, Brain 
} from 'lucide-react';
import { VoiceRecorder } from '@/components/doctor/VoiceRecorder';
import ConsultationCallPanel from '@/components/doctor/ConsultationCallPanel';
import { VitalsEditor } from '@/components/doctor/VitalsEditor';
import { MedicationEditor } from '@/components/doctor/MedicationEditor';
import { InvestigationEditor } from '@/components/doctor/InvestigationEditor';
import { AISuggestionsPanel } from '@/components/doctor/AISuggestionsPanel';
import { PrescriptionPreview } from '@/components/doctor/PrescriptionPreview';
import { SoapSummary } from '@/components/doctor/SoapSummary';
import { 
  ConsultationResponse, 
  ConsultationReviewResponse, 
  ConsultationAiDraftResponse,
  VitalData, 
  InvestigationItem, 
  MedicationDetail, 
  ConsultationMedicationSuggestionResponse, 
  ConsultationMedicationSuggestionGroupResponse 
} from '@/types/consultation';
import { useConsultation } from '@/hooks/useConsultation';
import { 
  SectionCard, 
  InnerTile, 
  StatusChip, 
  SubsectionPanel, 
  MetaPill, 
  ActionTileButton, 
  ButtonWrap 
} from '@/components/doctor/LayoutComponents';
import { 
  syncVitalsFromConsultation, 
  syncVitalsFromDraft,
  mapMedicinesFromConsultation, 
  mapInvestigationsFromConsultation,
  extractVitalsForApi,
  extractMedicationsForApi,
  extractInvestigationsForApi,
  formatRecordingTime,
} from '@/lib/consultationUtils';
import toast from 'react-hot-toast';

export default function DoctorConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const appointmentId = Number(resolvedParams.id);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);

  // Clinical fields
  const [f, setF] = useState({
    chiefComplaints: '',
    pastHistory: '',
    physicalExamination: '',
    diagnosisNotes: '',
    investigationAdvised: '',
    clinicalNotes: '',
    advice: '',
    allergy: '',
    severity: '',
    lifestyleAdvice: '',
    followUp: '',
  });
  const [summary, setSummary] = useState('');

  const up = (field: string) => (e: any) => setF((prev) => ({ ...prev, [field]: e.target.value }));

  // Vitals
  const [vitals, setVitals] = useState<VitalData[]>([]);

  // Medicines
  const [medications, setMedications] = useState<MedicationDetail[]>([]);

  // Investigations
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);

  const {
    consultation,
    consultationId,
    loading,
    saving,
    busy,
    error,
    review,
    reviewLoading,
    reviewError,
    isRecording,
    recordingSecs,
    uploading,
    recordingUrlInput,
    setRecordingUrlInput,
    audioFile,
    transcript,
    setTranscript,
    transcribing,
    recordingSupported,
    suggestions,
    selectedSuggestionIds,
    setSelectedSuggestionIds,
    correctionReasons,
    loadConsultation,
    loadReview,
    handleStartRecording,
    handleStopAndGenerate,
    handlePickAndGenerate,
    handleUseRecordingUrl,
    handleRefreshSummary,
    handleTranscribeOnly,
    handleDiscardDraft,
    toggleSuggestion,
    setCorrectionReason,
    setSaving,
    setBusy,
  } = useConsultation({ appointmentId });

  // Sync local state from consultation
  useEffect(() => {
    if (consultation) {
      setVitals(syncVitalsFromConsultation(consultation));
      setMedications(mapMedicinesFromConsultation(consultation));
      setInvestigations(mapInvestigationsFromConsultation(consultation));

      setF({
        chiefComplaints: consultation.chiefComplaints || '',
        pastHistory: consultation.pastHistory || '',
        physicalExamination: consultation.physicalExamination || '',
        diagnosisNotes: consultation.diagnosisNotes || '',
        investigationAdvised: consultation.investigationAdvised || '',
        clinicalNotes: consultation.clinicalNotes || '',
        advice: consultation.advice || '',
        allergy: consultation.allergy || '',
        severity: consultation.severity || '',
        lifestyleAdvice: consultation.lifestyleAdvice || '',
        followUp: consultation.followUp || '',
      });
    }
  }, [consultation]);

  // Sync AI draft fields from review (auto-fill from transcription)
  useEffect(() => {
    const draft = review?.draft;
    if (draft && !loading && !reviewLoading) {
      // Sync clinical fields from AI draft
      setF({
        chiefComplaints: draft.symptoms || f.chiefComplaints,
        pastHistory: draft.pastHistory || f.pastHistory,
        physicalExamination: draft.physicalExamination || f.physicalExamination,
        diagnosisNotes: draft.diagnosis || f.diagnosisNotes,
        investigationAdvised: draft.advice || f.investigationAdvised,
        clinicalNotes: draft.clinicalNotes || f.clinicalNotes,
        advice: draft.advice || f.advice,
        allergy: draft.allergy || f.allergy,
        severity: draft.severity || f.severity,
        lifestyleAdvice: draft.lifestyleAdvice || f.lifestyleAdvice,
        followUp: draft.followUp || f.followUp,
      });

      // Sync vitals from AI draft
      if (draft.vitals && Object.keys(draft.vitals).some(k => draft.vitals[k as keyof typeof draft.vitals] != null)) {
        const vitalsFromDraft = syncVitalsFromDraft(draft.vitals);
        if (vitalsFromDraft.some(v => v.value)) {
          setVitals(vitalsFromDraft);
        }
      }

      // Sync medications from AI draft
      if (draft.medications && draft.medications.length > 0) {
        const medsFromDraft = draft.medications.map((m, i) => ({
          sno: i + 1,
          medicineName: m.medicineName,
          dosage: m.dosage,
          amountPerUse: m.amountPerUse,
          frequency: m.frequencyPerDay,
          frequencyPerDay: m.frequencyPerDay,
          timing: m.timing,
          duration: m.duration,
          durationDays: m.durationDays,
          instructions: m.instructions,
          notes: m.notes,
          route: (m as any).route || 'Oral',
          aiSuggestionId: m.aiSuggestionId,
          conditionKeyword: m.conditionKeyword,
        }));
        setMedications(medsFromDraft);
      }

      // Sync investigations from AI draft
      if (draft.investigations && draft.investigations.length > 0) {
        const invsFromDraft = draft.investigations.map((inv, i) => ({
          sno: i + 1,
          investigationName: inv.investigationName,
          priority: inv.priority || 'NORMAL',
        }));
        setInvestigations(invsFromDraft);
      }

      // Update transcript and summary
      if (draft.transcript) setTranscript(draft.transcript);
      if (draft.transcriptSummary) setSummary(draft.transcriptSummary);
      
      // Show success toast if this is a new draft
      toast.success('AI draft generated and fields auto-filled');
    }
  }, [review, loading, reviewLoading]);

  // Load chat room
  useEffect(() => {
    if (consultation?.appointmentId) {
      chatApi.getRoomByAppointment(consultation.appointmentId)
        .then(room => setChatRoomId(room?.data?.id ?? null))
        .catch(() => setChatRoomId(null));
    }
  }, [consultation]);

  const handleSave = useCallback(async () => {
    if (!consultationId) return toast.error('Consultation not loaded yet');
    setSaving(true);
    try {
      await consultationApi.update(consultationId, {
        chiefComplaints: f.chiefComplaints || undefined,
        pastHistory: f.pastHistory || undefined,
        physicalExamination: f.physicalExamination || undefined,
        diagnosisNotes: f.diagnosisNotes || undefined,
        investigationAdvised: f.investigationAdvised || undefined,
        clinicalNotes: f.clinicalNotes || undefined,
      });
      await consultationApi.addVitals(consultationId, extractVitalsForApi(vitals));
      toast.success('Draft saved');
      await loadConsultation();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  }, [consultationId, f, vitals, loadConsultation, setSaving]);

  const handleFinalize = useCallback(async () => {
    if (!consultationId) return toast.error('Consultation not loaded yet');
    setSaving(true);
    try {
      const meds = extractMedicationsForApi(medications);
      const invs = extractInvestigationsForApi(investigations);

      await consultationApi.finalizePrescription(consultationId, {
        diagnosis: f.diagnosisNotes || undefined,
        symptoms: f.chiefComplaints || undefined,
        chiefComplaints: f.chiefComplaints || undefined,
        pastHistory: f.pastHistory || undefined,
        physicalExamination: f.physicalExamination || undefined,
        advice: f.advice || undefined,
        allergy: f.allergy || undefined,
        severity: f.severity || undefined,
        lifestyleAdvice: f.lifestyleAdvice || undefined,
        followUp: f.followUp || undefined,
        transcriptSummary: review?.transcriptSummary,
        doctorNotes: f.clinicalNotes || undefined,
        medications: meds,
        investigations: invs,
        maxId: consultation?.patientMaxId,
        location: consultation?.patientLocation,
        referredBy: consultation?.referredBy,
        speciality: consultation?.speciality,
        invoiceNumber: consultation?.invoiceNumber,
        consultationDate: consultation?.consultationDate,
        vitals: extractVitalsForApi(vitals),
      });
      toast.success('Prescription finalized');
      await loadConsultation();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to finalize prescription');
    } finally { setSaving(false); }
  }, [consultationId, f, medications, investigations, review, consultation, loadConsultation, setSaving, vitals]);

  const handleSend = useCallback(async () => {
    if (!consultationId) return;
    setSaving(true);
    try {
      await consultationApi.sendPrescription(consultationId);
      toast.success('Prescription sent to patient');
      await loadConsultation();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send prescription');
    } finally { setSaving(false); }
  }, [consultationId, loadConsultation, setSaving]);

  const handlePdf = useCallback(async () => {
    if (!consultationId) return;
    try {
      const { data } = await consultationApi.getPrescriptionPdf(consultationId);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `prescription-${consultationId}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to download PDF');
    }
  }, [consultationId]);

  const handleShareWithPharmacy = useCallback(async () => {
    if (!consultationId) return toast.error('Consultation not loaded');
    try {
      const pharmacies = await consultationApi.getAssociatedPharmacies();
      if (!pharmacies.data?.length) {
        toast.error('No associated pharmacy available');
        return;
      }
      const selectedPharmacy = pharmacies.data[0];
      await consultationApi.sharePrescriptionWithPharmacy(consultationId, {
        pharmacyId: selectedPharmacy.id,
        notes: 'Doctor prescription handoff',
      });
      toast.success(`Prescription sent to ${selectedPharmacy.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to share with pharmacy');
    }
  }, [consultationId]);

  const handleAddSuggestions = useCallback(() => {
    const selected = suggestions
      .flatMap(g => g.suggestions)
      .filter(s => s.aiSuggestionId && selectedSuggestionIds.has(s.aiSuggestionId!));
    
    if (selected.length === 0) {
      toast.error('Select at least one AI suggestion');
      return;
    }

    const existingKeys = medications
      .map(m => m.notes.includes('ai:') ? m.notes.split('ai:')[1] : '')
      .filter(Boolean);
    
    let added = 0;
    for (const s of selected) {
      if (!s.aiSuggestionId || existingKeys.includes(String(s.aiSuggestionId))) continue;
      
      setMedications(prev => [...prev, {
        medicineName: s.medicineName,
        dosage: s.dosage,
        amountPerUse: s.amountPerUse,
        frequency: s.frequency,
        frequencyPerDay: s.frequencyPerDay,
        timing: s.timing,
        duration: s.duration,
        durationDays: s.durationDays,
        instructions: s.notes || s.instructions,
        notes: `ai:${s.aiSuggestionId}`,
        route: s.route || 'Oral',
        aiSuggestionId: s.aiSuggestionId,
      }]);
      added++;
    }
    
    if (added > 0) {
      toast.success(`${added} AI suggestion${added === 1 ? '' : 's'} added to prescription`);
      setSelectedSuggestionIds(new Set());
    } else {
      toast('Selected suggestions were already present');
    }
  }, [suggestions, selectedSuggestionIds, medications, setMedications, setSelectedSuggestionIds]);

  if (loading) return <AppLayout role="DOCTOR" title="Consultation" subtitle="Loading..."><p className="text-sm text-doctor-dim">Loading...</p></AppLayout>;
  if (!consultation) return <AppLayout role="DOCTOR" title="Consultation" subtitle="Not found"><p className="text-sm text-doctor-dim">Appointment not found</p></AppLayout>;

  // The raw transcript is deliberately not shown here - it is already editable
  // in the "Transcript / Dictation" field below, and repeating speech-to-text
  // under the AI draft only adds noise next to the structured SOAP summary.
  const reviewSummaryText = review?.transcriptSummary?.trim() || '';
  const reviewSoapSections = review?.soapSections ?? [];
  const reviewProviderText = review?.summaryProvider?.trim() || '';

  return (
    <AppLayout role="DOCTOR" title="Consultation" subtitle={`Appointment #${appointmentId}`}>
      <div className="space-y-5">
        {/* Call + recording */}
        <ConsultationCallPanel
          appointmentId={appointmentId}
          onRecordingReady={(blob) => {
            if (!blob) return;
            const file = new File([blob], `consultation-${appointmentId}-call.webm`, {
              type: blob.type || 'audio/webm',
            });
            handlePickAndGenerate(file);
          }}
        />

        {/* Hero */}
        <SectionCard
          icon={User}
          title={`Dr. ${consultation.doctorName ?? '—'}`}
          subtitle={[
            consultation.patientName ?? '—',
            consultation.patientAge ? `${consultation.patientAge} yrs` : '',
            consultation.patientGender ?? '',
          ].filter(Boolean).join(' • ')}
          trailing={
            <div className="flex flex-wrap gap-2">
              {consultation.finalized === true && <Pill color={FL.mint}>Finalized</Pill>}
              {consultation.prescriptionSent === true && <Pill color={FL.blue}>Sent</Pill>}
              {chatRoomId && <Pill color={FL.cyan}>Chat room #{chatRoomId}</Pill>}
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-doctor-blue/15 flex items-center justify-center text-doctor-blue shrink-0">
              <User size={22} />
            </div>
          </div>
        </SectionCard>

        {/* Clinical */}
        <SectionCard
          icon={Stethoscope}
          title="Clinical Notes"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Chief Complaints"><textarea value={f.chiefComplaints} onChange={up('chiefComplaints')} rows={3} className={inputClass} placeholder="Patient's main complaints..." /></Field>
            <Field label="Past History"><textarea value={f.pastHistory} onChange={up('pastHistory')} rows={3} className={inputClass} placeholder="Relevant medical history..." /></Field>
            <Field label="Physical Examination"><textarea value={f.physicalExamination} onChange={up('physicalExamination')} rows={3} className={inputClass} placeholder="Examination findings..." /></Field>
            <Field label="Diagnosis"><textarea value={f.diagnosisNotes} onChange={up('diagnosisNotes')} rows={3} className={inputClass} placeholder="Primary diagnosis..." /></Field>
            <Field label="Investigations Advised"><textarea value={f.investigationAdvised} onChange={up('investigationAdvised')} rows={3} className={inputClass} placeholder="Tests ordered..." /></Field>
            <Field label="Clinical Notes"><textarea value={f.clinicalNotes} onChange={up('clinicalNotes')} rows={3} className={inputClass} placeholder="Additional clinical notes..." /></Field>
            <Field label="Advice"><textarea value={f.advice} onChange={up('advice')} rows={2} className={inputClass} placeholder="Advice to patient..." /></Field>
            <Field label="Allergy"><input value={f.allergy} onChange={up('allergy')} className={inputClass} placeholder="Known allergies..." /></Field>
            <Field label="Severity"><input value={f.severity} onChange={up('severity')} className={inputClass} placeholder="Mild / Moderate / Severe" /></Field>
            <Field label="Lifestyle Advice"><textarea value={f.lifestyleAdvice} onChange={up('lifestyleAdvice')} rows={2} className={inputClass} placeholder="Lifestyle modifications..." /></Field>
            <Field label="Follow-up"><input value={f.followUp} onChange={up('followUp')} className={inputClass} placeholder="Follow-up schedule..." /></Field>
          </div>
        </SectionCard>

        {/* Vitals */}
        <SectionCard
          icon={Activity}
          title="Vitals"
        >
          <VitalsEditor vitals={vitals} onChange={setVitals} />
          <ActionButton variant="ghost" className="mt-4" disabled={saving} onClick={handleSave}>
            <span className="inline-flex items-center gap-1.5"><Activity size={14} /> Save Vitals & Draft</span>
          </ActionButton>
        </SectionCard>

        {/* AI Notes & Recording */}
        <SectionCard
          icon={Sparkles}
          title="AI Notes & Transcription"
        >
          <VoiceRecorder
            appointmentId={appointmentId}
            onRecordingComplete={(file) => {
              if (file) {
                handlePickAndGenerate(file);
              }
            }}
            disabled={isRecording || uploading || reviewLoading}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ActionButton disabled={!recordingUrlInput.trim() || busy} onClick={handleUseRecordingUrl}>
              <span className="inline-flex items-center gap-1.5"><Link2 size={15} /> {uploading ? 'Working...' : 'Use Recording URL'}</span>
            </ActionButton>
            <ActionButton variant="outline" disabled={busy || reviewLoading} onClick={loadReview}>
              <span className="inline-flex items-center gap-1.5"><RefreshCw size={15} /> {reviewLoading ? 'Loading...' : 'Reload Draft'}</span>
            </ActionButton>
            <ActionButton variant="ghost" disabled={busy} onClick={handleRefreshSummary}>
              <span className="inline-flex items-center gap-1.5"><Sparkles size={15} /> Refresh AI Summary</span>
            </ActionButton>
            <ActionButton variant="ghost" disabled={busy} onClick={handleDiscardDraft}>
              <span className="inline-flex items-center gap-1.5"><Trash2 size={15} /> Discard Draft</span>
            </ActionButton>
          </div>

          {!recordingSupported && (
            <p className="mt-2 text-xs text-warning-light">Live microphone recording is unavailable in this browser. Upload an audio file instead.</p>
          )}

          {reviewError && <p className="mt-2 text-xs text-danger-light">{reviewError}</p>}
          {(reviewLoading || uploading) && <p className="mt-2 text-xs text-doctor-muted">{uploading ? 'Uploading and generating AI draft...' : 'Loading review draft...'}</p>}

          {(reviewSummaryText || reviewSoapSections.length > 0 || reviewProviderText) && (
            <InnerTile className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-doctor-muted">AI Review Draft</p>
              {reviewSoapSections.length > 0 ? (
                <SoapSummary sections={reviewSoapSections} className="mt-2" showAllSections />
              ) : (
                reviewSummaryText && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-primary-light">{reviewSummaryText}</p>
              )}
              {reviewProviderText && <p className="mt-1 text-xs text-doctor-muted">Summary provider: {reviewProviderText}</p>}
              {review?.analysisPending === true && (
                <p className="mt-1 text-xs text-warning-light">AI analysis is still processing in the background.</p>
              )}
            </InnerTile>
          )}

          <Field label="Transcript / Dictation">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Paste the consultation transcript, then generate AI notes (fills chief complaints, investigations and suggested medicines)..."
            />
          </Field>
          
          <ActionButton variant="ghost" className="mt-4" disabled={saving || !transcript.trim()} onClick={handleRefreshSummary}>
            <span className="inline-flex items-center gap-1.5"><Sparkles size={14} /> {saving ? 'Working...' : 'Generate AI Notes from Transcript'}</span>
          </ActionButton>
        </SectionCard>

        {/* AI Suggestions Panel */}
        {suggestions.length > 0 && (
          <SectionCard
            icon={Sparkles}
            title="AI Medication Suggestions"
            subtitle={`${suggestions.flatMap(g => g.suggestions).length} total • ${selectedSuggestionIds.size} selected`}
            trailing={
              <ActionButton 
                disabled={saving || selectedSuggestionIds.size === 0} 
                onClick={handleAddSuggestions}
              >
                <span className="inline-flex items-center gap-1.5"><Check size={14} /> Add {selectedSuggestionIds.size} to Prescription</span>
              </ActionButton>
            }
          >
            <AISuggestionsPanel
              suggestions={suggestions}
              selectedSuggestionIds={selectedSuggestionIds}
              onToggleSuggestion={toggleSuggestion}
              onAddSelected={handleAddSuggestions}
              onSetCorrectionReason={setCorrectionReason}
              correctionReasons={correctionReasons}
            />
          </SectionCard>
        )}

        {/* Medicines Editor */}
        <SectionCard
          icon={PillIcon}
          title="Medicines"
        >
          <MedicationEditor
            medications={medications}
            onChange={setMedications}
            suggestions={suggestions.flatMap(g => g.suggestions)}
            onAddSuggestions={handleAddSuggestions}
            disabled={saving}
          />
        </SectionCard>

        {/* Investigations Editor */}
        <SectionCard
          icon={FileText}
          title="Investigations"
        >
          <InvestigationEditor
            investigations={investigations}
            onChange={setInvestigations}
            disabled={saving}
          />
        </SectionCard>

        {/* Prescription Preview */}
        {consultation.finalized && (
          <SectionCard
            icon={FileText}
            title="Prescription Preview"
          >
            <PrescriptionPreview
              consultation={consultation}
              onDownloadPdf={handlePdf}
              onPrint={() => window.print()}
            />
          </SectionCard>
        )}

        {/* Actions */}
        <SectionCard
          icon={Activity}
          title="Actions"
        >
          <ButtonWrap>
            <ActionButton disabled={saving || busy} onClick={handleSave}>
              <span className="inline-flex items-center gap-1.5"><FileText size={15} /> Save Draft</span>
            </ActionButton>
            <ActionButton disabled={saving || busy || consultation.finalized} onClick={handleFinalize}>
              <span className="inline-flex items-center gap-1.5"><Check size={15} /> {consultation.finalized ? 'Finalized' : 'Finalize Prescription'}</span>
            </ActionButton>
            <ActionButton variant="ghost" disabled={saving || busy || !consultation.finalized} onClick={handleSend}>
              <span className="inline-flex items-center gap-1.5"><Send size={15} /> {consultation.prescriptionSent ? 'Sent' : 'Send to Patient'}</span>
            </ActionButton>
            <ActionButton variant="outline" disabled={!consultation.finalized} onClick={handlePdf}>
              <span className="inline-flex items-center gap-1.5"><Download size={15} /> Download PDF</span>
            </ActionButton>
            <ActionButton variant="ghost" disabled={!consultation.finalized} onClick={handleShareWithPharmacy}>
              <span className="inline-flex items-center gap-1.5"><Link2 size={15} /> Share with Pharmacy</span>
            </ActionButton>
            {chatRoomId && (
              <ActionButton variant="ghost" onClick={() => router.push(`/doctor/chat?roomId=${chatRoomId}`)}>
                <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} /> Chat with Patient</span>
              </ActionButton>
            )}
          </ButtonWrap>
        </SectionCard>
      </div>
    </AppLayout>
  );
}