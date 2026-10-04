'use client';

import { useState } from 'react';
import { prescriptionApi } from '@/lib/api/hospital-staff';
import AppLayout from '@/components/layout/AppLayout';
import { PharmacyOrderWorklist } from '@/components/pharmacy/PharmacyOrderWorklist';
import { Card, Button, Input, StatusBadge } from '@/components/ui';
import { Pill, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccessRow {
  id?: number;
  sharedByName?: string;
  sharedWithPharmacyName?: string;
  sharedWithUserName?: string;
  accessType?: string;
  isActive?: boolean;
  reason?: string;
}

export default function PharmacistPrescriptionsPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessRows, setAccessRows] = useState<AccessRow[]>([]);
  const [checking, setChecking] = useState(false);

  const lookup = async () => {
    const id = Number(prescriptionId);
    if (!id) {
      toast.error('Enter a prescription ID');
      return;
    }
    setChecking(true);
    try {
      const [{ data: access }, accessListRes] = await Promise.all([
        prescriptionApi.checkAccess(id),
        prescriptionApi.getAccessList(id).catch(() => ({ data: [] as AccessRow[] })),
      ]);
      setHasAccess(Boolean(access?.hasAccess));
      setAccessRows(Array.isArray(accessListRes.data) ? accessListRes.data : []);
    } catch {
      toast.error('Unable to check prescription access');
      setHasAccess(null);
      setAccessRows([]);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AppLayout role="PHARMACY" title="Prescriptions" subtitle="Shared prescriptions and fulfilment">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-heading font-bold text-primary-light mb-4 flex items-center gap-2">
            <Pill size={18} className="text-accent" /> Prescription access lookup
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <Input label="Prescription ID" type="number" value={prescriptionId} onChange={(event) => setPrescriptionId(event.target.value)} placeholder="e.g. 1024" />
            <Button onClick={lookup} loading={checking}><Search size={15} className="mr-2" /> Check access</Button>
          </div>

          {hasAccess !== null && (
            <div className="mt-4 space-y-3">
              <p className="text-body text-primary-light/80">
                Access:{' '}
                {hasAccess ? <StatusBadge status="GRANTED" /> : <StatusBadge status="DENIED" />}
              </p>
              {accessRows.length > 0 && (
                <div className="space-y-2">
                  {accessRows.map((row, index) => (
                    <div key={row.id ?? index} className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-10/50 rounded-xl">
                      <p className="text-sm text-primary-light/80">
                        {row.sharedByName ?? 'Unknown'} → {row.sharedWithPharmacyName ?? row.sharedWithUserName ?? 'You'}
                        {row.reason ? ` · ${row.reason}` : ''}
                      </p>
                      <StatusBadge status={row.isActive === false ? 'REVOKED' : (row.accessType ?? 'ACTIVE')} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <PharmacyOrderWorklist prescriptionOnly title="Prescription-linked orders" />
      </div>
    </AppLayout>
  );
}
