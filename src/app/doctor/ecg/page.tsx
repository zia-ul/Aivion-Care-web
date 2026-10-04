'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { DarkCard, StatTile, FL } from '@/components/ui/FlutterTheme';
import { Activity, HeartPulse, Thermometer, Waves } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';

type DashboardValue = string | number | null | undefined;
interface VitalsDashboard {
  averageHeartRate?: DashboardValue;
  averageSpo2?: DashboardValue;
  averageTemperature?: DashboardValue;
  averageRespiratoryRate?: DashboardValue;
  latestHeartRate?: DashboardValue;
  latestSpo2?: DashboardValue;
  latestTemperature?: DashboardValue;
  [key: string]: DashboardValue | unknown;
}

function value(data: VitalsDashboard, keys: string[]): string {
  for (const key of keys) {
    const candidate = data[key];
    if (candidate !== null && candidate !== undefined && String(candidate).trim() !== '') return String(candidate);
  }
  return '—';
}

export default function DoctorEcgPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<VitalsDashboard>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.doctorId) return;
    doctorApi.getVitalsDashboard(user.doctorId)
      .then(({ data: response }) => setData(response ?? {}))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [user?.doctorId]);

  return (
    <AppLayout role="DOCTOR" title="ECG Monitor" subtitle="Connected vitals overview">
      <div className="space-y-5">
        <DarkCard><div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-doctor-rec-red/15 text-doctor-rec-red"><Activity size={21} /></div><div><h2 className="font-bold text-white">Patient monitoring overview</h2><p className="mt-1 text-sm leading-6 text-doctor-muted">Review aggregated patient vitals from connected consultations. This view supports clinical review and is not an automatic diagnosis.</p></div></div></DarkCard>
        {loading ? <p className="text-sm text-doctor-dim">Loading vitals...</p> : <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><StatTile title="Heart rate" value={value(data, ['averageHeartRate', 'latestHeartRate'])} sub="bpm" icon={<HeartPulse size={20} />} color={FL.pink} /><StatTile title="SpO₂" value={value(data, ['averageSpo2', 'latestSpo2'])} sub="percent" icon={<Waves size={20} />} color={FL.blue} /><StatTile title="Temperature" value={value(data, ['averageTemperature', 'latestTemperature'])} sub="degrees" icon={<Thermometer size={20} />} color={FL.gold} /><StatTile title="Respiratory rate" value={value(data, ['averageRespiratoryRate'])} sub="per minute" icon={<Activity size={20} />} color={FL.mint} /></div>}
      </div>
    </AppLayout>
  );
}
