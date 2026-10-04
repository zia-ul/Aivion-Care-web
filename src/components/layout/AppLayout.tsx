'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

export default function AppLayout({ children, role, title, subtitle }: { children: ReactNode; role: string; title: string; subtitle?: string }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const actualRole = user?.role;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!actualRole) return;
    // Doctor role: allow DOCTOR, SUPER_ADMIN, HOSPITAL_HEAD
    if (role === 'DOCTOR' && !['DOCTOR', 'SUPER_ADMIN', 'HOSPITAL_HEAD'].includes(actualRole)) {
      router.replace(actualRole === 'PATIENT' ? '/patient/dashboard' : '/login');
    }
    // Patient role: allow PATIENT, SUPER_ADMIN
    if (role === 'PATIENT' && !['PATIENT', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace(['DOCTOR', 'HOSPITAL_HEAD'].includes(actualRole) ? '/doctor/dashboard' : '/login');
    }
    // Hospital Head role: allow HOSPITAL_HEAD, SUPER_ADMIN
    if (role === 'HOSPITAL_HEAD' && !['HOSPITAL_HEAD', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace('/login');
    }
    // Pharmacist role: allow PHARMACY, SUPER_ADMIN
    if (role === 'PHARMACY' && !['PHARMACY', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace('/login');
    }
    // Pathology role: allow PATHOLOGY, SUPER_ADMIN
    if (role === 'PATHOLOGY' && !['PATHOLOGY', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace('/login');
    }
    // Lab Assistant role: allow LAB_ASSISTANT, SUPER_ADMIN
    if (role === 'LAB_ASSISTANT' && !['LAB_ASSISTANT', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace('/login');
    }
    // Receptionist role: allow RECEPTIONIST, SUPER_ADMIN
    if (role === 'RECEPTIONIST' && !['RECEPTIONIST', 'SUPER_ADMIN'].includes(actualRole)) {
      router.replace('/login');
    }
    // Super Admin role: only SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && actualRole !== 'SUPER_ADMIN') {
      router.replace('/login');
    }
    // Redirect unapproved doctors to approval-pending
    if (role === 'DOCTOR' && actualRole === 'DOCTOR' && user?.doctorApproved !== true) {
      router.replace('/approval-pending');
    }
  }, [actualRole, role, router, user?.doctorApproved]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-bg px-6">
        <div className="flex items-center gap-3 text-body text-primary-light/60" role="status">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative min-h-screen bg-gradient-bg text-primary-light">
      <a href="#main-content" className="sr-only absolute left-4 top-4 z-[60] rounded-lg bg-accent-fill px-4 py-2 text-sm font-bold text-white focus:not-sr-only">Skip to content</a>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(34,211,197,0.07),transparent_28%)]" aria-hidden="true" />
      <div className="flex min-h-screen">
        <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
          <Sidebar role={role} />
        </div>

        <div className="min-w-0 flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:ml-64 md:pb-0">
          <Header title={title} subtitle={subtitle} />
          <main id="main-content" className="mx-auto w-full max-w-container px-4 py-5 sm:px-5 md:px-7 md:py-8">
            {children}
          </main>
        </div>
      </div>

      <BottomNav role={role} />
    </div>
  );
}
