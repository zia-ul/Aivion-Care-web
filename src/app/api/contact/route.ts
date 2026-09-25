import { NextResponse } from 'next/server';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
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
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@aiconfidencecure.com';

  if (!apiKey || !sender) {
    return NextResponse.json({ message: 'Email delivery is not configured yet.' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [supportEmail],
        reply_to: email,
        subject: `Website contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
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
