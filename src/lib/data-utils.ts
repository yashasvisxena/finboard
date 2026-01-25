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
 * Find the array base path by checking each level of the first column key
 * Returns the longest path that resolves to an array
 */
function findArrayBasePath(
  data: unknown,
  columns: { key: string }[]
): string | null {
  if (columns.length === 0) return null;

  // Use the first column key to find potential array paths
  const segments = columns[0].key.split('.');
  let currentPath = '';

  for (let i = 0; i < segments.length - 1; i++) {
    currentPath = currentPath ? `${currentPath}.${segments[i]}` : segments[i];
    const resolved = resolvePath(data, currentPath);

    if (Array.isArray(resolved)) {
      // Verify all columns share this base path
      const allMatch = columns.every(
        (col) =>
          col.key === currentPath || col.key.startsWith(currentPath + '.')
      );
      if (allMatch) {
        return currentPath;
      }
    }
  }

  return null;
}

/**
 * Extract multiple values from data for table columns
 */
export function extractTableData(
  data: unknown,
  columns: { key: string; label?: string; format?: TFieldFormat }[]
): Record<string, TResolvedValue>[] {
  // If data is an array at root level, map each item
  if (Array.isArray(data)) {
    return data.map((item) => {
      const row: Record<string, TResolvedValue> = {};
      columns.forEach((col) => {
        row[col.key] = resolvePath(item, col.key);
      });
      return row;
    });
  }

  // If data is an object, try to find a nested array from column keys
  if (typeof data === 'object' && data !== null) {
    // Try to find a base path that points to an array
    const basePath = findArrayBasePath(data, columns);

    if (basePath) {
      const resolvedArray = resolvePath(data, basePath);

      if (Array.isArray(resolvedArray)) {
        // Map over the array items
        return resolvedArray.map((item) => {
          const row: Record<string, TResolvedValue> = {};
          columns.forEach((col) => {
            // Get relative key by stripping basePath
            const relativeKey = col.key.startsWith(basePath + '.')
              ? col.key.slice(basePath.length + 1)
              : col.key;
            row[col.key] = resolvePath(item, relativeKey);
          });
          return row;
        });
      }
    }

    // Fallback: treat as single row
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
  // Case 1: Data is already an array (root level)
  if (Array.isArray(data)) {
    return data.map((item) => {
      const xValue =
        xAxisKeys.length > 0 ? resolvePath(item, xAxisKeys[0]) : item;
      const yValue = resolvePath(item, yAxisKey);
      return { x: xValue, y: yValue };
    });
  }

  // Case 2: Data is nested, find the array using xAxisKeys[0]
  if (xAxisKeys.length > 0) {
    const dataPath = xAxisKeys[0];
    const resolvedData = resolvePath(data, dataPath);

    if (Array.isArray(resolvedData)) {
      return resolvedData.map((item, index) => {
        // Prepare relative keys by stripping the base dataPath
        // e.g. path "datasets.0.values.1" relative to "datasets.0.values" becomes "1"
        const relativeYKey = yAxisKey.startsWith(dataPath + '.')
          ? yAxisKey.slice(dataPath.length + 1)
          : yAxisKey;

        // Try to determine X from the item
        // If the item itself is an array (e.g. [date, value]), and we haven't specified a deeper path for X,
        // we default to index component 0.
        // But if the user selects additional X keys, we might need logic.
        // For now, if the item is an array:
        let xValue: TResolvedValue = index;

        if (Array.isArray(item)) {
          // Default to first element for X if item is array
          xValue = item[0];

          // If xAxisKeys has more entries, or logic requires specific mapping?
          // Currently simplification: Array Items use idx 0 as X.
        } else {
          // If item is object, X is likely the index unless we have a relative key
          // But normally xAxisKeys[0] IS the data source.
        }

        // Resolve Y
        // If item is array and relativeKey is '1', resolvePath works (head='1', index).
        const yValue = resolvePath(item, relativeYKey) ?? item;

        return { x: xValue, y: yValue };
      });
    }
  }

  return [];
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
