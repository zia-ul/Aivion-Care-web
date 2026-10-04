import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, Upload, FileAudio, Play, Pause, Trash2, Volume2, VolumeX, Send, Save, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { consultationApi } from '@/lib/api/endpoints';
import { MedicalHighlightedText } from '@/components/doctor/MedicalHighlightedText';

/** How many times a dropped speech-service connection is retried. */
const MAX_NETWORK_RETRIES = 4;

// Type declarations for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  /** Chrome ends a session after a pause even when continuous is true. */
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

interface VoiceRecorderProps {
  onRecordingComplete?: (file: File) => void;
  onTranscriptChange?: (transcript: string) => void;
disabled?: boolean;
  /**
   * @deprecated No longer applied. Recording runs until the doctor presses
   * "Stop & Generate" so a long consultation is never cut off on a timer.
   */
  maxDurationMinutes?: number;
  appointmentId?: number; // For live transcript updates
  language?: 'en-US' | 'hi-IN'; // Language for speech recognition
}

export function VoiceRecorder({
  onRecordingComplete,
  onTranscriptChange,
  disabled = false,
  appointmentId,
  language = 'en-US',
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en-US' | 'hi-IN'>(language);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  /**
   * The transcript is mirrored into a ref because `onresult` fires several
   * times before React commits a render. Reading `transcript` from the closure
   * meant each new sentence was appended to a stale value, so only the last
   * sentence survived and the transcript appeared to "break" every line.
   */
  const transcriptRef = useRef<string>('');
/** Read inside recognition callbacks so they never capture a stale flag. */
  const isRecordingRef = useRef(false);
  /** Last error code already surfaced, so the console is not flooded. */
  const reportedErrorRef = useRef<string | null>(null);
  /** Consecutive speech-service connection drops, reset per recording. */
  const networkFailuresRef = useRef(0);
  const languageRef = useRef(language);
  const appointmentIdRef = useRef(appointmentId);
  const onTranscriptChangeRef = useRef(onTranscriptChange);

    useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { appointmentIdRef.current = appointmentId; }, [appointmentId]);
  useEffect(() => { onTranscriptChangeRef.current = onTranscriptChange; }, [onTranscriptChange]);

  const pushLiveTranscript = useCallback(async (text: string) => {
    const id = appointmentIdRef.current;
    if (!id || !text) return;
    try {
      await consultationApi.updateLiveTranscript(id, {
        transcriptText: text,
        isFinal: false,
        source: 'voice-recorder',
      });
    } catch (err) {
      // Non-fatal: the in-page transcript is still correct, so only log.
      console.warn('Live transcript update failed:', err);
    }
  }, []);

  // Create the recogniser once. Recreating it on every render tore down a live
  // session mid-sentence, because the old effect cleanup called stop().
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageRef.current;

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += chunk;
        } else {
          interimText += chunk;
        }
      }

      // Interim text is rendered but not committed, so a mis-heard word can
      // still be corrected by the recogniser before it becomes final.
      setTranscript(`${transcriptRef.current}${finalText}${interimText}`);
      if (!finalText) return;

      transcriptRef.current = `${transcriptRef.current}${finalText}`;
      setTranscript(transcriptRef.current);
      onTranscriptChangeRef.current?.(transcriptRef.current);
      void pushLiveTranscript(finalText);
    };

