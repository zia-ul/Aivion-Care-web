/**
 * Clinical vocabulary categorization & highlighting inside dictated transcripts and SOAP notes.
 *
 * Dictation mixes English drug and test names with romanised Hindi/Urdu,
 * so the term list covers both with domain categories:
 * - drug: Emerald / Green
 * - symptom: Rose / Coral
 * - test: Sky / Cyan
 * - vital: Purple / Violet
 * - instruction: Amber / Indigo
 */

export type MedicalCategory = 'drug' | 'symptom' | 'test' | 'vital' | 'instruction';

export interface MedicalTermDef {
  term: string;
  category: MedicalCategory;
}

/** Specific clinical multi-word phrases (checked first). */
const CATEGORIZED_PHRASES: MedicalTermDef[] = [
  // Drugs / Formulations
  { term: 'montair lc', category: 'drug' },
  { term: 'montair-lc', category: 'drug' },
  { term: 'augmentin 625', category: 'drug' },
  { term: 'augmentin 375', category: 'drug' },
  { term: 'amoxyclav 625', category: 'drug' },
  { term: 'azithral 500', category: 'drug' },
  { term: 'dolo 650', category: 'drug' },
  { term: 'crocin 650', category: 'drug' },
  { term: 'pan d', category: 'drug' },
  { term: 'pan-d', category: 'drug' },
  { term: 'pantocid dsr', category: 'drug' },
  { term: 'cough syrup', category: 'drug' },
  { term: 'eye drops', category: 'drug' },
  { term: 'ear drops', category: 'drug' },
  { term: 'ors sachet', category: 'drug' },

  // Tests / Labs
  { term: 'complete blood count', category: 'test' },
  { term: 'blood sugar test', category: 'test' },
  { term: 'blood sugar', category: 'test' },
  { term: 'fasting blood sugar', category: 'test' },
  { term: 'post prandial blood sugar', category: 'test' },
  { term: 'lipid profile', category: 'test' },
  { term: 'liver function test', category: 'test' },
  { term: 'kidney function test', category: 'test' },
  { term: 'renal function test', category: 'test' },
  { term: 'thyroid profile', category: 'test' },
  { term: 'urine routine', category: 'test' },
  { term: 'urine test', category: 'test' },
  { term: 'stool test', category: 'test' },
  { term: 'chest x-ray', category: 'test' },
  { term: 'chest xray', category: 'test' },
  { term: 'x-ray', category: 'test' },
  { term: 'ct scan', category: 'test' },
  { term: 'mri scan', category: 'test' },
  { term: 'ultrasound abdomen', category: 'test' },
  { term: 'widal test', category: 'test' },
  { term: 'dengue ns1', category: 'test' },

  // Vitals & Measurements
  { term: 'blood pressure', category: 'vital' },
  { term: 'heart rate', category: 'vital' },
  { term: 'pulse rate', category: 'vital' },
  { term: 'oxygen saturation', category: 'vital' },
  { term: 'respiratory rate', category: 'vital' },
  { term: 'body temperature', category: 'vital' },
  { term: 'body mass index', category: 'vital' },
  { term: 'weight loss', category: 'vital' },
  { term: 'weight gain', category: 'vital' },

  // Symptoms
  { term: 'chest pain', category: 'symptom' },
  { term: 'abdominal pain', category: 'symptom' },
  { term: 'stomach pain', category: 'symptom' },
  { term: 'throat pain', category: 'symptom' },
  { term: 'sore throat', category: 'symptom' },
  { term: 'body ache', category: 'symptom' },
  { term: 'joint pain', category: 'symptom' },
  { term: 'back pain', category: 'symptom' },
  { term: 'lower back pain', category: 'symptom' },
  { term: 'loose motions', category: 'symptom' },
  { term: 'shortness of breath', category: 'symptom' },
  { term: 'difficulty breathing', category: 'symptom' },
  { term: 'sir dard', category: 'symptom' },
  { term: 'pet dard', category: 'symptom' },
  { term: 'sar dard', category: 'symptom' },
  { term: 'gala dard', category: 'symptom' },

  // Instructions & Scheduling
  { term: 'after food', category: 'instruction' },
  { term: 'before food', category: 'instruction' },
  { term: 'with food', category: 'instruction' },
  { term: 'with water', category: 'instruction' },
  { term: 'empty stomach', category: 'instruction' },
  { term: 'at bedtime', category: 'instruction' },
  { term: 'bed time', category: 'instruction' },
  { term: 'twice daily', category: 'instruction' },
  { term: 'thrice daily', category: 'instruction' },
  { term: 'once daily', category: 'instruction' },
  { term: 'four times daily', category: 'instruction' },
  { term: 'every 8 hours', category: 'instruction' },
  { term: 'every 12 hours', category: 'instruction' },
  { term: 'for 3 days', category: 'instruction' },
  { term: 'for 5 days', category: 'instruction' },
  { term: 'for 7 days', category: 'instruction' },
  { term: 'for 10 days', category: 'instruction' },
  { term: 'for 14 days', category: 'instruction' },
  { term: 'as needed', category: 'instruction' },
  { term: 'follow up', category: 'instruction' },
  { term: 'drink plenty of water', category: 'instruction' },
  { term: 'avoid oily food', category: 'instruction' },
  { term: 'bed rest', category: 'instruction' },
];

