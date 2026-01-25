'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';
import { apiClientFetcher } from '@/services/api/core/api-client';
import { IWidget } from '@/types/widget.types';
import { memo } from 'react';

import { WidgetCardHeader, WidgetContentRenderer } from './components';

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
        queryKey: ['widget', widget.id, widget.api.provider, widget.api.url],
        client: apiClientFetcher(widget.api.provider),
        provider: widget.api.provider,
        url: widget.api.url,
        params: widget.api.params,
        enabled: Boolean(widget.api.url),
      });

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
          className,
          widget.type === 'table' && 'col-span-full',
          widget.type === 'chart' && 'col-span-full xl:col-span-2'
        )}
      >
        <WidgetCardHeader
          widget={widget}
          onRefetch={refetch}
          onDelete={onDelete}
          isLoading={isLoading}
          isFetching={isFetching}
        />

        <CardContent>
          <WidgetContentRenderer
            widget={widget}
            data={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isFetching={isFetching}
            onRetry={refetch}
          />
        </CardContent>
      </Card>
    );
  }
);

WidgetCard.displayName = 'WidgetCard';
