import { CalendarDays, Megaphone, Stethoscope, Users } from 'lucide-react';

/** Tab identifiers shared by the Initiatives section and its tests. */
export type InitiativeTab = 'events' | 'mou' | 'awareness';

/*
 * Placeholder content. Replace each entry with real, verified programme
 * details (dates, partners, scope) before publishing.
 */
export const events = [
  {
    title: 'Community Health Screening Drive',
    text: 'Free screening camps covering blood pressure, blood sugar and basic vitals, with on-the-spot physician consultation.',
    meta: 'Pan-India · Quarterly',
    Icon: Stethoscope,
  },
  {
    title: 'Healthcare Awareness Seminar',
    text: 'Interactive sessions led by practising clinicians on prevention, chronic disease management and healthy living.',
    meta: 'Partner colleges & hospitals',
    Icon: Users,
  },
] as const;

/** MoU list is nested inside the MoU tab, with India highlighted as focus region. */
export const mouPartners = [
  {
    name: 'India — National Health Institutions',
    text: 'Collaboration with hospitals and health institutions across India to extend specialist consultation and diagnostics to underserved regions.',
    focus: true,
  },
  {
    name: 'Academic Institutions',
    text: 'Partnerships supporting curriculum development, clinical research and training for future healthcare professionals.',
    focus: false,
  },
  {
    name: 'Non-Profit & Community Organisations',
    text: 'Working with foundations and NGOs to run joint outreach, education and preventive health programmes.',
    focus: false,
  },
] as const;

export const awareness = [
  {
    title: 'Preventive Health',
    text: 'Guidance on screening schedules, vaccination and early detection of common conditions.',
  },
  {
    title: 'Digital Health Literacy',
    text: 'Helping people confidently use teleconsultation, health records and digital tools.',
  },
  {
    title: 'Mental Wellbeing',
    text: 'Awareness and open conversation around stress, anxiety and seeking support.',
  },
  {
    title: 'Chronic Disease Management',
    text: 'Practical education for living well with diabetes, hypertension and cardiac conditions.',
  },
] as const;

export { CalendarDays, Megaphone };