/** Single words or short medical brand/generic terms. */
const CATEGORIZED_TERMS: MedicalTermDef[] = [
  // Drugs - Generics
  { term: 'paracetamol', category: 'drug' },
  { term: 'acetaminophen', category: 'drug' },
  { term: 'amoxicillin', category: 'drug' },
  { term: 'amox', category: 'drug' },
  { term: 'clavulanate', category: 'drug' },
  { term: 'augmentin', category: 'drug' },
  { term: 'azithromycin', category: 'drug' },
  { term: 'azithral', category: 'drug' },
  { term: 'cefixime', category: 'drug' },
  { term: 'ciprofloxacin', category: 'drug' },
  { term: 'ofloxacin', category: 'drug' },
  { term: 'levofloxacin', category: 'drug' },
  { term: 'metronidazole', category: 'drug' },
  { term: 'flagyl', category: 'drug' },
  { term: 'pantoprazole', category: 'drug' },
  { term: 'pantocid', category: 'drug' },
  { term: 'omeprazole', category: 'drug' },
  { term: 'rabeprazole', category: 'drug' },
  { term: 'esomeprazole', category: 'drug' },
  { term: 'ranitidine', category: 'drug' },
  { term: 'cetirizine', category: 'drug' },
  { term: 'levocetirizine', category: 'drug' },
  { term: 'montelukast', category: 'drug' },
  { term: 'fexofenadine', category: 'drug' },
  { term: 'allegra', category: 'drug' },
  { term: 'ibuprofen', category: 'drug' },
  { term: 'combiflam', category: 'drug' },
  { term: 'aceclofenac', category: 'drug' },
  { term: 'diclofenac', category: 'drug' },
  { term: 'voveran', category: 'drug' },
  { term: 'tramadol', category: 'drug' },
  { term: 'aspirin', category: 'drug' },
  { term: 'clopidogrel', category: 'drug' },
  { term: 'atorvastatin', category: 'drug' },
  { term: 'rosuvastatin', category: 'drug' },
  { term: 'metformin', category: 'drug' },
  { term: 'glycomet', category: 'drug' },
  { term: 'glimepiride', category: 'drug' },
  { term: 'telmisartan', category: 'drug' },
  { term: 'telma', category: 'drug' },
  { term: 'amlodipine', category: 'drug' },
  { term: 'losartan', category: 'drug' },
  { term: 'atenolol', category: 'drug' },
  { term: 'metoprolol', category: 'drug' },
  { term: 'hydrochlorothiazide', category: 'drug' },
  { term: 'salbutamol', category: 'drug' },
  { term: 'budecort', category: 'drug' },
  { term: 'foracort', category: 'drug' },
  { term: 'inhaler', category: 'drug' },
  { term: 'multivitamin', category: 'drug' },
  { term: 'becosules', category: 'drug' },
  { term: 'neurobion', category: 'drug' },
  { term: 'zinc', category: 'drug' },
  { term: 'zincovit', category: 'drug' },
  { term: 'calcium', category: 'drug' },
  { term: 'shelcal', category: 'drug' },
  { term: 'vitamin d3', category: 'drug' },
  { term: 'calcitriol', category: 'drug' },
  { term: 'ondansetron', category: 'drug' },
  { term: 'emset', category: 'drug' },
  { term: 'domperidone', category: 'drug' },
  { term: 'vomikind', category: 'drug' },
  { term: 'crocin', category: 'drug' },
  { term: 'dolo', category: 'drug' },
  { term: 'calpol', category: 'drug' },
  { term: 'ORS', category: 'drug' },
  { term: 'electral', category: 'drug' },
  { term: 'antibiotic', category: 'drug' },
  { term: 'antibiotics', category: 'drug' },
  { term: 'syrup', category: 'drug' },
  { term: 'tablet', category: 'drug' },
  { term: 'tablets', category: 'drug' },
  { term: 'capsule', category: 'drug' },
  { term: 'capsules', category: 'drug' },
  { term: 'injection', category: 'drug' },
  { term: 'ointment', category: 'drug' },
  { term: 'drops', category: 'drug' },
  { term: 'tab', category: 'drug' },
  { term: 'cap', category: 'drug' },
  { term: 'inj', category: 'drug' },
  { term: 'dawa', category: 'drug' },
  { term: 'dawai', category: 'drug' },
  { term: 'goli', category: 'drug' },

  // Vitals & Clinical Measurements
  { term: 'temperature', category: 'vital' },
  { term: 'fever', category: 'vital' },
  { term: 'bp', category: 'vital' },
  { term: 'pressure', category: 'vital' },
  { term: 'pulse', category: 'vital' },
  { term: 'spo2', category: 'vital' },
  { term: 'saturation', category: 'vital' },
  { term: 'respiration', category: 'vital' },
  { term: 'bmi', category: 'vital' },
  { term: 'weight', category: 'vital' },
  { term: 'height', category: 'vital' },
  { term: 'glucose', category: 'vital' },
  { term: 'sugar', category: 'vital' },
  { term: 'hemoglobin', category: 'vital' },
  { term: 'haemoglobin', category: 'vital' },
  { term: 'hb', category: 'vital' },

  // Symptoms
  { term: 'headache', category: 'symptom' },
  { term: 'migraine', category: 'symptom' },
  { term: 'cough', category: 'symptom' },
  { term: 'cold', category: 'symptom' },
  { term: 'feverish', category: 'symptom' },
  { term: 'nausea', category: 'symptom' },
  { term: 'vomiting', category: 'symptom' },
  { term: 'vomit', category: 'symptom' },
  { term: 'diarrhea', category: 'symptom' },
  { term: 'diarrhoea', category: 'symptom' },
  { term: 'constipation', category: 'symptom' },
  { term: 'chills', category: 'symptom' },
  { term: 'shivering', category: 'symptom' },
  { term: 'dizziness', category: 'symptom' },
  { term: 'giddiness', category: 'symptom' },
  { term: 'vertigo', category: 'symptom' },
  { term: 'weakness', category: 'symptom' },
  { term: 'fatigue', category: 'symptom' },
  { term: 'itching', category: 'symptom' },
  { term: 'rash', category: 'symptom' },
  { term: 'swelling', category: 'symptom' },
  { term: 'bleeding', category: 'symptom' },
  { term: 'palpitations', category: 'symptom' },
  { term: 'breathlessness', category: 'symptom' },
  { term: 'insomnia', category: 'symptom' },
  { term: 'anxiety', category: 'symptom' },
  { term: 'numbness', category: 'symptom' },
  { term: 'tingling', category: 'symptom' },
  { term: 'allergy', category: 'symptom' },
  { term: 'allergic', category: 'symptom' },
  { term: 'bukhar', category: 'symptom' },
  { term: 'dard', category: 'symptom' },
  { term: 'takleef', category: 'symptom' },
  { term: 'chakkar', category: 'symptom' },
  { term: 'khansi', category: 'symptom' },
  { term: 'ulti', category: 'symptom' },
  { term: 'thakan', category: 'symptom' },
  { term: 'neend', category: 'symptom' },

  // Tests & Investigations
  { term: 'cbc', category: 'test' },
  { term: 'esr', category: 'test' },
  { term: 'crp', category: 'test' },
  { term: 'widal', category: 'test' },
  { term: 'dengue', category: 'test' },
  { term: 'malaria', category: 'test' },
  { term: 'typhoid', category: 'test' },
  { term: 'urinalysis', category: 'test' },
  { term: 'sputum', category: 'test' },
  { term: 'xray', category: 'test' },
  { term: 'ultrasound', category: 'test' },
  { term: 'usg', category: 'test' },
  { term: 'ecg', category: 'test' },
  { term: 'ekg', category: 'test' },
  { term: 'mri', category: 'test' },
  { term: 'echo', category: 'test' },
  { term: 'biopsy', category: 'test' },
  { term: 'hba1c', category: 'test' },
  { term: 'thyroid', category: 'test' },
  { term: 'lft', category: 'test' },
  { term: 'kft', category: 'test' },
  { term: 'pcr', category: 'test' },
  { term: 'troponin', category: 'test' },

  // Instructions / Regimen
  { term: 'dose', category: 'instruction' },
  { term: 'dosage', category: 'instruction' },
  { term: 'frequency', category: 'instruction' },
  { term: 'duration', category: 'instruction' },
  { term: 'morning', category: 'instruction' },
  { term: 'evening', category: 'instruction' },
  { term: 'night', category: 'instruction' },
  { term: 'bedtime', category: 'instruction' },
  { term: 'od', category: 'instruction' },
  { term: 'bd', category: 'instruction' },
  { term: 'tds', category: 'instruction' },
  { term: 'sos', category: 'instruction' },
  { term: 'advice', category: 'instruction' },
  { term: 'advised', category: 'instruction' },
  { term: 'review', category: 'instruction' },
  { term: 'hydration', category: 'instruction' },
  { term: 'rest', category: 'instruction' },
  { term: 'exercise', category: 'instruction' },
  { term: 'diet', category: 'instruction' },
];

