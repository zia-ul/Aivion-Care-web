'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verificationApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input } from '@/components/ui';
import { KeyRound, Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your email or registered phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await verificationApi.sendOtp(identifier.trim());
      toast.success(res.data?.message || 'Verification code sent!');
      setStep('VERIFY');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await verificationApi.resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success('Password reset successfully! Please sign in with your new credentials.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-bg px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-info/10 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white shadow-[0_10px_30px_rgba(34,211,197,0.22)]">
            <KeyRound size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent/80">Account Security</p>
          <h1 className="mt-2 text-headline font-extrabold tracking-tight text-primary-light">Reset Password</h1>
          <p className="mt-2 text-body text-primary-light/60">
            {step === 'REQUEST'
              ? 'Enter your registered email or phone to receive a secure recovery code.'
              : 'Enter the 6-digit verification code and your new password.'}
          </p>
        </div>

        <Card padding="lg" className="border-accent/15 bg-surface-20/90 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          {step === 'REQUEST' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <Input
                icon={<Mail size={17} />}
                label="Registered Email or Mobile"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. name@hospital.com or +91..."
                required
              />

              <div className="rounded-xl border border-tonal-20 bg-surface-20 p-3 text-xs leading-5 text-primary-light/60">
                <span className="block font-bold text-primary-light">Super Admin Recovery:</span>
                Super Admin credentials can only be recovered via primary authorized email (<code className="text-teal-600 dark:text-teal-300">ziaulislam83413@gmail.com</code>).
              </div>

              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? 'Sending Code…' : 'Send Recovery Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} /> Code sent to {identifier}
              </div>

              <Input
                icon={<KeyRound size={17} />}
                label="6-Digit Verification Code (OTP)"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 492018"
                required
              />

              <Input
                icon={<KeyRound size={17} />}
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />

              <Input
                icon={<KeyRound size={17} />}
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />

              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? 'Updating Password…' : 'Set New Password'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="w-full text-center text-xs text-primary-light/50 hover:text-accent transition-colors pt-2"
              >
                Change identifier or re-send code
              </button>
            </form>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/10 bg-accent/5 p-3.5 text-xs leading-5 text-primary-light/50">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span>Multi-channel OTP encryption protects account integrity across all healthcare roles.</span>
          </div>
        </Card>

        <p className="mt-6 text-center text-body text-primary-light/60">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-accent transition hover:text-accent/80 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
