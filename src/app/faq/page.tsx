import type { Metadata } from 'next';
import FAQSection from '@/components/landing/FAQSection';
import PageShell from '@/components/landing/PageShell';

export const metadata: Metadata = {
  title: 'FAQ | Aivion Care',
  description:
    'Answers to common questions about Aivion Care — appointments, video consultations, data security, and who can use the platform.',
};

export default function FaqPage() {
  return (
    <PageShell>
      <main>
        <FAQSection />
      </main>
    </PageShell>
  );
}
