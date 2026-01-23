import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sizeClasses } from '@/constants/widgets';
import { cn, getIcon } from '@/lib/utils';
import { Widget, WidgetSize } from '@/types/widgets/widgetTypes';
import { GripVertical } from 'lucide-react';
import { memo } from 'react';

interface WidgetCardProps {
  widget: Widget;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  className?: string;
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
  }: WidgetCardProps) => {
    const Icon = getIcon(widget.icon);

    return (
      <Card
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={cn(
          sizeClasses[widget.size as WidgetSize],
          'cursor-move',
          isDragging
            ? 'opacity-50 scale-95 ring-2 ring-primary'
            : 'opacity-100',
          className
        )}
      >
        <CardHeader className='flex flex-row items-center gap-2 pb-3'>
          <GripVertical size={16} />
          <div className='p-2 rounded-lg'>
            <Icon className='w-4 h-4' />
          </div>
          <CardTitle className='text-base'>{widget.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className='text-sm text-gray-600 mb-4'>{widget.description}</p>
        </CardContent>
      </Card>
    );
  }
);

WidgetCard.displayName = 'WidgetCard';
