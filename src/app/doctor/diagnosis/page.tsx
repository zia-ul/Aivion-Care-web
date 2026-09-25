'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { appointmentApi } from '@/lib/api/endpoints';
import { ActionButton, DarkCard, Pill, FL } from '@/components/ui/FlutterTheme';
import { BrainCircuit, FileText } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

interface Appointment {
  id: number;
  patientName?: string;
  appointmentDate?: string;
  slotTime?: string;
  status?: string;
}

export default function DoctorDiagnosisPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.doctorId) return;
    appointmentApi.getDoctorToday()
      .then(({ data }) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [user?.doctorId]);

  return (
    <AppLayout role="DOCTOR" title="AI Diagnosis" subtitle="Transcription, notes, and prescription assistance">
      <div className="space-y-5">
        <DarkCard>
          <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#A8A4E7]/15 text-[#A8A4E7]"><BrainCircuit size={21} /></div><div><h2 className="font-bold text-white">AI-assisted consultation workflow</h2><p className="mt-1 text-sm leading-6 text-[#8AB0C0]">Open an appointment to upload audio, generate a transcript, create clinical notes, review medicines, and finalize the prescription. AI supports your clinical judgment.</p></div></div>
        </DarkCard>
        <div><h2 className="mb-3 text-lg font-bold text-white">Today&apos;s consultation queue</h2>{loading ? <p className="text-sm text-[#5B7A88]">Loading appointments...</p> : appointments.length === 0 ? <DarkCard><p className="text-sm text-[#8AB0C0]">No consultations scheduled today.</p></DarkCard> : <div className="space-y-3">{appointments.map((appointment) => <DarkCard key={appointment.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-white">{appointment.patientName ?? 'Patient'}</p><p className="mt-1 text-xs text-[#8AB0C0]">{appointment.appointmentDate} at {String(appointment.slotTime ?? '').slice(0, 5)}</p></div><div className="flex items-center gap-2"><Pill color={FL.blue}>{appointment.status ?? 'Scheduled'}</Pill><ActionButton onClick={() => router.push(`/doctor/consultation/${appointment.id}`)}><span className="inline-flex items-center gap-1.5"><FileText size={15} /> Open AI workflow</span></ActionButton></div></div></DarkCard>)}</div>}</div>
      </div>
    </AppLayout>
  );
}
