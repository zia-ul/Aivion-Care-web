'use client';

import { useEffect, useState } from 'react';
import { appointmentApi, doctorApi } from '@/lib/api/endpoints';
import { staffAppointmentApi } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, Select } from '@/components/ui';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface DoctorOption {
  id: number;
  name?: string;
  speciality?: string;
}

interface AppointmentRow {
  id?: number;
  patientId?: number;
  patientName?: string;
  doctorId?: number;
  doctorName?: string;
  departmentName?: string;
  appointmentDate?: string;
  slotTime?: string;
  status?: string;
}

export default function ReceptionistAppointmentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    appointmentDate: '',
    slotTime: '',
    notes: '',
  });

  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    setLoading(true);
    try {
      const doctorsPromise = Number.isFinite(hospitalId)
        ? doctorApi.search({ hospitalId })
        : Promise.resolve({ data: [] });
      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentApi.getMyAppointments(),
        doctorsPromise,
      ]);
      setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
      setForm((previous) => ({ ...previous }));
    } catch {
      toast.error('Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!Number.isFinite(hospitalId)) {
      toast.error('Hospital ID is missing from your profile');
      return;
    }
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.slotTime) {
      toast.error('Patient, doctor, date and slot time are required');
      return;
    }
    setBooking(true);
    try {
      await staffAppointmentApi.staffBook({
        hospitalId,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        appointmentDate: form.appointmentDate,
        slotTime: form.slotTime,
        notes: form.notes || undefined,
      });
      toast.success('Appointment booked');
      setForm({ patientId: '', doctorId: '', departmentId: '', appointmentDate: '', slotTime: '', notes: '' });
      await load();
    } catch {
      toast.error('Unable to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const updateStatus = async (id: number | undefined, status: string) => {
    if (!id) return;
    try {
      await appointmentApi.updateStatus(id, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      await load();
    } catch {
      toast.error('Unable to update appointment');
    }
  };


  return (
    <AppLayout role="RECEPTIONIST" title="Appointments" subtitle="Book and manage hospital appointments">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4">Book appointment for a patient</h2>
          <form onSubmit={submitBooking} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Patient ID" value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })} placeholder="Patient ID" required />
            <Select
              label="Doctor"
              value={form.doctorId}
              onChange={(event) => setForm({ ...form, doctorId: event.target.value })}
              options={[
                { value: '', label: 'Select doctor' },
                ...doctors.map((doctor) => ({
                  value: String(doctor.id),
                  label: `${doctor.name ?? `Doctor ${doctor.id}`}${doctor.speciality ? ` · ${doctor.speciality}` : ''}`,
                })),
              ]}
              required
            />
            <Input label="Department ID (optional)" value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })} placeholder="Department ID" />
            <Input label="Date" type="date" value={form.appointmentDate} onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })} required />
            <Input label="Slot time" type="time" value={form.slotTime} onChange={(event) => setForm({ ...form, slotTime: event.target.value })} required />
            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit" loading={booking}><Plus size={16} className="mr-2" /> Book appointment</Button>
            </div>
          </form>
        </Card>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <h3 className="text-heading font-bold text-primary-light mb-4">Hospital appointments</h3>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-body text-primary-light/60">No appointments found for this hospital scope.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment, index) => (
                <div key={appointment.id ?? index} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-10/50 rounded-xl">
                  <div>
                    <p className="font-medium text-primary-light">{appointment.patientName ?? `Patient ${appointment.patientId ?? ''}`}</p>
                    <p className="text-sm text-primary-light/60">
                      {appointment.doctorName ?? 'Doctor'} · {appointment.appointmentDate ?? ''} {appointment.slotTime ?? ''}
                    </p>
                    {appointment.status ? <p className="text-xs text-primary-light/50">Status: {appointment.status}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(appointment.id, 'CONFIRMED')}>Confirm</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(appointment.id, 'CANCELLED')}>Cancel</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}