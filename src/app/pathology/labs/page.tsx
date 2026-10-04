'use client';

import { useEffect, useState } from 'react';
import { pathologyApi } from '@/lib/api/endpoints';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button } from '@/components/ui';
import { Microscope, MapPin, Clock, RefreshCw, Home } from 'lucide-react';
import type { PathologyLabDiscoveryResponse } from '@/types/pathology';
import toast from 'react-hot-toast';

export default function PathologyLabsPage() {
  const [labs, setLabs] = useState<PathologyLabDiscoveryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await pathologyApi.getLabs();
      setLabs(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load pathology labs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout role="PATHOLOGY" title="Labs" subtitle="Approved pathology labs network">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-bold text-primary-light">Approved labs ({labs.length})</h2>
          <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading labs...</p>
        ) : labs.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No pathology labs available.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map((lab) => (
              <Card key={lab.id} className="p-5">
                <div className="flex items-start gap-4">
                  <span className="p-2 bg-cyan-500/10 rounded-xl"><Microscope size={22} className="text-cyan-500" /></span>
                  <div>
                    <h3 className="font-bold text-primary-light">{lab.name}</h3>
                    <p className="text-sm text-primary-light/70 mt-1">{lab.address}</p>
                    <div className="mt-3 space-y-1 text-sm text-primary-light/60">
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> {lab.city}, {lab.state} {lab.pincode}</p>
                      {lab.openingDays ? <p className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {lab.openingDays}</p> : null}
                      {lab.openingHours ? <p className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {lab.openingHours}</p> : null}
                      {lab.homeCollectionAvailable ? <p className="flex items-center gap-2"><Home size={14} className="text-accent" /> Home collection available</p> : null}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
