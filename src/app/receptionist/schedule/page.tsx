'use client';

import { useEffect, useState } from 'react';
import { appointmentApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { StatCard, StatusBadge } from '@/components/ui';
import { LayoutDashboard, Calendar, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface AppointmentRow {
  id?: number;
  patientName?: string;
  patientId?: number;
  doctorName?: string;
  departmentName?: string;
  appointmentDate?: string;
  slotTime?: string;
  status?: string;
  type?: string;
}

export default function ReceptionistSchedulePage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await appointmentApi.getMyAppointments();
        const rows = Array.isArray(data) ? data : [];
        setAppointments(rows.filter((row) => !selectedDate || !row.appointmentDate || String(row.appointmentDate).slice(0, 10) === selectedDate));
      } catch {
        toast.error('Unable to load daily schedule');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  return (
    <AppLayout role="RECEPTIONIST" title="Daily Schedule" subtitle="Hospital appointments by day">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-primary-light/70" htmlFor="receptionist-date">Date</label>
          <input
            id="receptionist-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-input border border-tonal-20/60 bg-surface-20 px-3 py-2 text-sm text-primary-light"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <StatCard key={i} label="Loading..." value="—" icon={LayoutDashboard} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-8 text-center text-body text-primary-light/60">
            No appointments scheduled for {selectedDate}.
          </div>
        ) : (
          <div className="space-y-2">
            {appointments.map((appointment, index) => (
              <div key={appointment.id ?? index} className="flex items-center justify-between gap-4 p-3 bg-surface-20/80 border border-tonal-20/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm font-medium text-primary-light/70">{appointment.slotTime ?? ''}</span>
                  <div>
                    <p className="font-medium text-primary-light flex items-center gap-2"><Users size={14} /> {appointment.patientName ?? `Patient ${appointment.patientId ?? ''}`}</p>
                    <p className="text-sm text-primary-light/60 flex items-center gap-2">
                      <Calendar size={13} /> {appointment.doctorName ?? 'Doctor'}
                      {appointment.departmentName ? ` · ${appointment.departmentName}` : ''}
                      {appointment.type ? ` · ${appointment.type}` : ''}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-sm text-primary-light/60">
                  <Clock size={14} />
                  <StatusBadge status={appointment.status ?? 'SCHEDULED'} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
