'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMedicationReminders } from '@/hooks/useMedicationReminders';
import { Card, Button } from '@/components/ui';
import { StatusBadge as Badge } from '@/components/ui/StatusBadge';
import { Pill, Bell, CheckCircle, XCircle, Clock, AlertTriangle, Play, Pause, Volume2, BellOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Dose {
  scheduledDate: string;
  doseTime: string;
  status: 'PENDING' | 'TAKEN' | 'SKIPPED';
  actedAt?: string;
}

interface Reminder {
  id: number;
  medicineName: string;
  dosage?: string;
  amountPerUse?: string;
  frequencyPerDay?: string;
  timing?: string;
  durationText?: string;
  notes?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  scheduleTimes: string[];
  todayDoses: Dose[];
  takenCount: number;
  skippedCount: number;
  pendingCount: number;
}

export default function PatientRemindersPage() {
  const {
    reminders,
    loading,
    error,
    permission,
    startReminder,
    logDose,
    refresh,
  } = useMedicationReminders({ autoRefresh: true, refreshInterval: 60000 });

  const [busyId, setBusyId] = useState<number | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const requestPermission = async () => {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      toast.success('Notifications enabled! You will receive medication alarms.');
      refresh();
    } else {
      toast.error('Notification permission denied. Please enable in browser settings.');
    }
    setShowPermissionModal(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TAKEN': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SKIPPED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PENDING':
        const now = new Date();
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TAKEN': return <CheckCircle size={14} className="text-green-400" />;
      case 'SKIPPED': return <XCircle size={14} className="text-red-400" />;
      case 'PENDING': return <Clock size={14} className="text-amber-400" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  const isDoseOverdue = (dose: Dose) => {
    if (dose.status !== 'PENDING') return false;
    const now = new Date();
    const [hours, minutes] = dose.doseTime.split(':').map(Number);
    const doseDate = new Date();
    doseDate.setHours(hours, minutes, 0, 0);
    return doseDate < now;
  };

  if (loading) {
    return (
      <AppLayout role="PATIENT" title="Medicines" subtitle="Reminders & adherence tracking">
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 bg-surface-10/50 rounded-xl animate-pulse">
            <div className="w-11 h-11 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shrink-0"><Pill size={20} /></div>
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-surface-20/50 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-20/50 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const activeReminders = reminders.filter(r => r.active);
  const inactiveReminders = reminders.filter(r => !r.active);

  return (
    <AppLayout role="PATIENT" title="Medicines" subtitle="Reminders & adherence tracking">
      <div className="space-y-5">
        {permission !== 'granted' && (
          <Card className="p-4 bg-accent/5 border-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-accent text-2xl" />
                <div>
                  <p className="font-semibold text-primary-light">Enable Medication Alarms</p>
                  <p className="text-sm text-primary-light/60">Get notified when it&apos;s time to take your medicine</p>
                </div>
              </div>
              <Button onClick={() => setShowPermissionModal(true)} size="sm">
                <Bell className="mr-2" size={16} /> Enable
              </Button>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-4 bg-red-500/5 border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeReminders.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-heading font-bold text-primary-light mb-3 flex items-center gap-2">
                <Pill size={20} className="text-accent" />
                Active Reminders ({activeReminders.length})
              </h3>
              <div className="space-y-3">
                {activeReminders.map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <Pill size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg font-semibold text-primary-light truncate">{r.medicineName}</p>
                          <Badge status="ACTIVE" className="bg-green-500/20 text-green-400 border-green-500/30" />
                        </div>
                        <p className="text-sm text-primary-light/60 mt-1">
                          {[r.dosage, r.amountPerUse, r.frequencyPerDay, r.timing, r.durationText]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                        {r.notes && <p className="text-xs text-primary-light/50 mt-1">{r.notes}</p>}
                        {r.startDate && <p className="text-xs text-primary-light/50 mt-1">Started: {String(r.startDate).slice(0, 10)}</p>}
                        {r.endDate && <p className="text-xs text-primary-light/50 mt-1">Ends: {String(r.endDate).slice(0, 10)}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2 text-sm text-primary-light/60">
                          <Volume2 size={16} className="text-accent" />
                          <span>{r.todayDoses.filter(d => d.status === 'PENDING').length} pending</span>
                        </div>
                        {r.todayDoses.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {r.todayDoses.map((dose) => (
                              <span
                                key={dose.doseTime}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${
                                  isDoseOverdue(dose)
                                    ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                                    : getStatusColor(dose.status)
                                }`}
                              >
                                {getStatusIcon(dose.status)}
                                {formatTime(dose.doseTime)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-tonal-20/30">
                      <div className="flex flex-wrap gap-2">
                        {!r.active && (
                          <Button
                            onClick={() => startReminder(r.id)}
                            disabled={busyId === r.id}
                            loading={busyId === r.id}
                            className="flex-1 sm:flex-none"
                          >
                            <Play className="mr-2" size={14} /> Start Reminder
                          </Button>
                        )}
{r.todayDoses
                          .filter((dose) => dose.status === 'PENDING')
                          .map((dose) => (
                            <div key={dose.doseTime} className="flex-1 sm:flex-none">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => logDose(r.id, dose.doseTime, 'TAKEN')}
                                disabled={busyId === r.id}
                                loading={busyId === r.id}
                                className="w-full justify-center gap-1"
                              >
                                <CheckCircle size={14} /> Taken
                              </Button>
                            </div>
                          ))}
{r.todayDoses
                          .filter((dose) => dose.status === 'PENDING')
                          .map((dose) => (
                            <div key={dose.doseTime} className="flex-1 sm:flex-none">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => logDose(r.id, dose.doseTime, 'SKIPPED')}
                                disabled={busyId === r.id}
                                loading={busyId === r.id}
                                className="w-full justify-center gap-1"
                              >
                                <XCircle size={14} /> Skip
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {inactiveReminders.length > 0 && (
            <div>
              <h3 className="text-heading font-bold text-primary-light mb-3 flex items-center gap-2">
                <Pause size={20} className="text-amber-400" />
                Inactive Reminders ({inactiveReminders.length})
              </h3>
              <div className="space-y-3">
                {inactiveReminders.map((r) => (
                  <Card key={r.id} className="p-4 opacity-70">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-500/15 flex items-center justify-center text-gray-400 shrink-0">
                        <Pill size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg font-semibold text-primary-light truncate">{r.medicineName}</p>
                          <Badge status="INACTIVE" className="bg-gray-500/20 text-gray-400 border-gray-500/30" />
                        </div>
                        <p className="text-sm text-primary-light/60 mt-1">
                          {[r.dosage, r.amountPerUse, r.frequencyPerDay, r.timing, r.durationText]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                        {r.notes && <p className="text-xs text-primary-light/50 mt-1">{r.notes}</p>}
                      </div>
                      <Button
                        onClick={() => startReminder(r.id)}
                        disabled={busyId === r.id}
                        loading={busyId === r.id}
                        className="shrink-0"
                      >
                        <Play className="mr-2" size={14} /> Start
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reminders.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="p-8 text-center">
                <Pill size={48} className="mx-auto text-primary-light/20 mb-4" />
                <p className="text-body text-primary-light/60 mb-4">No medication reminders yet</p>
                <p className="text-sm text-primary-light/40">They are created when your doctor sends a prescription</p>
              </Card>
            </div>
          )}
        </div>

        {showPermissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-md p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-accent" />
                </div>
                <h3 className="text-heading font-bold text-primary-light">Enable Medication Alarms</h3>
                <p className="text-primary-light/60 mt-2">Allow notifications to receive alarms when it&apos;s time to take your medicine</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowPermissionModal(false)} className="flex-1">
                  Not Now
                </Button>
                <Button onClick={requestPermission} className="flex-1">
                  <Bell className="mr-2" size={16} /> Allow Notifications
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}