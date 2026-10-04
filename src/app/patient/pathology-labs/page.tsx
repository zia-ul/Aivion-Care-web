'use client';

import { useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import { PathologyLabDiscoveryResponse, PathologyWorkflowResponse, PathologyRequestCreateRequest } from '@/types/pathology';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { Activity, MapPin, Phone, Clock, Home, CheckCircle, Hourglass, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPathologyLabsPage() {
  const [labs, setLabs] = useState<PathologyLabDiscoveryResponse[]>([]);
  const [myRequests, setMyRequests] = useState<PathologyWorkflowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusIcons: Record<string, { icon: typeof Activity; color: string }> = {
    PENDING: { icon: Hourglass, color: 'text-amber-400' },
    APPROVED: { icon: CheckCircle, color: 'text-green-400' },
    REJECTED: { icon: XCircle, color: 'text-red-400' },
  };

  const loadLabs = async () => {
    setLoading(true);
    try {
      const [labsRes, requestsRes] = await Promise.allSettled([
        pathologyApi.getLabs(),
        pathologyApi.getMyRequests(),
      ]);

      if (labsRes.status === 'fulfilled') {
        setLabs(labsRes.value.data);
      }
      if (requestsRes.status === 'fulfilled') {
        setMyRequests(requestsRes.value.data);
      }
    } catch (error: any) {
      toast.error('Failed to load pathology data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  const handleSubmitRequest = async () => {
    if (!selectedLabId || !requestNote.trim()) {
      toast.error('Please select a lab and enter a note');
      return;
    }
    setSubmitting(true);
    try {
      const data: PathologyRequestCreateRequest = {
        pathologyLabId: selectedLabId,
        requestNote: requestNote.trim(),
      };
      await pathologyApi.createRequest(data);
      toast.success('Pathology request submitted successfully!');
      setShowRequestForm(false);
      setSelectedLabId(null);
      setRequestNote('');
      loadLabs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const config = statusIcons[status] || statusIcons.PENDING;
    const Icon = config.icon;
    return <Icon size={16} className={config.color} />;
  };

  return (
    <AppLayout role="PATIENT" title="Pathology Labs" subtitle="Find approved pathology labs">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-heading font-bold text-primary-light">Available Labs</h2>
          <Button onClick={() => setShowRequestForm(true)} size="sm">
            Request Pathology Test
          </Button>
        </div>

        {showRequestForm && (
          <Card className="p-6">
            <h3 className="text-heading font-bold text-primary-light mb-4">New Pathology Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-light/70 mb-1">Select Lab</label>
                <select
                  value={selectedLabId || ''}
                  onChange={(e) => setSelectedLabId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 bg-surface-10/50 border border-tonal-20/50 rounded-xl text-primary-light focus:outline-none focus:border-accent"
                >
                  <option value="">Select a lab...</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
              <Textarea
                label="Request Note"
                placeholder="Describe the tests you need or any notes for the lab..."
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmitRequest} loading={submitting} className="flex-1">
                  Submit Request
                </Button>
                <Button onClick={() => setShowRequestForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-surface-20/50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-20/50 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : labs.length > 0 ? (
          <div className="space-y-4">
            {labs.map((lab) => (
              <Card key={lab.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Activity size={24} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading font-bold text-primary-light">{lab.name}</h3>
                    <p className="text-body text-primary-light/70 mt-1">{lab.address}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                      {lab.city && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent" />
                          <span>{lab.city}, {lab.state} {lab.pincode}</span>
                        </div>
                      )}
                      {lab.openingDays && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent" />
                          <span>{lab.openingDays}</span>
                        </div>
                      )}
                      {lab.homeCollectionAvailable && (
                        <div className="flex items-center gap-2">
                          <Home size={14} className="text-accent" />
                          <span>Home collection available</span>
                        </div>
                      )}
                      {lab.openingHours && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent" />
                          <span>Hours: {lab.openingHours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Activity size={48} className="mx-auto text-primary-light/20 mb-4" />
            <p className="text-body text-primary-light/60">No pathology labs found</p>
          </Card>
        )}

        {myRequests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-heading font-bold text-primary-light mb-4">My Requests</h2>
            <div className="space-y-3">
              {myRequests.map((req) => (
                <Card key={req.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-medium text-primary-light">
                        Request #{req.id} — {req.pathologyLabName || 'Unknown Lab'}
                      </p>
                      <p className="text-sm text-primary-light/50 mt-1">
                        Status: {req.status} · Created: {new Date(req.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <StatusIcon status={req.status || 'PENDING'} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
