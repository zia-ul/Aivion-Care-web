'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select, Textarea } from '@/components/ui';
import { Building2, Eye, EyeOff, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';

export default function RegisterHospitalPage() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    registrationNumber: '',
    email: '',
    phone: '',
    facilityType: 'HOSPITAL',
    headName: '',
    headEmail: '',
    headPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authApi.registerHospital(form);
      toast.success('Hospital registration submitted! Please wait for approval.');
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
            <h1 className="text-headline font-extrabold text-accent mb-1">Hospital / Clinic Registration</h1>
            <p className="text-body text-primary-light/70">Register your facility and primary administrator</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-card border border-tonal-20/70 bg-surface-20/60 p-4">
              <p className="text-body font-semibold text-primary-light">Facility profile</p>
              <p className="mt-1 text-support text-primary-light/60">Hospital or clinic details.</p>
              <Select
                label="Facility Type"
                value={form.facilityType}
                onChange={(e) => update('facilityType', e.target.value)}
                options={[
                  { value: 'HOSPITAL', label: 'Hospital' },
                  { value: 'CLINIC', label: 'Clinic' },
                  { value: 'DIAGNOSTIC_CENTER', label: 'Diagnostic Center' },
                ]}
              />
              <Input icon={<Building2 size={17} />} label="Facility Name" placeholder="Enter facility name" required value={form.name} onChange={(e) => update('name', e.target.value)} className="sm:col-span-2" />
              <Input label="Registration Number (Optional)" value={form.registrationNumber} onChange={(e) => update('registrationNumber', e.target.value)} className="sm:col-span-2" />
              <Input icon={<Mail size={17} />} label="Facility Email" type="email" placeholder="facility@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Facility Phone" placeholder="Facility phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Administrator contact</p><p className="text-support text-primary-light/55">First admin for the facility account.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<UserRound size={17} />} label="Administrator Full Name" placeholder="Hospital head name" required value={form.headName} onChange={(e) => update('headName', e.target.value)} />
              <Input icon={<Mail size={17} />} label="Administrator Email" type="email" placeholder="head@example.com" required value={form.headEmail} onChange={(e) => update('headEmail', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Administrator Phone" placeholder="Head phone number" required value={form.headPhone} onChange={(e) => update('headPhone', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Location</p><p className="text-support text-primary-light/55">Optional now, useful for approvals and discovery.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea label="Address" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className="sm:col-span-2" rows={4} />
              <Input label="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Input label="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
              <Input label="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
              <Input label="Pincode" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Security</p><p className="text-support text-primary-light/55">Protect the admin account with a strong password.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Password" placeholder="Create a strong password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Confirm Password" placeholder="Re-enter your password" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /><button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Submitting...' : 'Register Hospital'}</Button>
          </form>
          <p className="mt-4 text-center text-body text-primary-light/70">Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}
