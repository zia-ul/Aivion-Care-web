'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import type { PathologyApprovalSummary } from '@/types/pathology';
import toast from 'react-hot-toast';
import { Card, Button, Input, Textarea } from '@/components/ui';
import {
  Microscope, Search, RefreshCw, Loader2, CheckCircle, XCircle,
  AlertCircle, RotateCcw, ShieldCheck, ChevronLeft, User, FileText,
  MapPin, PauseCircle,
} from 'lucide-react';

interface PathologyDocument {
  id?: number;
  documentType?: string;
  fileName?: string;
  status?: string;
  rejectionReason?: string;
  uploadedAt?: string;
}

interface PathologyDetail {
  pathologyProfileId?: number;
  pathologyLabId?: number;
  pathologistId?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  qualification?: string;
  medicalRegistrationNumber?: string;
  registrationCouncil?: string;
  specialization?: string;
  yearsExperience?: number;
  labName?: string;
  displayName?: string;
  labType?: string;
  registrationNumber?: string;
  clinicalEstablishmentNumber?: string;
  nablNumber?: string;
  gstNumber?: string;
  labAddress?: string;
  labCity?: string;
  labState?: string;
  labPincode?: string;
  openingDays?: string;
  openingHours?: string;
  homeCollectionAvailable?: boolean;
  emergencyCollectionAvailable?: boolean;
  services?: string[];
  pathologyApprovalStatus?: string;
  pathologistApprovalStatus?: string;
  approved?: boolean;
  active?: boolean;
  completionPercent?: number;
  rejectionReason?: string;
  approvedAt?: string;
  documents?: PathologyDocument[];
}

const STATUS_FILTERS = [
  { value: 'SUBMITTED', label: 'Submitted', iconName: 'AlertCircle' },
  { value: 'RESUBMIT_REQUIRED', label: 'Resubmit', iconName: 'RotateCcw' },
  { value: 'APPROVED', label: 'Approved', iconName: 'CheckCircle' },
  { value: 'REJECTED', label: 'Rejected', iconName: 'XCircle' },
  { value: 'ALL', label: 'All', iconName: 'ShieldCheck' },
];

const FilterIcons: Record<string, React.ReactNode> = {
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  RotateCcw: <RotateCcw className="h-4 w-4" />,
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
};

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-400/20 text-primary-light/60' },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-400/20 text-blue-400' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-400/20 text-amber-400' },
  APPROVED: { label: 'Approved', color: 'bg-green-400/20 text-green-400' },
  RESUBMIT_REQUIRED: { label: 'Resubmit Required', color: 'bg-amber-400/20 text-amber-400' },
  REJECTED: { label: 'Rejected', color: 'bg-red-400/20 text-red-400' },
  SUSPENDED: { label: 'Suspended', color: 'bg-red-400/20 text-red-400' },
  VERIFIED: { label: 'Verified', color: 'bg-green-400/20 text-green-400' },
  PENDING: { label: 'Pending', color: 'bg-amber-400/20 text-amber-400' },
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) {
    return <span className="rounded-full bg-gray-400/20 px-2 py-0.5 text-xs font-semibold text-primary-light/60">—</span>;
  }
  const config = STATUS_BADGES[status] || { label: status, color: 'bg-gray-400/20 text-primary-light/60' };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>;
}

