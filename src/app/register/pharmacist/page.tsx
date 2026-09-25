'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select } from '@/components/ui';
import { BadgeCheck, Building2, Eye, EyeOff, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';

interface HospitalOption {
  id: number;
  name: string;
  city?: string;
  facilityType?: string;
}

const ATTACHED_TYPE = 'Attached Hospital / Clinic Pharmacy';
const INDEPENDENT_TYPE = 'Independent Pharmacy';

export default function RegisterPharmacistPage() {
  const [form, setForm] = useState({
    pharmacyType: ATTACHED_TYPE,
    pharmacyName: '',
    hospitalId: '',
    fullName: '',
    phone: '',
    email: '',
    pharmacistRegistrationNumber: '',
    qualification: '',
    registrationAuthority: '',
    drugLicenseNumber: '',
    licenseType: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    privacyPolicyAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const _requiresFacilityLink = form.pharmacyType === ATTACHED_TYPE;

  useEffect(() => {
    const loadHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const { data } = await authApi.getHospitals();
        setHospitals(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Unable to load hospitals. You can register as an independent pharmacy.');
      } finally {
        setLoadingHospitals(false);
      }
    };
    loadHospitals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!form.privacyPolicyAccepted) return toast.error('Accept privacy policy');
    setLoading(true);
    try {
      const { confirmPassword: _omit, ...rest } = form;
      const payload = {
        ...rest,
        hospitalId: _requiresFacilityLink && rest.hospitalId ? Number(rest.hospitalId) : undefined,
        pharmacyType: _requiresFacilityLink
          ? (hospitals.find(h => h.id === Number(rest.hospitalId))?.facilityType === 'CLINIC'
              ? 'ATTACHED_CLINIC_PHARMACY'
              : 'ATTACHED_HOSPITAL_PHARMACY')
          : 'INDEPENDENT_PHARMACY',
      };
      await authApi.registerPharmacist(payload);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg p-4">
      <div className="w-full max-w-lg">
        <Card>
          <div className="flex justify-end">
            <Link href="/login" className="rounded-input border border-accent/50 px-4 py-2 text-sm font-bold text-accent transition hover:bg-accent hover:text-tonal-0">Sign in</Link>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-headline font-extrabold text-accent mb-1">Pharmacist Registration</h1>
            <p className="text-body text-primary-light/70">Create your pharmacist account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-card border border-tonal-20/70 bg-surface-20/60 p-4">
              <p className="text-body font-semibold text-primary-light">Practice setup</p>
              <p className="mt-1 text-support text-primary-light/60">Choose pharmacy type and link a facility when needed.</p>
              <Select
                label="Pharmacy Type"
                value={form.pharmacyType}
                onChange={(e) => update('pharmacyType', e.target.value)}
                options={[
                  { value: ATTACHED_TYPE, label: 'Attached Hospital / Clinic Pharmacy' },
                  { value: INDEPENDENT_TYPE, label: 'Independent Pharmacy' },
                ]}
              />
              <Input
                icon={<Building2 size={17} />}
                label="Pharmacy Name"
                placeholder="Enter pharmacy name"
                required
                value={form.pharmacyName}
                onChange={(e) => update('pharmacyName', e.target.value)}
              />
              {_requiresFacilityLink && (
                <div className="mt-3">
                  <Select
                    label="Linked Hospital / Clinic"
                    required
                    value={form.hospitalId}
                    onChange={(e) => update('hospitalId', e.target.value)}
                    disabled={loadingHospitals}
                    options={[
                      { value: '', label: loadingHospitals ? 'Loading...' : 'Select hospital / clinic' },
                      ...hospitals
                        .filter((f) => f.facilityType === 'HOSPITAL' || f.facilityType === 'CLINIC' || !f.facilityType)
                        .map((h) => ({
                          value: String(h.id),
                          label: `${h.name}${h.city ? ` | ${h.city}` : ''}${h.facilityType ? ` | ${h.facilityType}` : ''}`,
                        })),
                    ]}
                  />
                </div>
              )}
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Identity and contact</p><p className="text-support text-primary-light/55">Details patients and teams will see.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<UserRound size={17} />} label="Full Name" placeholder="Enter your full name" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Mobile Number" placeholder="Enter mobile number" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Professional details</p><p className="text-support text-primary-light/55">Core pharmacist registration details.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<BadgeCheck size={17} />} label="Registered Pharmacist Registration Number" placeholder="Enter registration number" required value={form.pharmacistRegistrationNumber} onChange={(e) => update('pharmacistRegistrationNumber', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="Qualification" placeholder="e.g. B.Pharm, M.Pharm" required value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="Registration Authority" placeholder="e.g. State Pharmacy Council" required value={form.registrationAuthority} onChange={(e) => update('registrationAuthority', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Pharmacy license details</p><p className="text-support text-primary-light/55">License basics now; documents later.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<BadgeCheck size={17} />} label="Drug License Number" placeholder="Enter drug license number" required value={form.drugLicenseNumber} onChange={(e) => update('drugLicenseNumber', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="License Type" placeholder="e.g. Retail, Wholesale" required value={form.licenseType} onChange={(e) => update('licenseType', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="City" placeholder="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="Pincode" placeholder="Pincode" type="number" required value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Security</p><p className="text-support text-primary-light/55">Protect your account with a strong password.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Password" placeholder="Create a strong password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Confirm Password" placeholder="Re-enter your password" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /><button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="privacy" checked={form.privacyPolicyAccepted} onChange={(e) => update('privacyPolicyAccepted', e.target.checked)} className="w-4 h-4 rounded border-tonal-20 bg-surface-20 text-accent focus:ring-accent" />
              <label htmlFor="privacy" className="text-body text-primary-light/80">I accept the privacy policy and terms of service. My information is protected by secure authentication and role-based access.</label>
            </div>
            <details className="rounded-input border border-tonal-20/70 bg-surface-20/50 px-4 py-3 text-support text-primary-light/65">
              <summary className="cursor-pointer font-semibold text-primary-light">Read privacy and security details</summary>
              <p className="mt-2 leading-5">Your registration details are used to create and verify your pharmacy account. Access is controlled by your role. Use a strong password and never share login credentials.</p>
            </details>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Creating Account...' : 'Register Pharmacist'}</Button>
          </form>
          <p className="mt-4 text-center text-body text-primary-light/70">Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}