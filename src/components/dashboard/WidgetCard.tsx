'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/useApiQuery';
import { cn } from '@/lib/utils';
import { apiClientFetcher } from '@/services/api/core/api-client';
import { IWidget } from '@/types/widget.types';
import {
  ChartBar,
  GripVertical,
  Pencil,
  RefreshCcw,
  Sheet,
  Table,
  Trash2,
} from 'lucide-react';
import { memo } from 'react';

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
      return <Table size={20} />;
    case 'chart':
      return <ChartBar size={20} />;
    case 'card':
    default:
      return <Sheet size={20} />;
  }
});
WidgetIcon.displayName = 'WidgetIcon';

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
    const { data, isLoading, error } = useApiQuery<unknown>({
      queryKey: ['widget', widget.id, widget.api.apiName, widget.api.url],
      client: apiClientFetcher(widget.api.provider || ''),
      url: widget.api.url || '',
      enabled: Boolean(widget.api.useCustomUrl),
    });

    return (
      <Card
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={cn(
          'cursor-move',
          isDragging
            ? 'opacity-50 scale-95 ring-2 ring-primary'
            : 'opacity-100',
          className
        )}
      >
        <CardHeader className='flex flex-row justify-between items-center gap-2'>
          <div className='flex flex-row items-center gap-2'>
            <GripVertical size={20} />
            <div className='flex flex-row items-center text-lg gap-1'>
              <WidgetIcon icon={widget.type} />
              <CardTitle>{widget.title}</CardTitle>
            </div>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Button variant='outline' size={'icon-sm'}>
              <RefreshCcw />
            </Button>
            <Button variant='outline' size={'icon-sm'}>
              <Pencil />
            </Button>
            <Button variant='destructive' size={'icon-sm'} onClick={onDelete}>
              <Trash2 />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {JSON.stringify(widget.api)}
          <br />
          {JSON.stringify(widget.mapping)}
          <br />
          {JSON.stringify(data)}
        </CardContent>
      </Card>
    );
  }
);

WidgetCard.displayName = 'WidgetCard';
