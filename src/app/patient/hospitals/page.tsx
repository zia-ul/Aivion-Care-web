'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { hospitalApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, inputClass, Field } from '@/components/ui/FlutterTheme';
import { Building2, MapPin, Search } from 'lucide-react';

interface Hospital { id: number; name: string; address?: string; city?: string; state?: string; country?: string; email?: string; phone?: string; facilityType?: string; status?: string; subscriptionPlan?: string; }

export default function PatientHospitalsPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (cityFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await hospitalApi.getAll({ city: cityFilter.trim() || undefined });
      const list: Hospital[] = Array.isArray(data) ? data : [];
      setHospitals(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(''); }, [load]);

  return (
    <AppLayout role="PATIENT" title="Find Hospitals" subtitle="Search and book appointments">
      <div className="space-y-5">
        <form
          onSubmit={(e) => { e.preventDefault(); load(city); }}
          className="flex gap-3 items-end"
        >
          <div className="flex-1">
            <Field label="Filter by city">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className={inputClass} />
            </Field>
          </div>
          <ActionButton onClick={() => load(city)} className="mb-0.5">
            <span className="inline-flex items-center gap-2"><Search size={16} /> Search</span>
          </ActionButton>
        </form>

        {loading ? (
          <p className="text-sm text-doctor-dim">Loading hospitals...</p>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-doctor-danger-soft/40 p-5 text-sm text-doctor-red">{error}</div>
        ) : hospitals.length === 0 ? (
          <div className="rounded-3xl bg-white border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">
            No hospitals found. Try a different city.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hospitals.map((h) => (
              <button key={h.id} onClick={() => router.push(`/patient/hospitals/${h.id}`)} className="text-left">
                <DarkCard tone="patient" className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-doctor-mint/15 flex items-center justify-center text-doctor-mint shrink-0">
                      <Building2 size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white font-semibold truncate">{h.name}</p>
                        <Pill color={h.status === 'APPROVED' ? FL.mint : FL.gold}>{h.status ?? ''}</Pill>
                      </div>
                      <p className="text-xs text-doctor-muted mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {[h.address, h.city, h.state, h.country].filter(Boolean).join(', ') || 'Address not listed'}
                      </p>
                      {h.facilityType && <p className="text-xs text-doctor-muted mt-1">{h.facilityType}</p>}
                      {h.phone && <p className="text-xs text-doctor-muted mt-1">Phone: {h.phone}</p>}
                      <div className="mt-3">
                        <ActionButton variant="ghost">View doctors</ActionButton>
                      </div>
                    </div>
                  </div>
                </DarkCard>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
