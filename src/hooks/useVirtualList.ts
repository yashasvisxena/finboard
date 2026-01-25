'use client';

import { VirtualItem, useVirtualizer } from '@tanstack/react-virtual';
import { RefObject, useMemo, useRef } from 'react';

export interface UseVirtualListOptions<T> {
  /** Array of items to virtualize */
  items: T[];
  /** Number of items per row (for grid layouts) */
  itemsPerRow?: number;
  /** Estimated height of each row in pixels */
  rowHeight: number;
  /** Number of extra rows to render outside the visible area */
  overscan?: number;
  /** Minimum number of items before virtualization kicks in */
  threshold?: number;
  /** Number of extra rows to add (e.g., for add button) */
  extraRows?: number;
}

export interface VirtualRowData<T> {
  /** The virtual item from react-virtual */
  virtualItem: VirtualItem;
  /** The items in this row (for grid layouts) */
  rowItems: T[];
  /** Whether this is an extra row (beyond actual data) */
  isExtraRow: boolean;
  /** The row index */
  index: number;
}

export interface UseVirtualListReturn<T> {
  /** Ref to attach to the scrollable container */
  parentRef: RefObject<HTMLDivElement | null>;
  /** Whether virtualization is enabled based on threshold */
  isVirtualized: boolean;
  /** Total height of the virtualized content */
  totalHeight: number;
  /** Virtual row data for rendering */
  virtualRows: VirtualRowData<T>[];
  /** The grouped rows (for non-virtualized rendering) */
  rows: T[][];
}

/**
 * A reusable hook for list/grid virtualization
 * Abstracts away the complexity of @tanstack/react-virtual
 */
export function useVirtualList<T>({
  items,
  itemsPerRow = 1,
  rowHeight,
  overscan = 2,
  threshold = 0,
  extraRows = 0,
}: UseVirtualListOptions<T>): UseVirtualListReturn<T> {
  const parentRef = useRef<HTMLDivElement>(null);

  // Group items into rows based on itemsPerRow
  const rows = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      result.push(items.slice(i, i + itemsPerRow));
    }
    return result;
  }, [items, itemsPerRow]);

  const isVirtualized = items.length > threshold;

  const virtualizer = useVirtualizer({
    count: rows.length + extraRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
    enabled: isVirtualized,
  });

  const virtualRows = useMemo((): VirtualRowData<T>[] => {
    if (!isVirtualized) return [];

    return virtualizer.getVirtualItems().map((virtualItem) => ({
      virtualItem,
      rowItems: rows[virtualItem.index] ?? [],
      isExtraRow: virtualItem.index >= rows.length,
      index: virtualItem.index,
    }));
  }, [isVirtualized, virtualizer, rows]);

  return {
    parentRef,
    isVirtualized,
    totalHeight: virtualizer.getTotalSize(),
    virtualRows,
    rows,
  };
}
