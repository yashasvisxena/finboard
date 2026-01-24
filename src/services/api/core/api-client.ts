import { API_BASE_URLS } from '@/constants';
import { createApiClient } from '@/lib/axios/api-setup';

export const finnhubApi = createApiClient(API_BASE_URLS.FINNHUB);

export const indianStockApi = createApiClient(API_BASE_URLS.INDIAN_API);
