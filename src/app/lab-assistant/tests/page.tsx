'use client';

import { useEffect, useState } from 'react';
import { labApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, Input } from '@/components/ui';
import { TestTube, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface LabTest {
  id: number;
  name?: string;
  description?: string;
  normalRange?: string;
  unit?: string;
  price?: number;
}

export default function LabAssistantTestsPage() {
  const { user } = useAuthStore();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const hospitalId = user?.hospitalId ? Number(user.hospitalId) : NaN;

  const load = async () => {
    if (!Number.isFinite(hospitalId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await labApi.getTests(hospitalId);
      setTests(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Unable to load hospital tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hospitalId]);

  const visible = tests.filter((test) => {
    if (!query.trim()) return true;
    return `${test.name ?? ''} ${test.description ?? ''}`.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <AppLayout role="LAB_ASSISTANT" title="Hospital Tests" subtitle="Tests offered by this hospital lab">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-heading font-bold text-primary-light">Available tests ({tests.length})</h2>
          <div className="flex items-end gap-3">
            <Input label="Search" placeholder="Test name" value={query} onChange={(event) => setQuery(event.target.value)} />
            <Button variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" /> Refresh</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-body text-primary-light/60">Loading tests...</p>
        ) : !Number.isFinite(hospitalId) ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No hospital is linked to your account.</p></Card>
        ) : visible.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-body text-primary-light/60">No tests found for this hospital.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((test) => (
              <Card key={test.id} className="p-5">
                <div className="flex items-start gap-4">
                  <span className="p-2 bg-blue-500/10 rounded-xl"><TestTube size={20} className="text-blue-500" /></span>
                  <div>
                    <h3 className="font-bold text-primary-light">{test.name ?? `Test #${test.id}`}</h3>
                    {test.description ? <p className="text-sm text-primary-light/60 mt-1">{test.description}</p> : null}
                    <p className="text-xs text-primary-light/50 mt-2">
                      {test.normalRange ? `Range: ${test.normalRange}` : ''}
                      {test.unit ? ` ${test.unit}` : ''}
                      {test.price != null ? ` · ₹${test.price}` : ''}
                    </p>
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