export default function PathologyApprovalPage() {
  const [submissions, setSubmissions] = useState<PathologyApprovalSummary[]>([]);
  const [selected, setSelected] = useState<PathologyApprovalSummary | null>(null);
  const [detail, setDetail] = useState<PathologyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [acting, setActing] = useState(false);
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadSubmissions();
    const timer = setInterval(() => loadSubmissions(true), 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus]);

  const loadSubmissions = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await superAdminApi.getPathologySubmissions({
        status: activeStatus === 'ALL' ? undefined : activeStatus,
        size: 200,
      });
      setSubmissions(Array.isArray(res.data?.content) ? res.data.content : []);
    } catch (error) {
      if (!silent) toast.error('Failed to load pathology submissions');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const selectSubmission = async (item: PathologyApprovalSummary) => {
    setSelected(item);
    setReason('');
    setDetail(null);
    setLoadingDetail(true);
    try {
      const res = await superAdminApi.getPathologySubmission(item.pathologyProfileId);
      setDetail(res.data ?? null);
    } catch (error) {
      toast.error('Failed to load the submission');
    } finally {
      setLoadingDetail(false);
    }
  };

  const decide = async (action: 'approve' | 'reject' | 'resubmit' | 'suspend') => {
    if (!selected || acting) return;
    const labels: Record<string, string> = {
      approve: 'approve',
      reject: 'reject',
      resubmit: 'send back for resubmission',
      suspend: 'suspend',
    };
    const needsReason = action !== 'approve';
    if (needsReason && !reason.trim()) {
      toast.error('Please provide a reason first.');
      return;
    }
    const ok = window.confirm(
      `Are you sure you want to ${labels[action]} this pathology lab? This also ${
        action === 'approve' ? 'approves' : 'updates'
      } its pathologist account.`
    );
    if (!ok) return;

    setActing(true);
    try {
      const payload = { reason: reason.trim() || undefined, notes: reason.trim() || undefined };
      const id = selected.pathologyProfileId;
      if (action === 'approve') await superAdminApi.approvePathology(id);
      else if (action === 'reject') await superAdminApi.rejectPathology(id, payload);
      else if (action === 'resubmit') await superAdminApi.resubmitPathology(id, payload);
      else await superAdminApi.suspendPathology(id, payload);
      toast.success(`Pathology lab ${labels[action]} action completed successfully`);
      setSelected(null);
      setDetail(null);
      loadSubmissions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to ${labels[action]}`);
    } finally {
      setActing(false);
    }
  };

  const filtered = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (s.labName ?? '').toLowerCase().includes(q) ||
      (s.ownerName ?? '').toLowerCase().includes(q) ||
      (s.city ?? '').toLowerCase().includes(q)
    );
  });

  const currentFilter = STATUS_FILTERS.find((f) => f.value === activeStatus);
  const isApproved = (selected?.pathologyApprovalStatus ?? '') === 'APPROVED';

  return (
    <AppLayout role="SUPER_ADMIN" title="Pathology Approvals" subtitle="Review pathology lab and pathologist onboarding">
      <div className="space-y-6">
        {/* Overview Card */}
        <Card>
          <div className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-accent/10 p-3">
                  <Microscope className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-light">Pathology Approval Dashboard</h2>
                  <p className="text-primary-light/60">Approving a lab also approves its required pathologist account</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg border border-accent/20 bg-surface-20/50 px-4 py-2 text-lg font-bold text-accent">
                  {submissions.length} {currentFilter?.label}
                </div>
                <Button onClick={() => loadSubmissions()} disabled={loading} variant="outline">
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
                  placeholder="Search by lab name, owner or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((f) => (
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

        {/* Queue + Detail */}
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
          {/* Queue Pane */}
          <Card className="lg:max-h-[calc(100vh-200px)] overflow-hidden">
            <div className="p-4 border-b border-tonal-20/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary-light">Labs Queue</h3>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{filtered.length}</span>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              {loading && filtered.length === 0 ? (
                <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" /><p className="text-primary-light/60">Loading...</p></div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <Microscope className="h-12 w-12 text-primary-light/30 mx-auto mb-3" />
                  <p className="text-primary-light/60">No pathology submissions found</p>
                </div>
              ) : (
                <div className="divide-y divide-tonal-20/50">
                  {filtered.map((s) => (
                    <button
                      key={s.pathologyProfileId}
                      onClick={() => selectSubmission(s)}
                      className={`w-full p-4 text-left transition-colors ${selected?.pathologyProfileId === s.pathologyProfileId ? 'bg-accent/5' : 'hover:bg-surface-20/50'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Microscope className="h-4 w-4 text-accent shrink-0" />
                            <p className="font-semibold text-primary-light truncate">{s.labName || `Lab #${s.pathologyLabId}`}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-primary-light/60">
                            {s.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.city}</span>}
                            {s.ownerName && <span className="truncate">{s.ownerName}</span>}
                          </div>
                        </div>
                        <StatusBadge status={s.pathologyApprovalStatus} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Detail Pane */}
          <Card className="flex-1 flex flex-col">
            {selected ? (
              <>
                <div className="p-4 border-b border-tonal-20/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Microscope className="h-5 w-5 text-accent shrink-0" />
                      <h3 className="text-lg font-bold text-primary-light truncate">{selected.labName || `Lab #${selected.pathologyLabId}`}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-primary-light/50">Lab: <StatusBadge status={selected.pathologyApprovalStatus} /></span>
                      <span className="flex items-center gap-1 text-xs text-primary-light/50">Pathologist: <StatusBadge status={selected.pathologistApprovalStatus} /></span>
                      {selected.submittedAt && (
                        <span className="text-xs text-primary-light/40">Submitted {new Date(selected.submittedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => { setSelected(null); setDetail(null); }} variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingDetail ? (
                    <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" /><p className="text-primary-light/60">Loading submission...</p></div>
                  ) : (
                    <>
                      {/* Lab details */}
                      <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                        <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><Microscope className="h-5 w-5" />Lab Details</h4>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div><span className="text-primary-light/50 text-sm">Lab Name</span><p className="text-primary-light">{detail?.labName || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Display Name</span><p className="text-primary-light">{detail?.displayName || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Lab Type</span><p className="text-primary-light">{detail?.labType || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Registration #</span><p className="text-primary-light">{detail?.registrationNumber || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Clinical Establishment #</span><p className="text-primary-light">{detail?.clinicalEstablishmentNumber || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">NABL #</span><p className="text-primary-light">{detail?.nablNumber || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">GST #</span><p className="text-primary-light">{detail?.gstNumber || '—'}</p></div>
                          <div className="sm:col-span-2 lg:col-span-3"><span className="text-primary-light/50 text-sm">Address</span><p className="text-primary-light">{detail?.labAddress || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">City</span><p className="text-primary-light">{detail?.labCity || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">State</span><p className="text-primary-light">{detail?.labState || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Pincode</span><p className="text-primary-light">{detail?.labPincode || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Opening Days</span><p className="text-primary-light">{detail?.openingDays || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Opening Hours</span><p className="text-primary-light">{detail?.openingHours || '—'}</p></div>
                          <div>
                            <span className="text-primary-light/50 text-sm">Home Collection</span>
                            <p className="text-primary-light">{detail?.homeCollectionAvailable ? 'Available' : 'Not available'}</p>
                          </div>
                          <div>
                            <span className="text-primary-light/50 text-sm">Emergency Collection</span>
                            <p className="text-primary-light">{detail?.emergencyCollectionAvailable ? 'Available' : 'Not available'}</p>
                          </div>
                          {!!detail?.services?.length && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <span className="text-primary-light/50 text-sm">Services</span>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {detail.services.map((s) => (
                                  <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Pathologist details */}
                      <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                        <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><User className="h-5 w-5" />Pathologist</h4>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div><span className="text-primary-light/50 text-sm">Full Name</span><p className="text-primary-light">{detail?.fullName || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Qualification</span><p className="text-primary-light">{detail?.qualification || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Specialization</span><p className="text-primary-light">{detail?.specialization || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Registration #</span><p className="text-primary-light">{detail?.medicalRegistrationNumber || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Registration Council</span><p className="text-primary-light">{detail?.registrationCouncil || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Experience</span><p className="text-primary-light">{detail?.yearsExperience != null ? `${detail.yearsExperience} yrs` : '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Email</span><p className="text-primary-light break-all">{detail?.email || '—'}</p></div>
                          <div><span className="text-primary-light/50 text-sm">Phone</span><p className="text-primary-light">{detail?.phone || '—'}</p></div>
                        </div>
                      </div>
                      {/* Documents */}
                      <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                        <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><FileText className="h-5 w-5" />Submitted Documents</h4>
                        {(!detail?.documents?.length) ? (
                          <p className="text-sm text-primary-light/60">No documents were submitted.</p>
                        ) : (
                          <div className="space-y-2">
                            {detail.documents.map((doc, idx) => (
                              <div key={idx} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-10/50 p-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-primary-light break-words">{doc.documentType || 'Document'}</p>
                                  <p className="text-xs text-primary-light/50 break-words">{doc.fileName || '—'}</p>
                                  {doc.rejectionReason && <p className="text-xs text-red-400 mt-1">Reason: {doc.rejectionReason}</p>}
                                </div>
                                <StatusBadge status={doc.status} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {detail?.rejectionReason && (
                        <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-4">
                          <p className="font-semibold text-red-400 mb-1">Rejection Reason:</p>
                          <p className="text-primary-light">{detail.rejectionReason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="border-t border-tonal-20/50 p-4">
                        <h4 className="font-semibold text-primary-light mb-2">Actions</h4>
                        {isApproved ? (
                          <div className="rounded-lg bg-green-400/10 border border-green-400/30 p-3 text-green-400 text-sm">
                            This pathology lab is already approved and active.
                          </div>
                        ) : (
                          <>
                            <Textarea
                              placeholder="Review notes (optional for approve, recommended for reject / resubmit / suspend)"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              rows={2}
                              className="mb-3"
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                onClick={() => decide('approve')}
                                disabled={acting || loadingDetail}
                                className="flex-1"
                              >
                                {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Approve Lab &amp; Pathologist <CheckCircle className="ml-2 h-4 w-4" /></>}
                              </Button>
                              <Button onClick={() => decide('resubmit')} disabled={acting || loadingDetail} variant="outline" className="flex-1">
                                {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Send Back <RotateCcw className="ml-2 h-4 w-4" /></>}
                              </Button>
                              <Button onClick={() => decide('reject')} disabled={acting || loadingDetail} variant="danger" className="flex-1">
                                {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Reject <XCircle className="ml-2 h-4 w-4" /></>}
                              </Button>
                              <Button onClick={() => decide('suspend')} disabled={acting || loadingDetail} variant="outline" className="flex-1">
                                {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Suspend <PauseCircle className="ml-2 h-4 w-4" /></>}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Microscope className="h-16 w-16 text-primary-light/20 mx-auto mb-4" />
                  <p className="text-primary-light/60">Select a pathology lab from the queue to review its onboarding</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
