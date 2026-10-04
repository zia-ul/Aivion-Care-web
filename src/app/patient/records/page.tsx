'use client';

import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { consultationApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, SectionTitle } from '@/components/ui/FlutterTheme';
import { FileText, Download, RefreshCw } from 'lucide-react';

interface HistoryItem {
  consultationId?: number; id?: number; appointmentId?: number; doctorName?: string; patientName?: string;
  finalizedAt?: string; consultationDate?: string; diagnosis?: string; prescriptionSent?: boolean; speciality?: string;
}

export default function PatientRecordsPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend: GET /consultations/history (patient scope from JWT)
      const { data } = await consultationApi.getHistory();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const downloadPdf = async (item: HistoryItem) => {
    const cid = item.consultationId ?? item.id;
    if (!cid) return;
    setDownloadingId(cid);
    try {
      // Backend: GET /consultations/{id}/prescription-pdf (blob)
      const { data } = await consultationApi.getPrescriptionPdf(cid);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${cid}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to download prescription PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AppLayout role="PATIENT" title="Medical Records" subtitle="Consultation history & prescriptions">
      <div className="space-y-5">
        <SectionTitle action={<ActionButton variant="outline" onClick={load}><span className="inline-flex items-center gap-1.5"><RefreshCw size={14} /> Refresh</span></ActionButton>}>
          Finalized consultations
        </SectionTitle>

        {loading ? (
          <p className="text-sm text-doctor-dim">Loading records...</p>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-doctor-danger-soft/40 p-5 text-sm text-doctor-red">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">
            No finalized consultations yet. Records appear here after your doctor finalizes a prescription.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const cid = item.consultationId ?? item.id ?? idx;
              return (
                <DarkCard key={cid} tone="patient">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold">Dr. {item.doctorName ?? '—'}</p>
                        {item.speciality && <Pill color={FL.lavender}>{item.speciality}</Pill>}
                        {item.prescriptionSent && <Pill color={FL.mint}>Prescription sent</Pill>}
                      </div>
                      <p className="text-xs text-doctor-muted mt-1">Consultation #{cid}{item.appointmentId ? ` • Appointment #${item.appointmentId}` : ''}</p>
                      {item.diagnosis && <p className="text-xs text-doctor-muted mt-1.5 line-clamp-2">Diagnosis: {item.diagnosis}</p>}
                      {(item.consultationDate || item.finalizedAt) && (
                        <p className="text-xs text-doctor-muted mt-1.5">{item.consultationDate ?? String(item.finalizedAt ?? '').slice(0, 10)}</p>
                      )}
                    </div>
                    <ActionButton
                      disabled={downloadingId === cid}
                      onClick={() => downloadPdf(item)}
                    >
                      <span className="inline-flex items-center gap-1.5"><Download size={15} /> {downloadingId === cid ? 'Downloading...' : 'Prescription PDF'}</span>
                    </ActionButton>
                  </div>
                </DarkCard>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
