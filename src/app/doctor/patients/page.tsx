'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { Users } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';

interface Patient { patientId: number; patientName: string; lastAppointmentDate?: string; appointmentId?: number; chatRoomId?: number | null; patientUserId?: number | null; }

export default function DoctorPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Backend: GET /api/v1/doctors/my-patients (doctorId comes from JWT, no path param).
        const res = await doctorApi.getMyPatients();
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppLayout role="DOCTOR" title="My Patients" subtitle="Patients under your care">
      <div className="space-y-6">
        <Card>
          <h3 className="text-heading font-bold text-primary-light mb-4">Patient List</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-body text-primary-light/60">Loading...</p>
            </div>
          ) : patients.length === 0 ? (
            <EmptyState icon={Users} title="No patients yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {patients.map((patient) => (
                <div key={patient.patientId} className="p-4 bg-surface-10/50 rounded-xl border border-tonal-20/30">
                  <p className="font-semibold text-primary-light">{patient.patientName}</p>
                  <p className="text-support text-primary-light/60">Patient #{patient.patientId}</p>
                  {patient.lastAppointmentDate && <p className="text-support text-primary-light/50">Last visit: {patient.lastAppointmentDate}</p>}
                  {patient.chatRoomId && <p className="text-support text-primary-light/50">Chat room #{patient.chatRoomId}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
