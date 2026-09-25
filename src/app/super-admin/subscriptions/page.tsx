'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { subscriptionApi } from '@/lib/api/endpoints';
import { AdminSubscriptionDashboard, DoctorAccess } from '@/types/subscription';

export default function SubscriptionGovernancePage() {
  const [dashboard, setDashboard] = useState<AdminSubscriptionDashboard | null>(null);
  const [error, setError] = useState('');
  const load = async () => {
    try {
      const res = await subscriptionApi.getAdminDashboard();
      setDashboard(res.data);
    } catch {
      setError('Unable to load subscription governance.');
    }
  };
  useEffect(() => { load(); }, []);
  const toggle = async (doctor: DoctorAccess) => {
    try {
      await subscriptionApi.setDoctorAppointmentWaiver(doctor.doctorId, { appointmentAccessWithoutSubscription: !doctor.appointmentAccessWithoutSubscription });
      await load();
    } catch {
      setError('Unable to update appointment access.');
    }
  };
  return <AppLayout role="SUPER_ADMIN" title="Subscription Governance" subtitle="See payments and grant appointment-only access when needed">
    {error && <p className="mb-4 text-red-400">{error}</p>}
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {[
        ['Active subscriptions', dashboard?.activeSubscriptions],
        ['Expired subscriptions', dashboard?.expiredSubscriptions],
        ['Razorpay revenue', `₹${dashboard?.totalRevenue || 0}`],
      ].map(([label, value]) => (
        <div key={String(label)} className="rounded-card border border-tonal-20/50 bg-surface-20/80 p-5">
          <p className="text-primary-light/60">{label}</p>
          <p className="mt-2 text-2xl font-bold text-primary-light">{value ?? '—'}</p>
        </div>
      ))}
    </div>
    <div className="overflow-x-auto rounded-card border border-tonal-20/50 bg-surface-20/80">
      <table className="min-w-full text-left text-sm">
        <thead className="text-primary-light/60">
          <tr>
            <th className="p-4">Doctor</th>
            <th className="p-4">Paid subscription</th>
            <th className="p-4">Appointment access</th>
            <th className="p-4" />
          </tr>
        </thead>
        <tbody>
          {dashboard?.doctorAccess?.map((doctor) => (
            <tr key={doctor.doctorId} className="border-t border-tonal-20/40">
              <td className="p-4 text-primary-light">
                <div>{doctor.fullName || 'Doctor'}</div>
                <div className="text-primary-light/60">{doctor.email}</div>
              </td>
              <td className="p-4 text-primary-light">{doctor.subscriptionActive ? 'Active' : 'Inactive'}</td>
              <td className="p-4 text-primary-light">
                {doctor.appointmentEnabled
                  ? doctor.appointmentAccessWithoutSubscription
                    ? 'Admin waiver'
                    : 'Subscription'
                  : 'Disabled'}
              </td>
              <td className="p-4">
                <button onClick={() => toggle(doctor)} className="rounded-lg border border-accent px-3 py-2 text-accent">
                  {doctor.appointmentAccessWithoutSubscription ? 'Revoke waiver' : 'Enable without subscription'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AppLayout>;
}