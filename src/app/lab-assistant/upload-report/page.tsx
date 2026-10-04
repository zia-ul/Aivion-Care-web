'use client';

import { useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { FileText, Upload, RefreshCw } from 'lucide-react';
import type { PathologyWorkflowResponse } from '@/types/pathology';
import toast from 'react-hot-toast';

export default function LabAssistantUploadReportPage() {
  const [requests, setRequests] = useState<PathologyWorkflowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { title: string; summary: string }>>({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pathologyApi.getMyRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (id: number) => {
    const draft = drafts[id];
    if (!draft?.title) {
      toast.error('Report title is required');
      return;
    }
    setBusyId(id);
    try {
      await pathologyApi.saveReportDraft(id, { reportTitle: draft.title, overallSummary: draft.summary });
      toast.success('Report draft saved');
      await load();
    } catch {
      toast.error('Unable to save report');
    } finally {
      setBusyId(null);
    }
  };

  const complete = async (id: number) => {
    setBusyId(id);
    try {
      await pathologyApi.completeReport(id);
      toast.success('Report completed');
      await load();
    } catch {
      toast.error('Unable to complete report');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppLayout role="LAB_ASSISTANT" title="Upload Report" subtitle="Draft and publish lab reports">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-bold text-primary-light">Requests awaiting reports ({requests.length})</h2>
          <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading requests...</p>
        ) : requests.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No requests require a report right now.</p></Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const draft = drafts[request.id] ?? { title: '', summary: '' };
              return (
                <Card key={request.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="p-2 bg-green-500/10 rounded-lg"><FileText size={18} className="text-green-500" /></span>
                      <div>
                        <p className="font-medium text-primary-light">Request #{request.id} · {request.patientName ?? `Patient ${request.patientId ?? ''}`}</p>
                        <p className="text-sm text-primary-light/60">{request.pathologyLabName ?? 'Lab'}{request.doctorName ? ` · ${request.doctorName}` : ''}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {request.status ? <StatusBadge status={request.status} /> : null}
                          {request.report?.status ? <StatusBadge status={request.report.status} /> : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button size="sm" variant="ghost" disabled={busyId === request.id} onClick={() => complete(request.id)}>Mark complete</Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-tonal-20/40 pt-4">
                    <Input label="Report title" value={draft.title} onChange={(event) => setDrafts({ ...drafts, [request.id]: { ...draft, title: event.target.value } })} />
                    <Input label="Summary" value={draft.summary} onChange={(event) => setDrafts({ ...drafts, [request.id]: { ...draft, summary: event.target.value } })} />
                    <div className="flex items-end">
                      <Button size="sm" disabled={busyId === request.id} onClick={() => save(request.id)}><Upload size={14} className="mr-1" /> Save draft</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}