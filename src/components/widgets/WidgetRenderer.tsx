'use client';

import {
  ICardMapping,
  IChartMapping,
  ITableMapping,
  IWidgetDataMapping,
} from '@/types/mapping.types';
import { TWidgetType } from '@/types/widget.types';
import { memo } from 'react';

import { CardWidget } from './CardWidget';
import { ChartWidget } from './ChartWidget';
import { TableWidget } from './TableWidget';

interface WidgetRendererProps {
  type: TWidgetType;
  data: unknown;
  mapping: IWidgetDataMapping;
}

export const WidgetRenderer = memo(
  ({ type, data, mapping }: WidgetRendererProps) => {
    switch (type) {
      case 'table':
        return (
          <TableWidget
            data={data}
            mapping={mapping as ITableMapping}
            page={1}
            pageSize={10}
            totalItems={
              (data as any)?.count ||
              (data as any)?.total ||
              (Array.isArray(data) ? data.length : 0)
            }
          />
        );
      case 'chart':
        return <ChartWidget data={data} mapping={mapping as IChartMapping} />;
      case 'card':
        return <CardWidget data={data} mapping={mapping as ICardMapping} />;
      default:
        return (
          <div className='text-sm text-muted-foreground'>
            Unknown widget type: {type}
          </div>
        );
    }
  }
);

WidgetRenderer.displayName = 'WidgetRenderer';
