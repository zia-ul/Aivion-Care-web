'use client';

import { useEffect, useState } from 'react';
import { subscriptionApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Modal } from '@/components/ui';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CheckCircle, XCircle, Hourglass, AlertCircle, Eye, User, Calendar, MapPin, Stethoscope, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

interface FreeSubscriptionRequest {
  id: number;
  doctorId: number;
  doctorName: string;
  clinicName: string;
  clinicAddress: string;
  specialization: string;
  experienceYears: number;
  medicalLicenseNumber: string;
  medicalLicenseDocUrl?: string;
  degreeCertificateUrl?: string;
  governmentIdUrl?: string;
  annualPatientVolume?: number;
  consultationFee?: number;
  reasonForFreeSubscription: string;
  additionalNotes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  adminReviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Hourglass },
  APPROVED: { label: 'Approved', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
  EXPIRED: { label: 'Expired', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: AlertCircle },
} as const;

export default function FreeSubscriptionRequestsPage() {
  const [requests, setRequests] = useState<FreeSubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<FreeSubscriptionRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState({ approved: true, adminReviewNotes: '', approvedUntil: '' });
  const [reviewing, setReviewing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadRequests();
  }, [page, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const params: any = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await subscriptionApi.getAllFreeRequests(params);
      setRequests(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error: any) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (request: FreeSubscriptionRequest) => {
    try {
      const res = await subscriptionApi.getFreeRequest(request.id);
      setSelectedRequest(res.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load request details');
    }
  };

  const handleReview = async () => {
    if (!selectedRequest) return;
    setReviewing(true);
    try {
      await subscriptionApi.reviewFreeRequest(selectedRequest.id, {
        approved: reviewData.approved,
        adminReviewNotes: reviewData.adminReviewNotes,
        approvedUntil: reviewData.approvedUntil || undefined,
      });
      toast.success(`Request ${reviewData.approved ? 'approved' : 'rejected'} successfully!`);
      setShowModal(false);
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Review failed');
    } finally {
      setReviewing(false);
    }
  };

  const openReviewModal = (request: FreeSubscriptionRequest) => {
    setSelectedRequest(request);
    setReviewData({ approved: true, adminReviewNotes: '', approvedUntil: '' });
    setShowModal(true);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (loading) {
    return (
      <AppLayout role="SUPER_ADMIN" title="Free Subscription Requests" subtitle="Manage doctor free subscription requests">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-accent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="SUPER_ADMIN" title="Free Subscription Requests" subtitle="Manage doctor free subscription requests">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h3 className="text-heading font-bold text-primary-light">All Requests ({totalElements})</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-tonal-20/50 rounded-input bg-surface-10/50 text-primary-light"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </Card>

        {/* Requests Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-tonal-20/50">
                  <th className="text-left p-4 font-semibold text-primary-light/70">Doctor</th>
                  <th className="text-left p-4 font-semibold text-primary-light/70">Clinic</th>
                  <th className="text-left p-4 font-semibold text-primary-light/70">Specialization</th>
                  <th className="text-left p-4 font-semibold text-primary-light/70">Submitted</th>
                  <th className="text-left p-4 font-semibold text-primary-light/70">Status</th>
                  <th className="text-left p-4 font-semibold text-primary-light/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-primary-light/50">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="border-b border-tonal-20/30 hover:bg-surface-10/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            {request.doctorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-primary-light">{request.doctorName}</p>
                            <p className="text-sm text-primary-light/50">ID: {request.doctorId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-primary-light">{request.clinicName}</p>
                        <p className="text-sm text-primary-light/50 truncate max-w-xs">{request.clinicAddress}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-sm">{request.specialization}</span>
                        <p className="text-sm text-primary-light/50 mt-1">{request.experienceYears} years exp.</p>
                      </td>
                      <td className="p-4 text-primary-light/70">{formatDate(request.createdAt)}</td>
                      <td className="p-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(request)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'PENDING' && (
                            <Button variant="outline" size="sm" onClick={() => openReviewModal(request)}>
                              Review
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-tonal-20/50">
              <p className="text-sm text-primary-light/60">
                Page {page + 1} of {totalPages} ({totalElements} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Detail/Review Modal */}
        {showModal && selectedRequest && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Details" size="lg">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Doctor Name</p>
                  <p className="text-body text-primary-light flex items-center gap-2">
                    <User className="h-4 w-4" /> {selectedRequest.doctorName}
                  </p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Doctor ID</p>
                  <p className="text-body text-primary-light">#{selectedRequest.doctorId}</p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Clinic</p>
                  <p className="text-body text-primary-light flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {selectedRequest.clinicName}
                  </p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Specialization</p>
                  <p className="text-body text-primary-light flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" /> {selectedRequest.specialization}
                  </p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4 sm:col-span-2">
                  <p className="text-support text-primary-light/60 mb-1">Clinic Address</p>
                  <p className="text-body text-primary-light">{selectedRequest.clinicAddress}</p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Experience</p>
                  <p className="text-body text-primary-light">{selectedRequest.experienceYears} years</p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">License Number</p>
                  <p className="text-body text-primary-light">{selectedRequest.medicalLicenseNumber}</p>
                </div>
                {selectedRequest.annualPatientVolume && (
                  <div className="rounded-input border border-tonal-20/50 p-4">
                    <p className="text-support text-primary-light/60 mb-1">Annual Patient Volume</p>
                    <p className="text-body text-primary-light">{selectedRequest.annualPatientVolume}</p>
                  </div>
                )}
                {selectedRequest.consultationFee && (
                  <div className="rounded-input border border-tonal-20/50 p-4">
                    <p className="text-support text-primary-light/60 mb-1">Consultation Fee</p>
                    <p className="text-body text-primary-light">₹{selectedRequest.consultationFee}</p>
                  </div>
                )}
              </div>

              <div className="rounded-input border border-tonal-20/50 p-4">
                <p className="text-support text-primary-light/60 mb-1">Reason for Request</p>
                <p className="text-body text-primary-light whitespace-pre-wrap">{selectedRequest.reasonForFreeSubscription}</p>
              </div>

              {selectedRequest.additionalNotes && (
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Additional Notes</p>
                  <p className="text-body text-primary-light whitespace-pre-wrap">{selectedRequest.additionalNotes}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Medical License Doc</p>
                  {selectedRequest.medicalLicenseDocUrl ? (
                    <a href={selectedRequest.medicalLicenseDocUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" /> View Document
                    </a>
                  ) : (
                    <p className="text-primary-light/50">Not provided</p>
                  )}
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Degree Certificate</p>
                  {selectedRequest.degreeCertificateUrl ? (
                    <a href={selectedRequest.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" /> View Document
                    </a>
                  ) : (
                    <p className="text-primary-light/50">Not provided</p>
                  )}
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Government ID</p>
                  {selectedRequest.governmentIdUrl ? (
                    <a href={selectedRequest.governmentIdUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" /> View Document
                    </a>
                  ) : (
                    <p className="text-primary-light/50">Not provided</p>
                  )}
                </div>
              </div>

              {selectedRequest.status !== 'PENDING' && (
                <div className={`rounded-input p-4 ${selectedRequest.status === 'APPROVED' ? 'border-green-400/50 bg-green-400/10' : 'border-red-400/50 bg-red-400/10'}`}>
                  <p className="font-semibold text-primary-light mb-1">Admin Review</p>
                  <p className="text-sm text-primary-light/70">Reviewed by: {selectedRequest.reviewedBy || 'Unknown'}</p>
                  <p className="text-sm text-primary-light/70">Reviewed on: {selectedRequest.reviewedAt ? formatDate(selectedRequest.reviewedAt) : 'Unknown'}</p>
                  {selectedRequest.adminReviewNotes && (
                    <p className="mt-2 text-primary-light">{selectedRequest.adminReviewNotes}</p>
                  )}
                  {selectedRequest.status === 'APPROVED' && selectedRequest.approvedUntil && (
                    <p className="mt-2 text-green-400 font-medium">Access valid until: {formatDate(selectedRequest.approvedUntil)}</p>
                  )}
                </div>
              )}

              {selectedRequest.status === 'PENDING' && (
                <div className="border-t border-tonal-20/50 pt-6 space-y-4">
                  <h4 className="font-semibold text-primary-light">Review Decision</h4>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="decision"
                        value="true"
                        checked={reviewData.approved}
                        onChange={() => setReviewData({ ...reviewData, approved: true })}
                        className="text-accent"
                      />
                      <span className="text-primary-light">Approve</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="decision"
                        value="false"
                        checked={!reviewData.approved}
                        onChange={() => setReviewData({ ...reviewData, approved: false })}
                        className="text-accent"
                      />
                      <span className="text-primary-light">Reject</span>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-primary-light mb-1">Admin Review Notes (required for rejection)</label>
                      <textarea
                        value={reviewData.adminReviewNotes}
                        onChange={(e) => setReviewData({ ...reviewData, adminReviewNotes: e.target.value })}
                        placeholder="Enter review notes..."
                        rows={3}
                        className="w-full px-4 py-2 border border-tonal-20/50 rounded-input bg-surface-10/50 text-primary-light"
                      />
                    </div>
                    {reviewData.approved && (
                      <div>
                        <label className="block text-sm font-medium text-primary-light mb-1">Access Valid Until (optional)</label>
                        <input
                          type="date"
                          value={reviewData.approvedUntil}
                          onChange={(e) => setReviewData({ ...reviewData, approvedUntil: e.target.value })}
                          className="w-full px-4 py-2 border border-tonal-20/50 rounded-input bg-surface-10/50 text-primary-light"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={handleReview} loading={reviewing} className={reviewData.approved ? '' : 'bg-danger hover:bg-danger-fill/90'}>
                      {reviewing ? 'Processing...' : reviewData.approved ? 'Approve' : 'Reject'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}

function StatusBadgeComponent({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}