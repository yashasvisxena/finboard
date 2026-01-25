import axios from 'axios';
import { useState } from 'react';

export function useTestApi() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async (
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const res = await axios.get(url, { params, headers });
      setData(res.data);
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
