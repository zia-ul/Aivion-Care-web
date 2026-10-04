'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { initThemeStore, useThemeStore } from '@/lib/stores/theme';
import { wsService } from '@/lib/websocket/client';
import { Toaster } from 'react-hot-toast';
import { IncomingCallListener } from '@/components/chat/IncomingCallListener';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  }));

  // Sync the theme store with the data-theme attribute set before hydration.
  useEffect(() => initThemeStore(), []);

  // Register Service Worker for push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Hydrate auth state once on mount (fresh page load starts unauthenticated).
    try {
      const storedUser = localStorage.getItem('user');
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      if (storedUser && storedAccess && storedRefresh) {
        useAuthStore.getState().setAuth({
          user: JSON.parse(storedUser),
          accessToken: storedAccess,
          refreshToken: storedRefresh,
        });
      } else {
        useAuthStore.getState().setLoading(false);
      }
    } catch {
      useAuthStore.getState().setLoading(false);
    }
  }, []);

  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const theme = useThemeStore((s) => s.theme);
  const themeReady = useThemeStore((s) => s.ready);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      wsService.connect(accessToken);
      return () => {
        wsService.disconnect();
      };
    }
  }, [isAuthenticated, accessToken]);

  // The server refuses the STOMP handshake when the access token is missing,
  // expired or revoked. Retrying cannot recover from that, so end the session
  // and let the user sign in again rather than silently losing realtime updates.
  useEffect(() => {
    return wsService.onAuthError((reason) => {
      console.warn('Realtime connection rejected:', reason);
      useAuthStore.getState().clearAuth();
    });
  }, []);

  // Toast colours follow the active palette. Until the store reports ready we
  // render the server default (dark) to avoid a hydration mismatch.
  const isDark = !themeReady || theme === 'dark';
  const toastStyle = isDark
    ? {
        background: '#0D202B',
        color: '#DDFBF8',
        border: '1px solid rgba(39, 97, 114, 0.55)',
      }
    : {
        background: '#FFFFFF',
        color: '#0C1F2B',
        border: '1px solid rgba(180, 203, 212, 0.75)',
      };

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <IncomingCallListener />
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            ...toastStyle,
            borderRadius: '16px',
            boxShadow: isDark ? '0 18px 45px rgba(0, 0, 0, 0.35)' : '0 18px 45px rgba(15, 40, 55, 0.12)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: isDark ? '#22D3C5' : '#0F766E', secondary: isDark ? '#07141D' : '#FFFFFF' } },
          error: { iconTheme: { primary: isDark ? '#F47D8A' : '#B22D46', secondary: isDark ? '#07141D' : '#FFFFFF' } },
        }}
      />
    </QueryClientProvider>
  );
}

