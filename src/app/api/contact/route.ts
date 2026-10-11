import { NextResponse } from 'next/server';
import { CONTACT_EMAILS, ContactEmailKey } from '@/lib/contact-emails';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Routes an enquiry to the team that can act on it, based on the subject the
 * visitor chose. Anything unrecognised goes to support, which is the safest
 * default for a healthcare product.
 */
const SUBJECT_ROUTING: ReadonlyArray<{ mailbox: ContactEmailKey; pattern: RegExp }> = [
  { mailbox: 'hr', pattern: /\b(career|job|jobs|hiring|hire|intern|internship|recruit|application|resume|cv|apply)\b/i },
  { mailbox: 'sales', pattern: /\b(sales|price|pricing|quote|cost|buy|purchase|demo|partnership|partner|collaborat|onboard|enterprise|licen[cs]e|procure)\b/i },
  { mailbox: 'info', pattern: /\b(info|general|press|media|privacy|legal|terms|compliance|about|company)\b/i },
];

function routeToMailbox(subject: string): ContactEmailKey {
  for (const { mailbox, pattern } of SUBJECT_ROUTING) {
    if (pattern.test(subject)) return mailbox;
  }
  return 'support';
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  const payload: ContactPayload = contentType.includes('application/json')
    ? ((await request.json()) as ContactPayload)
    : Object.fromEntries((await request.formData()).entries());
  const name = text(payload.name);
  const email = text(payload.email);
  const subject = text(payload.subject);
  const message = text(payload.message);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ message: 'Please complete all fields.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !sender) {
    return NextResponse.json({ message: 'Email delivery is not configured yet.' }, { status: 503 });
  }

  const mailbox = routeToMailbox(subject);
  const recipient = process.env[`CONTACT_EMAIL_${mailbox.toUpperCase()}`] || CONTACT_EMAILS[mailbox];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `[${mailbox}] Website contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nRouted to: ${recipient}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const providerError = (await response.json().catch(() => null)) as { message?: string } | null;
      console.error('Resend rejected contact email', response.status, providerError);
      return NextResponse.json(
        { message: providerError?.message || `Email provider rejected the request (${response.status}).` },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact email delivery failed', error);
    return NextResponse.json({ message: 'We could not send your message. Please try again.' }, { status: 500 });
  }
}