/**
     * `network` is usually transient (the speech endpoint dropped, Wi-Fi blip,
     * VPN reconnect) and it is also what a restricted campus network produces
     * every time. Aborting on the first one killed transcription permanently,
     * so retry a few times with backoff before giving up. The other codes are
     * genuinely unrecoverable and stop immediately.
     */
    const RETRYABLE_ERRORS = new Set(['network']);

    const FATAL_ERRORS = new Set([
      'not-allowed',
      'service-not-allowed',
      'audio-capture',
      'language-not-supported',
    ]);

    const FATAL_MESSAGES: Record<string, string> = {
      network:
        'Live transcription could not reach the browser speech service. Audio is still being recorded - dictate into the Transcript box below when you are done.',
      'not-allowed':
        'Microphone access was blocked. Allow the microphone for this site in your browser, then start recording again.',
      'service-not-allowed':
        'The browser speech service is unavailable on this device. Audio is still being recorded - dictate into the Transcript box below when you are done.',
      'audio-capture':
        'No microphone was found. Connect a microphone, then start recording again.',
      'language-not-supported':
        'The selected language is not supported by the browser speech service. Switch language, or paste the transcript manually.',
    };

    const reportedRef = reportedErrorRef;

    recognition.onerror = (event) => {
      const code = event.error;

      if (code === 'no-speech' || code === 'aborted') {
        // Routine while listening; never surface or restart-loop on these.
        return;
      }

      if (RETRYABLE_ERRORS.has(code)) {
        networkFailuresRef.current += 1;
        if (networkFailuresRef.current <= MAX_NETWORK_RETRIES) {
          const attempt = networkFailuresRef.current;
          setTranscriptError(
            `Speech service connection lost (attempt ${attempt} of ${MAX_NETWORK_RETRIES}). Retrying - audio is still being recorded.`
          );
          // Back off so a blocked endpoint does not spin.
          window.setTimeout(() => {
            if (!isRecordingRef.current) return;
            try {
              recognition.start();
            } catch {
              /* already running */
            }
          }, 800 * attempt);
          return;
        }
        isRecordingRef.current = false;
        setIsTranscribing(false);
        try {
          recognition.abort();
        } catch {
          /* not running */
        }
        setTranscriptError(FATAL_MESSAGES.network);
        if (reportedRef.current !== code) {
          reportedRef.current = code;
          console.warn('Speech recognition gave up after retries:', code);
        }
        return;
      }

      if (FATAL_ERRORS.has(code)) {
        isRecordingRef.current = false;
        setIsTranscribing(false);
        try {
          recognition.abort();
        } catch {
          /* not running */
        }
        setTranscriptError(FATAL_MESSAGES[code] ?? `Transcription stopped: ${code}.`);
        if (reportedRef.current !== code) {
          reportedRef.current = code;
          console.warn('Speech recognition stopped:', code);
        }
        return;
      }

      if (reportedRef.current !== code) {
        reportedRef.current = code;
        console.warn('Speech recognition error:', code);
        setTranscriptError(`Transcription error: ${code}`);
      }
    };

    /**
     * Chrome ends a session after a short silence even with continuous=true.
     * Without this the transcript froze after roughly one sentence. Restart
     * only while recording is live and no fatal error has occurred.
     */
    recognition.onend = () => {
      if (!isRecordingRef.current || reportedRef.current) return;
      try {
        recognition.start();
      } catch {
        // start() throws if it is already running; that is fine.
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isRecordingRef.current = false;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    };
  }, [pushLiveTranscript]);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
      setIsTranscribing(false);
    }

    recorder.onstop = () => {
      const chunks = recordedChunksRef.current;
      if (chunks.length === 0) {
        setError('Recording did not complete. Please try again.');
        setIsRecording(false);
        return;
      }

      const mimeType = recorder.mimeType || 'audio/webm';
      const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('webm') ? 'webm' : 'wav';
      const file = new File(chunks, `consultation-${Date.now()}.${ext}`, { type: mimeType });

      const url = URL.createObjectURL(file);
      setAudioFile(file);
      setAudioUrl(url);
      setRecordingTime(0);
      setIsRecording(false);
      onRecordingComplete?.(file);
    };

    recorder.stop();
    mediaRecorderRef.current = null;
  }, [onRecordingComplete]);

