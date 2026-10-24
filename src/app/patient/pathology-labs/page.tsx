'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pathologyApi, chatApi, patientDocumentApi } from '@/lib/api/endpoints';
import type {
  PathologyLabDiscoveryResponse,
  PathologyWorkflowResponse,
  PathologyRequestCreateRequest,
} from '@/types/pathology';
import type { PatientDocumentResponse } from '@/types/patient-documents';
import AppLayout from '@/components/layout/AppLayout';
import { Card, Button, StatusBadge } from '@/components/ui';
import { Modal, Field, inputClass } from '@/components/ui/FlutterTheme';
import { ShareModal } from '@/components/sharing/ShareModal';
import { shareToWhatsApp } from '@/lib/sharing';
import {
  Activity, MapPin, Phone, Clock, Home, CheckCircle, Hourglass,
  XCircle, MessageCircle, Share2, Upload, FileText, CheckCircle2,
  RefreshCw, Search, TestTube,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientPathologyLabsPage() {
  const router = useRouter();
  const [labs, setLabs] = useState<PathologyLabDiscoveryResponse[]>([]);
  const [myRequests, setMyRequests] = useState<PathologyWorkflowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startingChatId, setStartingChatId] = useState<number | null>(null);

  // Sharing state
  const [shareTarget, setShareTarget] = useState<PathologyLabDiscoveryResponse | null>(null);
  const [shareRequestTarget, setShareRequestTarget] = useState<PathologyWorkflowResponse | null>(null);

  // Request Form modal state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [userPrescriptions, setUserPrescriptions] = useState<PatientDocumentResponse[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadLabs = async () => {
    setLoading(true);
    try {
      const [labsRes, requestsRes, docsRes] = await Promise.allSettled([
        pathologyApi.getLabs(),
        pathologyApi.getMyRequests(),
        patientDocumentApi.getAll({ category: 'LAB_REPORT' }),
      ]);

      if (labsRes.status === 'fulfilled' && Array.isArray(labsRes.value.data)) {
        setLabs(labsRes.value.data);
      }
      if (requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value.data)) {
        setMyRequests(requestsRes.value.data);
      }
      if (docsRes.status === 'fulfilled' && Array.isArray(docsRes.value.data)) {
        setUserPrescriptions(docsRes.value.data);
      }
    } catch {
      toast.error('Failed to load pathology data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  // Start chat with pathology lab
  const handleStartChat = async (lab: PathologyLabDiscoveryResponse) => {
    if (!lab.userId) {
      if (lab.phone) {
        shareToWhatsApp({
          phone: lab.phone,
          title: `Inquiry to ${lab.name}`,
          text: `Hello ${lab.name}, I am contacting you through Aivion Care to inquire about diagnostic lab tests and reports.`,
        });
      } else {
        router.push('/patient/chat');
      }
      return;
    }

    setStartingChatId(lab.id);
    try {
      await chatApi.createRoom({
        type: 'ONE_TO_ONE',
        participantUserIds: [lab.userId],
      });
      toast.success(`Connected to ${lab.name}`);
      router.push('/patient/chat');
    } catch {
      router.push('/patient/chat');
    } finally {
      setStartingChatId(null);
    }
  };

  const handleOpenRequest = (labId?: number) => {
    setSelectedLabId(labId || (labs[0]?.id ?? null));
    setRequestNote('');
    setSelectedDocId(null);
    setNewDocFile(null);
    setHomeCollection(false);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedLabId) {
      toast.error('Please select a diagnostic lab');
      return;
    }
    if (!requestNote.trim() && !selectedDocId && !newDocFile) {
      toast.error('Please specify tests required or attach a prescription document');
      return;
    }

    setSubmitting(true);
    try {
      let fileUrl = '';
      if (newDocFile) {
        const uploadRes = await patientDocumentApi.upload(newDocFile, {
          category: 'LAB_REPORT',
          title: newDocFile.name.replace(/\.[^.]+$/, ''),
          description: `Test prescription for lab request`,
          isFavorite: false,
        });
        fileUrl = uploadRes.data?.storagePath || uploadRes.data?.fileName || '';
      }

      const selectedLab = labs.find((l) => l.id === selectedLabId);
      const data: PathologyRequestCreateRequest = {
        pathologyLabId: selectedLabId,
        requestNote: `${requestNote.trim()}${homeCollection ? ' (Patient requests home sample collection)' : ''}`,
        prescriptionId: selectedDocId || undefined,
        prescriptionFileUrl: fileUrl || undefined,
      };

      await pathologyApi.createRequest(data);
      toast.success('Pathology test request submitted! The lab will provide a quotation.');
      setShowRequestForm(false);
      setSelectedLabId(null);
      setRequestNote('');
      setSelectedDocId(null);
      setNewDocFile(null);

      // Connect in chat if lab user is available
      if (selectedLab?.userId) {
        try {
          await chatApi.createRoom({
            type: 'ONE_TO_ONE',
            participantUserIds: [selectedLab.userId],
          });
        } catch {
          // ignore
        }
      }

      loadLabs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit pathology request');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLabs = labs.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q) ||
      l.address?.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout role="PATIENT" title="Pathology Labs" subtitle="Find accredited diagnostic centers, book tests & chat">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search & Top Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-20/80 p-4 rounded-card border border-tonal-20/50">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light/40" />
            <input
              type="text"
              placeholder="Search diagnostic labs by name, city, or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-10/50 border border-tonal-20/50 rounded-xl text-primary-light placeholder-primary-light/40 focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button onClick={() => handleOpenRequest()} className="gap-2 bg-accent hover:bg-accent-fill text-white text-xs font-semibold">
              <TestTube size={15} /> Request Lab Test
            </Button>
            <Button variant="outline" onClick={() => loadLabs()} className="gap-1.5 text-xs">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Available Labs List */}
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
        ) : filteredLabs.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-tonal-20">
            <Activity size={48} className="mx-auto text-primary-light/20 mb-3" />
            <p className="text-base font-semibold text-primary-light">No pathology labs found</p>
            <p className="text-sm text-primary-light/60 mt-1">
              {searchQuery ? `No labs matching "${searchQuery}"` : 'Accredited diagnostic labs will appear here'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLabs.map((lab) => (
              <Card
                key={lab.id}
                className="p-5 hover:border-tonal-20 transition-all duration-200 bg-surface-20/80"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Lab Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <TestTube size={24} />
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-primary-light text-base">{lab.name}</h3>
                        {lab.homeCollectionAvailable && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <Home size={12} /> Home Sample Collection
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-light/70">{lab.address}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-primary-light/60">
                        {lab.city && (
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-accent flex-shrink-0" />
                            <span className="truncate">{lab.city}, {lab.state} {lab.pincode}</span>
                          </div>
                        )}
                        {lab.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone size={13} className="text-accent flex-shrink-0" />
                            <a href={`tel:${lab.phone}`} className="text-accent hover:underline">{lab.phone}</a>
                          </div>
                        )}
                        {lab.openingHours && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock size={13} className="text-accent flex-shrink-0" />
                            <span className="truncate">{lab.openingDays || 'Mon-Sat'}: {lab.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-tonal-20/50 justify-end flex-shrink-0">
                    {/* Chat with Lab */}
                    <Button
                      size="sm"
                      onClick={() => handleStartChat(lab)}
                      disabled={startingChatId === lab.id}
                      className="gap-1.5 bg-accent hover:bg-accent-fill text-white text-xs font-semibold"
                    >
                      <MessageCircle size={14} className={startingChatId === lab.id ? 'animate-spin' : ''} />
                      Chat
                    </Button>

                    {/* Book / Request Test */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenRequest(lab.id)}
                      className="gap-1.5 text-purple-400 border-purple-500/30 hover:bg-purple-500/10 text-xs font-medium"
                    >
                      <TestTube size={14} />
                      Request Test
                    </Button>

                    {/* WhatsApp */}
                    {lab.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          shareToWhatsApp({
                            phone: lab.phone,
                            title: lab.name,
                            text: `Hello ${lab.name}, I am contacting you through Aivion Care to inquire about diagnostic lab tests.`,
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
                      onClick={() => setShareTarget(lab)}
                      className="gap-1 text-primary-light/60 hover:text-primary-light text-xs"
                      title="Share lab"
                    >
                      <Share2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* My Requests Section */}
        {myRequests.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-tonal-20/50">
            <h3 className="text-base font-bold text-primary-light flex items-center justify-between">
              <span>My Test Requests ({myRequests.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-surface-20/80 border border-tonal-20/50 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-primary-light text-sm">
                        Request #{req.id}
                      </span>
                      <StatusBadge status={req.status || 'PENDING'} />
                    </div>
                    <p className="text-xs text-primary-light/80 font-medium">
                      {req.pathologyLabName || 'Diagnostic Lab'}
                    </p>
                    {req.requestNote && (
                      <p className="text-xs text-primary-light/60 line-clamp-2">
                        {req.requestNote}
                      </p>
                    )}
                    <p className="text-[11px] text-primary-light/40">
                      Created: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-tonal-20/30">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push('/patient/chat')}
                      className="h-7 px-2.5 text-xs gap-1 text-accent border-accent/30 hover:bg-accent/10"
                    >
                      <MessageCircle size={13} /> Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShareRequestTarget(req)}
                      className="h-7 px-2 text-xs"
                      title="Share request"
                    >
                      <Share2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Test Modal */}
        {showRequestForm && (
          <Modal
            isOpen={showRequestForm}
            onClose={() => setShowRequestForm(false)}
            title="Request Pathology Diagnostic Test"
            size="lg"
          >
            <div className="space-y-4">
              <Field label="Selected Lab" required>
                <select
                  value={selectedLabId || ''}
                  onChange={(e) => setSelectedLabId(e.target.value ? parseInt(e.target.value) : null)}
                  className={inputClass}
                >
                  <option value="">Select a diagnostic center...</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} ({lab.city || 'Local'})
                    </option>
                  ))}
                </select>
              </Field>

              {/* Attach Existing Prescription / Medical Record */}
              {userPrescriptions.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-primary-light/70 mb-1.5">
                    Attach Prescription / Test Advice from Vault
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                    {userPrescriptions.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocId(doc.id === selectedDocId ? null : doc.id);
                          setNewDocFile(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors flex items-center justify-between ${
                          selectedDocId === doc.id
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-surface-10/50 border-tonal-20 hover:bg-surface-20 text-primary-light'
                        }`}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <FileText size={15} className="flex-shrink-0" />
                          <span className="text-xs font-medium truncate">{doc.title}</span>
                        </div>
                        {selectedDocId === doc.id && <CheckCircle2 size={15} className="text-accent flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Document */}
              <Field label="Or Upload Doctor Prescription / Referral">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className={`${inputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent/15 file:text-accent hover:file:bg-accent/25`}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setNewDocFile(f);
                      setSelectedDocId(null);
                    }
                  }}
                />
              </Field>
              {newDocFile && (
                <p className="text-xs text-emerald-400 mt-1">
                  Selected file: {newDocFile.name} ({(newDocFile.size / 1024).toFixed(0)} KB)
                </p>
              )}

              <Field label="Tests Required or Doctor Notes">
                <textarea
                  rows={3}
                  placeholder="e.g. CBC, Lipid Profile, Thyroid Profile (TSH), Fasting Blood Sugar..."
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-10/50 border border-tonal-20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeCollection}
                  onChange={(e) => setHomeCollection(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
                <div>
                  <p className="text-xs font-semibold text-primary-light">Request Home Sample Collection</p>
                  <p className="text-[11px] text-primary-light/50">Phlebotomist visits your home for blood/sample collection</p>
                </div>
              </label>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSubmitRequest}
                  loading={submitting}
                  className="flex-1 bg-accent hover:bg-accent-fill text-white"
                >
                  Submit Diagnostic Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Share Lab Modal */}
        {shareTarget && (
          <ShareModal
            isOpen={Boolean(shareTarget)}
            onClose={() => setShareTarget(null)}
            title="Share Diagnostic Center"
            itemTitle={shareTarget.name}
            description={`${shareTarget.address}, ${shareTarget.city || ''} ${shareTarget.pincode || ''}\nPhone: ${shareTarget.phone || 'N/A'}\nHome Collection: ${shareTarget.homeCollectionAvailable ? 'Available' : 'Lab Visit'}`}
            phone={shareTarget.phone}
            shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/patient/pathology-labs` : ''}
            category="Pathology Lab"
          />
        )}

        {/* Share Request Modal */}
        {shareRequestTarget && (
          <ShareModal
            isOpen={Boolean(shareRequestTarget)}
            onClose={() => setShareRequestTarget(null)}
            title="Share Test Request"
            itemTitle={`Lab Request #${shareRequestTarget.id} — ${shareRequestTarget.pathologyLabName || 'Diagnostic Lab'}`}
            description={`Status: ${shareRequestTarget.status || 'Pending'}\nNotes: ${shareRequestTarget.requestNote || 'Diagnostic tests booked via Aivion Care'}`}
            category="Lab Request"
          />
        )}
      </div>
    </AppLayout>
  );
}
