'use client';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { WidgetRenderer } from '@/components/widgets';
import { IWidget } from '@/types/widget.types';
import { Database } from 'lucide-react';
import { memo } from 'react';

import { ErrorState } from '../../common/ErrorState';
import { WidgetLoadingSkeleton } from '../../common/LoadingState';

interface WidgetContentRendererProps {
  widget: IWidget;
  data: unknown;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  onRetry: () => void;
}

function isEmptyData(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
}

export const WidgetContentRenderer = memo(
  ({
    widget,
    data,
    isLoading,
    isError,
    error,
    isFetching,
    onRetry,
  }: WidgetContentRendererProps) => {
    if (isLoading) {
      return <WidgetLoadingSkeleton />;
    }

    if (isError) {
      return (
        <ErrorState
          title='Failed to load data'
          message={
            error?.message || 'Unable to fetch data from the API endpoint'
          }
          type={
            error?.message?.toLowerCase().includes('network')
              ? 'network'
              : 'generic'
          }
          onRetry={onRetry}
          isRetrying={isFetching}
          size='sm'
        />
      );
    }

    if (isEmptyData(data)) {
      return (
        <Empty className='min-h-[100px]'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Database className='size-5' />
            </EmptyMedia>
            <EmptyTitle>No data available</EmptyTitle>
            <EmptyDescription>
              The API returned empty data. Try refreshing or check your
              configuration.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <WidgetRenderer type={widget.type} data={data} mapping={widget.mapping} />
    );
  }
);

WidgetContentRenderer.displayName = 'WidgetContentRenderer';
