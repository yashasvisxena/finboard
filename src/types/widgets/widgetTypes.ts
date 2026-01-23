import { WidgetApiConfig, WidgetDisplayConfig } from './apiTypes';

export type IconType = 'table' | 'chart' | 'card';

export interface BaseWidget {
  id: string;
  title: string;
  description?: string;
  icon: IconType;

  api: WidgetApiConfig;
  display?: WidgetDisplayConfig;

  data?: unknown;
  lastUpdated?: number;
}

export interface TableWidget extends BaseWidget {
  icon: 'table';
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ChartWidget extends BaseWidget {
  icon: 'chart';
}

export interface CardWidget extends BaseWidget {
  icon: 'card';
}

export type Widget = TableWidget | ChartWidget | CardWidget;

export interface WidgetLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
