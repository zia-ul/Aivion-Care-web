'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import { Card, Button } from '@/components/ui';
import { ShieldCheck, Hourglass, ArrowRight, LogOut, RefreshCw } from 'lucide-react';

type Role = 'patient' | 'doctor' | 'hospital' | 'pharmacist' | 'pathology';

interface ApprovalStatus {
  role: Role;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMIT_REQUIRED' | 'SUBMITTED';
  message?: string;
  rejectionReason?: string;
}

export default function ApprovalPendingPage() {
  const [approval, setApproval] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const roleNames: Record<Role, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    hospital: 'Hospital / Clinic',
    pharmacist: 'Pharmacist',
    pathology: 'Pathology / Lab',
  };

  const statusConfig = {
    PENDING: { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10', icon: Hourglass, description: 'Your registration is awaiting admin review.' },
    SUBMITTED: { label: 'Submitted for Approval', color: 'text-blue-400 bg-blue-400/10', icon: ShieldCheck, description: 'Your profile has been submitted and is under review.' },
    APPROVED: { label: 'Approved', color: 'text-green-400 bg-green-400/10', icon: ShieldCheck, description: 'Your account has been approved! You can now sign in.' },
    REJECTED: { label: 'Rejected', color: 'text-red-400 bg-red-400/10', icon: ShieldCheck, description: 'Your registration was rejected. Please contact support or try again.' },
    RESUBMIT_REQUIRED: { label: 'Changes Required', color: 'text-amber-400 bg-amber-400/10', icon: ShieldCheck, description: 'Admin has requested changes. Please update your profile and resubmit.' },
  } as const;

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await authApi.getMyProfile?.() || { data: null };
        if (data) {
          setApproval({
            role: (data.role?.toLowerCase() as Role) || 'patient',
            status: (data.approvalStatus || data.status || 'PENDING').toUpperCase() as ApprovalStatus['status'],
            message: data.message,
            rejectionReason: data.rejectionReason,
          });
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [router]);

  const handleRefresh = () => {
    setLoading(true);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mx-auto mb-4" />
          <p className="text-primary-light/70">Checking approval status...</p>
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg p-4">
        <Card className="w-full max-w-md">
          <div className="text-center py-12">
            <ShieldCheck className="mx-auto h-16 w-16 text-accent/50 mb-4" />
            <h1 className="text-headline font-extrabold text-accent mb-2">Unable to check status</h1>
            <p className="text-body text-primary-light/70 mb-6">Please sign in to check your approval status.</p>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const config = statusConfig[approval.status];
  const isApproved = approval.status === 'APPROVED';
  const isRejected = approval.status === 'REJECTED';
  const needsResubmit = approval.status === 'RESUBMIT_REQUIRED';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg p-4">
      <Card className="w-full max-w-md">
        <div className="text-center py-12">
          <div className={`mx-auto mb-4 rounded-full p-4 ${config.color.replace('text-', 'bg-').replace('border-', 'bg-')}`}>
            <config.icon className="h-10 w-10" />
          </div>
          <h1 className="text-headline font-extrabold text-accent mb-2">Approval {config.label}</h1>
          <p className="text-body text-primary-light/70 mb-2">Account type: <span className="font-semibold">{roleNames[approval.role]}</span></p>
          <p className="text-support text-primary-light/60 mb-6">{config.description}</p>

          {approval.rejectionReason && (
            <div className="mb-6 rounded-input border border-red-400/50 bg-red-400/10 p-4 text-left">
              <p className="font-semibold text-red-400">Rejection Reason:</p>
              <p className="mt-1 text-primary-light">{approval.rejectionReason}</p>
            </div>
          )}

          <div className="space-y-3">
            {isApproved && (
              <Link href="/login">
                <Button className="w-full" size="lg">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Sign In Now
                </Button>
              </Link>
            )}

            {needsResubmit && (
              <Link href="/verification">
                <Button className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Profile & Resubmit
                </Button>
              </Link>
            )}

            {!isApproved && !needsResubmit && (
              <Button onClick={handleRefresh} className="w-full" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            )}

            <Link href="/login">
              <Button variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}