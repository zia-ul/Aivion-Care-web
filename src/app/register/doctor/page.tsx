'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select } from '@/components/ui';
import { BadgeCheck, Building2, CircleDollarSign, Eye, EyeOff, Mail, Phone, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';

interface HospitalOption {
  id: number;
  name: string;
  city?: string;
}

export default function RegisterDoctorPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', speciality: '', licenseNumber: '', qualification: '', experienceYears: '', consultationFee: '', clinicName: '', hospitalId: '', privacyPolicyAccepted: false });
  const [loading, setLoading] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);
  const [isHospitalDoctor, setIsHospitalDoctor] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    const loadHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const { data } = await authApi.getHospitals();
        setHospitals(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Unable to load hospitals. You can register as an independent clinic doctor.');
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
      // Backend DoctorRegisterRequest: consultationFee is BigDecimal, hospitalId optional; no confirmPassword.
      const { confirmPassword: _omit, ...rest } = form;
      await authApi.registerDoctor({ ...rest, experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined, consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined, hospitalId: isHospitalDoctor && form.hospitalId ? Number(form.hospitalId) : undefined, clinicName: isHospitalDoctor ? undefined : form.clinicName });
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
            <Link href="/login" className="rounded-input border border-accent/50 px-4 py-2 text-sm font-bold text-accent transition hover:bg-accent-fill hover:text-white">Sign in</Link>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-headline font-extrabold text-accent mb-1">Doctor Registration</h1>
            <p className="text-body text-primary-light/70">Create your doctor account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-card border border-tonal-20/70 bg-surface-20/60 p-4">
              <p className="text-body font-semibold text-primary-light">Practice setup</p>
              <p className="mt-1 text-support text-primary-light/60">Choose whether you are joining a hospital or registering an independent clinic.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setIsHospitalDoctor(true)} className={`rounded-input border px-3 py-2 text-sm font-semibold ${isHospitalDoctor ? 'border-accent bg-accent/10 text-accent' : 'border-tonal-20 text-primary-light/60'}`}>Within hospital</button>
                <button type="button" onClick={() => setIsHospitalDoctor(false)} className={`rounded-input border px-3 py-2 text-sm font-semibold ${!isHospitalDoctor ? 'border-accent bg-accent/10 text-accent' : 'border-tonal-20 text-primary-light/60'}`}>Independent clinic</button>
              </div>
              {isHospitalDoctor ? (
                <div className="mt-3"><Select label="Select Hospital" required value={form.hospitalId} onChange={(e) => update('hospitalId', e.target.value)} disabled={loadingHospitals} options={[{ value: '', label: loadingHospitals ? 'Loading hospitals...' : 'Select hospital' }, ...hospitals.map((hospital) => ({ value: String(hospital.id), label: hospital.city ? `${hospital.name} | ${hospital.city}` : hospital.name }))]} /></div>
              ) : (
                <div className="mt-3"><Input icon={<Building2 size={17} />} label="Clinic Name" placeholder="Enter your clinic name" required value={form.clinicName} onChange={(e) => update('clinicName', e.target.value)} /></div>
              )}
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Professional profile</p><p className="text-support text-primary-light/55">Add your clinical identity and practice details.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input icon={<UserRound size={17} />} label="Full Name" placeholder="Enter your full name" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <Input icon={<Mail size={17} />} label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              <Input icon={<Phone size={17} />} label="Phone" placeholder="Enter your phone number" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              <Input icon={<Stethoscope size={17} />} label="Speciality" placeholder="e.g. Cardiology" required value={form.speciality} onChange={(e) => update('speciality', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="License Number" placeholder="Medical license number" required value={form.licenseNumber} onChange={(e) => update('licenseNumber', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="Qualification" placeholder="e.g. MBBS, MD" value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
              <Input icon={<BadgeCheck size={17} />} label="Experience (years)" placeholder="Years of experience" type="number" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} />
              <Input icon={<CircleDollarSign size={17} />} label="Consultation Fee" placeholder="Enter fee amount" value={form.consultationFee} onChange={(e) => update('consultationFee', e.target.value)} />
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Password" placeholder="Create a strong password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              <div className="relative"><Input icon={<ShieldCheck size={17} />} className="pr-12" label="Confirm Password" placeholder="Re-enter your password" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} /><button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-[2.65rem] z-10 text-primary-light/80 hover:text-accent">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <div className="border-b border-tonal-20/50 pb-1 pt-2"><p className="text-heading font-bold text-primary-light">Security</p><p className="text-support text-primary-light/55">Protect your doctor account with a strong password.</p></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="privacy" checked={form.privacyPolicyAccepted} onChange={(e) => update('privacyPolicyAccepted', e.target.checked)} className="w-4 h-4 rounded border-tonal-20 bg-surface-20 text-accent focus:ring-accent" />
              <label htmlFor="privacy" className="text-body text-primary-light/80">I accept the privacy policy and terms of service. Healthcare data is handled with role-based access and secure authentication.</label>
            </div>
            <details className="rounded-input border border-tonal-20/70 bg-surface-20/50 px-4 py-3 text-support text-primary-light/65">
              <summary className="cursor-pointer font-semibold text-primary-light">Read privacy and security details</summary>
              <p className="mt-2 leading-5">Your registration details are used to create and verify your healthcare account. Access to patient and clinical information is controlled by your role. Use a strong password and never share your login credentials.</p>
            </details>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Creating Account...' : 'Register'}</Button>
          </form>
          <p className="mt-4 text-center text-body text-primary-light/70">Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </Card>
      </div>
    </div>
  );
}
