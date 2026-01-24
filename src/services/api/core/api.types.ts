export type TApiProvider = 'alphaVantage' | 'finnhub' | 'indianApi';
export type TApiParamValue = string | number | boolean | object | string[];

export interface IWidgetApiConfig {
  provider: TApiProvider;
  apiName: string;
  refreshInterval: number;
  useCustomUrl?: boolean;
  customUrl?: string;
  params: Record<string, TApiParamValue>;
}

export interface IApiConfig {
  provider: TApiProvider;
  name: string;
  endpoint: string;
  params: IApiParams[];
  isWS?: boolean;
  sampleResponse?: Record<string, unknown>;
}

export interface IApiParams {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  description?: string;
}