const handleStartRecording = useCallback(async () => {
    if (isRecording || disabled) return;

    setError(null);
    setTranscriptError(null);

    // Most restricted networks never reach the browser speech service, so say
    // so up front instead of letting the doctor discover it mid-consultation.
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setTranscriptError(
        'You appear to be offline. Live transcription needs a connection, but audio will still be recorded.'
      );
    }
    // Don't reset transcript - keep accumulating

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

      isRecordingRef.current = true;
      // A fresh attempt re-arms the recogniser after a previous fatal error.
      reportedErrorRef.current = null;
      networkFailuresRef.current = 0;

      // Start (or resume) speech recognition.
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = currentLanguage;
          recognitionRef.current.start();
        } catch {
          // Already running from a previous onend restart - that is fine.
        }
        setIsTranscribing(true);
      }

      setRecordingTime(0);
      setIsRecording(true);

      // Elapsed time only. Recording never auto-stops: the doctor ends the
      // session explicitly with "Stop & Generate", so a long consultation is
      // never cut off mid-sentence.
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1000);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Microphone permission is required.');
    }
  }, [isRecording, disabled, currentLanguage]);

  const stopRecordingAndTranscribe = useCallback(() => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
      setIsTranscribing(false);
    }
    stopRecording();
  }, [stopRecording]);

  const handleClearTranscript = useCallback(() => {
    transcriptRef.current = '';
    setTranscript('');
    onTranscriptChangeRef.current?.('');
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const handleRemove = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioFile(null);
    setAudioUrl(null);
    setRecordingTime(0);
    onRecordingComplete?.(null as any);
  }, [audioUrl, onRecordingComplete]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [audioUrl]);

  if (disabled) {
    return (
      <div className="rounded-2xl border border-doctor-raised bg-doctor-panel p-4 text-center">
        <Mic className="h-8 w-8 text-doctor-blue/40 mx-auto mb-2" />
        <p className="text-sm text-doctor-muted">Recording disabled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-doctor-raised border border-doctor-blue/20">
        <Globe className="h-5 w-5 text-doctor-blue" />
        <span className="text-sm font-medium text-doctor-muted">Language:</span>
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value as 'en-US' | 'hi-IN')}
          disabled={isRecording}
          className="flex-1 sm:w-48 px-3 py-2 rounded-lg bg-doctor-panel border border-doctor-blue/30 text-primary-light text-sm focus:outline-none focus:border-doctor-blue disabled:opacity-50"
        >
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi (हिंदी)</option>
        </select>
        {isRecording && (
          <span className="text-xs text-doctor-mint flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-doctor-mint animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-colors ${
            isRecording
              ? 'bg-doctor-red-fill cursor-not-allowed'
              : 'bg-doctor-blue-fill hover:bg-doctor-blue-fill/90'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="h-5 w-5 animate-pulse" />
              <span>Recording {formatTime(recordingTime)}</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={stopRecording}
          disabled={!isRecording}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-primary-light bg-doctor-raised border border-doctor-blue/30 hover:bg-doctor-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="h-5 w-5" />
          <span>Stop & Generate</span>
        </button>
      </div>

      {/* Transcript Display */}
      {(transcript || isTranscribing || transcriptError) && (
        <div className="rounded-2xl bg-doctor-raised p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
<div className="flex items-center gap-2">
              <Mic className={`h-5 w-5 ${isTranscribing ? 'text-doctor-mint animate-pulse' : 'text-doctor-muted'}`} />
              <span className="font-medium text-primary-light">Live Transcript</span>
              <span
                className="rounded-full border border-doctor-blue/25 bg-doctor-panel px-2 py-0.5 text-[10px] text-doctor-muted"
                title="Produced in your browser. The AI notes are generated separately from the recorded audio."
              >
                Browser speech-to-text
              </span>
            </div>
            {isTranscribing && (
              <span className="text-xs text-doctor-mint flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-doctor-mint animate-pulse"></span>
                Listening...
              </span>
            )}
          </div>
          
          {transcriptError && (
            <div className="rounded-lg bg-doctor-red/10 border border-doctor-red/30 p-2 text-xs text-doctor-pink mb-3">
              {transcriptError}
            </div>
          )}
          
<div className="min-h-[80px] max-h-[200px] overflow-y-auto p-3 rounded-xl bg-doctor-panel text-sm text-primary-light whitespace-pre-wrap font-mono">
            {transcript ? (
              <MedicalHighlightedText text={transcript} />
            ) : (
              <span className="text-doctor-muted">Transcript will appear here as you speak...</span>
            )}
          </div>
          
          {/*
            Copy / Clear / Save appear only once recording has stopped, so the
            doctor cannot copy a half-finished transcript mid-consultation.
          */}
          {!isRecording && transcript && (
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(transcript);
                  toast.success('Transcript copied to clipboard');
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium text-white bg-doctor-blue-fill hover:bg-doctor-blue-fill/90"
              >
                <Send className="h-4 w-4" />
                <span>Copy Transcript</span>
              </button>
              <button
                type="button"
                onClick={handleClearTranscript}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium text-white bg-doctor-red-fill hover:bg-doctor-red-fill/90"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Transcript</span>
              </button>
              <button
                type="button"
onClick={async () => {
                  const id = appointmentIdRef.current;
                  if (!id) {
                    // Transcription itself came from the browser, not the AI.
                    // The AI notes run off the recorded audio, which needs a
                    // consultation to attach to, so fall back to a copy rather
                    // than a dead end.
                    navigator.clipboard.writeText(transcript);
                    toast.success(
                      'No consultation is linked, so the transcript was copied instead. The AI notes are generated from the recorded audio after saving.',
                      { duration: 6000 }
                    );
                    return;
                  }
                  try {
                    await consultationApi.updateLiveTranscript(id, {
                      transcriptText: transcript,
                      isFinal: true,
                      source: 'voice-recorder',
                    });
                    toast.success('Transcript saved');
                  } catch (err) {
                    console.error(err);
                    toast.error('Could not save the transcript. Please try again.');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium text-white bg-doctor-mint-fill hover:bg-doctor-mint-fill/90"
              >
                <Save className="h-4 w-4" />
                <span>Save Transcript</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-lg bg-doctor-red/10 border border-doctor-red/30 p-3 text-sm text-doctor-pink">
          {error}
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && audioFile && (
        <div className="rounded-2xl bg-doctor-raised p-4">
          <div className="flex items-center gap-3">
            <FileAudio className="h-6 w-6 text-doctor-mint" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-primary-light truncate">{audioFile.name}</p>
              <p className="text-xs text-doctor-muted">
                {formatTime(recordingTime || audioFile.size)} • {(audioFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="rounded-lg bg-doctor-blue-fill p-2 text-white hover:bg-doctor-blue-fill/90"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-doctor-muted" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-doctor-panel rounded-lg appearance-none accent-doctor-mint"
                />
              </div>

              <button
                onClick={handleRemove}
                className="rounded-lg bg-doctor-red/20 p-2 text-doctor-pink hover:bg-doctor-red/30"
                aria-label="Remove recording"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
        </div>
      )}

      {/* File Upload Fallback */}
      <div className="rounded-xl border-2 border-dashed border-doctor-blue/30 bg-doctor-panel/50 p-4">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="h-8 w-8 text-doctor-blue/60" />
          <p className="text-sm text-doctor-muted">Or upload audio file</p>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setAudioFile(file);
                setAudioUrl(url);
                onRecordingComplete?.(file);
              }
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

