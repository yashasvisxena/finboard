'use client';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IWidget } from '@/types/widget.types';
import { GripVertical, Pencil, RefreshCcw, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { AddWidgetDialog } from '../../add-widget-dialog/AddWidgetDialog';
import { Button } from '../../ui/button';
import { WidgetIcon } from './WidgetIcon';

interface WidgetCardHeaderProps {
  widget: IWidget;
  onRefetch: () => void;
  onDelete: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

export const WidgetCardHeader = memo(
  ({
    widget,
    onRefetch,
    onDelete,
    isLoading,
    isFetching,
  }: WidgetCardHeaderProps) => {
    return (
      <CardHeader className='flex flex-col justify-center items-start gap-2'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <div className='flex flex-row items-center gap-2 min-w-0'>
            <GripVertical className='size-4 sm:size-5 shrink-0 text-muted-foreground touch-none' />
            <div className='flex flex-row items-center gap-2 min-w-0'>
              <WidgetIcon icon={widget.type} />
              <CardTitle className='text-sm sm:text-base text-wrap'>
                {widget.title}
              </CardTitle>
            </div>
          </div>

          <div className='flex flex-row items-center gap-1.5 sm:gap-2 shrink-0'>
            <Button
              variant='outline'
              size='icon-sm'
              onClick={onRefetch}
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
        </div>

        <span className='text-sm text-muted-foreground truncate'>
          {widget.description && `${widget.description}`}
          {widget.description && <br />}
          Updates every {widget.api.refreshInterval} seconds
        </span>
      </CardHeader>
    );
  }
);

WidgetCardHeader.displayName = 'WidgetCardHeader';
