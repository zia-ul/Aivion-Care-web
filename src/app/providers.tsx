'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { wsService } from '@/lib/websocket/client';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  }));

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

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      wsService.connect(accessToken);
      return () => {
        wsService.disconnect();
      };
    }
  }, [isAuthenticated, accessToken]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0D202B',
            color: '#DDFBF8',
            border: '1px solid rgba(39, 97, 114, 0.55)',
            borderRadius: '16px',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.35)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22D3C5', secondary: '#07141D' } },
          error: { iconTheme: { primary: '#F47D8A', secondary: '#07141D' } },
        }}
      />
    </QueryClientProvider>
  );
}

