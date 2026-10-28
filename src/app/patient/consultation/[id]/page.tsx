'use client';

import { useState, useEffect, useCallback, use } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { chatApi, consultationApi } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';
import { Download, Video, MessageCircle, Bell, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { SoapSummary } from '@/components/doctor/SoapSummary';
import { ConsultationSoapSectionResponse } from '@/types/consultation';
import { patientApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';

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
  appointmentType?: string;
  soapSections?: ConsultationSoapSectionResponse[];
}

export default function PatientConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [addingReminders, setAddingReminders] = useState(false);
  const [remindersAdded, setRemindersAdded] = useState(false);

  const id = Number(resolvedParams.id);

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

  const handleAddMedicationReminders = async () => {
    if (!consultation?.medicines?.length) {
      toast.error('No medicines available in this prescription.');
      return;
    }

    setAddingReminders(true);
    let successCount = 0;

    for (const med of consultation.medicines) {
      try {
        const medName = med.medicineName || med.name;
        if (!medName) continue;
        const durationStr = med.durationDays ? `${med.durationDays} days` : med.duration || '7 days';
        await patientApi.createMedicationReminder({
          medicineName: medName,
          dosage: med.dosage || '1 dose',
          amountPerUse: med.amountPerUse || '1 tablet',
          frequencyPerDay: med.frequency || med.frequencyPerDay || 'Twice daily',
          timing: med.timing || 'After meals',
          duration: durationStr,
          notes: med.instructions || med.notes || `Prescribed in Consultation #${consultation.id}`,
          startDate: new Date().toISOString().split('T')[0],
          scheduleTimes: ['09:00', '21:00'],
        });
        successCount++;
      } catch (e) {
        console.error('Failed to create reminder for', med, e);
      }
    }

    setAddingReminders(false);
    if (successCount > 0) {
      setRemindersAdded(true);
      toast.success(`Successfully set ${successCount} medicine reminder(s)!`);
    } else {
      toast.error('Could not schedule reminders. Please try again.');
    }
  };

  if (loading) return <AppLayout role="PATIENT" title="Consultation" subtitle="Loading..."><div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Loading...</p></div></AppLayout>;
  if (!consultation) return <AppLayout role="PATIENT" title="Consultation" subtitle="Not found"><div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Consultation not found</p></div></AppLayout>;

  const { id: cid, doctorName, appointmentId, chiefComplaints, advice, medicines, finalized, heartRate, bpSystolic, bpDiastolic, spo2, bodyTemp } = consultation;
  const vitals = { heartRate, bpSystolic, bpDiastolic, spo2, bodyTemp };
  const soapSections = consultation.soapSections ?? [];

  return (
    <AppLayout role="PATIENT" title="Consultation Details" subtitle={`Dr. ${doctorName}`}>
      <div className="space-y-6">
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-heading font-bold text-primary-light">Consultation #{cid}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${consultation.appointmentType === 'VIDEO' || consultation.appointmentType === 'TELECONSULT' ? 'bg-doctor-cyan/15 text-doctor-cyan' : 'bg-doctor-mint/15 text-doctor-mint'}`}>
                  {consultation.appointmentType === 'VIDEO' || consultation.appointmentType === 'TELECONSULT' ? 'Online Video Visit' : 'In-Person Clinic Visit'}
                </span>
              </div>
              <p className="text-body text-primary-light/60 mt-1">Appointment #{appointmentId}</p>
            </div>
            <div className="flex gap-2">
              {(consultation.appointmentType === 'VIDEO' || consultation.appointmentType === 'TELECONSULT') && (
                <>
                  <Button variant="outline" onClick={() => chatRoomId && router.push(`/patient/chat?roomId=${chatRoomId}`)} disabled={!chatRoomId}>
                    <MessageCircle size={18} className="inline mr-2" /> Chat Doctor
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/video/consultation?id=${appointmentId}`)}>
                    <Video size={18} className="inline mr-2" /> Video Call
                  </Button>
                </>
              )}
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
              {soapSections.length > 0 && (
                <div>
                  <h4 className="text-heading font-bold text-primary-light mb-2">Clinical Summary (SOAP)</h4>
                  <SoapSummary sections={soapSections} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-heading font-bold text-primary-light">Prescription</h4>
                {medicines && medicines.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMedicationReminders}
                    disabled={addingReminders || remindersAdded}
                    className="gap-1.5 text-xs font-medium"
                  >
                    {addingReminders ? (
                      <>
                        <Loader2 size={14} className="animate-spin inline" /> Setting...
                      </>
                    ) : remindersAdded ? (
                      <>
                        <Check size={14} className="text-doctor-emerald inline" /> Reminders Set
                      </>
                    ) : (
                      <>
                        <Bell size={14} className="inline text-doctor-cyan" /> Set Reminders
                      </>
                    )}
                  </Button>
                )}
              </div>
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