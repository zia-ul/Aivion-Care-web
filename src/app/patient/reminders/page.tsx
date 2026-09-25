'use client';

import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { patientApi } from '@/lib/api/endpoints';
import { DarkCard, Pill, ActionButton, FL, SectionTitle } from '@/components/ui/FlutterTheme';
import { Pill as PillIcon, Play, Check, X } from 'lucide-react';

interface Reminder {
  id: number; consultationId?: number; medicineName?: string; dosage?: string; frequency?: string;
  timing?: string; durationDays?: number; startDate?: string; active?: boolean;
  adherenceStatus?: string; doses?: any[];
}

export default function PatientRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend: GET /medication-reminders/my (PATIENT only)
      const { data } = await patientApi.getMedicationReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const start = async (id: number) => {
    setBusyId(id);
    try {
      await patientApi.startMedicationReminder(id);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to start reminder');
    } finally {
      setBusyId(null);
    }
  };

  const logDose = async (id: number, status: 'TAKEN' | 'SKIPPED') => {
    setBusyId(id);
    try {
      // Backend: POST /medication-reminders/{id}/adherence { scheduledDate, doseTime, status }
      const now = new Date();
      await patientApi.logAdherence(id, {
        scheduledDate: now.toISOString().split('T')[0],
        doseTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        status,
      });
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to log dose');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppLayout role="PATIENT" title="Medicines" subtitle="Reminders & adherence tracking">
      <div className="space-y-5">
        <SectionTitle>Your prescriptions</SectionTitle>
        {loading ? (
          <p className="text-sm text-[#5B7A88]">Loading reminders...</p>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-[#F09595]/40 p-5 text-sm text-[#C25A5A]">{error}</div>
        ) : reminders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#D6ECF1] p-6 text-center text-sm text-[#5B7A88]">
            No medication reminders yet. They are created when your doctor sends a prescription.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reminders.map((r) => (
              <DarkCard key={r.id} tone="patient">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#F3C979]/15 flex items-center justify-center text-[#F3C979] shrink-0"><PillIcon size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold">{r.medicineName ?? 'Medicine'}</p>
                      {r.adherenceStatus && (
                        <Pill color={r.adherenceStatus === 'TAKEN' ? FL.mint : r.adherenceStatus === 'SKIPPED' ? FL.pink : FL.gold}>{r.adherenceStatus}</Pill>
                      )}
                    </div>
                    <p className="text-xs text-[#8AB0C0] mt-1">{[r.dosage, r.frequency, r.timing, r.durationDays ? `${r.durationDays} days` : null].filter(Boolean).join(' • ')}</p>
                    {r.startDate && <p className="text-xs text-[#8AB0C0] mt-1">Started: {String(r.startDate).slice(0, 10)}</p>}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <ActionButton disabled={busyId === r.id} onClick={() => start(r.id)}>
                        <span className="inline-flex items-center gap-1.5"><Play size={14} /> Start</span>
                      </ActionButton>
                      <ActionButton variant="ghost" disabled={busyId === r.id} onClick={() => logDose(r.id, 'TAKEN')}>
                        <span className="inline-flex items-center gap-1.5"><Check size={14} /> Taken</span>
                      </ActionButton>
                      <ActionButton variant="danger" disabled={busyId === r.id} onClick={() => logDose(r.id, 'SKIPPED')}>
                        <span className="inline-flex items-center gap-1.5"><X size={14} /> Skipped</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
