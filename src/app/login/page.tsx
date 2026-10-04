'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import { getRoleHomePath } from '@/lib/helpers';
import { useAuthStore } from '@/lib/stores/auth';
import toast from 'react-hot-toast';
import { Card, Button, Input } from '@/components/ui';
import { Eye, EyeOff, HeartPulse, KeyRound, Mail, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      toast.error('Enter login ID and password');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.login({ loginId: loginId.trim(), password });
      const data = response.data;
      if (!data?.accessToken || !data?.user) {
        throw new Error('Invalid login response from server');
      }
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      useAuthStore.getState().setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      const role = data.user.role;
      if (role === 'DOCTOR' && data.user.doctorApproved !== true) {
        router.push('/approval-pending');
      } else {
        router.push(getRoleHomePath(role));
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        (error?.code === 'ERR_NETWORK'
          ? 'Cannot reach backend at http://localhost:8080. Start the backend first.'
          : 'Login failed');
      toast.error(msg);
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
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-fill text-white shadow-[0_10px_30px_rgba(34,211,197,0.22)]">
            <HeartPulse size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent/75">Aivion Care</p>
          <h1 className="mt-2 text-headline font-extrabold tracking-tight text-primary-light">Welcome back</h1>
          <p className="mt-2 text-body text-primary-light/55">Sign in to continue to your care workspace.</p>
        </div>

        <Card padding="lg" className="border-accent/15 bg-surface-20/90 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input icon={<Mail size={17} />} label="Login ID or email" type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="Enter login ID or email" autoComplete="username" required />
            <div className="relative">
              <Input icon={<KeyRound size={17} />} className="pr-12" label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-[2.65rem] z-10 rounded-lg p-1.5 text-primary-light/70 transition hover:bg-surface-30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? 'Signing in…' : 'Sign in securely'}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/10 bg-accent/5 p-3.5 text-xs leading-5 text-primary-light/50">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span>Your health information is protected with a secure, private workspace.</span>
          </div>
        </Card>

        <p className="mt-6 text-center text-body text-primary-light/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-accent transition hover:text-accent/80 hover:underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
