import { apiClientFetcher } from '@/services/api/core/api-client';
import { useState } from 'react';

export function useTestApi() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async (
    url: string,
    provider: string,
    params?: Record<string, any>
  ) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const apiClient = apiClientFetcher(provider);
      const res = await apiClient.get(url, { params });
      setData(res);
    } catch (err: any) {
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
    setData(null);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    testApi,
    reset,
  };
}
