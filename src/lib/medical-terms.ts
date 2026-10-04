/**
 * Highlights clinical vocabulary inside dictated consultation transcripts.
 *
 * Dictation is rarely clean English - clinicians mix English drug and test names
 * with romanised Hindi, so the term list covers both. Matching is longest-first
 * so multi-word phrases ("blood test") win over their single words ("blood").
 */

/** Single words: drugs, vitals, symptoms, tests, clinical verbs. */
const TERMS = [
  // drugs / formulations
  'paracetamol', 'acetaminophen', 'ibuprofen', 'aspirin', 'crocin', 'dolo', 'typhoid',
  'azithromycin', 'amoxicillin', 'augmentin', 'cefixime', 'antibiotic', 'antibiotics',
  'ORS', 'saline', 'sharbate', 'lime', 'syrup', 'tablet', 'tablets', 'capsule', 'capsules',
  'injection', 'ointment', 'cream', 'gel', 'drops', 'suppository', 'ORS',
  // vitals / measurements
  'temperature', 'fever', 'bp', 'blood pressure', 'pressure', 'pulse', 'heart rate',
  'spo2', 'oxygen saturation', 'saturation', 'respiratory rate', 'bmi', 'weight', 'height',
  'glucose', 'sugar', 'diabetes', 'hemoglobin', 'haemoglobin', 'hb',
  // symptoms
  'headache', 'migraine', 'cough', 'cold', 'feverish', 'nausea', 'vomiting', 'vomit',
  'diarrhea', 'diarrhoea', 'loose motions', 'constipation', 'abdominal pain', 'stomach pain',
  'chest pain', 'throat pain', 'body ache', 'bodyache', 'chills', 'shivering', 'dizziness',
  'giddiness', 'vertigo', 'weakness', 'fatigue', 'itching', 'rash', 'swelling', 'bleeding',
  'palpitations', 'breathlessness', 'insomnia', 'anxiety', 'numbness', 'tingling',
  // tests / imaging
  'blood test', 'cbc', 'complete blood count', 'esr', 'crp', 'widal', 'dengue', 'malaria',
  'typhoid test', 'urine test', 'urinalysis', 'urine', 'stool', 'sputum', 'xray', 'x-ray',
  'ultrasound', 'usg', 'ecg', 'ekg', 'mri', 'ct scan', 'ct', 'echo', 'biopsy', 'hba1c',
  'thyroid', 'lipid profile', 'lft', 'kft', 'renal function', 'blood sugar', 'blood grouping',
  'covid', 'pcr',
  // clinical / prescription
  'prescription', 'prescribe', 'dose', 'dosage', 'frequency', 'duration', 'schedule',
  'morning', 'evening', 'night', 'bedtime', 'empty stomach', 'after food', 'before food',
  'with water', 'after meal', 'before meal', 'twice daily', 'thrice daily', 'once daily',
  'od', 'bd', 'tds', 'sos', 'follow up', 'review', 'advice', 'advised', 'allergy', 'allergic',
  'diagnosis', 'symptom', 'symptoms', 'treatment', 'medicine', 'medicines', 'medication',
  'tab', 'cap', 'inj', 'OT', 'BP check', 'weight loss', 'hydration', 'rest', 'exercise', 'diet',
  // romanised Hindi / Urdu medical words seen in Indian dictation
  'bukhar', 'dard', 'takleef', 'chakkar', 'khansi', 'pighran', 'ulti', 'thakan', 'neend',
  'khaana', 'pani', 'dawa', 'dawai', 'goli', 'khatam', 'dobara', 'timmat', 'naram',
  'sir dard', 'pet dard', 'sar dard', 'khana', 'tada', 'puri', 'adhoora',
] as const;

/** Multi-word phrases, checked before single words. */
const PHRASES = [
  'complete blood count', 'blood pressure', 'blood sugar', 'blood grouping', 'chest pain',
  'abdominal pain', 'stomach pain', 'throat pain', 'body ache', 'loose motions', 'heart rate',
  'oxygen saturation', 'respiratory rate', 'after food', 'before food', 'with water',
  'after meal', 'before meal', 'empty stomach', 'twice daily', 'thrice daily', 'once daily',
  'follow up', 'renal function', 'lipid profile', 'sugar test', 'urine test', 'x-ray',
  'ct scan', 'weight loss', 'bed time', 'bedtime', 'at bedtime',
] as const;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeAlternation = (values: readonly string[]) =>
  values.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '')).join('|');

/** Words of 4+ characters, or any 2-3 character term given in caps (BP, ECG, X-RAY). */
const isUsefulWord = (word: string) => word.length >= 4 || /^[A-Z]{2,3}$/.test(word);

const termPattern = new RegExp(
  `\\b(?:${escapeAlternation(PHRASES)}|${escapeAlternation(TERMS)})\\b`,
  'gi',
);

export interface HighlightSegment {
  text: string;
  medical: boolean;
}

/**
 * Splits transcript text into plain and medical-term segments for rendering.
 * Multi-word phrases are matched before single words.
 */
export function segmentMedicalText(text: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  if (!text) return segments;

  let cursor = 0;
  for (const match of text.matchAll(termPattern)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (!isUsefulWord(value.trim())) continue;

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), medical: false });
    }
    segments.push({ text: value, medical: true });
    cursor = start + value.length;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), medical: false });
  }
  return segments;
}

/** Count of medical terms found, for a "n terms detected" hint. */
export function countMedicalTerms(text: string): number {
  return segmentMedicalText(text).filter((segment) => segment.medical).length;
}