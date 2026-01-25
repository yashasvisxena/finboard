import { apiClientFetcher } from '@/services/api/core/api-client';
import { useRef, useState } from 'react';

export function useTestApi() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const testApi = async (
    url: string,
    provider: string,
    params?: Record<string, any>
  ) => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      setData(null);

      const apiClient = apiClientFetcher(provider);
      const res = await apiClient.get(url, {
        params,
        signal: controller.signal,
      });

      setData(res);
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') {
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to fetch API';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    testApi,
    reset,
  };
}
