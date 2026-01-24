import { API_BASE_URLS, API_KEYS } from '@/constants';
import { createApiClient } from '@/lib/axios/api-setup';

export const finnhubApi = createApiClient(API_BASE_URLS.FINNHUB, {
  'X-Finnhub-Token': API_KEYS.FINNHUB!,
});

export const indianStockApi = createApiClient(API_BASE_URLS.INDIAN_API, {
  'X-Api-Key': API_KEYS.INDIAN_API!,
});

export const customApi = createApiClient('');

export const apiClientFetcher = (provider: string) => {
  switch (provider) {
    case 'finnhub':
      return finnhubApi;
    case 'indian-stock':
      return indianStockApi;
    default:
      return customApi;
  }
};
