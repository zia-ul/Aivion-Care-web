'use client';

import { useEffect, useState } from 'react';
import { hospitalProfileApi, HospitalProfile } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, StatusBadge } from '@/components/ui';
import { Activity, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_MESSAGE: Record<string, string> = {
  PENDING: 'Your hospital registration is pending review.',
  UNDER_REVIEW: 'Your hospital is currently under review by the platform administrator.',
  RESUBMIT: 'Resubmission required. Please update the requested information.',
  REJECTED: 'Your hospital registration has been rejected.',
  APPROVED: 'Your hospital has been approved.',
};

export default function HospitalHeadStatusPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    if (!Number.isFinite(hospitalId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await hospitalProfileApi.get(hospitalId);
      setProfile(data);
    } catch {
      toast.error('Unable to load hospital status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const status = profile?.status ?? 'UNKNOWN';

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Hospital Status" subtitle="Approval and review status">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <Activity size={56} className="mx-auto text-accent mb-4" />
          <div className="mb-4 flex justify-center"><StatusBadge status={status} /></div>
          <p className="text-body text-primary-light/70 leading-7">
            {STATUS_MESSAGE[status] ?? 'Hospital status will appear once the profile is reviewed.'}
          </p>
          {profile?.name ? (
            <p className="mt-4 text-sm text-primary-light/50">
              {profile.name}{profile.registrationNumber ? ` · ${profile.registrationNumber}` : ''}
            </p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw size={15} className="mr-2" /> Refresh status
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-heading font-bold text-primary-light mb-3">What happens next</h3>
          <ol className="list-decimal list-inside space-y-2 text-body text-primary-light/70">
            <li>Platform administrators review your registration details and documents.</li>
            <li>You receive a notification when the decision is available.</li>
            <li>If changes are requested, update the hospital profile and resubmit.</li>
          </ol>
        </Card>
      </div>
    </AppLayout>
  );
}