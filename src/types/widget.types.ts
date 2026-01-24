import { IWidgetApiConfig } from '@/services/api/core/api.types';

import { IWidgetDataMapping } from './mapping.types';

export type TWidgetSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'wide'
  | 'tall'
  | 'full';

export type TWidgetType = 'table' | 'chart' | 'card';

export interface IWidget {
  id: string;
  type: TWidgetType;
  title: string;
  description?: string;

  api: IWidgetApiConfig;
  mapping: IWidgetDataMapping;
}
