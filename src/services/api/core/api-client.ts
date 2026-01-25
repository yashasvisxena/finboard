import { API_BASE_URLS, API_KEYS } from '@/constants';
import { createApiClient } from '@/lib/axios/api-setup';

export const finnhubApi = createApiClient(API_BASE_URLS.FINNHUB, {
  'X-Finnhub-Token': API_KEYS.FINNHUB!,
});

export const indianStockApi = createApiClient(API_BASE_URLS.INDIAN_API, {
  'X-Api-Key': API_KEYS.INDIAN_API!,
});

export const alphaVantageApi = createApiClient(API_BASE_URLS.ALPHA_VANTAGE, {
  'X-Api-Key': API_KEYS.ALPHA_VANTAGE!,
});

export const customApi = createApiClient('');

export const apiClientFetcher = (provider: string) => {
  switch (provider) {
    case 'finnhub':
      return finnhubApi;
    case 'indianApi':
      return indianStockApi;
    case 'alphaVantage':
      return alphaVantageApi;
    default:
      return customApi;
  }
};
