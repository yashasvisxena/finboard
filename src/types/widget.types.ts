import {
  WidgetApiConfig,
  WidgetDisplayConfig,
} from '@/services/api/core/api.types';

export type WidgetSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'wide'
  | 'tall'
  | 'full';

export type IconType = 'table' | 'chart' | 'card';

export interface BaseWidget {
  id: string;
  title: string;
  description?: string;
  icon: IconType;
  size: WidgetSize;

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
