'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';
import { Card, Button, Input } from '@/components/ui';
import { ShieldCheck, Search, Filter, RefreshCw, Loader2, CheckCircle, XCircle, AlertCircle, Building2, MapPin, Mail, Phone, Eye, MoreVertical, ChevronLeft } from 'lucide-react';

interface Hospital {
  hospital_id: number;
  hospital_name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMIT';
  facilityType?: string;
  registration_number?: string;
  address?: string;
  head_user_id?: number;
  head_name?: string;
  head_email?: string;
  head_phone?: string;
  rejectionReason?: string;
  createdAt?: string;
}

const STATUS_FILTERS = [
  { value: 'PENDING', label: 'Pending', iconName: 'AlertCircle' },
  { value: 'APPROVED', label: 'Approved', iconName: 'CheckCircle' },
  { value: 'REJECTED', label: 'Rejected', iconName: 'XCircle' },
  { value: 'ALL', label: 'All', iconName: 'ShieldCheck' },
];

const FilterIcons: Record<string, React.ReactNode> = {
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  XCircle: <XCircle className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
};

export default function AdminHospitalApprovalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [activeStatus, setActiveStatus] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHospitals();
    const timer = setInterval(() => loadHospitals(true), 30000);
    return () => clearInterval(timer);
  }, [activeStatus]);

  const loadHospitals = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await superAdminApi.getHospitals();
      let data = Array.isArray(res.data) ? res.data : [];
      if (activeStatus !== 'ALL') {
        data = data.filter((h: Hospital) => h.status === activeStatus);
      }
      setHospitals(data);
    } catch (error) {
      if (!silent) toast.error('Failed to load hospitals');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    if (acting) return;
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this hospital?`);
    if (!confirm) return;

    setActing(true);
    try {
      await superAdminApi.updateHospitalStatus(id, { status });
      toast.success(`Hospital ${status.toLowerCase()} successfully`);
      setSelectedHospital(null);
      loadHospitals();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to ${status.toLowerCase()}`);
    } finally {
      setActing(false);
    }
  };

  const filteredHospitals = hospitals.filter(h =>
    h.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFilter = STATUS_FILTERS.find(f => f.value === activeStatus);
  const currentFilterIcon = currentFilter ? FilterIcons[currentFilter.iconName] : <ShieldCheck className="h-4 w-4" />;

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'Pending', color: 'bg-amber-400/20 text-amber-400' },
      SUBMITTED: { label: 'Submitted', color: 'bg-blue-400/20 text-blue-400' },
      APPROVED: { label: 'Approved', color: 'bg-green-400/20 text-green-400' },
      REJECTED: { label: 'Rejected', color: 'bg-red-400/20 text-red-400' },
      RESUBMIT: { label: 'Resubmit', color: 'bg-amber-400/20 text-amber-400' },
    };
    const config = configs[status] || { label: status, color: 'bg-gray-400/20 text-gray-400' };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <AppLayout role="SUPER_ADMIN" title="Hospital Approvals" subtitle="Review and approve hospital registrations">
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
                  <h2 className="text-xl font-bold text-primary-light">Hospital Approval Dashboard</h2>
                  <p className="text-primary-light/60">Review and approve hospital registrations</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg border border-accent/20 bg-surface-20/50 px-4 py-2 text-lg font-bold text-accent">
                  {hospitals.length} {currentFilter?.label}
                </div>
                <Button onClick={() => loadHospitals()} disabled={loading} variant="outline">
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
                  placeholder="Search by name, email, city..."
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

        {/* Hospitals Grid */}
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
          {/* Queue Pane */}
          <Card className="lg:max-h-[calc(100vh-200px)] overflow-hidden">
            <div className="p-4 border-b border-tonal-20/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary-light">Hospitals Queue</h3>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{filteredHospitals.length}</span>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              {loading && filteredHospitals.length === 0 ? (
                <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" /><p className="text-primary-light/60">Loading...</p></div>
              ) : filteredHospitals.length === 0 ? (
                <div className="p-8 text-center">
                  {currentFilterIcon && <div className="h-12 w-12 text-primary-light/30 mx-auto mb-3">{currentFilterIcon}</div>}
                  <p className="text-primary-light/60">No hospitals found</p>
                </div>
              ) : (
                <div className="divide-y divide-tonal-20/50">
                  {filteredHospitals.map(h => (
                    <button
                      key={h.hospital_id}
                      onClick={() => setSelectedHospital(h)}
                      className={`w-full p-4 text-left transition-colors ${selectedHospital?.hospital_id === h.hospital_id ? 'bg-accent/5' : 'hover:bg-surface-20/50'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-accent" />
                            <p className="font-semibold text-primary-light truncate">{h.hospital_name}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-primary-light/60">
                            {h.facilityType && <span className="rounded-full bg-accent/10 px-2 py-0.5">{h.facilityType}</span>}
                            {h.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.city}</span>}
                            {h.state && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.state}</span>}
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{h.email}</span>
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{h.phone}</span>
                          </div>
                        </div>
                        {getStatusBadge(h.status)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Detail Pane */}
          <Card className="flex-1 flex flex-col">
            {selectedHospital ? (
              <>
                <div className="p-4 border-b border-tonal-20/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-bold text-primary-light">{selectedHospital.hospital_name}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedHospital.facilityType && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{selectedHospital.facilityType}</span>}
                      {getStatusBadge(selectedHospital.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setSelectedHospital(null)} variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Hospital Details */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><Building2 className="h-5 w-5" />Hospital Details</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div><span className="text-primary-light/50 text-sm">Registration #</span><p className="text-primary-light">{selectedHospital.registration_number || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Facility Type</span><p className="text-primary-light">{selectedHospital.facilityType || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Status</span><p className="text-primary-light">{getStatusBadge(selectedHospital.status)}</p></div>
                      <div className="sm:col-span-2"><span className="text-primary-light/50 text-sm">Address</span><p className="text-primary-light">{selectedHospital.address || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">City</span><p className="text-primary-light">{selectedHospital.city || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">State</span><p className="text-primary-light">{selectedHospital.state || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Email</span><p className="text-primary-light">{selectedHospital.email}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Phone</span><p className="text-primary-light">{selectedHospital.phone}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Created</span><p className="text-primary-light">{selectedHospital.createdAt ? new Date(selectedHospital.createdAt).toLocaleDateString() : '—'}</p></div>
                    </div>
                  </div>

                  {/* Administrator Details */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Administrator Contact</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><span className="text-primary-light/50 text-sm">Head Name</span><p className="text-primary-light">{selectedHospital.head_name || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Head Email</span><p className="text-primary-light">{selectedHospital.head_email || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Head Phone</span><p className="text-primary-light">{selectedHospital.head_phone || '—'}</p></div>
                      <div><span className="text-primary-light/50 text-sm">Head User ID</span><p className="text-primary-light">{selectedHospital.head_user_id || '—'}</p></div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {selectedHospital.rejectionReason && (
                    <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-4">
                      <p className="font-semibold text-red-400 mb-1">Rejection Reason:</p>
                      <p className="text-primary-light">{selectedHospital.rejectionReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="rounded-lg border border-tonal-20/50 bg-surface-20/50 p-4">
                    <h4 className="font-semibold text-primary-light mb-3">Actions</h4>
                    {selectedHospital.status === 'APPROVED' ? (
                      <div className="rounded-lg bg-green-400/10 border border-green-400/30 p-3 text-green-400 text-sm">
                        This hospital is already approved and has full access.
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => updateStatus(selectedHospital.hospital_id, 'APPROVED')} disabled={acting} className="flex-1">
                          {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Approve Hospital <CheckCircle className="ml-2 h-4 w-4" /></>}
                        </Button>
                        <Button onClick={() => updateStatus(selectedHospital.hospital_id, 'REJECTED')} disabled={acting} variant="danger" className="flex-1">
                          {acting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : <>Reject <XCircle className="ml-2 h-4 w-4" /></>}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShieldCheck className="h-16 w-16 text-primary-light/20 mx-auto mb-4" />
                  <p className="text-primary-light/60">Select a hospital from the queue to review their details</p>
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
    PENDING: { label: 'Pending', color: 'bg-amber-400/20 text-amber-400' },
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-400/20 text-blue-400' },
    APPROVED: { label: 'Approved', color: 'bg-green-400/20 text-green-400' },
    REJECTED: { label: 'Rejected', color: 'bg-red-400/20 text-red-400' },
    RESUBMIT: { label: 'Resubmit', color: 'bg-amber-400/20 text-amber-400' },
  };
  const config = configs[status] || { label: status, color: 'bg-gray-400/20 text-gray-400' };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.color}`}>{config.label}</span>;
}