import axios from 'axios';
import { resolveApiOrigin } from './config';
import { useAuthStore } from '@/lib/stores/auth';

let refreshPromise: Promise<string | null> | null = null;

/**
 * Returns a valid access token. If the current token is missing or expired
 * (or expiring within 60s), attempts to refresh it via refresh-token endpoint.
 */
export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const currentToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Check if accessToken is still valid (decode exp without verify)
  if (currentToken) {
    try {
      const parts = currentToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const expMs = (payload.exp || 0) * 1000;
        // If token has more than 60s remaining before expiry, it's safe to use
        if (Date.now() < expMs - 60000) {
          return currentToken;
        }
      }
    } catch {
      // Decode failed, attempt refresh below
    }
  }

  // If no refresh token available, fall back to current token
  if (!refreshToken) {
    return currentToken;
  }

  // Deduplicate concurrent refresh calls
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const API_URL = resolveApiOrigin();
      const response = await axios.post<{ accessToken: string; refreshToken?: string }>(
        `${API_URL}/api/v1/auth/refresh-token`,
        { refreshToken }
      );
      const newAccess = response.data.accessToken;
      const newRefresh = response.data.refreshToken;
      if (newAccess) {
        localStorage.setItem('accessToken', newAccess);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth({
            user: currentUser,
            accessToken: newAccess,
            refreshToken: newRefresh || refreshToken,
          });
        }
        return newAccess;
      }
      return currentToken;
    } catch (err) {
      console.warn('Failed to refresh access token:', err);
      return currentToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
