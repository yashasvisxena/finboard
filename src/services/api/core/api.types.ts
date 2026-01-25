export type TApiProvider = 'alphaVantage' | 'finnhub' | 'indianApi' | 'custom';
export type TApiParamValue = string | number | boolean;

export interface IWidgetApiConfig {
  provider: TApiProvider;
  url: string;
  refreshInterval: number;
  params?: Record<string, TApiParamValue>;
}
