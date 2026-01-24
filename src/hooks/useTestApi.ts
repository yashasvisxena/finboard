import axios from 'axios';
import { useState } from 'react';

export function useTestApi() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async (url: string, params?: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(url, { params });
      setData(res.data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch API');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    testApi,
  };
}
