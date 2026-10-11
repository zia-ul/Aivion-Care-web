/**
 * Contact addresses for AI Confidence Cure.
 *
 * Each mailbox is published for the purpose its name implies, so a visitor always
 * reaches a team that can actually act on the enquiry:
 *
 *   info@    general enquiries, press, privacy and legal questions
 *   hr@      careers and applications
 *   sales@   partnerships, pricing, demos and business enquiries
 *   support@ product support, appointments, accounts and technical issues
 *
 * The contact form routes to one of these based on the subject; see
 * src/app/api/contact/route.ts.
 */

export const CONTACT_EMAILS = {
  info: 'info@aiconfidencecure.com',
  hr: 'hr@aiconfidencecure.com',
  sales: 'sales@aiconfidencecure.com',
  support: 'support@aiconfidencecure.com',
} as const;

export type ContactEmailKey = keyof typeof CONTACT_EMAILS;

export interface ContactChannel {
  label: string;
  address: string;
  purpose: string;
}

/** Shown on the contact page and the contact section of the landing page. */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    label: 'General enquiries',
    address: CONTACT_EMAILS.info,
    purpose: 'Questions about the company, press, or privacy and legal requests.',
  },
  {
    label: 'Careers',
    address: CONTACT_EMAILS.hr,
    purpose: 'Applications, internships, and anything about joining the team.',
  },
  {
    label: 'Sales & partnerships',
    address: CONTACT_EMAILS.sales,
    purpose: 'Demos, pricing, hospital onboarding, and ecosystem partnerships.',
  },
  {
    label: 'Product support',
    address: CONTACT_EMAILS.support,
    purpose: 'Appointments, video visits, account access, and technical issues.',
  },
] as const;

/** mailto: link for an address. */
export const mailto = (address: string) => `mailto:${address}`;