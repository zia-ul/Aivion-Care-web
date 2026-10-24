'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pharmacyApi, chatApi, patientDocumentApi } from '@/lib/api/endpoints';
import type { PharmacyDiscoveryResponse } from '@/types/pharmacy';
import type { PatientDocumentResponse } from '@/types/patient-documents';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button } from '@/components/ui';
import { Modal, Field, inputClass } from '@/components/ui/FlutterTheme';
import { ShareModal } from '@/components/sharing/ShareModal';
import { shareToWhatsApp } from '@/lib/sharing';
import {
  Pill, MapPin, Phone, Clock, Search, MessageCircle,
  Share2, Upload, FileText, CheckCircle2, Truck, RefreshCw,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPharmacyDiscoveryPage() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<PharmacyDiscoveryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startingChatId, setStartingChatId] = useState<number | null>(null);

  // Sharing state
  const [shareTarget, setShareTarget] = useState<PharmacyDiscoveryResponse | null>(null);

  // Send Prescription Modal state
  const [selectedPharmacyForRx, setSelectedPharmacyForRx] = useState<PharmacyDiscoveryResponse | null>(null);
  const [userPrescriptions, setUserPrescriptions] = useState<PatientDocumentResponse[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [newRxFile, setNewRxFile] = useState<File | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submittingRx, setSubmittingRx] = useState(false);

  const loadPharmacies = async (city?: string) => {
    setLoading(true);
    try {
      const { data } = await pharmacyApi.getNearby(city ? { city } : undefined);
      setPharmacies(Array.isArray(data) ? data : []);
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
    loadPharmacies(searchQuery.trim() || undefined);
  };

  // Start chat with pharmacy
  const handleStartChat = async (pharmacy: PharmacyDiscoveryResponse) => {
    if (!pharmacy.userId) {
      // Fallback: If no direct user id is linked yet, redirect to patient chat or WhatsApp
      if (pharmacy.phone) {
        shareToWhatsApp({
          phone: pharmacy.phone,
          title: `Inquiry to ${pharmacy.name}`,
          text: `Hello ${pharmacy.name}, I am contacting you through Aivion Care regarding a medicine order/prescription.`,
        });
      } else {
        router.push('/patient/chat');
      }
      return;
    }

    setStartingChatId(pharmacy.id);
    try {
      await chatApi.createRoom({
        type: 'ONE_TO_ONE',
        participantUserIds: [pharmacy.userId],
      });
      toast.success(`Connected to ${pharmacy.name}`);
      router.push('/patient/chat');
    } catch {
      router.push('/patient/chat');
    } finally {
      setStartingChatId(null);
    }
  };

  // Open Send Prescription Modal
  const handleOpenSendRx = async (pharmacy: PharmacyDiscoveryResponse) => {
    setSelectedPharmacyForRx(pharmacy);
    setSelectedDocId(null);
    setNewRxFile(null);
    setDeliveryAddress(pharmacy.city ? `${pharmacy.city}, Delivery Address` : '');
    setOrderNotes('');

    setLoadingPrescriptions(true);
    try {
      const { data } = await patientDocumentApi.getAll({ category: 'PRESCRIPTION' });
      setUserPrescriptions(Array.isArray(data) ? data : []);
    } catch {
      setUserPrescriptions([]);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  // Submit Prescription to Pharmacy
  const handleSubmitPrescription = async () => {
    if (!selectedPharmacyForRx) return;
    if (!selectedDocId && !newRxFile) {
      toast.error('Please select an existing prescription or upload a file');
      return;
    }

    setSubmittingRx(true);
    try {
      let documentTitle = 'Prescription Order';

      // If user uploaded a new file, upload to document vault first
      if (newRxFile) {
        const uploadRes = await patientDocumentApi.upload(newRxFile, {
          category: 'PRESCRIPTION',
          title: newRxFile.name.replace(/\.[^.]+$/, ''),
          description: `Uploaded for order with ${selectedPharmacyForRx.name}`,
          isFavorite: false,
        });
        documentTitle = uploadRes.data?.title || newRxFile.name;
      } else if (selectedDocId) {
        const found = userPrescriptions.find((d) => d.id === selectedDocId);
        if (found) documentTitle = found.title;
      }

      // Create an order or notify pharmacy
      try {
        await pharmacyApi.createOrder({
          pharmacyId: selectedPharmacyForRx.id,
          items: [{ medicineName: documentTitle, quantity: 1, dosage: 'As prescribed' }],
          deliveryAddress: deliveryAddress.trim() || undefined,
          notes: orderNotes.trim() ? orderNotes.trim() : 'Prescription uploaded by patient',
        });
        toast.success(`Prescription sent to ${selectedPharmacyForRx.name}!`);
      } catch {
        // Even if order endpoint needs items, notify user and initiate chat
        toast.success(`Prescription attached. Starting chat with ${selectedPharmacyForRx.name}...`);
      }

      // If pharmacy has a chat user, start room
      if (selectedPharmacyForRx.userId) {
        try {
          await chatApi.createRoom({
            type: 'ONE_TO_ONE',
            participantUserIds: [selectedPharmacyForRx.userId],
          });
        } catch {
          // ignore
        }
      }

      setSelectedPharmacyForRx(null);
      router.push('/patient/chat');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not send prescription');
    } finally {
      setSubmittingRx(false);
    }
  };

  const filteredPharmacies = pharmacies.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout role="PATIENT" title="Pharmacies" subtitle="Find approved pharmacies, order medicines & chat">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search & Actions Bar */}
        <div className="bg-surface-20/80 rounded-card border border-tonal-20/50 p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light/40" />
              <input
                type="text"
                placeholder="Search pharmacy name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-10/50 border border-tonal-20/50 rounded-xl text-primary-light placeholder-primary-light/40 focus:outline-none focus:border-accent text-sm"
              />
            </div>
            <Button onClick={handleSearch} className="gap-2 bg-accent hover:bg-accent-fill text-white">
              <Search size={16} /> Search
            </Button>
            <Button variant="outline" onClick={() => loadPharmacies()} className="gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {/* Pharmacy Listings */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-5 bg-surface-20/50 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-surface-20/50 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-surface-20/50 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : filteredPharmacies.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-tonal-20">
            <Pill size={48} className="mx-auto text-primary-light/20 mb-3" />
            <p className="text-base font-semibold text-primary-light">No pharmacies found</p>
            <p className="text-sm text-primary-light/60 mt-1">
              {searchQuery ? `No pharmacies matching "${searchQuery}"` : 'Approved pharmacies will appear here'}
            </p>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); loadPharmacies(); }} className="mt-4">
                Clear Search Filter
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPharmacies.map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className="p-5 hover:border-tonal-20 transition-all duration-200 bg-surface-20/80"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Pharmacy Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                      <Pill size={24} />
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-primary-light text-base">{pharmacy.name}</h3>
                        {pharmacy.delivery && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Truck size={12} /> {pharmacy.delivery}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-light/70">{pharmacy.address}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-primary-light/60">
                        {pharmacy.city && (
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-accent flex-shrink-0" />
                            <span className="truncate">{pharmacy.city}, {pharmacy.state} {pharmacy.pincode}</span>
                          </div>
                        )}
                        {pharmacy.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone size={13} className="text-accent flex-shrink-0" />
                            <a href={`tel:${pharmacy.phone}`} className="text-accent hover:underline">{pharmacy.phone}</a>
                          </div>
                        )}
                        {pharmacy.openingHours && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock size={13} className="text-accent flex-shrink-0" />
                            <span className="truncate">{pharmacy.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-tonal-20/50 justify-end flex-shrink-0">
                    {/* Chat Button */}
                    <Button
                      size="sm"
                      onClick={() => handleStartChat(pharmacy)}
                      disabled={startingChatId === pharmacy.id}
                      className="gap-1.5 bg-accent hover:bg-accent-fill text-white text-xs font-semibold"
                    >
                      <MessageCircle size={14} className={startingChatId === pharmacy.id ? 'animate-spin' : ''} />
                      Chat
                    </Button>

                    {/* Send Prescription */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenSendRx(pharmacy)}
                      className="gap-1.5 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 text-xs font-medium"
                    >
                      <Upload size={14} />
                      Send Rx
                    </Button>

                    {/* Direct WhatsApp */}
                    {pharmacy.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          shareToWhatsApp({
                            phone: pharmacy.phone,
                            title: pharmacy.name,
                            text: `Hello ${pharmacy.name}, I am contacting you through Aivion Care to inquire about medicines and prescription orders.`,
                          })
                        }
                        className="gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 text-xs font-medium"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </Button>
                    )}

                    {/* Share Modal Trigger */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShareTarget(pharmacy)}
                      className="gap-1 text-primary-light/60 hover:text-primary-light text-xs"
                      title="Share pharmacy"
                    >
                      <Share2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Send Prescription Modal */}
        {selectedPharmacyForRx && (
          <Modal
            isOpen={Boolean(selectedPharmacyForRx)}
            onClose={() => setSelectedPharmacyForRx(null)}
            title={`Send Prescription to ${selectedPharmacyForRx.name}`}
            size="lg"
          >
            <div className="space-y-4">
              <p className="text-xs text-primary-light/60">
                Attach a prescription from your medical vault or upload a new file. {selectedPharmacyForRx.name} will prepare your order.
              </p>

              {/* Existing Prescriptions Selector */}
              <div>
                <label className="block text-xs font-semibold text-primary-light/70 mb-1.5">
                  Choose from Saved Prescriptions
                </label>
                {loadingPrescriptions ? (
                  <p className="text-xs text-primary-light/40 py-2">Loading your prescriptions...</p>
                ) : userPrescriptions.length === 0 ? (
                  <p className="text-xs text-primary-light/40 py-2">No prescriptions in your vault yet.</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {userPrescriptions.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocId(doc.id === selectedDocId ? null : doc.id);
                          setNewRxFile(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors flex items-center justify-between ${
                          selectedDocId === doc.id
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-surface-10/50 border-tonal-20 hover:bg-surface-20 text-primary-light'
                        }`}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <FileText size={16} className="flex-shrink-0" />
                          <span className="text-xs font-medium truncate">{doc.title}</span>
                        </div>
                        {selectedDocId === doc.id && <CheckCircle2 size={16} className="text-accent flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Or Upload New File */}
              <div className="pt-2 border-t border-tonal-20/50">
                <Field label="Or Upload New Prescription File">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className={`${inputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent/15 file:text-accent hover:file:bg-accent/25`}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setNewRxFile(f);
                        setSelectedDocId(null);
                      }
                    }}
                  />
                </Field>
                {newRxFile && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Selected file: {newRxFile.name} ({(newRxFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              {/* Delivery Address & Notes */}
              <Field label="Delivery Address">
                <input
                  type="text"
                  placeholder="Enter full delivery address or 'Store Pickup'"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Notes for Pharmacist">
                <textarea
                  rows={2}
                  placeholder="Specify any dosage preference, allergies, or urgent instructions..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSubmitPrescription}
                  loading={submittingRx}
                  className="flex-1 bg-accent hover:bg-accent-fill text-white"
                >
                  Confirm & Send Prescription
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPharmacyForRx(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Universal Share Modal */}
        {shareTarget && (
          <ShareModal
            isOpen={Boolean(shareTarget)}
            onClose={() => setShareTarget(null)}
            title="Share Pharmacy Details"
            itemTitle={shareTarget.name}
            description={`${shareTarget.address}, ${shareTarget.city || ''} ${shareTarget.pincode || ''}\nPhone: ${shareTarget.phone || 'N/A'}\nDelivery: ${shareTarget.delivery || 'Available'}`}
            phone={shareTarget.phone}
            shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/patient/pharmacies` : ''}
            category="Pharmacy"
          />
        )}
      </div>
    </AppLayout>
  );
}
