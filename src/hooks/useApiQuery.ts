'use client';

import {
  type QueryKey,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface UseApiQueryArgs<TData = unknown> {
  /** Unique cache key for this request */
  queryKey: QueryKey;
  /** Axios client to use (e.g. finnhubApi, indianStockApi, customApi) */
  client: AxiosInstance;
  /** URL or path to call. For customApi, this can be a full URL. */
  url: string;
  /** Additional Axios config such as params, headers, data, etc. */
  config?: Omit<AxiosRequestConfig, 'url' | 'method'>;
  /** Whether the query should be enabled. */
  enabled?: boolean;
  /** Abort signal for the request. */
  signal?: AbortSignal;
  /** Optional refetch interval in milliseconds for auto-refresh. */
  refetchInterval?: number | false;
}

export function useApiQuery<TData = unknown>(
  args: UseApiQueryArgs<TData>
): UseQueryResult<TData> {
  const {
    queryKey,
    client,
    url,
    config,
    enabled = true,
    signal,
    refetchInterval,
  } = args;

  return useQuery<TData>({
    queryKey,
    enabled,
    refetchInterval: refetchInterval || 120 * 1000,
    queryFn: async () => {
      const response = await client.get<TData>(url, {
        ...config,
        signal,
      });

      return response.data;
    },
  });
}
