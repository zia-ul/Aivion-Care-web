'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { authApi, doctorApi } from '@/lib/api/endpoints';
import { isTokenExpired } from '@/lib/helpers';
import { wsService } from '@/lib/websocket/client';
import { useAuthStore } from '@/lib/stores/auth';
import { User, Mail, Phone, Building2, LogOut, FileUp, ShieldCheck, Trash2, AlertTriangle, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Change password with old password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      if (!isTokenExpired(accessToken)) {
        await authApi.logout(localStorage.getItem('refreshToken') || undefined);
      }
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

  const handleDeactivateAccount = async () => {
    if (!confirm('This will deactivate your account and revoke active sessions. Are you sure?')) return;
    
    setDeleting(true);
    try {
      await authApi.deleteProfile();
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
      alert(error?.response?.data?.message || 'Failed to deactivate account');
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!mounted) return null;

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

            {isSuperAdmin && (
              <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <ShieldCheck size={18} className="text-amber-400" />
                <div>
                  <p className="text-support text-amber-300 font-bold">Super Admin Security Recovery Email</p>
                  <p className="text-body font-mono text-primary-light">ziaulislam83413@gmail.com</p>
                  <p className="text-[11px] text-amber-200/70 mt-0.5">Account protected from deletion; only authorized recovery email can reset root credentials.</p>
                </div>
              </div>
            )}

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
            {showChangePassword ? (
              <form onSubmit={handleChangePassword} className="p-4 rounded-2xl border border-accent/20 bg-surface-20/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <Lock size={18} />
                    <span>Change Password</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowChangePassword(false)}
                    className="text-xs text-primary-light/60 hover:text-primary-light"
                  >
                    Cancel
                  </button>
                </div>

                <div className="relative">
                  <Input
                    icon={<Lock size={16} />}
                    label="Current Password"
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-[2.4rem] text-primary-light/60 hover:text-accent"
                  >
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    icon={<KeyRound size={16} />}
                    label="New Password"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-[2.4rem] text-primary-light/60 hover:text-accent"
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <Input
                  icon={<KeyRound size={16} />}
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => router.push('/reset-password')}
                    className="text-xs text-accent/80 hover:text-accent underline"
                  >
                    Lost your current password?
                  </button>
                  <Button type="submit" loading={changingPassword} size="sm">
                    {changingPassword ? 'Updating…' : 'Update Password'}
                  </Button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-accent/40 bg-accent/10 text-accent rounded-input hover:bg-accent/20 transition-colors"
              >
                <Lock size={18} /> Change Password (Using Current Password)
              </button>
            )}

            <button
              type="button"
              onClick={() => router.push('/reset-password')}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-primary-light/20 bg-surface-10/40 text-primary-light/80 rounded-input hover:bg-surface-20 transition-colors text-sm"
            >
              <KeyRound size={17} /> Forgot / Lost Password? Reset via Email or SMS OTP
            </button>

            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-primary-light/10 text-primary-light rounded-input hover:bg-primary-light/20 transition-colors">
              <LogOut size={18} /> Logout
            </button>

            {!isSuperAdmin && (
              <>
                <button onClick={() => setShowDeleteConfirm(true)} className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-danger/10 text-danger-light rounded-input hover:bg-danger-fill/20 transition-colors">
                  <Trash2 size={18} /> Deactivate Account
                </button>
                {showDeleteConfirm && (
                  <div className="rounded-xl border border-danger/50 bg-danger/5 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-danger mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-danger-light">Confirm Account Deactivation</p>
                        <p className="mt-1 text-sm text-danger/80">This deactivates your credentials and revokes active sessions. Clinical history and audit trails are preserved in an inactive state.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-tonal-20/50 text-primary-light rounded-input hover:bg-surface-10/50 transition-colors">Cancel</button>
                      <button onClick={handleDeactivateAccount} disabled={deleting} className="flex-1 px-4 py-2 bg-danger text-white rounded-input hover:bg-danger-fill/90 transition-colors disabled:opacity-50">
                        {deleting ? 'Deactivating...' : 'Deactivate Account'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
