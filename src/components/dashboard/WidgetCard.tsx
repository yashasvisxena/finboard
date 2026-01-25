'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useApiQuery } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';
import { apiClientFetcher } from '@/services/api/core/api-client';
import { IWidget } from '@/types/widget.types';
import {
  ChartBar,
  Database,
  GripVertical,
  Pencil,
  RefreshCcw,
  Sheet,
  Table,
  Trash2,
} from 'lucide-react';
import { memo } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { ErrorState } from '../common/ErrorState';
import { WidgetLoadingSkeleton } from '../common/LoadingState';
import { Button } from '../ui/button';

interface WidgetCardProps {
  widget: IWidget;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  className?: string;
  onDelete: () => void;
}

const WidgetIcon = memo(({ icon }: { icon: string }) => {
  switch (icon) {
    case 'table':
      return <Table className='size-4 sm:size-5' />;
    case 'chart':
      return <ChartBar className='size-4 sm:size-5' />;
    case 'card':
    default:
      return <Sheet className='size-4 sm:size-5' />;
  }
});
WidgetIcon.displayName = 'WidgetIcon';

function isEmptyData(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
}

export const WidgetCard = memo(
  ({
    widget,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragging,
    className,
    onDelete,
  }: WidgetCardProps) => {
    const { data, isLoading, isError, error, refetch, isFetching } =
      useApiQuery<unknown>({
        queryKey: ['widget', widget.id, widget.api.apiName, widget.api.url],
        client: apiClientFetcher(widget.api.provider || ''),
        url: widget.api.url || '',
        enabled: Boolean(widget.api.useCustomUrl),
      });

    const renderContent = () => {
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
            onRetry={() => refetch()}
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
        <div className='space-y-2 text-sm'>
          <div className='text-xs text-muted-foreground'>
            <strong>API:</strong> {JSON.stringify(widget.api)}
          </div>
          <div className='text-xs text-muted-foreground'>
            <strong>Mapping:</strong> {JSON.stringify(widget.mapping)}
          </div>
          <pre className='text-xs bg-muted p-2 rounded-md overflow-auto max-h-[120px]'>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    };

    return (
      <Card
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={cn(
          'cursor-move transition-all duration-200',
          isDragging
            ? 'opacity-50 scale-95 ring-2 ring-primary'
            : 'opacity-100',
          className
        )}
      >
        <CardHeader className='flex flex-row justify-between items-start gap-2 p-3 sm:p-4 sm:items-center'>
          <div className='flex flex-row items-center gap-2 min-w-0'>
            <GripVertical className='size-4 sm:size-5 shrink-0 text-muted-foreground touch-none' />
            <div className='flex flex-row items-center gap-1.5 min-w-0'>
              <WidgetIcon icon={widget.type} />
              <CardTitle className='text-sm sm:text-base truncate'>
                {widget.title}
              </CardTitle>
            </div>
          </div>

          <div className='flex flex-row items-center gap-1.5 sm:gap-2 shrink-0'>
            <Button
              variant='outline'
              size='icon-sm'
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className='size-7 sm:size-8'
            >
              <RefreshCcw
                className={cn('size-3 sm:size-4', isFetching && 'animate-spin')}
              />
            </Button>
            <AddWidgetDialog editWidget={widget}>
              <Button
                variant='outline'
                size='icon-sm'
                className='size-7 sm:size-8'
              >
                <Pencil className='size-3 sm:size-4' />
              </Button>
            </AddWidgetDialog>
            <Button
              variant='destructive'
              size='icon-sm'
              onClick={onDelete}
              className='size-7 sm:size-8'
            >
              <Trash2 className='size-3 sm:size-4' />
            </Button>
          </div>
        </CardHeader>

        <CardContent className='p-3 pt-0 sm:p-4 sm:pt-0'>
          {renderContent()}
        </CardContent>
      </Card>
    );
  }
);

WidgetCard.displayName = 'WidgetCard';
