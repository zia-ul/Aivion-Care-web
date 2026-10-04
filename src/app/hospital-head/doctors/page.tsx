'use client';

import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input } from '@/components/ui';
import { Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface DoctorRow {
  id?: number;
  name?: string;
  speciality?: string;
  qualification?: string;
  experienceYears?: number;
  consultationFee?: number;
}

export default function HospitalHeadDoctorsPage() {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    if (!Number.isFinite(hospitalId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await doctorApi.search({ hospitalId });
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const visible = doctors.filter((doctor) => {
    if (!query.trim()) return true;
    return `${doctor.name ?? ''} ${doctor.speciality ?? ''} ${doctor.qualification ?? ''}`.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Doctors" subtitle="Doctors registered to this hospital">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-heading font-bold text-primary-light">Doctors ({doctors.length})</h2>
          <div className="flex items-end gap-3">
            <Input label="Search" placeholder="Name or speciality" value={query} onChange={(event) => setQuery(event.target.value)} />
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading doctors...</p>
        ) : visible.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No doctors found for this hospital.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((doctor) => (
              <Card key={doctor.id} className="p-5">
                <div className="flex items-start gap-4">
                  <span className="p-2 bg-blue-500/10 rounded-xl"><Users size={20} className="text-blue-500" /></span>
                  <div>
                    <h3 className="font-bold text-primary-light">{doctor.name ?? `Doctor #${doctor.id}`}</h3>
                    <p className="text-sm text-primary-light/60">{doctor.speciality ?? 'General'}</p>
                    <p className="text-xs text-primary-light/50 mt-2">
                      {doctor.qualification ? `${doctor.qualification} · ` : ''}
                      {doctor.experienceYears != null ? `${doctor.experienceYears} yrs · ` : ''}
                      {doctor.consultationFee != null ? `₹${doctor.consultationFee}` : ''}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}