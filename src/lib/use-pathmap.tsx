import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

export function usePathmap() {
  return usePathname();
}

export function useRequireAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
    router.push('/login');
    return null;
  }

  return null;
}
