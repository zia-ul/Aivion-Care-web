'use client';

import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, StatusBadge } from '@/components/ui';
import { ShieldCheck, RefreshCw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface DoctorRow {
  id?: number;
  name?: string;
  speciality?: string;
}

export default function HospitalHeadStaffApprovalPage() {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Unable to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Staff Approval" subtitle="Onboarding status of hospital staff">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading font-bold text-primary-light">Staff linked to this hospital ({doctors.length})</h3>
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading staff...</p>
          ) : doctors.length === 0 ? (
            <p className="text-body text-primary-light/60">No staff records available for this hospital.</p>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between gap-3 p-4 bg-surface-10/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-amber-500/10 rounded-lg"><ShieldCheck size={18} className="text-amber-500" /></span>
                    <div>
                      <p className="font-medium text-primary-light">{doctor.name ?? `Doctor #${doctor.id}`}</p>
                      <p className="text-sm text-primary-light/60">{doctor.speciality ?? 'General'}</p>
                    </div>
                  </div>
                  <StatusBadge status="ACTIVE" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-card border border-accent/25 bg-accent/[0.06] p-5 flex items-start gap-3">
          <Info size={18} className="mt-0.5 text-accent" />
          <p className="text-sm leading-6 text-primary-light/70">
            Doctor verification and pharmacy/lab onboarding decisions are reviewed by platform administrators.
            Hospital heads review credentials here and forward exceptions to the admin approval queue.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}