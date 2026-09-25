'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Select, Textarea } from '@/components/ui';
import {
  ShieldCheck, Search, Filter, RefreshCw, Loader2, CheckCircle, XCircle, AlertCircle,
  ClipboardList, MoreVertical, Download, FileText, ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';

interface DoctorSummary {
  doctorId: number;
  fullName: string;
  email: string;
  specialization: string;
  hospitalName?: string;
  approvalStatus: string;
  submittedAt: string;
}

interface DoctorProfile {
  doctorId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears?: number;
  licenseNumber: string;
  registrationAuthority?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  clinicName?: string;
  clinicRegistrationNumber?: string;
  address?: string;
  workingDays?: string;
  consultingHours?: string;
  inClinicFee?: number;
  onlineFee?: number;
  receptionPhone?: string;
  profilePhotoUrl?: string;
  signatureUrl?: string;
  licenseCertificateUrl?: string;
  degreeProofUrl?: string;
  aadhaarCardUrl?: string;
  panCardUrl?: string;
  clinicRegistrationProofUrl?: string;
  utilityBillUrl?: string;
  purchaseBillUrl?: string;
  rentAgreementUrl?: string;
  doctorLogoUrl?: string;
  doctorStampUrl?: string;
  approvalStatus: string;
  reviewNotes?: string;
  correctionReasons?: Record<string, string>;
}

const STATUS_FILTERS = [
  { value: 'SUBMITTED', label: 'Submitted', iconName: 'ClipboardList' },
  { value: 'RESUBMIT_REQUIRED', label: 'Need Changes', iconName: 'AlertCircle' },
  { value: 'APPROVED', label: 'Approved', iconName: 'CheckCircle' },
  { value: 'ALL', label: 'All', iconName: 'ShieldCheck' },
];

const REVIEW_FIELDS = [
  { key: 'profilePhoto', label: 'Profile Photo' },
  { key: 'signature', label: 'Signature' },
  { key: 'licenseCertificate', label: 'License Certificate' },
  { key: 'degreeProof', label: 'Degree Proof' },
  { key: 'aadhaarCard', label: 'Aadhaar Card' },
  { key: 'panCard', label: 'PAN Card' },
  { key: 'clinicRegistrationProof', label: 'Clinic Registration Proof' },
  { key: 'utilityBill', label: 'Utility Bill' },
  { key: 'purchaseBill', label: 'Purchase Bill' },
  { key: 'rentAgreement', label: 'Rent Agreement' },
  { key: 'clinicLogo', label: 'Clinic Logo / Stamp' },
];

const FilterIcons: Record<string, React.ReactNode> = {
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
};

export default function AdminDoctorApprovalPage() {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [acting, setActing] = useState(false);
  const [activeStatus, setActiveStatus] = useState('SUBMITTED');
  const [searchQuery, setSearchQuery] = useState('');
  const [correctionReasons, setCorrectionReasons] = useState<Record<string, string>>({});
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadDoctors();
    const timer = setInterval(() => loadDoctors(true), 20000);
    return () => clearInterval(timer);
  }, [activeStatus]);

  const loadDoctors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await doctorApi.listForApproval(activeStatus === 'ALL' ? undefined : activeStatus);
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      if (!silent) toast.error('Failed to load doctors');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const selectDoctor = async (doctorId: number) => {
    setLoadingDoctor(true);
    try {
      const res = await doctorApi.getProfileForAdmin(doctorId);
      const profile = res.data;
      setSelectedDoctor(profile);
      setCorrectionReasons(profile.correctionReasons || {});
      setReviewNotes(profile.reviewNotes || '');
    } catch (error) {
      toast.error('Failed to load doctor profile');
    } finally {
      setLoadingDoctor(false);
    }
  };

  const openDocument = async (url: string, title: string) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');
    } catch {
      toast.error('Failed to open document');
    }
  };

  const handleApprove = async () => {
    if (!selectedDoctor || acting) return;
    setActing(true);
    try {
      await doctorApi.approveDoctor(selectedDoctor.doctorId);
      toast.success('Doctor approved');
      setSelectedDoctor(null);
      loadDoctors();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Approval failed');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoctor || acting) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    setActing(true);
    try {
      await doctorApi.rejectDoctor(selectedDoctor.doctorId, reason);
      toast.success('Doctor rejected');
      setSelectedDoctor(null);
      loadDoctors();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Rejection failed');
    } finally {
      setActing(false);
    }
  };

  const handleResubmit = async () => {
    if (!selectedDoctor || acting) return;
    if (Object.keys(correctionReasons).length === 0) {
      toast.error('Add at least one improvement note');
      return;
    }
    setActing(true);
    try {
      await doctorApi.requestResubmission(selectedDoctor.doctorId, {
        reviewNotes,
        correctionReasons,
      });
      toast.success('Sent back for changes');
      setSelectedDoctor(null);
      loadDoctors();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Request failed');
    } finally {
      setActing(false);
    }
  };

  const addCorrection = () => {
    if (!selectedField || !reasonInput.trim()) return;
    setCorrectionReasons(prev => ({ ...prev, [selectedField]: reasonInput.trim() }));
    setSelectedField(null);
    setReasonInput('');
  };

  const documents = REVIEW_FIELDS.map(f => ({
    ...f,
    url: selectedDoctor ? selectedDoctor[`${f.key}Url` as keyof DoctorProfile] as string : '',
  }));

  const filteredDoctors = doctors.filter(d =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFilter = STATUS_FILTERS.find(f => f.value === activeStatus);
  const currentFilterIcon = currentFilter ? FilterIcons[currentFilter.iconName] : <ShieldCheck className="h-4 w-4" />;

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      APPROVED: { label: 'Approved', color: 'bg-green-400/20 text-green-400' },
      REJECTED: { label: 'Rejected', color: 'bg-red-400/20 text-red-400' },
      SUBMITTED: { label: 'Submitted', color: 'bg-blue-400/20 text-blue-400' },
      RESUBMIT_REQUIRED: { label: 'Needs Changes', color: 'bg-amber-400/20 text-amber-400' },
    };
    const config = configs[status] || { label: status, color: 'bg-gray-400/20 text-gray-400' };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <AppLayout role="SUPER_ADMIN" title="Doctor Verification" subtitle="Review submitted doctor profiles, request improvements, and approve verified doctors">
      <div className="space-y-6">
        {/* Overview Card */}
        <Card>
          <div className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-accent/10 p-3">
                  {currentFilterIcon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-light">Doctor Verification Workspace</h2>
                  <p className="text-primary-light/60">Review submitted profiles, request improvements, and approve doctors</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg border border-accent/20 bg-surface-20/50 px-4 py-2 text-lg font-bold text-accent">
                  {doctors.length} {currentFilter?.label}
                </div>
                <Button onClick={() => loadDoctors()} disabled={loading} variant="outline">
                  <RefreshCw className={loading ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Search & Filters */}
        <Card>
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-light/40" />
                <Input
                  placeholder="Search by name, email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map(f => (
                  <Button
                    key={f.value}
                    variant={activeStatus === f.value ? 'primary' : 'outline'}
                    onClick={() => setActiveStatus(f.value)}
                    disabled={loading}
                    className="gap-2"
                  >
                    {FilterIcons[f.iconName]}
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
          {/* Queue Pane */}
          <Card className="lg:max-h-[calc(100vh-200px)] overflow-hidden">
            <div className="p-4 border-b border-tonal-20/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary-light">Queue</h3>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{filteredDoctors.length}</span>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              {loading && filteredDoctors.length === 0 ? (
                <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" /><p className="text-primary-light/60">Loading...</p></div>
              ) : filteredDoctors.length === 0 ? (
                <div className="p-8 text-center">
                  {currentFilterIcon && <div className="h-12 w-12 text-primary-light/30 mx-auto mb-3">{currentFilterIcon}</div>}
                  <p className="text-primary-light/60">{currentFilter?.label || 'No doctors found'}</p>
                </div>
              ) : (
                <div className="divide-y divide-tonal-20/50">
                  {filteredDoctors.map(doc => (
                    <button
                      key={doc.doctorId}
                      onClick={() => selectDoctor(doc.doctorId)}
                      className={`w-full p-4 text-left transition-colors ${selectedDoctor?.doctorId === doc.doctorId ? 'bg-accent/5' : 'hover:bg-surface-20/50'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary-light truncate">{doc.fullName}</p>
                          <p className="text-sm text-primary-light/60">{doc.specialization || 'No specialization'}</p>
                          {doc.hospitalName && <p className="text-xs text-primary-light/50">{doc.hospitalName}</p>}
                          <p className="text-xs text-primary-light/50">{doc.email}</p>
                        </div>
                        {getStatusBadge(doc.approvalStatus)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Detail Pane */}
          <Card className="flex-1 flex flex-col">
            {selectedDoctor ? (
              <>
                <div className="p-4 border-b border-tonal-20/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary-light">{selectedDoctor.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {selectedDoctor.specialization && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{selectedDoctor.specialization}</span>}
                      {selectedDoctor.qualification && <span className="rounded-full bg-primary-light/10 px-2 py-0.5 text-xs text-primary-light/70">{selectedDoctor.qualification}</span>}
                      {getStatusBadge(selectedDoctor.approvalStatus)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setSelectedDoctor(null)} variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Identity & Registration */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3">Identity & Registration</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><span className="text-primary-light/50 text-sm">Registration #</span><p className="text-primary-light">{selectedDoctor.licenseNumber || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Authority</span><p className="text-primary-light">{selectedDoctor.registrationAuthority || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Aadhaar</span><p className="text-primary-light">{selectedDoctor.aadhaarNumber || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">PAN</span><p className="text-primary-light">{selectedDoctor.panNumber || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Experience</span><p className="text-primary-light">{selectedDoctor.experienceYears ? `${selectedDoctor.experienceYears} years` : '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Phone</span><p className="text-primary-light">{selectedDoctor.phone || '—'}</p></div>
                    </div>
                  </div>

                  {/* Practice Details */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3">Practice Details</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><span className="text-primary-light/50 text-sm">Clinic</span><p className="text-primary-light">{selectedDoctor.clinicName || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Clinic Reg #</span><p className="text-primary-light">{selectedDoctor.clinicRegistrationNumber || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Address</span><p className="text-primary-light">{selectedDoctor.address || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Working Days</span><p className="text-primary-light">{selectedDoctor.workingDays || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Hours</span><p className="text-primary-light">{selectedDoctor.consultingHours || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">In-clinic Fee</span><p className="text-primary-light">{selectedDoctor.inClinicFee ? `₹${selectedDoctor.inClinicFee}` : '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Online Fee</span><p className="text-primary-light">{selectedDoctor.onlineFee ? `₹${selectedDoctor.onlineFee}` : '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Reception</span><p className="text-primary-light">{selectedDoctor.receptionPhone || '—'}</p></div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2">Verification Documents <span className="text-primary-light/50 text-sm">({documents.filter(d => d.url).length}/{documents.length})</span></h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {documents.map(doc => (
                        <div key={doc.key} className={`rounded-lg p-3 border ${doc.url ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-primary-light">{doc.label}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs ${doc.url ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                              {doc.url ? 'Uploaded' : 'Missing'}
                            </span>
                          </div>
                          {doc.url && (
                            <Button size="sm" variant="outline" onClick={() => openDocument(doc.url, doc.label)} className="w-full gap-1">
                              <FileText className="h-3 w-3" />
                              Open
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3">Admin Review</h4>

                    {selectedDoctor.reviewNotes && (
                      <div className="mb-4 p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
                        <p className="text-sm font-semibold text-blue-400 mb-1">Latest Admin Note</p>
                        <p className="text-primary-light text-sm">{selectedDoctor.reviewNotes}</p>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 mb-4">
                      <Select
                        label="Field needing improvement"
                        value={selectedField || ''}
                        onChange={e => setSelectedField(e.target.value)}
                        options={[{ value: '', label: 'Select field...' }, ...REVIEW_FIELDS.map(f => ({ value: f.key, label: f.label }))]}
                        disabled={acting || selectedDoctor.approvalStatus === 'APPROVED'}
                      />
                      <Input
                        label="Improvement note"
                        placeholder="What needs to be corrected?"
                        value={reasonInput}
                        onChange={e => setReasonInput(e.target.value)}
                        disabled={acting || selectedDoctor.approvalStatus === 'APPROVED'}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="outline" size="sm" onClick={addCorrection} disabled={!selectedField || !reasonInput.trim() || acting || selectedDoctor.approvalStatus === 'APPROVED'}>
                        Add Improvement Item
                      </Button>
                    </div>

                    {Object.keys(correctionReasons).length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-primary-light mb-2">Requested Improvements:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(correctionReasons).map(([key, reason]) => (
                            <span key={key} className="rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-sm text-amber-400 flex items-center gap-1">
                              <span>{REVIEW_FIELDS.find(f => f.key === key)?.label || key}:</span>
                              <span>{reason}</span>
                              <button onClick={() => setCorrectionReasons(prev => { const n = { ...prev }; delete n[key]; return n; })} className="text-amber-400 hover:text-amber-600">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Textarea
                      label="Admin Notes"
                      placeholder="Optional overall guidance..."
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      rows={3}
                      disabled={acting}
                    />

                    <div className="mt-4 flex gap-3">
                      {selectedDoctor.approvalStatus === 'APPROVED' ? (
                        <div className="rounded-lg bg-green-400/10 border border-green-400/30 p-3 text-green-400 text-sm">
                          This doctor is already approved and has full access.
                        </div>
                      ) : (
                        <>
                          <Button onClick={handleApprove} disabled={acting} className="flex-1">
                            {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Approve Doctor <CheckCircle className="ml-2 h-4 w-4" /></>}
                          </Button>
                          <Button onClick={handleReject} disabled={acting} variant="danger" className="flex-1">
                            {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Reject <XCircle className="ml-2 h-4 w-4" /></>}
                          </Button>
                          <Button onClick={handleResubmit} disabled={acting || Object.keys(correctionReasons).length === 0} variant="outline" className="flex-1">
                            {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Request Changes <AlertCircle className="ml-2 h-4 w-4" /></>}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShieldCheck className="h-16 w-16 text-primary-light/20 mx-auto mb-4" />
                  <p className="text-primary-light/60">Select a doctor from the queue to review their profile</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function getStatusBadge(status: string) {
  const configs: Record<string, { label: string; color: string }> = {
    APPROVED: { label: 'Approved', color: 'bg-green-400/20 text-green-400' },
    REJECTED: { label: 'Rejected', color: 'bg-red-400/20 text-red-400' },
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-400/20 text-blue-400' },
    RESUBMIT_REQUIRED: { label: 'Needs Changes', color: 'bg-amber-400/20 text-amber-400' },
  };
  const config = configs[status] || { label: status, color: 'bg-gray-400/20 text-gray-400' };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>;
}