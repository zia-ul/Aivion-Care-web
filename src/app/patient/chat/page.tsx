'use client';

import AppLayout from '@/components/layout/AppLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Suspense } from 'react';

export default function PatientChatPage() {
  return (
    <AppLayout role="PATIENT" title="Chat" subtitle="Conversations with your doctor">
      <Suspense fallback={<p className="text-sm text-[#5B7A88]">Loading...</p>}>
        <ChatPanel role="PATIENT" />
      </Suspense>
    </AppLayout>
  );
}
