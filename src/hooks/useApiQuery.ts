'use client';

import { apiKeyFetchers } from '@/constants';
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
  /** Optional refetch interval in milliseconds for auto-refresh. */
  refetchInterval?: number | false;
  /** API provider to use */
  provider: string;
  /** API params to use */
  params?: Record<string, any>;
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
    provider,
    refetchInterval,
    params,
  } = args;
  let finalParams = {};
  if (url) {
    if (provider === 'indianApi') {
      {
        finalParams = { ...finalParams, params };
      }
    } else if (provider in apiKeyFetchers) {
      const apiKey = apiKeyFetchers[provider as keyof typeof apiKeyFetchers]();
      finalParams = { ...apiKey, ...params };
    } else {
      finalParams = { ...params };
    }
  }
  const queryParams = {
    ...config?.params,
    ...finalParams,
  };

  return useQuery<TData>({
    queryKey,
    enabled,
    refetchInterval: refetchInterval || 120 * 1000,
    queryFn: async ({ signal }) => {
      const data = await client.get<TData>(url, {
        ...config,
        params: queryParams,
        signal,
      });

      return data as TData;
    },
  });
}
