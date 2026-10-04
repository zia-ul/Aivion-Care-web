'use client';

import { useEffect, useState } from 'react';
import { hospitalProfileApi, HospitalProfile } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { Building2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalHeadProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: '',
  });
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  useEffect(() => {
    const load = async () => {
      if (!Number.isFinite(hospitalId)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await hospitalProfileApi.get(hospitalId);
        setProfile(data);
        setForm({
          name: data.name ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          country: data.country ?? '',
          pincode: data.pincode ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
        });
      } catch {
        toast.error('Unable to load hospital profile');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!Number.isFinite(hospitalId)) return;
    setSaving(true);
    try {
      const { data } = await hospitalProfileApi.update(hospitalId, form);
      setProfile(data);
      toast.success('Hospital profile updated');
    } catch {
      toast.error('Unable to update hospital profile');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: keyof typeof form) => (
    <Input
      label={label}
      value={form[label]}
      onChange={(event) => setForm({ ...form, [label]: event.target.value })}
    />
  );

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Hospital Profile" subtitle="Manage hospital identity and contact details">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-blue-500/10 rounded-xl"><Building2 size={20} className="text-blue-500" /></span>
              <div>
                <h2 className="text-heading font-bold text-primary-light">{profile?.name ?? 'Hospital profile'}</h2>
                <p className="text-sm text-primary-light/60">{profile?.registrationNumber ?? '—'}</p>
              </div>
            </div>
            {profile?.status ? <StatusBadge status={profile.status} /> : null}
          </div>

          {loading ? (
            <p className="text-body text-primary-light/60">Loading profile...</p>
          ) : !Number.isFinite(hospitalId) ? (
            <p className="text-body text-primary-light/60">No hospital is linked to your account.</p>
          ) : (
            <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('name')}
              <Input label="Registration number" value={profile?.registrationNumber ?? ''} readOnly />
              <div className="sm:col-span-2">{field('address')}</div>
              {field('city')}
              {field('state')}
              {field('country')}
              {field('pincode')}
              {field('phone')}
              {field('email')}
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}><Save size={16} className="mr-2" /> Update profile</Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}