export interface DocumentCategoryDTO {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export interface PatientDocumentUploadRequest {
  category: string;
  title?: string;
  description?: string;
  documentDate?: string;
  folderId?: number;
  tags?: string;
  isFavorite?: boolean;
  documentType?: string;
}

export interface PatientDocumentResponse {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  category: DocumentCategory;
  categoryInfo?: DocumentCategoryDTO;
  documentDate?: string;
  uploadedAt: string;
  isFavorite?: boolean;
  tags?: string;
  analysisStatus?: string;
  analysisResult?: string;
  version: number;
  parentDocumentId?: number;
  folder?: FolderDTO;
  reminders?: ReminderDTO[];
  ocrText?: string;
  analysisResultSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCategory {
  value: string;
  label: string;
}

export interface FolderDTO {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  parentFolderId?: number;
}

export interface ReminderDTO {
  id: number;
  title: string;
  description?: string;
  reminderType: string;
  triggerAt: string;
  recurrenceRule?: string;
  status: string;
  notificationChannels?: string[];
}

export interface PatientDocumentFolderRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  parentFolderId?: number;
  isSystemFolder?: boolean;
}

export interface PatientDocumentFolderResponse {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isSystemFolder: boolean;
  documentCount: number;
  parentFolderId?: number;
  subFolders?: PatientDocumentFolderResponse[];
  createdAt: string;
  updatedAt: string;
}

export namespace DocumentReminderDTO {
  export type ReminderType = 'MEDICATION_TIME' | 'APPOINTMENT' | 'FOLLOW_UP' | 'TEST_REPEAT' | 'PRESCRIPTION_REFILL' | 'VACCINATION_DUE' | 'CUSTOM';

  export interface ReminderRequest {
    documentId: number;
    title: string;
    description?: string;
    reminderType: ReminderType;
    triggerAt: string;
    recurrenceRule?: string;
    notificationChannels?: string[];
  }

  export interface ReminderResponse {
    id: number;
    documentId: number;
    documentTitle: string;
    title: string;
    description?: string;
    reminderType: string;
    triggerAt: string;
    recurrenceRule?: string;
    status: string;
    lastTriggeredAt?: string;
    nextTriggerAt?: string;
    notificationChannels: string[];
    metadata?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface ReminderStatsResponse {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    upcomingToday: number;
    upcomingWeek: number;
  }
}

export interface DocumentStatsResponse {
  totalDocuments: number;
  byCategory: Record<string, number>;
  totalSizeBytes: number;
  favoritesCount: number;
  pendingAnalysisCount: number;
  completedAnalysisCount: number;
}

export interface DocumentUploadRequest {
  category: string;
  title?: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  documentDate?: string;
  folderId?: number;
  tags?: string;
  isFavorite?: boolean;
}
