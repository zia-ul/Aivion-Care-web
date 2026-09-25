'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select } from '@/components/ui';
import { CalendarDays, Eye, EyeOff, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react';

export default function RegisterPatientPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', dateOfBirth: '', gender: '', address: '', emergencyContactName: '', emergencyContactPhone: '', privacyPolicyAccepted: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!form.privacyPolicyAccepted) return toast.error('Accept privacy policy');
    setLoading(true);
    try {
      // Backend PatientRegisterRequest has no confirmPassword; do not send unknown field.
      const { confirmPassword: _omit, ...payload } = form;
      await authApi.registerPatient(payload);
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
            <h1 className="text-headline font-extrabold text-accent mb-1">Patient Registration</h1>
            <p className="text-body text-primary-light/70">Create your patient account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Personal profile</p><p className="text-support text-primary-light/55">Add the details used for appointments and care records.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input icon={<UserRound size={17} />} label="Full Name" placeholder="Enter your full name" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update('email', e.target.value)} />
                <Input icon={<Phone size={17} />} label="Phone" placeholder="Enter your phone number" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              <Input icon={<CalendarDays size={17} />} label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
              <Select label="Gender" value={form.gender} onChange={(e) => update('gender', e.target.value)} options={[{ value: '', label: 'Select' }, { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]} />
              <Input icon={<MapPin size={17} />} label="Address" placeholder="Where do you live?" value={form.address} onChange={(e) => update('address', e.target.value)} />
              <Input icon={<UserRound size={17} />} label="Emergency Contact Name" placeholder="Contact person" value={form.emergencyContactName} onChange={(e) => update('emergencyContactName', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Emergency Contact Phone" placeholder="Contact phone number" value={form.emergencyContactPhone} onChange={(e) => update('emergencyContactPhone', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Security</p><p className="text-support text-primary-light/55">Protect your patient account with a strong password.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Password" placeholder="Create a strong password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Confirm Password" placeholder="Re-enter your password" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /><button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="privacy" checked={form.privacyPolicyAccepted} onChange={(e) => update('privacyPolicyAccepted', e.target.checked)} className="w-4 h-4 rounded border-tonal-20 bg-surface-20 text-accent focus:ring-accent" />
              <label htmlFor="privacy" className="text-body text-primary-light/80">I accept the privacy policy and terms of service. My health information is protected by secure authentication and role-based access.</label>
            </div>
            <details className="rounded-input border border-tonal-20/70 bg-surface-20/50 px-4 py-3 text-support text-primary-light/65">
              <summary className="cursor-pointer font-semibold text-primary-light">Read privacy and security details</summary>
              <p className="mt-2 leading-5">Your personal and health details are used to provide healthcare services, appointments, records, and reminders. Access is limited by healthcare role. Use a strong password and never share your login credentials.</p>
            </details>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Creating Account...' : 'Register'}</Button>
          </form>
          <p className="mt-4 text-center text-body text-primary-light/70">Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}
