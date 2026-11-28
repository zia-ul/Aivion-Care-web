'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, CheckCircle2, XCircle, AlertTriangle, 
  FileText, Shield, ArrowRight, RefreshCw, LogOut,
  Sparkles, Stethoscope, Building2, UserRound
} from 'lucide-react';
import { authApi, doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import toast from 'react-hot-toast';

export default function DoctorApprovalPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [approvalStatus, setApprovalStatus] = useState<string>('PENDING');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const fetchDoctorStatus = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Check approval status endpoint
      const statusRes = await doctorApi.getApprovalStatus().catch(() => null);
      if (statusRes?.data) {
        const rawStatus = (statusRes.data.status || statusRes.data.approvalStatus || 'PENDING').toUpperCase();
        setApprovalStatus(rawStatus);
        setReviewNotes(statusRes.data.reviewNotes || '');
        setRejectionReason(statusRes.data.rejectionReason || '');

        if (rawStatus === 'APPROVED') {
          toast.success('Your doctor account has been approved!');
          router.push('/doctor/dashboard');
          return;
        }
      }

      // 2. Fetch full doctor onboarding profile details
      const profileRes = await doctorApi.getMyProfile().catch(() => null);
      if (profileRes?.data) {
        setProfile(profileRes.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch doctor approval status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctorStatus();
  }, []);

  const handleSignOut = () => {
    clearAuth();
    router.push('/login');
  };

  const isApproved = approvalStatus === 'APPROVED';
  const isRejected = approvalStatus === 'REJECTED';
  const isResubmit = approvalStatus === 'RESUBMIT_REQUIRED';
  const isPending = !isApproved && !isRejected && !isResubmit;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B132B] to-[#1C2541] px-4 py-12 text-slate-100">
      <div className="relative w-full max-w-2xl">
        {/* Header Icon & Branding */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00A884] to-[#00E5FF] text-slate-950 shadow-xl shadow-[#00A884]/20">
            <Stethoscope size={32} strokeWidth={2.4} />
          </div>
          <span className="inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-400 border border-emerald-500/20 uppercase">
            Doctor Profile Verification
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            {isApproved && 'Account Approved!'}
            {isPending && 'Super Admin Request Pending'}
            {isRejected && 'Application Declined'}
            {isResubmit && 'Action Required: Re-upload Documents'}
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            {isPending && 'Your doctor registration request has been submitted and is currently pending review and verification by the Super Admin.'}
            {isResubmit && 'Reviewers requested updates or clear scans for certain verification documents before approval.'}
            {isRejected && 'Your application could not be verified. Please check the review notes below or contact support.'}
          </p>
        </div>

        {/* Status Card (Mirrors Android Wrapper & AuthPageShell) */}
        <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Status Badge Row */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isApproved ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                isRejected ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                isResubmit ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              }`}>
                {isApproved && <CheckCircle2 size={22} />}
                {isRejected && <XCircle size={22} />}
                {isResubmit && <AlertTriangle size={22} />}
                {isPending && <Clock size={22} className="animate-pulse" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Status:</span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {approvalStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => fetchDoctorStatus(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Details / Review Notes */}
          {(rejectionReason || reviewNotes) && (
            <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
              <span className="font-bold block mb-1">Administrative Feedback:</span>
              <p>{rejectionReason || reviewNotes}</p>
            </div>
          )}

          {/* Doctor Info Preview */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block font-medium">Doctor Name:</span>
              <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                {profile?.fullName || user?.fullName || 'Verified Medical Practitioner'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block font-medium">Speciality & License:</span>
              <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                {profile?.speciality || 'General Medicine'} {profile?.licenseNumber ? `• Reg: ${profile.licenseNumber}` : ''}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block font-medium">Hospital / Clinic:</span>
              <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                {profile?.hospitalName || profile?.clinicName || 'Aivion Care Network'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block font-medium">Verification Standard:</span>
              <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                HIPAA & CDSCO Compliant
              </span>
            </div>
          </div>

          {/* Verification Progress Checklist (Same as Android) */}
          <div className="mt-6 border-t border-slate-800/80 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Verification Checklist</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Profile & Registration Information</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Completed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="flex items-center gap-2 text-slate-200">
                  <FileText size={16} className="text-blue-400" />
                  <span>Medical Degree & License Uploads</span>
                </span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Uploaded</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="flex items-center gap-2 text-slate-200">
                  <Shield size={16} className="text-amber-400" />
                  <span>Super Admin Clinical Accreditation</span>
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">In Progress</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {isResubmit && (
                <Link
                  href="/verification"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <span>Re-upload Documents</span>
                  <ArrowRight size={14} />
                </Link>
              )}
              {isApproved && (
                <Link
                  href="/doctor/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Open Doctor Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
