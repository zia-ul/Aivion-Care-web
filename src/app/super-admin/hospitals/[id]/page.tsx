'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { hospitalApi, superAdminApi } from '@/lib/api/endpoints';
import { Card, Button, StatusBadge } from '@/components/ui';
import { Building2, Mail, Phone, MapPin, Calendar, Shield, Globe, List, ExternalLink, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [hospital, setHospital] = useState<any>(null);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hospitalId, setHospitalId] = useState(0);

  useEffect(() => {
    const load = async () => {
      const resolvedParams = await params;
      const id = parseInt(resolvedParams.id || '0', 10);
      setHospitalId(id);
      setLoading(true);
      try {
        const [detailRes, servicesRes] = await Promise.allSettled([
          hospitalApi.get(hospitalId),
          hospitalApi.getServices(hospitalId),
        ]);
        if (detailRes.status === 'fulfilled') setHospital(detailRes.value.data);
        if (servicesRes.status === 'fulfilled') {
          setServices(servicesRes.value.data || []);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load hospital');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const handleStatusChange = async (status: string) => {
    const reason = window.prompt(`Reason for ${status} (optional):`) || undefined;
    setUpdating(true);
    try {
      await superAdminApi.updateHospitalStatus(hospitalId, { status, reason });
      setHospital((prev: any) => ({ ...prev, status }));
      toast.success(`Hospital status updated to ${status}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout role="SUPER_ADMIN" title="Hospital Details" subtitle="Loading...">
        <p className="text-body text-primary-light/60">Loading hospital details...</p>
      </AppLayout>
    );
  }

  if (!hospital) {
    return (
      <AppLayout role="SUPER_ADMIN" title="Hospital Details" subtitle="Not found">
        <p className="text-body text-primary-light/60">Hospital not found</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="SUPER_ADMIN" title="Hospital Details" subtitle={hospital.name || 'Unknown'}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {hospital.logoUrl ? (
                  <img src={hospital.logoUrl} alt={hospital.name} className="w-16 h-16 rounded-xl object-cover border border-tonal-20/50" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building2 size={32} className="text-accent" />
                  </div>
                )}
                <div>
                  <h2 className="text-heading font-bold text-primary-light">{hospital.name}</h2>
                  <p className="text-body text-primary-light/60 mt-1">{hospital.facilityType || 'Hospital'}</p>
                  <div className="mt-2">
                    <StatusBadge status={hospital.status || 'UNKNOWN'} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={hospital.status === 'APPROVED' ? 'outline' : 'primary'}
                  onClick={() => handleStatusChange('APPROVED')}
                  disabled={updating || hospital.status === 'APPROVED'}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant={hospital.status === 'REJECTED' ? 'outline' : 'outline'}
                  onClick={() => handleStatusChange('REJECTED')}
                  disabled={updating || hospital.status === 'REJECTED'}
                  className="border-danger/50 text-danger-light hover:bg-danger-fill/10"
                >
                  Reject
                </Button>
                <Button size="sm" variant="ghost" onClick={() => router.push('/super-admin/hospitals')}>
                  Back to List
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-heading font-bold text-primary-light mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <Mail size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Email</p>
                  <p className="text-body text-primary-light">{hospital.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <Phone size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Phone</p>
                  <p className="text-body text-primary-light">{hospital.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <MapPin size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Address</p>
                  <p className="text-body text-primary-light">
                    {hospital.address || '-'}{' '}
                    {hospital.city && <span>, {hospital.city}</span>}
                    {hospital.state && <span>, {hospital.state}</span>}
                    {hospital.pincode && <span> {hospital.pincode}</span>}
                  </p>
                </div>
              </div>
              {hospital.hospitalLoginId && (
                <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                  <Shield size={18} className="text-accent" />
                  <div>
                    <p className="text-support text-primary-light/60">Login ID</p>
                    <p className="text-body text-primary-light">{hospital.hospitalLoginId}</p>
                  </div>
                </div>
              )}
              {hospital.logoUrl && (
                <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                  <Globe size={18} className="text-accent" />
                  <div>
                    <p className="text-support text-primary-light/60">Logo URL</p>
                    <a href={hospital.logoUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                      {hospital.logoUrl} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-heading font-bold text-primary-light mb-4">Registration & Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <FileText size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Registration Number</p>
                  <p className="text-body text-primary-light">{hospital.registrationNumber || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-10/50 rounded-xl">
                <Calendar size={18} className="text-accent" />
                <div>
                  <p className="text-support text-primary-light/60">Subscription Plan</p>
                  <p className="text-body text-primary-light">{hospital.subscriptionPlan || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {services.length > 0 && (
          <Card>
            <div className="p-6">
              <h3 className="text-heading font-bold text-primary-light mb-4 flex items-center gap-2">
                <List size={20} className="text-accent" /> Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {services.map((service, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-surface-10/50 border border-tonal-20/50 text-body text-primary-light/70 rounded-lg"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
