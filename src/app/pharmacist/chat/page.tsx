'use client';

import AppLayout from '@/components/layout/AppLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Suspense } from 'react';

export default function PharmacistChatPage() {
  return (
    <AppLayout role="PHARMACY" title="Messages" subtitle="Direct chat with patients and doctors">
      <Suspense fallback={<div className="p-8 text-center text-primary-light/60">Loading messages...</div>}>
        <ChatPanel role="PHARMACY" />
      </Suspense>
    </AppLayout>
  );
}
