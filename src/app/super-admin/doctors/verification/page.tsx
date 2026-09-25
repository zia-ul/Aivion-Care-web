'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import { UserCheck } from 'lucide-react';
import { StatusBadge, EmptyState } from '@/components/ui';

interface DoctorVerification {
  doctorId: number;
  fullName: string;
  email: string;
  specialization?: string;
  qualification?: string;
  verificationStatus?: string;
  approvalStatus?: string;
  hospitalName?: string;
}

export default function SuperAdminDoctorVerification() {
  const [doctors, setDoctors] = useState<DoctorVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Backend returns a Spring Page object: { content: [...], totalElements, ... }.
        const { data } = await superAdminApi.getDoctorVerifications();
        setDoctors(Array.isArray(data) ? data : (data?.content ?? []));
      } catch (error) {
        console.error('Failed to load verifications:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVerification = async (doctorId: number, approved: boolean) => {
    try {
      // Backend DoctorProfileReviewRequest: { action: 'APPROVE' | 'RESUBMIT', reviewNotes }.
      await superAdminApi.updateDoctorVerification(doctorId, {
        action: approved ? 'APPROVE' : 'RESUBMIT',
        reviewNotes: approved ? 'Verified' : 'Rejected',
      });
      setDoctors((prev) => prev.map((d) => d.doctorId === doctorId ? { ...d, approvalStatus: approved ? 'APPROVED' : 'RESUBMIT' } : d));
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <AppLayout role="SUPER_ADMIN" title="Doctor Verification" subtitle="Review and verify doctor profiles">
      <div className="space-y-6">
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 md:p-6">
          <h3 className="text-heading font-bold text-primary-light mb-4">Pending Verifications</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Loading...</p></div>
          ) : doctors.length === 0 ? (
            <EmptyState icon={UserCheck} title="No pending verifications" />
          ) : (
            <div className="space-y-3">
              {doctors.map(({ doctorId, fullName, email, specialization, qualification, approvalStatus, hospitalName }) => (
                <div key={doctorId} className="flex items-start justify-between p-4 bg-surface-10/50 rounded-xl border border-tonal-20/30">
                  <div>
                    <p className="font-semibold text-primary-light">{fullName}</p>
                    <p className="text-support text-primary-light/60">{email}</p>
                    <p className="text-support text-primary-light/50">{specialization || 'General'}{qualification ? ` | ${qualification}` : ''}</p>
                    {hospitalName && <p className="text-support text-primary-light/50">Hospital: {hospitalName}</p>}
                  </div>
                  <div className="flex gap-2">
                    {approvalStatus !== 'APPROVED' && <button onClick={() => handleVerification(doctorId, true)} className="px-4 py-2 bg-success/10 text-success-light rounded-lg text-body font-medium hover:bg-success/20">Approve</button>}
                    {approvalStatus !== 'RESUBMIT' && <button onClick={() => handleVerification(doctorId, false)} className="px-4 py-2 bg-danger/10 text-danger-light rounded-lg text-body font-medium hover:bg-danger/20">Reject</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
