'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi, hospitalApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, inputClass, Field } from '@/components/ui/FlutterTheme';
import { Stethoscope, MapPin, Search, Banknote, GraduationCap } from 'lucide-react';

interface Hospital { id: number; name: string; address?: string; city?: string; state?: string; country?: string; email?: string; phone?: string; facilityType?: string; status?: string; subscriptionPlan?: string; }
interface Doctor { id?: number; userId?: number; name?: string; speciality?: string; qualification?: string; experienceYears?: number; consultationFee?: any; }

export default function HospitalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const hospitalId = Number(resolvedParams.id);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [speciality, setSpeciality] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!hospitalId) return;
      try {
        const [{ data: h }, { data: d }, { data: serviceData }] = await Promise.all([
          hospitalApi.get(hospitalId),
          doctorApi.search({ hospitalId }),
          hospitalApi.getServices(hospitalId),
        ]);
        setHospital(h);
        setDoctors(Array.isArray(d) ? d : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
      } catch (error) {
        console.error('Failed to load hospital:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hospitalId]);

  const filtered = doctors.filter((d) => !speciality.trim() || (d.speciality ?? '').toLowerCase().includes(speciality.trim().toLowerCase()));

  return (
    <AppLayout role="PATIENT" title={hospital?.name ?? 'Hospital'} subtitle={[hospital?.city, hospital?.state].filter(Boolean).join(', ')}>
      <div className="space-y-5">
        {loading ? (
          <p className="text-sm text-doctor-dim">Loading...</p>
        ) : (
          <>
            {hospital && (
              <DarkCard tone="patient">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-doctor-mint/15 flex items-center justify-center text-doctor-mint shrink-0"><MapPin size={22} /></div>
                  <div>
                    <p className="text-white font-semibold text-lg">{hospital.name}</p>
                    <p className="text-xs text-doctor-muted mt-1">{[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ') || 'Address not listed'}</p>
                    {hospital.phone && <p className="text-xs text-doctor-muted mt-1">Phone: {hospital.phone}</p>}
                    {hospital.email && <p className="text-xs text-doctor-muted mt-1">Email: {hospital.email}</p>}
                    {hospital.facilityType && <p className="text-xs text-doctor-muted mt-1">Type: {hospital.facilityType}</p>}
                    {hospital.status && <p className="text-xs text-doctor-muted mt-1">Status: {hospital.status}</p>}
                  </div>
                </div>
              </DarkCard>
            )}

            <DarkCard tone="patient">
              <h3 className="text-lg font-bold text-white">Services</h3>
              {services.length > 0 ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{services.map((service) => <li key={service} className="rounded-xl bg-doctor-shell px-3 py-2 text-sm text-primary-light">✓ {service}</li>)}</ul> : <p className="mt-2 text-sm text-doctor-muted">No services listed.</p>}
            </DarkCard>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Field label="Filter by speciality">
                  <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} placeholder="e.g. Cardiology" className={inputClass} />
                </Field>
              </div>
            </div>

            <h3 className="text-lg font-bold text-doctor-ink">Doctors ({filtered.length})</h3>
            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-white border border-doctor-border-soft p-6 text-center text-sm text-doctor-dim">No doctors found for this filter.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((d) => (
                  <DarkCard key={d.id ?? d.userId} tone="patient">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-doctor-blue/15 flex items-center justify-center text-doctor-blue shrink-0"><Stethoscope size={22} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">Dr. {d.name ?? '—'}</p>
                        <p className="text-xs text-doctor-muted mt-1">{d.speciality ?? 'General'}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-doctor-muted">
                          {d.qualification && <span className="inline-flex items-center gap-1"><GraduationCap size={12} /> {d.qualification}</span>}
                          {d.experienceYears != null && <span>{d.experienceYears} yrs exp</span>}
                          {d.consultationFee != null && (
                            <span className="inline-flex items-center gap-1"><Banknote size={12} /> ₹{String(d.consultationFee)}</span>
                          )}
                        </div>
                        <div className="mt-3">
                          <ActionButton onClick={() => router.push(`/patient/book/${d.id ?? d.userId}?hospitalId=${hospitalId}`)}>
                            Book appointment
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  </DarkCard>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
