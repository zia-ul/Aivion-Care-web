'use client';

import { useEffect, useState } from 'react';
import { hospitalProfileApi, HospitalProfile } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input } from '@/components/ui';
import { Users, RefreshCw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalHeadDepartmentsPage() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<string[]>([]);
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    if (!Number.isFinite(hospitalId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [profileRes, servicesRes] = await Promise.allSettled([
        hospitalProfileApi.get(hospitalId),
        hospitalProfileApi.getServices(hospitalId),
      ]);
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
      if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value.data)) setServices(servicesRes.value.data);
    } catch {
      toast.error('Unable to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Departments" subtitle="Services and departments of this hospital">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-cyan-500/10 rounded-xl"><Users size={20} className="text-cyan-500" /></span>
            <div>
              <h2 className="text-heading font-bold text-primary-light">{profile?.name ?? 'This hospital'}</h2>
              <p className="text-sm text-primary-light/60 mt-1">
                {[profile?.address, profile?.city, profile?.state].filter(Boolean).join(', ') || 'Address not available'}
              </p>
              {profile?.facilityType ? <p className="text-sm text-primary-light/50 mt-1">Facility: {profile.facilityType}</p> : null}
            </div>
          </div>
        </Card>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading font-bold text-primary-light">Active services ({services.length})</h3>
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-body text-primary-light/60">No active services reported for this hospital.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service) => (
                <div key={service} className="flex items-center gap-2 p-3 bg-surface-10/50 rounded-xl text-body text-primary-light">
                  <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" /> {service}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-card border border-accent/25 bg-accent/[0.06] p-5 flex items-start gap-3">
          <Info size={18} className="mt-0.5 text-accent" />
          <p className="text-sm leading-6 text-primary-light/70">
            Department-level creation and staffing controls are managed by the platform while the hospital
            directory API is being extended. Current data shown here comes from the hospital profile endpoint.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}