'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscriptionApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { FileText, ShieldCheck, Hourglass, AlertCircle, Loader2, ArrowRight, CheckCircle, XCircle, Eye, LogOut } from 'lucide-react';
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

export default function FreeSubscriptionRequestPage() {
  const router = useRouter();
  const [request, setRequest] = useState<FreeSubscriptionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    annualPatientVolume: '',
    consultationFee: '',
    reasonForFreeSubscription: '',
    additionalNotes: '',
  });

  useEffect(() => {
    loadRequest();
  }, []);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getMyFreeRequest();
      setRequest(res.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    // Validate required fields
    const requiredFields = ['reasonForFreeSubscription'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData].trim() === '') {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await subscriptionApi.createFreeRequest({
        annualPatientVolume: formData.annualPatientVolume ? parseInt(formData.annualPatientVolume) : undefined,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        reasonForFreeSubscription: formData.reasonForFreeSubscription,
        additionalNotes: formData.additionalNotes || undefined,
      });
      toast.success('Free subscription request submitted successfully!');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout role="DOCTOR" title="Free Subscription Request" subtitle="Request free appointment access">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-12 w-12 text-accent" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const statusConfig = {
    PENDING: { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10', icon: Hourglass, description: 'Your request is being reviewed by the admin team.' },
    APPROVED: { label: 'Approved', color: 'text-green-400 bg-green-400/10', icon: CheckCircle, description: 'Your request has been approved! You now have appointment access without subscription.' },
    REJECTED: { label: 'Rejected', color: 'text-red-400 bg-red-400/10', icon: XCircle, description: 'Your request was rejected. Please check the review notes below.' },
    EXPIRED: { label: 'Expired', color: 'text-gray-400 bg-gray-400/10', icon: AlertCircle, description: 'Your approved access has expired.' },
  } as const;

  return (
    <AppLayout role="DOCTOR" title="Free Subscription Request" subtitle="Request free appointment access without paid subscription">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Existing Request Status */}
        {request && (
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`rounded-full p-3 ${request.status === 'APPROVED' ? 'bg-green-400/10 text-green-400' : request.status === 'REJECTED' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'}`}>
                  {(() => {
                    const Icon = statusConfig[request.status].icon;
                    return Icon ? <Icon className="h-6 w-6" /> : null;
                  })()}
                </div>
                <div>
                  <h2 className="text-heading font-bold text-primary-light">Request Status: {statusConfig[request.status].label}</h2>
                  <p className="text-support text-primary-light/60">{statusConfig[request.status].description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Annual Patient Volume</p>
                  <p className="text-body text-primary-light">{request.annualPatientVolume || 'Not provided'}</p>
                </div>
                <div className="rounded-input border border-tonal-20/50 p-4">
                  <p className="text-support text-primary-light/60 mb-1">Consultation Fee</p>
                  <p className="text-body text-primary-light">{request.consultationFee ? `₹${request.consultationFee}` : 'Not provided'}</p>
                </div>
              </div>

              {request.adminReviewNotes && (
                <div className="mt-4 rounded-input border border-blue-400/50 bg-blue-400/10 p-4">
                  <p className="font-semibold text-blue-400 mb-1">Admin Review Notes:</p>
                  <p className="text-primary-light">{request.adminReviewNotes}</p>
                </div>
              )}

              {request.status === 'APPROVED' && request.approvedUntil && (
                <div className="mt-4 rounded-input border border-green-400/50 bg-green-400/10 p-4">
                  <p className="font-semibold text-green-400 mb-1">Access Valid Until:</p>
                  <p className="text-primary-light">{new Date(request.approvedUntil).toLocaleDateString()}</p>
                </div>
              )}

              {request.status === 'PENDING' && (
                <div className="mt-4 text-center text-sm text-primary-light/60">
                  <p>Submitted on {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* New Request Form - only show if no pending/approved request */}
        {!request || request.status === 'REJECTED' || request.status === 'EXPIRED' ? (
          <Card>
            <div className="p-6">
              <h3 className="text-heading font-bold text-primary-light mb-6">Submit Free Subscription Request</h3>
              <p className="text-body text-primary-light/60 mb-6">
                Fill out the form below to request free appointment access. This is for doctors who cannot afford a paid subscription.
                The admin team will review your request and respond within 2-3 business days.
              </p>

              <div className="space-y-5">
                <Input
                  label="Annual Patient Volume (optional)"
                  type="number"
                  value={formData.annualPatientVolume}
                  onChange={(e) => setFormData({ ...formData, annualPatientVolume: e.target.value })}
                  placeholder="e.g., 1000"
                />

                <Input
                  label="Consultation Fee (optional)"
                  type="number"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  placeholder="e.g., 500"
                />

                <Textarea
                  label="Reason for Free Subscription Request"
                  value={formData.reasonForFreeSubscription}
                  onChange={(e) => setFormData({ ...formData, reasonForFreeSubscription: e.target.value })}
                  placeholder="Explain why you need a free subscription (e.g., serving underserved community, starting new practice, financial constraints)"
                  required
                  rows={4}
                />

                <Textarea
                  label="Additional Notes (optional)"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any additional information you'd like to share"
                  rows={3}
                />

                <Button onClick={handleSubmit} loading={submitting} className="w-full" size="lg">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  );
}