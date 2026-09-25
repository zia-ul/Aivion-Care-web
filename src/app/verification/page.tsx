'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doctorApi, hospitalApi, pathologyApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select, Textarea } from '@/components/ui';
import {
  ShieldCheck, Upload, Eye, EyeOff, FileText, CheckCircle, AlertCircle, Loader2,
  ArrowRight, LogOut, RefreshCw, Building2, Stethoscope, FlaskConical, UserRound
} from 'lucide-react';

type Role = 'doctor' | 'hospital' | 'pathology';

interface VerificationProfile {
  id: number;
  role: Role;
  approvalStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RESUBMIT_REQUIRED';
  rejectionReason?: string;
  reviewNotes?: string;
  documents: DocumentItem[];
  profileData: Record<string, any>;
}

interface DocumentItem {
  key: string;
  label: string;
  required: boolean;
  uploaded: boolean;
  url?: string;
  fileName?: string;
  mimeType?: string;
}

const DOCUMENT_CONFIGS: Record<Role, DocumentItem[]> = {
  doctor: [
    { key: 'profilePhoto', label: 'Profile Photo', required: true, uploaded: false },
    { key: 'signature', label: 'Signature', required: true, uploaded: false },
    { key: 'licenseCertificate', label: 'License Certificate', required: true, uploaded: false },
    { key: 'degreeProof', label: 'Degree Proof', required: true, uploaded: false },
    { key: 'aadhaarCard', label: 'Aadhaar Card', required: true, uploaded: false },
    { key: 'panCard', label: 'PAN Card', required: true, uploaded: false },
    { key: 'clinicRegistrationProof', label: 'Clinic Registration Proof', required: true, uploaded: false },
    { key: 'utilityBill', label: 'Utility Bill', required: true, uploaded: false },
    { key: 'purchaseBill', label: 'Purchase Bill', required: false, uploaded: false },
    { key: 'rentAgreement', label: 'Rent Agreement', required: false, uploaded: false },
    { key: 'clinicLogo', label: 'Clinic Logo / Stamp', required: false, uploaded: false },
  ],
  hospital: [
    { key: 'businessCertificate', label: 'Business Registration Certificate', required: true, uploaded: false },
    { key: 'medicalLicense', label: 'Medical License', required: true, uploaded: false },
    { key: 'headIdProof', label: 'Head ID Proof', required: true, uploaded: false },
    { key: 'headPhoto', label: 'Head Photo', required: true, uploaded: false },
    { key: 'hospitalLogo', label: 'Hospital Logo', required: false, uploaded: false },
  ],
  pathology: [
    { key: 'aadhaarCard', label: 'Aadhaar Card', required: true, uploaded: false },
    { key: 'panCard', label: 'PAN Card', required: true, uploaded: false },
    { key: 'qualificationCertificate', label: 'Qualification Certificate', required: true, uploaded: false },
    { key: 'medicalRegistrationCertificate', label: 'Medical Registration Certificate', required: true, uploaded: false },
    { key: 'signature', label: 'Signature', required: true, uploaded: false },
    { key: 'labRegistrationCertificate', label: 'Lab Registration Certificate', required: true, uploaded: false },
    { key: 'clinicalEstablishmentCertificate', label: 'Clinical Establishment Certificate', required: true, uploaded: false },
    { key: 'businessOwnerPan', label: 'Business Owner PAN', required: true, uploaded: false },
    { key: 'shopLabEstablishmentProof', label: 'Shop/Lab Establishment Proof', required: true, uploaded: false },
    { key: 'labFrontPhoto', label: 'Lab Front Photo', required: true, uploaded: false },
    { key: 'labInsidePhoto', label: 'Lab Inside Photo', required: true, uploaded: false },
    { key: 'biomedicalWasteCertificate', label: 'Biomedical Waste Certificate', required: true, uploaded: false },
    { key: 'cancelledCheque', label: 'Cancelled Cheque', required: true, uploaded: false },
    { key: 'profilePhoto', label: 'Profile Photo', required: true, uploaded: false },
    { key: 'sealStamp', label: 'Seal / Stamp', required: false, uploaded: false },
  ],
};

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  doctor: <Stethoscope className="h-5 w-5" />,
  hospital: <Building2 className="h-5 w-5" />,
  pathology: <FlaskConical className="h-5 w-5" />,
};

const ROLE_LABELS: Record<Role, string> = {
  doctor: 'Doctor',
  hospital: 'Hospital / Clinic',
  pathology: 'Pathology / Lab',
};

