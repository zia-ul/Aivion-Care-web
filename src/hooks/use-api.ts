import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const {
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: Promise<any>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiCall;
        const data = response.data;
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }
        return data;
      } catch (error: any) {
        const message = error?.response?.data?.message || 'An error occurred';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        onError?.(error);
        if (showErrorToast) {
          toast.error(message);
        }
        throw error;
      }
    },
    [onSuccess, onError, showErrorToast, showSuccessToast, successMessage]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
