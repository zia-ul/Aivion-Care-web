'use client';

import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi, billingApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, SectionTitle } from '@/components/ui/FlutterTheme';
import { Wallet, Download, Receipt } from 'lucide-react';

interface Appt { id: number; doctorName?: string; appointmentDate?: string; status?: string; invoiceNumber?: string; }
interface Invoice { id?: number; billingId?: number; invoiceNumber?: string; paymentStatus?: string; paymentMode?: string; totalAmount?: any; discount?: any; tax?: any; }

export default function PatientPaymentsPage() {
  const [rows, setRows] = useState<{ appt: Appt; invoice: Invoice | null; error?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await appointmentApi.getMyAppointments();
      const appts: Appt[] = Array.isArray(data) ? data : [];
      const results = await Promise.all(
        appts.map(async (appt) => {
          try {
            // Backend: GET /appointments/{id}/invoice
            const { data: inv } = await appointmentApi.getInvoice(appt.id);
            return { appt, invoice: inv };
          } catch {
            return { appt, invoice: null, error: 'No invoice' };
          }
        })
      );
      setRows(results);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const downloadInvoicePdf = async (billingId: number) => {
    try {
      // Backend: GET /billing/invoices/{id}/pdf (blob)
      const { data } = await billingApi.getInvoicePdf(billingId);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${billingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to download invoice PDF');
    }
  };

  const statusColor = (s?: string) => (s === 'PAID' ? FL.mint : s === 'PENDING' ? FL.gold : FL.cyan);

  return (
    <AppLayout role="PATIENT" title="Payments" subtitle="Invoices & billing history">
      <div className="space-y-5">
        <SectionTitle>Invoices</SectionTitle>
        {loading ? (
          <p className="text-sm text-[#5B7A88]">Loading invoices...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#D6ECF1] p-6 text-center text-sm text-[#5B7A88]">No appointments yet.</div>
        ) : (
          <div className="space-y-3">
            {rows.map(({ appt, invoice, error }) => (
              <DarkCard key={appt.id} tone="patient">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold inline-flex items-center gap-2"><Receipt size={16} className="text-[#4DD9AC]" /> {invoice?.invoiceNumber ?? `Appointment #${appt.id}`}</p>
                      {invoice?.paymentStatus && <Pill color={statusColor(invoice.paymentStatus)}>{invoice.paymentStatus}</Pill>}
                    </div>
                    <p className="text-xs text-[#8AB0C0] mt-1">Dr. {appt.doctorName ?? '—'} • {appt.appointmentDate}</p>
                    {invoice && (
                      <p className="text-sm text-white font-bold mt-2">
                        ₹{String(invoice.totalAmount ?? '0')}
                        {(invoice.discount || invoice.tax) && (
                          <span className="text-xs font-normal text-[#8AB0C0] ml-2">
                            (discount ₹{invoice.discount ?? 0}, tax ₹{invoice.tax ?? 0})
                          </span>
                        )}
                      </p>
                    )}
                    {!invoice && <p className="text-xs text-[#8AB0C0] mt-2">{error === 'No invoice' ? 'Invoice not generated yet.' : ''}</p>}
                  </div>
                  {invoice?.billingId && (
                    <ActionButton variant="ghost" onClick={() => downloadInvoicePdf(invoice.billingId!)}>
                      <span className="inline-flex items-center gap-1.5"><Download size={15} /> PDF</span>
                    </ActionButton>
                  )}
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
