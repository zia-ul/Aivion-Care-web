'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Radio } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export default function SuperAdminBroadcast() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await superAdminApi.broadcastNotification({ title, message, type: 'EMERGENCY' });
      toast.success('Broadcast sent successfully');
      setTitle('');
      setMessage('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout role="SUPER_ADMIN" title="Broadcast Notification" subtitle="Send emergency alerts to all users">
      <div className="max-w-2xl">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-danger/10 rounded-xl"><Radio size={20} className="text-danger-light" /></div>
            <div>
              <h3 className="text-heading font-bold text-primary-light">Emergency Broadcast</h3>
              <p className="text-support text-primary-light/60">This will send a notification to all active users</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-body font-medium text-primary-light mb-1.5">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" placeholder="Emergency alert title" />
            </div>
            <div>
              <label className="block text-body font-medium text-primary-light mb-1.5">Message</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-surface-20 border border-tonal-20 rounded-input text-primary-light focus:outline-none focus:border-accent" placeholder="Enter emergency message" />
            </div>
            <Button type="submit" loading={loading} variant="danger">{loading ? 'Sending...' : 'Send Broadcast'}</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
