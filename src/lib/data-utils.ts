import { TFieldFormat } from '@/types/add-widget-schema';

import { TResolvedValue, resolvePath } from './dot-notation-resolver';

/**
 * Get the field name from a dot-notation path
 * e.g., 'data.stock.price' → 'price'
 */
export function getFieldName(path: string): string {
  if (!path) return '';
  const parts = path.split('.');
  return humanizeKey(parts[parts.length - 1]);
}

/**
 * Convert snake_case or camelCase to human-readable format
 * e.g., 'market_capital' → 'Market Capital'
 * e.g., 'marketCapital' → 'Market Capital'
 */
export function humanizeKey(key: string) {
  return (
    key
      // marketCapital → market Capital
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // snake_case → snake case
      .replace(/_/g, ' ')
      // Capitalize each word
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Extract a single value from data using a dot-notation path
 */
export function extractValue(data: unknown, path: string): TResolvedValue {
  return resolvePath(data, path);
}

/**
 * Extract multiple values from data for table columns
 */
export function extractTableData(
  data: unknown,
  columns: { key: string; label?: string; format?: TFieldFormat }[]
): Record<string, TResolvedValue>[] {
  // If data is an array, map each item
  if (Array.isArray(data)) {
    return data.map((item) => {
      const row: Record<string, TResolvedValue> = {};
      columns.forEach((col) => {
        row[col.key] = resolvePath(item, col.key);
      });
      return row;
    });
  }

  // If data is an object, treat as single row
  if (typeof data === 'object' && data !== null) {
    const row: Record<string, TResolvedValue> = {};
    columns.forEach((col) => {
      row[col.key] = resolvePath(data, col.key);
    });
    return [row];
  }

  return [];
}

/**
 * Extract chart data points from API response
 */
export function extractChartData(
  data: unknown,
  xAxisKeys: string[],
  yAxisKey: string
): { x: TResolvedValue; y: TResolvedValue }[] {
  if (!Array.isArray(data)) {
    // Try to resolve as nested array
    const resolved = resolvePath(data, xAxisKeys[0]);
    if (Array.isArray(resolved)) {
      return resolved.map((item, index) => ({
        x: index,
        y: resolvePath(item, yAxisKey) ?? item,
      }));
    }
    return [];
  }

  return data.map((item) => {
    const xValue =
      xAxisKeys.length > 0 ? resolvePath(item, xAxisKeys[0]) : item;
    const yValue = resolvePath(item, yAxisKey);
    return { x: xValue, y: yValue };
  });
}

/**
 * Extract card fields from data
 */
export function extractCardData(
  data: unknown,
  fields: { key: string; label?: string; format?: TFieldFormat }[]
): {
  key: string;
  label: string;
  value: TResolvedValue;
  format?: TFieldFormat;
}[] {
  return fields.map((field) => ({
    key: field.key,
    label: field.label ?? getFieldName(field.key),
    value: resolvePath(data, field.key),
    format: field.format,
  }));
}

/**
 * Format a value based on its format type
 */
export function formatValue(
  value: TResolvedValue,
  format?: TFieldFormat
): string {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value));

    case 'percentage':
      return `${Number(value).toFixed(2)}%`;

    case 'number':
      return new Intl.NumberFormat('en-US').format(Number(value));

    case 'text':
    default:
      return String(value);
  }
}

/**
 * Paginate array data
 */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number; totalItems: number } {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = data.slice(startIndex, startIndex + pageSize);

  return { items, totalPages, totalItems };
}

/**
 * Filter data by search term across all string values
 */
export function filterBySearch<T extends Record<string, unknown>>(
  data: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase();
  return data.filter((item) =>
    Object.values(item).some(
      (val) =>
        val !== null &&
        val !== undefined &&
        String(val).toLowerCase().includes(term)
    )
  );
}
