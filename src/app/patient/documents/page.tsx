'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  DarkCard, InnerCard, Pill, ActionButton, SectionTitle, StatTile,
  Modal, Field, inputClass, FL,
} from '@/components/ui/FlutterTheme';
import { patientDocumentApi } from '@/lib/api/endpoints';
import type {
  PatientDocumentResponse, PatientDocumentFolderResponse, DocumentStatsResponse,
  DocumentReminderDTO,
} from '@/types/patient-documents';
import toast from 'react-hot-toast';
import {
  FileText, Folder, FolderPlus, Upload, Search, Star, Download, Trash2,
  Bell, Clock, CheckCircle, XCircle, RefreshCw, ChevronRight, File,
  FlaskConical, Scan, Stethoscope, Shield, Contact, Syringe, History,
  Receipt, Share2, Award, AlertTriangle, Image as ImageIcon, Pill as PillIcon,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'LAB_REPORT', label: 'Lab Report', icon: 'FlaskConical', color: '#3b82f6' },
  { value: 'PRESCRIPTION', label: 'Prescription', icon: 'Pill', color: '#22c55e' },
  { value: 'DIAGNOSTIC_IMAGE', label: 'Diagnostic Image', icon: 'Scan', color: '#a855f7' },
  { value: 'CONSULTATION_NOTE', label: 'Consultation Note', icon: 'Stethoscope', color: '#14b8a6' },
  { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary', icon: 'FileText', color: '#f97316' },
  { value: 'INSURANCE', label: 'Insurance', icon: 'Shield', color: '#6366f1' },
  { value: 'IDENTITY', label: 'Identity', icon: 'IdCard', color: '#6b7280' },
  { value: 'VACCINATION', label: 'Vaccination', icon: 'Syringe', color: '#ec4899' },
  { value: 'MEDICAL_HISTORY', label: 'Medical History', icon: 'History', color: '#f59e0b' },
  { value: 'BILLING', label: 'Billing', icon: 'Receipt', color: '#10b981' },
  { value: 'REFERRAL', label: 'Referral', icon: 'Share2', color: '#06b6d4' },
  { value: 'FITNESS_CERTIFICATE', label: 'Fitness Certificate', icon: 'Award', color: '#84cc16' },
  { value: 'ALLERGY', label: 'Allergy', icon: 'AlertTriangle', color: '#ef4444' },
  { value: 'OTHER', label: 'Other', icon: 'File', color: '#64748b' },
];

const REMINDER_TYPES = [
  { value: 'MEDICATION_TIME', label: 'Medication Time' },
  { value: 'APPOINTMENT', label: 'Appointment' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'TEST_REPEAT', label: 'Test Repeat' },
  { value: 'PRESCRIPTION_REFILL', label: 'Prescription Refill' },
  { value: 'VACCINATION_DUE', label: 'Vaccination Due' },
  { value: 'CUSTOM', label: 'Custom' },
];

const ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  FlaskConical, Scan, Stethoscope, FileText, Shield, Contact, Syringe, History,
  Receipt, Share2, Award, AlertTriangle, File, Pill: PillIcon, Image: ImageIcon,
  IdCard: Contact,
};

function categoryMeta(value?: string | { value?: string }) {
  const val = typeof value === 'object' && value ? value.value : value;
  return CATEGORIES.find(c => c.value === val) ?? CATEGORIES[CATEGORIES.length - 1];
}

