'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { superAdminApi } from '@/lib/api/endpoints';
import { Building2, UserCheck, BarChart3, ExternalLink } from 'lucide-react';
import { StatCard, StatusBadge } from '@/components/ui';

export default function SuperAdminHospitals() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Backend returns a Spring Page object: { content: [...], totalElements, ... }.
        const { data } = await superAdminApi.getHospitals();
        setHospitals(Array.isArray(data) ? data : (data?.content ?? []));
      } catch (error) {
        console.error('Failed to load hospitals:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      // Backend HospitalStatusUpdateRequest: { status, reason? }.
      await superAdminApi.updateHospitalStatus(id, { status, reason: status === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin' });
      setHospitals((prev) => prev.map((h) => h.id === id ? { ...h, status } : h));
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const stats = useMemo(() => ({
    total: hospitals.length,
    pending: hospitals.filter((h) => h.status === 'PENDING').length,
    active: hospitals.filter((h) => h.status === 'APPROVED').length,
  }), [hospitals]);

  return (
    <AppLayout role="SUPER_ADMIN" title="Hospitals" subtitle="Manage hospital registrations">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Hospitals" value={stats.total} icon={Building2} />
          <StatCard label="Pending Approval" value={stats.pending} icon={UserCheck} />
          <StatCard label="Active" value={stats.active} icon={BarChart3} />
        </div>

        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4 md:p-6">
          <h3 className="text-heading font-bold text-primary-light mb-4">All Hospitals</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8"><p className="text-body text-primary-light/60">Loading...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-tonal-20/50">
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Name</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">City</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Email</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Status</th>
                    <th className="pb-3 text-support font-semibold text-primary-light/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tonal-20/30">
                  {hospitals.map(({ id, name, city, email, status }) => (
                    <tr key={id}>
                      <td className="py-3 text-body text-primary-light">
                        <Link href={`/super-admin/hospitals/${id}`} className="hover:text-accent transition-colors flex items-center gap-1">
                          {name} <ExternalLink size={12} className="text-primary-light/40" />
                        </Link>
                      </td>
                      <td className="py-3 text-body text-primary-light/70">{city || '-'}</td>
                      <td className="py-3 text-body text-primary-light/70">{email}</td>
                      <td className="py-3"><StatusBadge status={status} /></td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          {status !== 'APPROVED' && <button onClick={() => handleStatusChange(id, 'APPROVED')} className="px-3 py-1 bg-success/10 text-success-light rounded-lg text-body font-medium hover:bg-success-fill/20">Approve</button>}
                          {status !== 'REJECTED' && <button onClick={() => handleStatusChange(id, 'REJECTED')} className="px-3 py-1 bg-danger/10 text-danger-light rounded-lg text-body font-medium hover:bg-danger-fill/20">Reject</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
