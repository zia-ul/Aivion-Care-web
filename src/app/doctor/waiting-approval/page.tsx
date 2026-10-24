'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, CheckCircle, AlertCircle, Mail, 
  Shield, UserCheck, Loader2, RefreshCw 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { FL, DarkCard, InnerCard, Pill, ActionButton, SectionTitle } from '@/components/ui/FlutterTheme';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';

interface ApprovalStatusResponse {
  doctorId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

export default function WaitingForApprovalPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<ApprovalStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!user?.doctorId) {
      setError('Doctor profile not found');
      setLoading(false);
      return;
    }

    try {
      const response = await doctorApi.getApprovalStatus();
      setStatus(response.data);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to check approval status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [user?.doctorId]);

  const handleRetry = () => {
    checkStatus();
  };

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <AppLayout role="DOCTOR" title="Approval Status" subtitle="Checking your application status...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 border-4 border-doctor-lavender border-t-transparent rounded-full animate-spin" />
            <p className="text-primary-light font-medium text-lg">Checking your approval status...</p>
            <p className="text-sm text-doctor-muted">Please wait while we fetch your application status</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout role="DOCTOR" title="Approval Status" subtitle="Unable to check status">
        <DarkCard className="max-w-md mx-auto text-center py-8">
          <AlertCircle className="mx-auto text-doctor-pink" size={48} />
          <h3 className="mt-4 text-primary-light font-semibold text-lg">Unable to check status</h3>
          <p className="mt-2 text-sm text-doctor-muted">{error}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <ActionButton onClick={handleRetry}>
              <RefreshCw size={16} className="mr-1" />
              Retry
            </ActionButton>
            <ActionButton variant="outline" onClick={handleLogout}>
              Logout
            </ActionButton>
          </div>
        </DarkCard>
      </AppLayout>
    );
  }

  if (!status) {
    return (
      <AppLayout role="DOCTOR" title="Approval Status" subtitle="No status available">
        <DarkCard className="max-w-md mx-auto text-center py-8">
          <Clock className="mx-auto text-doctor-gold" size={48} />
          <h3 className="mt-4 text-primary-light font-semibold text-lg">No Application Found</h3>
          <p className="mt-2 text-sm text-doctor-muted">No doctor registration application found for your account.</p>
          <ActionButton onClick={() => router.push('/register/doctor')} className="mt-4">
            Register as Doctor
          </ActionButton>
        </DarkCard>
      </AppLayout>
    );
  }

  const getStatusConfig = () => {
    switch (status.status) {
      case 'APPROVED':
        return {
          icon: CheckCircle,
          color: FL.mint,
          bgColor: 'bg-doctor-mint/10',
          borderColor: 'border-doctor-mint/30',
          title: 'Application Approved!',
          subtitle: 'You can now access all doctor features',
          action: <ActionButton onClick={() => router.push('/doctor/dashboard')}>Go to Dashboard</ActionButton>
        };
      case 'REJECTED':
        return {
          icon: AlertCircle,
          color: FL.pink,
          bgColor: 'bg-doctor-pink/10',
          borderColor: 'border-doctor-pink/30',
          title: 'Application Not Approved',
          subtitle: 'Your application was not approved',
          action: <ActionButton variant="outline" onClick={() => router.push('/register/doctor')}>Re-apply</ActionButton>
        };
      default:
        return {
          icon: Clock,
          color: FL.gold,
          bgColor: 'bg-doctor-gold/10',
          borderColor: 'border-doctor-gold/30',
          title: 'Application Under Review',
          subtitle: 'Our admin team is reviewing your application. This typically takes 2-3 business days.',
          action: (
            <div className="flex gap-3 w-full">
              <ActionButton variant="outline" onClick={checkStatus} className="flex-1">
                <RefreshCw size={16} className="mr-1" />
                Refresh Status
              </ActionButton>
              <ActionButton variant="ghost" onClick={handleLogout}>Logout</ActionButton>
            </div>
          )
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AppLayout role="DOCTOR" title="Doctor Approval Status" subtitle="Track your doctor registration application">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Status Card */}
        <div className={`rounded-2xl p-6 border ${config.bgColor} ${config.borderColor}`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}>
              <config.icon className={`text-2xl ${config.color}`} size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-primary-light font-semibold text-xl">{config.title}</h3>
              <p className="mt-1 text-doctor-muted">{config.subtitle}</p>
            </div>
          </div>

          {status.rejectionReason && (
            <div className="mt-6 p-4 rounded-xl bg-doctor-pink/10 border border-doctor-pink/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-doctor-pink mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-primary-light font-medium">Reason for Rejection</p>
                  <p className="mt-1 text-sm text-doctor-muted">{status.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {status.reviewNotes && status.status === 'APPROVED' && (
            <div className="mt-4 p-4 rounded-xl bg-doctor-mint/10 border border-doctor-mint/30">
              <div className="flex items-start gap-3">
                <Mail className="text-doctor-mint mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-primary-light font-medium">Admin Notes</p>
                  <p className="mt-1 text-sm text-doctor-muted">{status.reviewNotes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-doctor-border-soft/30">
            {config.action}
          </div>
        </div>

        {/* Timeline */}
        <DarkCard>
          <SectionTitle>Application Timeline</SectionTitle>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-doctor-lavender/15 flex items-center justify-center">
                <Shield className="text-doctor-lavender" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-primary-light font-medium">Application Submitted</p>
                <p className="text-sm text-doctor-muted">{new Date(status.submittedAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Pill color={FL.mint} size="xs">Completed</Pill>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-doctor-gold/15 flex items-center justify-center">
                <UserCheck className="text-doctor-gold" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-primary-light font-medium">Admin Review Started</p>
                <p className="text-sm text-doctor-muted">Your application is being reviewed by our admin team</p>
              </div>
              <div className="flex items-center gap-2">
                {status.status === 'PENDING' ? (
                  <Pill color={FL.gold} size="xs">In Progress</Pill>
                ) : (
                  <Pill color={FL.mint} size="xs">Completed</Pill>
                )}
              </div>
            </div>

            {(status.status === 'APPROVED' || status.status === 'REJECTED') && status.reviewedAt && (
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${status.status === 'APPROVED' ? 'bg-doctor-mint/15' : 'bg-doctor-pink/15'} flex items-center justify-center`}>
                  {status.status === 'APPROVED' ? (
                    <CheckCircle className="text-doctor-mint" size={20} />
                  ) : (
                    <AlertCircle className="text-doctor-pink" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-primary-light font-medium">{status.status === 'APPROVED' ? 'Application Approved' : 'Application Rejected'}</p>
                  <p className="text-sm text-doctor-muted">{new Date(status.reviewedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill color={status.status === 'APPROVED' ? FL.mint : FL.pink} size="xs">
                    {status.status}
                  </Pill>
                </div>
              </div>
            )}
          </div>
        </DarkCard>

        {/* Info Card */}
        <div className="rounded-2xl bg-doctor-surface/30 border border-doctor-border-soft/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-doctor-lavender/15 flex items-center justify-center">
              <Shield className="text-doctor-lavender" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-primary-light font-semibold">What happens next?</p>
              <ul className="mt-2 space-y-1 text-sm text-doctor-muted">
                <li className="flex items-center gap-2">• Our admin team reviews all credentials and qualifications</li>
                <li className="flex items-center gap-2">• You will receive an email notification once reviewed</li>
                <li className="flex items-center gap-2">• If approved, you'll get immediate access to the doctor dashboard</li>
                <li className="flex items-center gap-2">• If additional documents are needed, we will contact you via email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