function iconFor(name?: string) {
  return ICONS[name ?? ''] ?? FileText;
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface UploadForm {
  category: string;
  title: string;
  description: string;
  documentDate: string;
  folderId: string;
  tags: string;
  isFavorite: boolean;
}

interface FolderForm {
  name: string;
  description: string;
  icon: string;
  color: string;
  parentFolderId: string;
}

interface ReminderForm {
  title: string;
  description: string;
  reminderType: string;
  triggerAt: string;
  recurrenceRule: string;
}

export default function PatientDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<PatientDocumentResponse[]>([]);
  const [folders, setFolders] = useState<PatientDocumentFolderResponse[]>([]);
  const [stats, setStats] = useState<DocumentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PatientDocumentResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const [uploadForm, setUploadForm] = useState<UploadForm>({
    category: 'LAB_REPORT', title: '', description: '', documentDate: '', folderId: '', tags: '', isFavorite: false,
  });
  const [folderForm, setFolderForm] = useState<FolderForm>({
    name: '', description: '', icon: 'Folder', color: '#3b82f6', parentFolderId: '',
  });
  const [reminderForm, setReminderForm] = useState<ReminderForm>({
    title: '', description: '', reminderType: 'FOLLOW_UP', triggerAt: '', recurrenceRule: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = {};
      if (categoryFilter) params.category = categoryFilter;
      if (folderFilter) params.folderId = Number(folderFilter);
      if (favoriteOnly) params.favorite = true;
      if (search) params.search = search;
      const { data } = await patientDocumentApi.getAll(params);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, folderFilter, favoriteOnly, search]);

  const loadFolders = useCallback(async () => {
    try {
      const { data } = await patientDocumentApi.getFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch {
      setFolders([]);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await patientDocumentApi.getStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadFolders(); loadStats(); }, [loadFolders, loadStats]);

  const folderName = useCallback((id?: number | null) => {
    if (!id) return null;
    const find = (list: PatientDocumentFolderResponse[]): PatientDocumentFolderResponse | undefined => {
      for (const f of list) {
        if (f.id === id) return f;
        const hit = f.subFolders?.length ? find(f.subFolders) : undefined;
        if (hit) return hit;
      }
      return undefined;
    };
    return find(folders)?.name ?? null;
  }, [folders]);

  const doUpload = async () => {
    if (!selectedFile) {
      toast.error('Please choose a file');
      return;
    }
    setBusy(true);
    try {
      const request = {
        category: uploadForm.category,
        title: uploadForm.title || undefined,
        description: uploadForm.description || undefined,
        documentDate: uploadForm.documentDate || undefined,
        folderId: uploadForm.folderId ? Number(uploadForm.folderId) : undefined,
        tags: uploadForm.tags || undefined,
        isFavorite: uploadForm.isFavorite || undefined,
      };
      const { data } = await patientDocumentApi.upload(selectedFile, request);
      toast.success('Document uploaded');
      setUploadOpen(false);
      setSelectedFile(null);
      setUploadForm({ category: 'LAB_REPORT', title: '', description: '', documentDate: '', folderId: '', tags: '', isFavorite: false });
      load();
      loadStats();
      return data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const doCreateFolder = async () => {
    if (!folderForm.name.trim()) {
      toast.error('Folder name is required');
      return;
    }
    setBusy(true);
    try {
      await patientDocumentApi.createFolder({
        name: folderForm.name,
        description: folderForm.description || undefined,
        icon: folderForm.icon || undefined,
        color: folderForm.color || undefined,
        sortOrder: 0,
        parentFolderId: folderForm.parentFolderId ? Number(folderForm.parentFolderId) : undefined,
        isSystemFolder: false,
      });
      toast.success('Folder created');
      setFolderOpen(false);
      setFolderForm({ name: '', description: '', icon: 'Folder', color: '#3b82f6', parentFolderId: '' });
      loadFolders();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create folder');
    } finally {
      setBusy(false);
    }
  };

  const doDownload = async (doc: PatientDocumentResponse) => {
    try {
      const { data } = await patientDocumentApi.download(doc.id);
      const blob = new Blob([data], { type: doc.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalFileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Download failed');
    }
  };

  const doToggleFavorite = async (doc: PatientDocumentResponse) => {
    try {
      await patientDocumentApi.toggleFavorite(doc.id);
      load();
      loadStats();
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const doDelete = async (doc: PatientDocumentResponse) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await patientDocumentApi.delete(doc.id);
      toast.success('Document deleted');
      load();
      loadStats();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Delete failed');
    }
  };

  const doDeleteFolder = async (folderId: number, name: string) => {
    if (!window.confirm(`Delete folder "${name}"? Documents inside will be moved out.`)) return;
    try {
      await patientDocumentApi.deleteFolder(folderId);
      toast.success('Folder deleted');
      if (folderFilter === String(folderId)) setFolderFilter('');
      loadFolders();
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete folder');
    }
  };

  const openReminder = (doc: PatientDocumentResponse) => {
    setSelectedDoc(doc);
    setReminderForm({ title: '', description: '', reminderType: 'FOLLOW_UP', triggerAt: '', recurrenceRule: '' });
    setReminderOpen(true);
  };

  const doCreateReminder = async () => {
    if (!selectedDoc) return;
    if (!reminderForm.title.trim() || !reminderForm.triggerAt) {
      toast.error('Title and trigger time are required');
      return;
    }
    setBusy(true);
    try {
      await patientDocumentApi.createReminder(selectedDoc.id, {
        documentId: selectedDoc.id,
        title: reminderForm.title,
        description: reminderForm.description || undefined,
        reminderType: reminderForm.reminderType as DocumentReminderDTO.ReminderType,
        triggerAt: new Date(reminderForm.triggerAt).toISOString(),
        recurrenceRule: reminderForm.recurrenceRule || undefined,
        notificationChannels: ['PUSH', 'EMAIL'],
      });
      toast.success('Reminder created');
      setReminderOpen(false);
      setSelectedDoc(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create reminder');
    } finally {
      setBusy(false);
    }
  };

  const renderFolderTree = (list: PatientDocumentFolderResponse[], depth = 0): React.ReactNode => (
    <div>
      {list.map(f => (
        <div key={f.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
              folderFilter === String(f.id) ? 'bg-accent/15 text-accent' : 'hover:bg-surface-30 text-primary-light'
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
            onClick={() => setFolderFilter(folderFilter === String(f.id) ? '' : String(f.id))}
          >
            <Folder size={15} className="shrink-0" />
            <span className="text-sm truncate flex-1">{f.name}</span>
            <span className="text-xs text-primary-light/40">{f.documentCount}</span>
            <button
              onClick={e => { e.stopPropagation(); doDeleteFolder(f.id, f.name); }}
              className="p-1 rounded-lg hover:bg-danger/20 text-primary-light/40 hover:text-danger"
              title="Delete folder"
            >
              <Trash2 size={13} />
            </button>
          </div>
          {f.subFolders?.length ? renderFolderTree(f.subFolders, depth + 1) : null}
        </div>
      ))}
    </div>
  );

  const filteredDocs = useMemo(() => documents, [documents]);

  return (
    <AppLayout role="PATIENT" title="My Documents" subtitle="Medical records, reports & prescriptions">
      <div className="space-y-5">
        {error && (
          <div className="rounded-3xl bg-white border border-doctor-danger-soft/40 p-5 text-sm text-doctor-red">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile title="Total Documents" value={stats?.totalDocuments ?? documents.length} icon={<FileText size={20} />} color={FL.blue} />
          <StatTile title="Favorites" value={stats?.favoritesCount ?? 0} icon={<Star size={20} />} color={FL.gold} />
          <StatTile title="Categories" value={Object.keys(stats?.byCategory ?? {}).length} icon={<Folder size={20} />} color={FL.lavender} />
          <StatTile title="Storage Used" value={formatBytes(stats?.totalSizeBytes)} icon={<File size={20} />} color={FL.mint} />
        </div>

        {/* Toolbar */}
        <DarkCard tone="patient" className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/40" />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className={`${inputClass} w-auto`}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <ActionButton
              variant={favoriteOnly ? 'primary' : 'outline'}
              onClick={() => setFavoriteOnly(!favoriteOnly)}
            >
              <span className="inline-flex items-center gap-1.5"><Star size={14} /> Favorites</span>
            </ActionButton>
            <ActionButton variant="outline" onClick={() => { load(); loadFolders(); loadStats(); }}>
              <span className="inline-flex items-center gap-1.5"><RefreshCw size={14} /> Refresh</span>
            </ActionButton>
            <ActionButton variant="outline" onClick={() => setFolderOpen(true)}>
              <span className="inline-flex items-center gap-1.5"><FolderPlus size={14} /> New Folder</span>
            </ActionButton>
            <ActionButton onClick={() => setUploadOpen(true)}>
              <span className="inline-flex items-center gap-1.5"><Upload size={14} /> Upload</span>
            </ActionButton>
          </div>
        </DarkCard>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Folder sidebar */}
          <div className="lg:col-span-1">
            <DarkCard tone="patient" className="p-4">
              <SectionTitle>Folders</SectionTitle>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors mb-1 ${
                  folderFilter === '' ? 'bg-accent/15 text-accent' : 'hover:bg-surface-30 text-primary-light'
                }`}
                onClick={() => setFolderFilter('')}
              >
                <FileText size={15} className="shrink-0" />
                <span className="text-sm">All Documents</span>
              </div>
              {folders.length === 0 ? (
                <p className="text-xs text-primary-light/40 px-3 py-2">No folders yet. Create one to group your documents.</p>
              ) : (
                renderFolderTree(folders)
              )}
            </DarkCard>
          </div>

          {/* Document list */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-3xl bg-surface-20 border border-tonal-20 p-5 animate-pulse">
                    <div className="h-4 bg-surface-30 rounded w-1/3 mb-3"></div>
                    <div className="h-3 bg-surface-30 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredDocs.length === 0 ? (
              <DarkCard tone="patient" className="p-8 text-center">
                <FileText size={48} className="mx-auto text-primary-light/20 mb-4" />
                <p className="text-body text-primary-light/60 mb-2">No documents found</p>
                <p className="text-sm text-primary-light/40">Upload lab reports, prescriptions, and other medical files here.</p>
              </DarkCard>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map(doc => {
                  const meta = categoryMeta(doc.category);
                  const Icon = iconFor(meta.icon);
                  return (
                    <DarkCard key={doc.id} tone="patient" className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-base font-semibold text-primary-light truncate">{doc.title}</p>
                            <Pill color={meta.color} size="sm">{meta.label}</Pill>
                            {doc.isFavorite && <Star size={14} className="text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-xs text-primary-light/50 mt-1">
                            {doc.originalFileName} • {formatBytes(doc.fileSizeBytes)}
                          </p>
                          {doc.description && (
                            <p className="text-xs text-primary-light/50 mt-1 line-clamp-2">{doc.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-primary-light/40 flex-wrap">
                            {doc.documentDate && <span className="inline-flex items-center gap-1"><Clock size={12} /> {String(doc.documentDate).slice(0, 10)}</span>}
                            {folderName(doc.folder?.id) && <span className="inline-flex items-center gap-1"><Folder size={12} /> {folderName(doc.folder?.id)}</span>}
                            <span>Uploaded {formatDateTime(doc.uploadedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => doToggleFavorite(doc)}
                            className="p-2 rounded-xl hover:bg-surface-30 text-primary-light/50 hover:text-amber-400 transition-colors"
                            title="Favorite"
                          >
                            <Star size={16} className={doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                          </button>
                          <button
                            onClick={() => doDownload(doc)}
                            className="p-2 rounded-xl hover:bg-surface-30 text-primary-light/50 hover:text-accent transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => openReminder(doc)}
                            className="p-2 rounded-xl hover:bg-surface-30 text-primary-light/50 hover:text-accent transition-colors"
                            title="Add reminder"
                          >
                            <Bell size={16} />
                          </button>
                          <button
                            onClick={() => doDelete(doc)}
                            className="p-2 rounded-xl hover:bg-danger/20 text-primary-light/50 hover:text-danger transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </DarkCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" size="lg">
        <div className="space-y-4">
          <div>
            <Field label="File" required>
              <input
                type="file"
                className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20`}
                onChange={e => {
                  const f = e.target.files?.[0];
                  setSelectedFile(f ?? null);
                  if (f && !uploadForm.title) {
                    setUploadForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') }));
                  }
                }}
              />
            </Field>
            {selectedFile && (
              <p className="text-xs text-primary-light/50 mt-1">
                {selectedFile.name} ({formatBytes(selectedFile.size)})
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select
                className={inputClass}
                value={uploadForm.category}
                onChange={e => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Folder">
              <select
                className={inputClass}
                value={uploadForm.folderId}
                onChange={e => setUploadForm(prev => ({ ...prev, folderId: e.target.value }))}
              >
                <option value="">No folder</option>
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Title">
            <input
              className={inputClass}
              placeholder="e.g. Blood Test Report"
              value={uploadForm.title}
              onChange={e => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Optional notes..."
              value={uploadForm.description}
              onChange={e => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Document Date">
              <input
                type="date"
                className={inputClass}
                value={uploadForm.documentDate}
                onChange={e => setUploadForm(prev => ({ ...prev, documentDate: e.target.value }))}
              />
            </Field>
            <Field label="Tags (comma separated)">
              <input
                className={inputClass}
                placeholder="e.g. annual, bloodwork"
                value={uploadForm.tags}
                onChange={e => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-primary-light">
            <input
              type="checkbox"
              checked={uploadForm.isFavorite}
              onChange={e => setUploadForm(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="rounded"
            />
            Mark as favorite
          </label>
          <div className="flex gap-3 pt-2">
            <ActionButton variant="outline" onClick={() => setUploadOpen(false)} className="flex-1">Cancel</ActionButton>
            <ActionButton onClick={doUpload} disabled={busy || !selectedFile} className="flex-1">
              <span className="inline-flex items-center gap-1.5"><Upload size={14} /> {busy ? 'Uploading...' : 'Upload'}</span>
            </ActionButton>
          </div>
        </div>
      </Modal>

      {/* Folder modal */}
      <Modal isOpen={folderOpen} onClose={() => setFolderOpen(false)} title="New Folder">
        <div className="space-y-4">
          <Field label="Name" required>
            <input
              className={inputClass}
              placeholder="e.g. Lab Reports"
              value={folderForm.name}
              onChange={e => setFolderForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <input
              className={inputClass}
              value={folderForm.description}
              onChange={e => setFolderForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Icon">
              <select
                className={inputClass}
                value={folderForm.icon}
                onChange={e => setFolderForm(prev => ({ ...prev, icon: e.target.value }))}
              >
                {['Folder', 'FileText', 'FlaskConical', 'Heart', 'Shield'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Color">
              <input
                type="color"
                className={`${inputClass} h-[42px] p-1`}
                value={folderForm.color}
                onChange={e => setFolderForm(prev => ({ ...prev, color: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Parent Folder">
            <select
              className={inputClass}
              value={folderForm.parentFolderId}
              onChange={e => setFolderForm(prev => ({ ...prev, parentFolderId: e.target.value }))}
            >
              <option value="">None (top level)</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </Field>
          <div className="flex gap-3 pt-2">
            <ActionButton variant="outline" onClick={() => setFolderOpen(false)} className="flex-1">Cancel</ActionButton>
            <ActionButton onClick={doCreateFolder} disabled={busy} className="flex-1">
              <span className="inline-flex items-center gap-1.5"><FolderPlus size={14} /> {busy ? 'Creating...' : 'Create'}</span>
            </ActionButton>
          </div>
        </div>
      </Modal>

      {/* Reminder modal */}
      <Modal isOpen={reminderOpen} onClose={() => setReminderOpen(false)} title="Add Reminder">
        {selectedDoc && (
          <div className="space-y-4">
            <InnerCard tone="patient">
              <p className="text-sm text-primary-light/60">Reminder for</p>
              <p className="font-semibold text-primary-light">{selectedDoc.title}</p>
            </InnerCard>
            <Field label="Title" required>
              <input
                className={inputClass}
                placeholder="e.g. Repeat blood test"
                value={reminderForm.title}
                onChange={e => setReminderForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Type" required>
                <select
                  className={inputClass}
                  value={reminderForm.reminderType}
                  onChange={e => setReminderForm(prev => ({ ...prev, reminderType: e.target.value }))}
                >
                  {REMINDER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Trigger Date & Time" required>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={reminderForm.triggerAt}
                  onChange={e => setReminderForm(prev => ({ ...prev, triggerAt: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Description">
              <input
                className={inputClass}
                value={reminderForm.description}
                onChange={e => setReminderForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Field>
            <Field label="Recurrence (e.g. DAILY, WEEKLY)">
              <input
                className={inputClass}
                placeholder="Optional"
                value={reminderForm.recurrenceRule}
                onChange={e => setReminderForm(prev => ({ ...prev, recurrenceRule: e.target.value }))}
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <ActionButton variant="outline" onClick={() => setReminderOpen(false)} className="flex-1">Cancel</ActionButton>
              <ActionButton onClick={doCreateReminder} disabled={busy} className="flex-1">
                <span className="inline-flex items-center gap-1.5"><Bell size={14} /> {busy ? 'Creating...' : 'Create Reminder'}</span>
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
