import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, RefreshTokenRequest } from '@/types';
import { resolveApiOrigin } from './config';

// One setting in .env.local. See ./config.ts.
const API_URL = resolveApiOrigin();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  refreshQueue.forEach((cb) => cb(token ?? ''));
  refreshQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // FormData must be sent as multipart/form-data with the browser-generated
    // boundary. The axios instance defaults to application/json, which makes
    // Spring reject the request (500/415) because the @RequestPart is missing.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const isAuthError = Boolean(
      originalRequest &&
      (status === 401 || (status === 403 && !originalRequest.url?.includes('/api/v1/subscriptions')))
    );

    if (originalRequest && isAuthError && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          const { useAuthStore } = await import('@/lib/stores/auth');
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<AuthResponse>(
          `${API_URL}/api/v1/auth/refresh-token`,
          { refreshToken } as RefreshTokenRequest
        );

        const { accessToken: newAccess, refreshToken: newRefresh } = response.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccess);
          localStorage.setItem('refreshToken', newRefresh);
          const { useAuthStore } = await import('@/lib/stores/auth');
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().setAuth({
              user: currentUser,
              accessToken: newAccess,
              refreshToken: newRefresh,
            });
          }
        }
        processQueue(null, newAccess);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return apiClient(originalRequest);
      } catch {
        processQueue(new Error('Refresh failed'));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          const { useAuthStore } = await import('@/lib/stores/auth');
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
        }
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden (e.g. Doctor verification pending, unapproved role gate, or permissions)
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      const errorMsg = error.response.data?.message || 'Access restricted';
      // If doctor verification is pending, navigate to approval-pending / verification screen
      if (errorMsg.toLowerCase().includes('doctor verification') || errorMsg.toLowerCase().includes('pending')) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/approval-pending' && currentPath !== '/verification') {
          window.location.href = '/approval-pending';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
