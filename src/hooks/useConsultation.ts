'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { consultationApi } from '@/lib/api/endpoints';
import { readableError } from '@/lib/errors';
import { ConsultationResponse, ConsultationReviewResponse, VitalData, InvestigationItem, MedicationDetail, ConsultationMedicationSuggestionGroupResponse, ConsultationMedicationSuggestionResponse } from '@/types/consultation';
import { formatRecordingTime, stopRecordingTracks } from '@/lib/consultationUtils';

interface UseConsultationOptions {
  appointmentId: number;
  onLoadComplete?: (consultation: ConsultationResponse) => void;
}

export function useConsultation({ appointmentId, onLoadComplete }: UseConsultationOptions) {
  // Core state
  const [consultation, setConsultation] = useState<ConsultationResponse | null>(null);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review/AI state
  const [review, setReview] = useState<ConsultationReviewResponse | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [recordingUrlInput, setRecordingUrlInput] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [transcribing, setTranscribing] = useState(false);

  // AI suggestions
  const [suggestions, setSuggestions] = useState<ConsultationMedicationSuggestionGroupResponse[]>([]);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState<Set<number>>(new Set());
  const [correctionReasons, setCorrectionReasons] = useState<Record<number, string>>({});

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recordingSupported = typeof window !== 'undefined' && 
    typeof window.MediaRecorder !== 'undefined' && 
    !!navigator.mediaDevices?.getUserMedia;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Load consultation
  const loadConsultation = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await consultationApi.getByAppointment(appointmentId);
      setConsultation(data);
      setConsultationId(data?.id ?? null);
      onLoadComplete?.(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load consultation');
      toast.error('Failed to load consultation');
    } finally {
      setLoading(false);
    }
  }, [appointmentId, onLoadComplete]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  // Load review draft
  const loadReview = useCallback(async () => {
    setReviewLoading(true);
    setReviewError('');
    try {
      const { data } = await consultationApi.getReview(appointmentId);
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      
      // Flatten suggestions for easy access
      const allGroups: ConsultationMedicationSuggestionGroupResponse[] = [];
      data.medicationSuggestions?.forEach(group => {
        allGroups.push({
          conditionKeyword: group.conditionKeyword,
          suggestions: group.suggestions.map(s => ({
            ...s,
            conditionKeyword: group.conditionKeyword,
          }))
        });
      });
      setSuggestions(allGroups);
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || err?.message || 'Failed to load review draft');
    } finally {
      setReviewLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  // Recording functions
  const handleStartRecording = useCallback(async () => {
    if (isRecording || uploading || reviewLoading) return;
    if (!recordingSupported) {
      toast.error('Live audio recording is not supported in this browser. Upload an audio file instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
              ? 'audio/mp4'
              : 'audio/wav';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;
      recorder.start(1000);
      setRecordingSecs(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => setRecordingSecs(v => v + 1), 1000);
      setReviewError('');
      setIsRecording(true);
    } catch (err: any) {
      stopRecordingTracks(mediaStreamRef, recordingTimerRef, mediaRecorderRef);
      toast.error(err?.message || 'Microphone permission is required.');
    }
  }, [isRecording, uploading, reviewLoading, recordingSupported]);

  const handleStopAndGenerate = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!isRecording || !recorder || uploading || reviewLoading) return;
    setUploading(true);
    setReviewError('');
    try {
      const recordedFile: File = await new Promise((resolve, reject) => {
        recorder.onstop = () => {
          const chunks = recordedChunksRef.current;
          if (!chunks.length) {
            reject(new Error('Recording did not complete. Please try again.'));
            return;
          }
          const mimeType = recorder.mimeType || 'audio/webm';
          const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('webm') ? 'webm' : 'wav';
          resolve(new File(chunks, `consultation-${appointmentId}-${Date.now()}.${ext}`, { type: mimeType }));
        };
        recorder.stop();
      });
      stopRecordingTracks(mediaStreamRef, recordingTimerRef, mediaRecorderRef);
      setIsRecording(false);
      setAudioFile(recordedFile);
      const { data } = await consultationApi.uploadRecordingAndGenerateDraft(appointmentId, recordedFile);
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      
      const allGroups: ConsultationMedicationSuggestionGroupResponse[] = [];
      data.medicationSuggestions?.forEach(group => {
        allGroups.push({
          conditionKeyword: group.conditionKeyword,
          suggestions: group.suggestions.map(s => ({ ...s, conditionKeyword: group.conditionKeyword }))
        });
      });
      setSuggestions(allGroups);
      
      toast.success('Recording transcribed and AI draft generated');
} catch (err: unknown) {
      stopRecordingTracks(mediaStreamRef, recordingTimerRef, mediaRecorderRef);
      setIsRecording(false);
      toast.error(readableError(err, 'Failed to process the recording. Please try again.'));
    } finally {
      setUploading(false);
    }
  }, [appointmentId, isRecording, uploading, reviewLoading]);

  const handlePickAndGenerate = useCallback(async (file: File | null) => {
    setAudioFile(file);
    if (!file || uploading || reviewLoading) return;
    setUploading(true);
    setReviewError('');
    try {
      const { data } = await consultationApi.uploadRecordingAndGenerateDraft(appointmentId, file);
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      
      const allGroups: ConsultationMedicationSuggestionGroupResponse[] = [];
      data.medicationSuggestions?.forEach(group => {
        allGroups.push({
          conditionKeyword: group.conditionKeyword,
          suggestions: group.suggestions.map(s => ({ ...s, conditionKeyword: group.conditionKeyword }))
        });
      });
      setSuggestions(allGroups);
      
      toast.success('Recording transcribed and AI draft generated');
    } catch (err: unknown) {
      toast.error(readableError(err, 'Failed to process the recording. Please try again.'));
    } finally {
      setUploading(false);
    }
  }, [appointmentId, uploading, reviewLoading]);

  const handleUseRecordingUrl = useCallback(async () => {
    const recordingUrl = recordingUrlInput.trim();
    if (!recordingUrl) return toast.error('Recording URL is required.');
    if (uploading || reviewLoading) return;
    setUploading(true);
    setReviewError('');
    try {
      const { data } = await consultationApi.completeRecordingAndGenerateDraft(appointmentId, { recordingUrl, autoTranscribe: true });
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      
      const allGroups: ConsultationMedicationSuggestionGroupResponse[] = [];
      data.medicationSuggestions?.forEach(group => {
        allGroups.push({
          conditionKeyword: group.conditionKeyword,
          suggestions: group.suggestions.map(s => ({ ...s, conditionKeyword: group.conditionKeyword }))
        });
      });
      setSuggestions(allGroups);
      
      toast.success('Recording registered and AI draft generated');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to use recording URL');
    } finally {
      setUploading(false);
    }
  }, [appointmentId, recordingUrlInput, uploading, reviewLoading]);

  const handleRefreshSummary = useCallback(async () => {
    if (reviewLoading) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      const { data } = await consultationApi.refreshSummary(appointmentId);
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      
      const allGroups: ConsultationMedicationSuggestionGroupResponse[] = [];
      data.medicationSuggestions?.forEach(group => {
        allGroups.push({
          conditionKeyword: group.conditionKeyword,
          suggestions: group.suggestions.map(s => ({ ...s, conditionKeyword: group.conditionKeyword }))
        });
      });
      setSuggestions(allGroups);
      
      toast.success('AI summary refreshed');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to refresh AI summary');
    } finally {
      setReviewLoading(false);
    }
  }, [appointmentId, reviewLoading]);

  const handleTranscribeOnly = useCallback(async () => {
    if (!audioFile) return toast.error('Choose an audio recording first');
    setTranscribing(true);
    try {
      const { data } = await consultationApi.uploadRecording(appointmentId, audioFile);
      const generatedTranscript = data?.transcript || data?.transcriptText || '';
      if (!generatedTranscript) throw new Error('The transcription response did not contain a transcript.');
      setTranscript(generatedTranscript);
      toast.success('Audio transcribed successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to transcribe audio');
    } finally {
      setTranscribing(false);
    }
  }, [appointmentId, audioFile]);

  const handleDiscardDraft = useCallback(async () => {
    if (!confirm('Discard all changes? This cannot be undone.')) return;
    setBusy(true);
    try {
      const { data } = await consultationApi.discardDraft(appointmentId);
      setReview(data);
      if (data.transcript) setTranscript(data.transcript);
      if (data.recordingUrl) setRecordingUrlInput(data.recordingUrl);
      toast.success('Draft discarded');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to discard draft');
    } finally {
      setBusy(false);
    }
  }, [appointmentId]);

  // AI suggestion handlers
  const toggleSuggestion = useCallback((suggestionId: number, selected: boolean) => {
    setSelectedSuggestionIds(prev => {
      const next = new Set(prev);
      if (selected) next.add(suggestionId);
      else next.delete(suggestionId);
      return next;
    });
  }, []);

  const setCorrectionReason = useCallback((suggestionId: number, reason: string) => {
    setCorrectionReasons(prev => ({ ...prev, [suggestionId]: reason }));
  }, []);

  return {
    // Core state
    consultation,
    consultationId,
    loading,
    saving,
    busy,
    error,
    
    // Review state
    review,
    reviewLoading,
    reviewError,
    
    // Recording state
    isRecording,
    recordingSecs,
    uploading,
    recordingUrlInput,
    setRecordingUrlInput,
    audioFile,
    setAudioFile,
    transcript,
    setTranscript,
    transcribing,
    recordingSupported,
    formatRecordingTime,
    
    // AI suggestions
    suggestions,
    selectedSuggestionIds,
    correctionReasons,
    
    // Actions
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
    setSelectedSuggestionIds,
    
    // Setters
    setSaving,
    setBusy,
    setError,
  };
}
