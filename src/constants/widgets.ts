import { ChartBar, Sheet, Table } from 'lucide-react';

export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  card: Sheet,
  table: Table,
  chart: ChartBar,
};
