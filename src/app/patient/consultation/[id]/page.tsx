'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { chatApi, consultationApi } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';
import { Download, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface Consultation {
  id: number;
  appointmentId: number;
  doctorName: string;
  patientName: string;
  finalized: boolean;
  prescriptionSent: boolean;
  medicines?: any[];
  chiefComplaints?: string;
  advice?: string;
  heartRate?: number | null;
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  spo2?: any;
  bodyTemp?: any;
}

export default function PatientConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);

  const id = Number(params.id);

  const loadConsultation = useCallback(async () => {
    try {
      const { data } = await consultationApi.getByAppointment(id);
      setConsultation(data);
      try {
        const room = await chatApi.getRoomByAppointment(data?.appointmentId ?? id);
        setChatRoomId(room?.data?.id ?? null);
      } catch {
        setChatRoomId(null);
      }
    } catch (error) {
      console.error('Failed to load consultation:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadConsultation();
  }, [loadConsultation]);

  const handleDownloadPdf = useCallback(async () => {
    if (!consultation?.id) return;
    try {
      await consultationApi.markPrescriptionViewed(consultation.id);
      const { data } = await consultationApi.getPrescriptionPdf(consultation.id);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${consultation.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      await consultationApi.markPrescriptionDownloaded(consultation.id);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to download PDF');
    }
  }, [consultation?.id]);

  if (loading) return <AppLayout role="PATIENT" title="Consultation" subtitle="Loading..."><div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Loading...</p></div></AppLayout>;
  if (!consultation) return <AppLayout role="PATIENT" title="Consultation" subtitle="Not found"><div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Consultation not found</p></div></AppLayout>;

  const { id: cid, doctorName, appointmentId, chiefComplaints, advice, medicines, finalized, heartRate, bpSystolic, bpDiastolic, spo2, bodyTemp } = consultation;
  const vitals = { heartRate, bpSystolic, bpDiastolic, spo2, bodyTemp };

  return (
    <AppLayout role="PATIENT" title="Consultation Details" subtitle={`Dr. ${doctorName}`}>
      <div className="space-y-6">
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-heading font-bold text-primary-light">Consultation #{cid}</h3>
              <p className="text-body text-primary-light/60">Appointment #{appointmentId}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => chatRoomId && router.push(`/patient/chat?roomId=${chatRoomId}`)} disabled={!chatRoomId}>
                <MessageCircle size={18} className="inline mr-2" /> Chat Doctor
              </Button>
              <Button variant="outline" onClick={() => router.push(`/video/consultation?id=${appointmentId}`)}>
                <Video size={18} className="inline mr-2" /> Video Call
              </Button>
              {finalized && (
                <Button variant="success" onClick={handleDownloadPdf}>
                  <Download size={18} className="inline mr-2" /> Download PDF
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {(chiefComplaints || advice) && (
                <div>
                  <h4 className="text-heading font-bold text-primary-light mb-2">Clinical Notes</h4>
                  <div className="space-y-2">
                    {chiefComplaints && <div className="p-3 bg-surface-10/50 rounded-xl"><p className="text-support text-primary-light/60">Chief Complaints</p><p className="text-body text-primary-light">{chiefComplaints}</p></div>}
                    {advice && <div className="p-3 bg-surface-10/50 rounded-xl"><p className="text-support text-primary-light/60">Advice</p><p className="text-body text-primary-light">{advice}</p></div>}
                  </div>
                </div>
              )}
              {vitals && Object.values(vitals).some((v) => v != null) && (
                <div>
                  <h4 className="text-heading font-bold text-primary-light mb-2">Vitals</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(vitals).filter(([_, v]) => v != null).map(([key, value]) => (
                      <div key={key} className="p-2 bg-surface-10/50 rounded-xl">
                        <p className="text-support text-primary-light/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-body font-semibold text-primary-light">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-heading font-bold text-primary-light mb-2">Prescription</h4>
              {medicines?.length ? (
                <div className="space-y-2">
                  {medicines.map((med: any, idx: number) => (
                    <div key={idx} className="p-3 bg-surface-10/50 rounded-xl border border-tonal-20/30">
                      <p className="text-body font-medium text-primary-light">{med.medicineName}</p>
                      <p className="text-support text-primary-light/60">{med.dosage} | {med.frequency} | {med.durationDays} days</p>
                      {med.instructions && <p className="text-support text-primary-light/50 mt-1">{med.instructions}</p>}
                    </div>
                  ))}
                </div>
              ) : <p className="text-body text-primary-light/60">No medicines prescribed yet</p>}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}