export default function VerificationPage() {
  const [role, setRole] = useState<Role>('doctor');
  const [profile, setProfile] = useState<VerificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const documents = DOCUMENT_CONFIGS[role];
  const requiredDocs = documents.filter(d => d.required);
  const uploadedCount = documents.filter(d => d.uploaded).length;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        let data: any = null;
        if (role === 'doctor') {
          const res = await doctorApi.getMyProfile();
          data = res.data;
        } else if (role === 'hospital') {
          const res = await hospitalApi.getMyProfile();
          data = res.data;
        } else if (role === 'pathology') {
          const res = await pathologyApi.getMyProfile();
          data = res.data;
        }
        if (data) {
          const docs = documents.map(doc => ({
            ...doc,
            uploaded: !!data[`${doc.key}Url`] || !!data[doc.key],
            url: data[`${doc.key}Url`],
            fileName: data[`${doc.key}FileName`],
            mimeType: data[`${doc.key}MimeType`],
          }));
          setProfile({
            id: data.id || data.userId || data.doctorId || data.hospitalId || data.pathologyProfileId || 0,
            role,
            approvalStatus: data.approvalStatus || data.status || 'DRAFT',
            rejectionReason: data.rejectionReason,
            reviewNotes: data.reviewNotes,
            documents: docs,
            profileData: data,
          });
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
        } else {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [role, router]);

  const handleUpload = async (documentKey: string, file: File) => {
    setUploading(documentKey);
    try {
      let res: any;
      if (role === 'doctor') {
        res = await doctorApi.uploadVerificationDocument(documentKey, file);
      } else if (role === 'hospital') {
        res = await hospitalApi.uploadDocument(documentKey, file);
      } else if (role === 'pathology') {
        res = await pathologyApi.uploadDocument(documentKey, file);
      }
      toast.success(`${documents.find(d => d.key === documentKey)?.label || 'Document'} uploaded`);
      setProfile(prev => prev ? {
        ...prev,
        documents: prev.documents.map(d =>
          d.key === documentKey ? { ...d, uploaded: true, url: res.data?.fileUrl, fileName: file.name } : d
        )
      } : null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (role === 'doctor') {
        await doctorApi.submitForApproval();
      } else if (role === 'hospital') {
        await hospitalApi.submitForApproval();
      } else if (role === 'pathology') {
        await pathologyApi.submitForApproval();
      }
      toast.success('Submitted for approval!');
      router.push('/approval-pending');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Submission failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    toast.success('Draft saved');
  };

  const canSubmit = profile && profile.approvalStatus === 'DRAFT' && requiredDocs.every(d => d.uploaded);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-accent mx-auto mb-4" />
          <p className="text-primary-light/70">Loading verification profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg p-4">
        <Card className="w-full max-w-md">
          <div className="text-center py-12">
            <ShieldCheck className="mx-auto h-16 w-16 text-accent/50 mb-4" />
            <h1 className="text-headline font-extrabold text-accent mb-2">Unable to load profile</h1>
            <p className="text-body text-primary-light/70 mb-6">Please sign in to access verification.</p>
            <Link href="/login"><Button className="w-full">Sign In</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const isEditable = ['DRAFT', 'REJECTED', 'RESUBMIT_REQUIRED'].includes(profile.approvalStatus);
  const RoleIcon = ROLE_ICONS[role];

  return (
    <div className="min-h-screen bg-gradient-bg pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {RoleIcon}
            <h1 className="text-headline font-extrabold text-accent">Verification & Documents</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={role} onChange={e => setRole(e.target.value as Role)} options={[
              { value: 'doctor', label: 'Doctor' },
              { value: 'hospital', label: 'Hospital / Clinic' },
              { value: 'pathology', label: 'Pathology / Lab' },
            ]} className="w-48" />
          </div>
        </div>

        <Card className="mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-3 ${profile.approvalStatus === 'APPROVED' ? 'bg-green-400/10 text-green-400' : profile.approvalStatus === 'REJECTED' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'}`}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-heading font-bold text-primary-light">
                    Status: <span className="text-accent">{profile.approvalStatus}</span>
                  </p>
                  <p className="text-support text-primary-light/60">
                    {uploadedCount} / {documents.length} documents uploaded
                    {requiredDocs.length > 0 && ` (${requiredDocs.filter(d => d.uploaded).length}/${requiredDocs.length} required)`}
                  </p>
                </div>
              </div>
              {profile.rejectionReason && (
                <div className="rounded-input border border-red-400/50 bg-red-400/10 p-3 text-primary-light text-sm">
                  Rejection: {profile.rejectionReason}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map(doc => {
                const uploaded = doc.uploaded;
                return (
                  <div key={doc.key} className={`rounded-card border p-4 transition-colors ${uploaded ? 'border-green-400/50 bg-green-400/5' : doc.required ? 'border-red-400/20 bg-red-400/5' : 'border-tonal-20/50 bg-surface-20/50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-primary-light">{doc.label}</span>
                          {doc.required && <span className="text-xs text-red-400">Required</span>}
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${uploaded ? 'bg-green-400/20 text-green-400' : 'bg-amber-400/20 text-amber-400'}`}>
                            {uploaded ? 'Uploaded' : 'Missing'}
                          </span>
                        </div>
                        {uploaded && doc.fileName && <p className="text-sm text-primary-light/60 truncate">{doc.fileName}</p>}
                      </div>
                      {isEditable && (
                        <button
                          onClick={() => document.getElementById(`upload-${doc.key}`)?.click()}
                          disabled={uploading === doc.key}
                          className="flex-shrink-0 rounded-lg border border-accent/50 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/10 disabled:opacity-50"
                        >
                          {uploading === doc.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    <input
                      id={`upload-${doc.key}`}
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={e => e.target.files?.[0] && handleUpload(doc.key, e.target.files[0])}
                    />
                  </div>
                );
              })}
            </div>

            {profile.reviewNotes && (
              <div className="mt-6 rounded-input border border-blue-400/50 bg-blue-400/10 p-4">
                <p className="font-semibold text-blue-400 mb-1">Admin Notes:</p>
                <p className="text-primary-light">{profile.reviewNotes}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {isEditable && (
                <>
                  <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                  <Button onClick={handleSubmit} disabled={!canSubmit || saving} className="flex-1" size="lg">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Submit for Approval <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </>
              )}
              {!isEditable && (
                <Button onClick={() => router.push('/approval-pending')} variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Approval Status
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5 text-center">
            <p className="text-body text-primary-light/70 mb-4">Need help? Contact support at support@aiconfidencecure.com</p>
            <Link href="/login"><Button variant="outline"><LogOut className="mr-2 h-4 w-4" />Sign Out</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}