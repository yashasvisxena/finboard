export type ApiProvider = 'alphaVantage' | 'finnhub' | 'indianApi';

export interface WidgetApiConfig {
  provider: ApiProvider;
  endpointKey: string;
  params: Record<string, string | number>;
  refreshInterval: number;
  useCustomUrl?: boolean;
  customUrl?: string;
}

export interface WidgetDisplayConfig {
  fields?: string[];
  formatters?: Record<string, 'currency' | 'percent' | 'number'>;
}
