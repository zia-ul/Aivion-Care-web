'use client';

import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api/endpoints';
import { labDirectoryApi } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, StatCard, Button } from '@/components/ui';
import { Users, RefreshCw, UserCheck, Microscope, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalHeadReceptionistsPage() {
  const { user } = useAuthStore();
  const [doctorCount, setDoctorCount] = useState(0);
  const [labCount, setLabCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    if (!Number.isFinite(hospitalId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [doctorsRes, labsRes] = await Promise.allSettled([
        doctorApi.search({ hospitalId }),
        labDirectoryApi.searchLabAssistants(hospitalId),
      ]);
      setDoctorCount(doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value.data) ? doctorsRes.value.data.length : 0);
      setLabCount(labsRes.status === 'fulfilled' && Array.isArray(labsRes.value.data) ? labsRes.value.data.length : 0);
    } catch {
      toast.error('Unable to load staff counts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Receptionists" subtitle="Front desk staff directory">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Doctors" value={loading ? '—' : doctorCount} icon={UserCheck} />
          <StatCard label="Lab assistants" value={loading ? '—' : labCount} icon={Microscope} />
          <StatCard label="Receptionists" value="—" icon={Users} />
        </div>

        <Card className="p-8 text-center">
          <Users size={40} className="mx-auto text-primary-light/20 mb-4" />
          <p className="text-heading font-bold text-primary-light">Receptionist accounts are provisioned by the platform</p>
          <p className="text-body text-primary-light/60 mt-2 max-w-xl mx-auto">
            The web backend does not yet expose a receptionist directory or creation endpoint. Once the staff
            directory API is available, receptionist records will appear here with role assignment and
            enable/disable controls.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
        </Card>

        <div className="rounded-card border border-accent/25 bg-accent/[0.06] p-5 flex items-start gap-3">
          <Info size={18} className="mt-0.5 text-accent" />
          <p className="text-sm leading-6 text-primary-light/70">
            Lab and pharmacy accounts can already be created from the Lab Assistants and Pharmacy pages. Those
            registration responses include the generated login ID to share with staff.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}