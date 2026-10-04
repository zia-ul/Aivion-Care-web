'use client';

import AppLayout from '@/components/layout/AppLayout';
import { PharmacyOrderWorklist } from '@/components/pharmacy/PharmacyOrderWorklist';

export default function PharmacistOrdersPage() {
  return (
    <AppLayout role="PHARMACY" title="Orders" subtitle="Dispense and manage medicine orders">
      <div className="max-w-6xl mx-auto space-y-6">
        <PharmacyOrderWorklist title="All pharmacy orders" />
      </div>
    </AppLayout>
  );
}
