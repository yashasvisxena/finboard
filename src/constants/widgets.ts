import { WidgetSize } from '@/types/widgets/widgetTypes';
import { ChartBar, Sheet, Table } from 'lucide-react';

export const sizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-1 row-span-1',
  large: 'col-span-1 md:col-span-2 row-span-2',
  wide: 'col-span-1 md:col-span-2 xl:col-span-3 row-span-1',
  tall: 'col-span-1 row-span-2',
  full: 'col-span-1 md:col-span-2 xl:col-span-3 row-span-2',
};

export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  card: Sheet,
  table: Table,
  chart: ChartBar,
};
