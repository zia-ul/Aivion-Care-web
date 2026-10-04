'use client';

import AppLayout from '@/components/layout/AppLayout';
import HospitalHeadDashboardContent from '@/components/hospital-head/HospitalHeadDashboardContent';

export default function HospitalHeadDashboardPage() {
  return (
    <AppLayout role="HOSPITAL_HEAD" title="Hospital Dashboard" subtitle="Hospital administration overview">
      <HospitalHeadDashboardContent />
    </AppLayout>
  );
}
