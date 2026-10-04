'use client';

import { useCallback, useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { RefreshCw, FileText, Send, Share2, CheckCircle } from 'lucide-react';
import type { PathologyWorkflowResponse } from '@/types/pathology';
import toast from 'react-hot-toast';

export default function PathologyWorkflowPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<PathologyWorkflowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [quotationFor, setQuotationFor] = useState<number | null>(null);
  const [reportFor, setReportFor] = useState<number | null>(null);
  const [quotation, setQuotation] = useState({ testName: '', rate: '', quantity: '1', discount: '' });
  const [report, setReport] = useState({ reportTitle: '', overallSummary: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pathologyApi.getMyRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load pathology workflow');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (id: number | undefined, action: () => Promise<unknown>, success: string) => {
    if (!id) return;
    setBusyId(id);
    try {
      await action();
      toast.success(success);
      await load();
    } catch {
      toast.error('Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const submitQuotation = async (id: number) => {
    if (!quotation.testName || !quotation.rate) {
      toast.error('Provide at least one test and rate');
      return;
    }
    await run(id, () => pathologyApi.sendQuotation(id, {
      tests: [{ testName: quotation.testName, rate: Number(quotation.rate), quantity: Number(quotation.quantity) || 1 }],
      discount: quotation.discount ? Number(quotation.discount) : undefined,
    }), 'Quotation sent');
    setQuotationFor(null);
    setQuotation({ testName: '', rate: '', quantity: '1', discount: '' });
  };

  const submitReport = async (id: number) => {
    if (!report.reportTitle) {
      toast.error('Report title is required');
      return;
    }
    await run(id, () => pathologyApi.saveReportDraft(id, {
      reportTitle: report.reportTitle,
      overallSummary: report.overallSummary,
    }), 'Report draft saved');
    setReportFor(null);
    setReport({ reportTitle: '', overallSummary: '' });
  };

  const isPathology = user?.role === 'PATHOLOGY' || user?.role === 'PATHOLOGIST';

  return (
    <AppLayout role="PATHOLOGY" title="Lab Workflow" subtitle="Requests, quotations and reports">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-bold text-primary-light">Requests ({requests.length})</h2>
          <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading workflow...</p>
        ) : requests.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No pathology requests in scope.</p></Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary-light">Request #{request.id} · {request.pathologyLabName ?? 'Lab'}</p>
                    <p className="text-sm text-primary-light/60">
                      {request.patientName ?? `Patient ${request.patientId ?? ''}`}
                      {request.doctorName ? ` · ${request.doctorName}` : ''}
                      {request.totalAmount != null ? ` · ₹${request.totalAmount}` : ''}
                    </p>
                    {request.requestNote ? <p className="text-sm text-primary-light/50 mt-1">{request.requestNote}</p> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {request.status ? <StatusBadge status={request.status} /> : null}
                      {request.paymentStatus ? <StatusBadge status={request.paymentStatus} /> : null}
                    </div>
                  </div>
                  {isPathology && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setQuotationFor(request.id)}>Quotation</Button>
                      <Button size="sm" variant="ghost" onClick={() => setReportFor(request.id)}><FileText size={14} className="mr-1" /> Report</Button>
                      <Button size="sm" variant="outline" disabled={busyId === request.id} onClick={() => run(request.id, () => pathologyApi.completeReport(request.id), 'Report completed')}><CheckCircle size={14} className="mr-1" /> Complete</Button>
                      <Button size="sm" variant="ghost" disabled={busyId === request.id} onClick={() => run(request.id, () => pathologyApi.sendReportToPatient(request.id), 'Report sent to patient')}><Send size={14} className="mr-1" /> To patient</Button>
                      <Button size="sm" variant="ghost" disabled={busyId === request.id} onClick={() => run(request.id, () => pathologyApi.shareReportWithDoctor(request.id, {}), 'Shared with doctor')}><Share2 size={14} className="mr-1" /> To doctor</Button>
                    </div>
                  )}
                </div>

                {quotationFor === request.id && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 border-t border-tonal-20/40 pt-4">
                    <Input label="Test name" value={quotation.testName} onChange={(event) => setQuotation({ ...quotation, testName: event.target.value })} />
                    <Input label="Rate" type="number" value={quotation.rate} onChange={(event) => setQuotation({ ...quotation, rate: event.target.value })} />
                    <Input label="Quantity" type="number" value={quotation.quantity} onChange={(event) => setQuotation({ ...quotation, quantity: event.target.value })} />
                    <Input label="Discount" type="number" value={quotation.discount} onChange={(event) => setQuotation({ ...quotation, discount: event.target.value })} />
                    <div className="flex items-end gap-2">
                      <Button size="sm" onClick={() => submitQuotation(request.id)}>Send</Button>
                      <Button size="sm" variant="ghost" onClick={() => setQuotationFor(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {reportFor === request.id && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-tonal-20/40 pt-4">
                    <Input label="Report title" value={report.reportTitle} onChange={(event) => setReport({ ...report, reportTitle: event.target.value })} />
                    <Input label="Summary" value={report.overallSummary} onChange={(event) => setReport({ ...report, overallSummary: event.target.value })} />
                    <div className="flex items-end gap-2">
                      <Button size="sm" onClick={() => submitReport(request.id)}>Save draft</Button>
                      <Button size="sm" variant="ghost" onClick={() => setReportFor(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}