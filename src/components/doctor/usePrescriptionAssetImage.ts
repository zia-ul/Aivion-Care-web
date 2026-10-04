'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

/**
 * Loads a prescription asset (hospital logo, doctor logo, stamp, signature)
 * with the same semantics as the Android `_PrescriptionAssetImage` widget:
 * - relative paths are resolved against the API base URL,
 * - non-http values render the fallback (badge),
 * - protected branding/document assets are fetched with the JWT so the
 *   browser never sends an unauthenticated request that 401s,
 * - failures always render the fallback instead of a broken image.
 */
export function usePrescriptionAssetImage(rawUrl?: string | null): {
  src: string | null;
  failed: boolean;
} {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const value = (rawUrl ?? '').trim();
    if (!value) {
      setFailed(true);
      setSrc(null);
      return;
    }

    const resolved = resolveAssetUrl(value);
    if (!resolved.startsWith('http://') && !resolved.startsWith('https://')) {
      setFailed(true);
      setSrc(null);
      return;
    }

    setFailed(false);
    setSrc(null);

    const controller = new AbortController();
    apiClient
      .get(resolved, { responseType: 'blob', signal: controller.signal, baseURL: '' })
      .then((response) => {
        if (cancelled) return;
        const blob = response.data as Blob;
        if (!blob || (blob as Blob).size === 0) {
          setFailed(true);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setFailed(false);
        setSrc(objectUrl);
      })
      .catch((error) => {
        if (cancelled) return;
        if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [rawUrl]);

  return { src, failed };
}

export function resolveAssetUrl(rawUrl: string): string {
  const value = (rawUrl ?? '').trim();
  if (!value) return value;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
  if (!base) return value;
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
}

/** Doctor initials for the fallback badge, matching the Android `_initials`. */
export function doctorInitials(value?: string | null): string {
  const parts = (value ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}