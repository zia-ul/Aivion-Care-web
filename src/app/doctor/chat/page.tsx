'use client';
import AppLayout from '@/components/layout/AppLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Suspense } from 'react';

export default function DoctorChatPage() {
  return (
    <AppLayout role="DOCTOR" title="Chat" subtitle="Conversations with patients">
      <Suspense fallback={<p>Loading...</p>}>
        <ChatPanel role="DOCTOR" />
      </Suspense>
    </AppLayout>
  );
}
