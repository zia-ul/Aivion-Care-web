'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Check, FlaskConical, HeartPulse, Pill, Stethoscope, UserRound, type LucideIcon } from 'lucide-react';
import { Button, Card } from '@/components/ui';

type Role = 'patient' | 'doctor' | 'hospital' | 'pharmacist' | 'pathology';
type RoleOption = { key: Role; label: string; description: string; icon: LucideIcon };

const roles: RoleOption[] = [
  { key: 'patient', label: 'Patient', description: 'Appointments, prescriptions and health records', icon: UserRound },
  { key: 'doctor', label: 'Doctor', description: 'Consultations, prescriptions and clinical tools', icon: Stethoscope },
  { key: 'hospital', label: 'Hospital / clinic', description: 'Facility, departments and staff management', icon: Building2 },
  { key: 'pharmacist', label: 'Pharmacist', description: 'Pharmacy setup, orders and inventory', icon: Pill },
  { key: 'pathology', label: 'Pathology / lab', description: 'Diagnostics, reports and sample workflows', icon: FlaskConical },
];

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('patient');
  const router = useRouter();
  const selected = roles.find((option) => option.key === role)!;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-dark px-4 py-5 sm:px-6 lg:py-8">
      <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Aivion Care home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-fill text-white"><HeartPulse size={21} /></span>
            <span className="font-extrabold tracking-tight">Aivion Care</span>
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-tonal-20 bg-surface-20/70 px-4 py-2.5 text-sm font-bold text-primary-light/75 transition hover:border-accent/40 hover:text-accent"><ArrowLeft size={16} /> Sign in</Link>
        </div>

        <Card padding="lg" className="mx-auto max-w-3xl border-primary-light/10 bg-surface-20/90 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent/75">Create workspace</p>
            <h1 className="mt-2 text-subtitle font-extrabold tracking-tight sm:text-headline">How will you use Aivion Care?</h1>
            <p className="mt-3 text-sm leading-6 text-primary-light/50">Choose your account type to continue to the correct registration and verification flow.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Account type">
            {roles.map((option) => {
              const Icon = option.icon;
              const active = role === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRole(option.key)}
                  className={`group flex min-h-[6.5rem] items-start gap-4 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${active ? 'border-accent/70 bg-accent/10 shadow-[inset_0_0_0_1px_rgba(34,211,197,0.15)]' : 'border-tonal-20/70 bg-surface-20/45 hover:-translate-y-0.5 hover:border-tonal-40 hover:bg-surface-20'}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${active ? 'bg-accent-fill text-white' : 'bg-surface-30 text-accent group-hover:bg-accent-fill/15'}`}><Icon size={21} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 font-bold text-primary-light">{option.label}{active && <Check size={17} className="text-accent" />}</span>
                    <span className="mt-1 block text-xs leading-5 text-primary-light/45">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-tonal-20/60 pt-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-sm text-primary-light/50"><Building2 size={17} className="text-accent/70" /><span>Registering as <strong className="text-primary-light">{selected.label}</strong></span></div>
            <Button size="lg" onClick={() => router.push(`/register/${role}`)}>Continue <ArrowRight size={18} /></Button>
          </div>
          <p className="mt-5 text-center text-sm text-primary-light/45">Already registered? <Link href="/login" className="font-bold text-accent hover:text-accent/80">Sign in to your workspace</Link></p>
        </Card>
      </div>
    </main>
  );
}
