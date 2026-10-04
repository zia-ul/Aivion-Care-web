'use client';

import { useEffect, useState } from 'react';
import { hospitalProfileApi, HospitalProfile } from '@/lib/api/hospital-staff';
import { useAuthStore } from '@/lib/stores/auth';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input } from '@/components/ui';
import { KeyRound, Copy, RefreshCw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalHeadGenerateLoginPage() {
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
      toast.error('Unable to load hospital login details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const copyLoginId = async () => {
    if (!profile?.hospitalLoginId) return;
    try {
      await navigator.clipboard.writeText(profile.hospitalLoginId);
      toast.success('Hospital login ID copied');
    } catch {
      toast.error('Unable to copy login ID');
    }
  };

  return (
    <AppLayout role="HOSPITAL_HEAD" title="Generate Login" subtitle="Hospital and staff login identifiers">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-5">
            <span className="p-2 bg-purple-500/10 rounded-xl"><KeyRound size={20} className="text-purple-500" /></span>
            <div>
              <h2 className="text-heading font-bold text-primary-light">Hospital login ID</h2>
              <p className="text-sm text-primary-light/60">Share this identifier with administrators who sign in as the hospital.</p>
            </div>
          </div>

          {loading ? (
            <p className="text-body text-primary-light/60">Loading login details...</p>
          ) : !Number.isFinite(hospitalId) ? (
            <p className="text-body text-primary-light/60">No hospital is linked to your account.</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Hospital login ID" value={profile?.hospitalLoginId ?? ''} readOnly placeholder="Not generated yet" />
                <div className="flex items-end">
                  <Button variant="outline" onClick={copyLoginId} disabled={!profile?.hospitalLoginId}>
                    <Copy size={15} className="mr-2" /> Copy login ID
                  </Button>
                </div>
              </div>
              <Button variant="ghost" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-heading font-bold text-primary-light mb-3">Staff login IDs</h3>
          <p className="text-body text-primary-light/70 leading-7">
            Lab and pharmacy accounts created from this workspace return their generated login ID immediately.
            Share the ID with the staff member so they can complete their first sign-in.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/hospital-head/lab-assistants"><Button variant="outline">Manage labs</Button></Link>
            <Link href="/hospital-head/pharmacy"><Button variant="outline">Manage pharmacy</Button></Link>
          </div>
        </Card>

        <div className="rounded-card border border-accent/25 bg-accent/[0.06] p-5 flex items-start gap-3">
          <Info size={18} className="mt-0.5 text-accent" />
          <p className="text-sm leading-6 text-primary-light/70">
            Arbitrary login ID generation for doctors and receptionists is issued by the platform administrator,
            so this workspace only surfaces identifiers that already exist in your hospital profile.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}