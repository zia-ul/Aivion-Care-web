'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select } from '@/components/ui';
import { BadgeCheck, Eye, EyeOff, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';

export default function RegisterPathologyPage() {
  const [form, setForm] = useState({
    accountType: 'Owner Pathologist',
    fullName: '',
    labName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
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
      const { confirmPassword: _omit, ...payload } = form;
      await authApi.registerPathology(payload);
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
            <h1 className="text-headline font-extrabold text-accent mb-1">Pathology / Lab Registration</h1>
            <p className="text-body text-primary-light/70">Create your pathology account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-card border border-tonal-20/70 bg-surface-20/60 p-4">
              <p className="text-body font-semibold text-primary-light">Account setup</p>
              <p className="mt-1 text-support text-primary-light/60">Choose how this account relates to the diagnostic lab.</p>
              <Select
                label="Account type"
                value={form.accountType}
                onChange={(e) => update('accountType', e.target.value)}
                options={[
                  { value: 'Owner Pathologist', label: 'Owner Pathologist' },
                  { value: 'Lab Owner or Manager', label: 'Lab Owner or Manager' },
                  { value: 'Pathologist joining existing lab', label: 'Pathologist joining existing lab' },
                ]}
              />
              <Input
                icon={<BadgeCheck size={17} />}
                label="Lab / Pathology Name"
                placeholder="Enter lab or pathology name"
                required
                value={form.labName}
                onChange={(e) => update('labName', e.target.value)}
              />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Owner contact</p><p className="text-support text-primary-light/55">Primary contact for verification updates.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<UserRound size={17} />} label="Full Name" placeholder="Enter your full name" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Phone" placeholder="Enter your phone number" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Location</p><p className="text-support text-primary-light/55">Detailed address and pincodes come later.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<BadgeCheck size={17} />} label="City" placeholder="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="State" placeholder="State" required value={form.state} onChange={(e) => update('state', e.target.value)} />
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Security</p><p className="text-support text-primary-light/55">Protect your pathology account with a strong password.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Password" placeholder="Create a strong password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Confirm Password" placeholder="Re-enter your password" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /><button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Creating Account...' : 'Register Pathology'}</Button>
          </form>
          <p className="mt-4 text-center text-body text-primary-light/70">Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}