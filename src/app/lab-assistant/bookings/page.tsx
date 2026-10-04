'use client';

import { useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { Calendar, RefreshCw } from 'lucide-react';
import type { PathologyWorkflowResponse } from '@/types/pathology';
import toast from 'react-hot-toast';

export default function LabAssistantBookingsPage() {
  const [bookings, setBookings] = useState<PathologyWorkflowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reportUrls, setReportUrls] = useState<Record<number, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pathologyApi.getMyRequests();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const uploadReport = async (id: number) => {
    const url = reportUrls[id];
    if (!url) {
      toast.error('Enter a report URL');
      return;
    }
    setBusyId(id);
    try {
      await pathologyApi.saveReportDraft(id, { reportTitle: `Report ${id}`, overallSummary: url });
      toast.success('Report link saved');
      await load();
    } catch {
      toast.error('Unable to save report');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppLayout role="LAB_ASSISTANT" title="Bookings" subtitle="Lab bookings and sample status">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-bold text-primary-light">Lab bookings ({bookings.length})</h2>
          <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No lab bookings available.</p></Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-amber-500/10 rounded-lg"><Calendar size={18} className="text-amber-500" /></span>
                    <div>
                      <p className="font-medium text-primary-light">Booking #{booking.id} · {booking.patientName ?? `Patient ${booking.patientId ?? ''}`}</p>
                      <p className="text-sm text-primary-light/60">
                        {booking.bookingMode ?? booking.preferredMode ?? 'Lab visit'}
                        {booking.scheduledDateTime ? ` · ${new Date(booking.scheduledDateTime).toLocaleString()}` : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {booking.status ? <StatusBadge status={booking.status} /> : null}
                        {booking.bookingStatus ? <StatusBadge status={booking.bookingStatus} /> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <Input label="Report URL" value={reportUrls[booking.id] ?? ''} onChange={(event) => setReportUrls({ ...reportUrls, [booking.id]: event.target.value })} placeholder="https://…" />
                    <Button size="sm" disabled={busyId === booking.id} onClick={() => uploadReport(booking.id)}>Save</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}