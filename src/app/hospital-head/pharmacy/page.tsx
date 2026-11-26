'use client';

import { useEffect, useState } from 'react';
import { pharmacyDirectoryApi, staffRegistrationApi } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, PasswordRequirements } from '@/components/ui';
import { ValidationHelpers } from '@/lib/helpers/validation';
import { Pill, RefreshCw, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface PharmacyRow {
  id: number;
  hospitalId?: number;
  name?: string;
  city?: string;
  state?: string;
  phone?: string;
}

export default function HospitalHeadPharmacyPage() {
  const { user } = useAuthStore();
  const [rows, setRows] = useState<PharmacyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ pharmacyName: '', email: '', phone: '', password: '' });
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pharmacyDirectoryApi.list();
      const list = Array.isArray(data) ? data : [];
      setRows(Number.isFinite(hospitalId) ? list.filter((row) => row.hospitalId === hospitalId) : list);
    } catch {
      toast.error('Unable to load pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!Number.isFinite(hospitalId)) {
      toast.error('Hospital ID is missing from your profile');
      return;
    }
    const pharmacyNameCheck = ValidationHelpers.validateTextLength(form.pharmacyName, 'Pharmacy name', 2, 100);
    if (!pharmacyNameCheck.isValid) return toast.error(pharmacyNameCheck.error!);

    const emailCheck = ValidationHelpers.validateEmail(form.email, 'Email');
    if (!emailCheck.isValid) return toast.error(emailCheck.error!);

    const phoneCheck = ValidationHelpers.validatePhone(form.phone, 'Phone');
    if (!phoneCheck.isValid) return toast.error(phoneCheck.error!);

    const passCheck = ValidationHelpers.validatePassword(form.password, 'Password');
    if (!passCheck.isValid) return toast.error(passCheck.error!);

    setRegistering(true);
    try {
      const { data } = await staffRegistrationApi.registerPharmacy({
        hospitalId,
        pharmacyName: pharmacyNameCheck.sanitizedValue || form.pharmacyName.trim(),
        email: emailCheck.sanitizedValue || form.email.trim(),
        phone: phoneCheck.sanitizedValue || form.phone.trim(),
        password: form.password,
      });
      toast.success(`Pharmacy created · Login ID: ${data.loginId}`);
      setForm({ pharmacyName: '', email: '', phone: '', password: '' });
      await load();
    } catch {
      toast.error('Unable to register pharmacy');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Pharmacy" subtitle="Hospital pharmacy accounts">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4">Register a hospital pharmacy</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input label="Pharmacy name" placeholder="Hospital Pharmacy Name" value={form.pharmacyName} onChange={(event) => setForm({ ...form, pharmacyName: event.target.value })} required />
              <Input label="Email" type="email" placeholder="pharmacy@hospital.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              <Input label="Phone" placeholder="10-digit mobile" filterType="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
              <Input label="Password" type="password" placeholder="Create strong password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </div>
            <PasswordRequirements password={form.password} />
            <div>
              <Button type="submit" loading={registering}><UserPlus size={16} className="mr-2" /> Register pharmacy</Button>
            </div>
          </form>
        </Card>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading font-bold text-primary-light">Pharmacies ({rows.length})</h3>
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
          {loading ? (
            <p className="text-body text-primary-light/60">Loading pharmacies...</p>
          ) : rows.length === 0 ? (
            <p className="text-body text-primary-light/60">No pharmacies linked to this hospital yet.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="flex items-center gap-3 p-4 bg-surface-10/50 rounded-xl">
                  <span className="p-2 bg-green-500/10 rounded-lg"><Pill size={18} className="text-green-500" /></span>
                  <div>
                    <p className="font-medium text-primary-light">{row.name ?? `Pharmacy #${row.id}`}</p>
                    <p className="text-sm text-primary-light/60">
                      {[row.city, row.state].filter(Boolean).join(', ')}{row.phone ? ` · ${row.phone}` : ''}
                    </p>
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
