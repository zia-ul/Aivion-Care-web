'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { authApi, doctorApi } from '@/lib/api/endpoints';
import { wsService } from '@/lib/websocket/client';
import { useAuthStore } from '@/lib/stores/auth';
import { User, Mail, Phone, Building2, LogOut, FileUp, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout(localStorage.getItem('refreshToken') || undefined);
    } catch (error) {
      console.error(error);
    } finally {
      try {
        wsService.disconnect();
      } catch {
        // ignore
      }
      clearAuth();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all data. Are you sure?')) return;
    if (!confirm('This action cannot be undone. Type "DELETE" to confirm.')) return;
    
    setDeleting(true);
    try {
      if (user?.role === 'DOCTOR') {
        await doctorApi.deleteProfile();
      } else {
        await authApi.deleteProfile();
      }
      try {
        wsService.disconnect();
      } catch {
        // ignore
      }
      clearAuth();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const uploadDocument = async (documentType: string, file: File | undefined) => {
    if (!file) return;
    setUploadingType(documentType);
    try {
      await doctorApi.uploadVerificationDocument(documentType, file);
      alert(`${documentType.replaceAll('-', ' ')} uploaded successfully.`);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Document upload failed');
    } finally {
      setUploadingType(null);
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout role={user?.role || 'PATIENT'} title="Profile" subtitle="Manage your account">
      <div className="max-w-2xl">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-heading font-bold text-primary-light">{user?.fullName}</h3>
              <p className="text-body text-primary-light/60">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
              <Mail size={18} className="text-accent" />
              <div>
                <p className="text-support text-primary-light/60">Email</p>
                <p className="text-body text-primary-light">{user?.email}</p>
              </div>
            </div>
            {user?.hospitalName && (
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <Building2 size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Hospital</p>
                  <p className="text-body text-primary-light">{user.hospitalName}</p>
                </div>
              </div>
            )}
            {user?.doctorId && (
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <User size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Doctor ID</p>
                  <p className="text-body text-primary-light">#{user.doctorId}</p>
                </div>
              </div>
            )}
            {user?.patientId && (
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <User size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Patient ID</p>
                  <p className="text-body text-primary-light">#{user.patientId}</p>
                </div>
              </div>
            )}
          </div>

          {user?.role === 'DOCTOR' && (
            <div className="mt-6 border-t border-tonal-20/50 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><ShieldCheck size={19} /></div>
                <div><h3 className="font-bold text-primary-light">Doctor profile and verification files</h3><p className="mt-1 text-sm text-primary-light/55">Upload the documents required for profile review after signing in.</p></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ['profile-photo', 'Profile photo', 'image/*'],
                  ['license-certificate', 'License certificate', '.pdf,image/*'],
                  ['degree-proof', 'Degree proof', '.pdf,image/*'],
                  ['government-id', 'Government ID', '.pdf,image/*'],
                  ['aadhaar-card', 'Aadhaar card', '.pdf,image/*'],
                  ['pan-card', 'PAN card', '.pdf,image/*'],
                  ['clinic-registration-proof', 'Clinic registration proof', '.pdf,image/*'],
                ].map(([type, label, accept]) => (
                  <label key={type} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-tonal-20/70 bg-surface-10/50 p-3 text-sm text-primary-light hover:border-accent/50">
                    <span>{label}</span><span className="inline-flex items-center gap-1.5 text-accent">{uploadingType === type ? 'Uploading...' : <><FileUp size={16} /> Upload</>}<input type="file" accept={accept} className="hidden" disabled={uploadingType !== null} onChange={(event) => { void uploadDocument(type, event.target.files?.[0]); event.currentTarget.value = ''; }} /></span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-tonal-20/50 space-y-3">
            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-primary-light/10 text-primary-light rounded-input hover:bg-primary-light/20 transition-colors">
              <LogOut size={18} /> Logout
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-danger/10 text-danger-light rounded-input hover:bg-danger/20 transition-colors">
              <Trash2 size={18} /> Delete Account
            </button>
            {showDeleteConfirm && (
              <div className="rounded-xl border border-danger/50 bg-danger/5 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-danger mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-danger-light">Confirm Account Deletion</p>
                    <p className="mt-1 text-sm text-danger/80">This will permanently delete your account, profile, documents, and all associated data. This action cannot be undone.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-tonal-20/50 text-primary-light rounded-input hover:bg-surface-10/50 transition-colors">Cancel</button>
                  <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 px-4 py-2 bg-danger text-white rounded-input hover:bg-danger/90 transition-colors disabled:opacity-50">
                    {deleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
