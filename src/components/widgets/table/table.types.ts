import { ITableMapping } from '@/types/mapping.types';

export interface TableWidgetProps {
  data: unknown;
  mapping: ITableMapping;
  page?: number;
  pageSize?: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string | null;
  direction: SortDirection;
}

export const PAGE_SIZES = [5, 10, 20, 50] as const;
