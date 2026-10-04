'use client';

import { useEffect, useState } from 'react';
import { pharmacyApi } from '@/lib/api/endpoints';
import { PharmacyDiscoveryResponse } from '@/types/pharmacy';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui';
import { Pill, MapPin, Phone, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPharmacyDiscoveryPage() {
  const [pharmacies, setPharmacies] = useState<PharmacyDiscoveryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  const loadPharmacies = async (city?: string) => {
    setLoading(true);
    try {
      const { data } = await pharmacyApi.getNearby(city ? { city } : undefined);
      setPharmacies(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      loadPharmacies(searchCity.trim());
    }
  };

  return (
    <AppLayout role="PATIENT" title="Pharmacies" subtitle="Find nearby pharmacies">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 bg-surface-10/50 border border-tonal-20/50 rounded-xl text-primary-light placeholder-primary-light/40 focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-accent-fill text-white rounded-xl hover:bg-accent-fill/90 transition-colors flex items-center gap-2"
          >
            <Search size={16} /> Search
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-surface-20/50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-20/50 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : pharmacies.length === 0 ? (
          <Card className="p-8 text-center">
            <Pill size={48} className="mx-auto text-primary-light/20 mb-4" />
            <p className="text-body text-primary-light/60">No pharmacies found{searchCity ? ` in "${searchCity}"` : ''}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Pill size={24} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading font-bold text-primary-light">{pharmacy.name}</h3>
                    <p className="text-body text-primary-light/70 mt-1">{pharmacy.address}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                      {pharmacy.city && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent" />
                          <span>{pharmacy.city}, {pharmacy.state} {pharmacy.pincode}</span>
                        </div>
                      )}
                      {pharmacy.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-accent" />
                          <a href={`tel:${pharmacy.phone}`} className="text-accent hover:underline">{pharmacy.phone}</a>
                        </div>
                      )}
                      {pharmacy.openingHours && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent" />
                          <span>{pharmacy.openingHours}</span>
                        </div>
                      )}
                      {pharmacy.delivery && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent" />
                          <span>Delivery: {pharmacy.delivery}</span>
                        </div>
                      )}
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