/** Map of lookup term (lowercase) to its category */
const TERM_MAP = new Map<string, MedicalCategory>();

for (const p of CATEGORIZED_PHRASES) {
  TERM_MAP.set(p.term.toLowerCase(), p.category);
}
for (const t of CATEGORIZED_TERMS) {
  if (!TERM_MAP.has(t.term.toLowerCase())) {
    TERM_MAP.set(t.term.toLowerCase(), t.category);
  }
}

/** All terms sorted by length descending so multi-word phrases match first. */
const ALL_SORTED_TERMS = [...CATEGORIZED_PHRASES, ...CATEGORIZED_TERMS]
  .map((item) => item.term)
  .sort((a, b) => b.length - a.length);

const escapeAlternation = (values: string[]) =>
  values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

const termPattern = new RegExp(`\\b(?:${escapeAlternation(ALL_SORTED_TERMS)})\\b`, 'gi');

/** Words of 3+ characters, or specific 2-letter clinical acronyms like BP, OD, BD. */
const isUsefulWord = (word: string) => {
  const trimmed = word.trim();
  if (trimmed.length >= 3) return true;
  return /^(bp|od|bd|hb|ct|ot)$/i.test(trimmed);
};

export interface HighlightSegment {
  text: string;
  medical: boolean;
  category?: MedicalCategory;
}

/**
 * Splits transcript or clinical note text into plain and categorized medical-term segments.
 */
export function segmentMedicalText(text: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  if (!text) return segments;

  let cursor = 0;
  for (const match of text.matchAll(termPattern)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (!isUsefulWord(value)) continue;

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), medical: false });
    }
    const cat = TERM_MAP.get(value.toLowerCase()) || 'drug';
    segments.push({ text: value, medical: true, category: cat });
    cursor = start + value.length;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), medical: false });
  }
  return segments;
}

/** Count of medical terms found, broken down by category. */
export function countMedicalTerms(text: string): { total: number; byCategory: Record<MedicalCategory, number> } {
  const counts: Record<MedicalCategory, number> = {
    drug: 0,
    symptom: 0,
    test: 0,
    vital: 0,
    instruction: 0,
  };
  let total = 0;
  for (const seg of segmentMedicalText(text)) {
    if (seg.medical && seg.category) {
      counts[seg.category] = (counts[seg.category] || 0) + 1;
      total++;
    }
  }
  return { total, byCategory: counts };
}
