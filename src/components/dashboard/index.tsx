'use client';

import { Button } from '@/components/ui/button';
import { useGridColumns } from '@/hooks/useGridColumn';
import { useVirtualList } from '@/hooks/useVirtualList';
import { moveItem } from '@/lib/utils';
import { useWidgetStore } from '@/store/widgetStore';
import { IWidget } from '@/types/widget.types';
import { Plus } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { WidgetCard } from './WidgetCard';

const VIRTUALIZATION_THRESHOLD = 6;
const WIDGET_HEIGHT = 280;
const WIDGETS_PER_ROW = 3;

const WidgetRow = memo(
  ({
    widgets,
    draggedId,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDelete,
  }: {
    widgets: IWidget[];
    draggedId: string | null;
    onDragStart: (id: string) => void;
    onDragOver: (e: React.DragEvent, targetId: string) => void;
    onDragEnd: () => void;
    onDelete: (id: string) => void;
  }) => (
    <>
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          onDragStart={() => onDragStart(widget.id)}
          onDragOver={(e) => onDragOver(e, widget.id)}
          onDrop={onDragEnd}
          onDragEnd={onDragEnd}
          isDragging={draggedId === widget.id}
          onDelete={() => onDelete(widget.id)}
        />
      ))}
    </>
  )
);
WidgetRow.displayName = 'WidgetRow';

const DashboardLayout = () => {
  const widgets = useWidgetStore((state) => state.widgets);
  const setWidgets = useWidgetStore((state) => state.setWidgets);
  const deleteWidget = useWidgetStore((state) => state.deleteWidget);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const columns = useGridColumns();

  const { parentRef, isVirtualized, totalHeight, virtualRows } = useVirtualList(
    {
      items: widgets,
      itemsPerRow: columns,
      rowHeight: WIDGET_HEIGHT,
      overscan: 2,
      threshold: VIRTUALIZATION_THRESHOLD,
      extraRows: 1,
    }
  );

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();

      if (!draggedId || draggedId === targetId) return;

      const draggedIndex = widgets.findIndex((w) => w.id === draggedId);
      const targetIndex = widgets.findIndex((w) => w.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      setWidgets(moveItem(widgets, draggedIndex, targetIndex));
    },
    [draggedId, widgets, setWidgets]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  if (!isVirtualized) {
    return (
      <main className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto py-4 sm:gap-4'>
        {widgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            onDragStart={() => handleDragStart(widget.id)}
            onDragOver={(e) => handleDragOver(e, widget.id)}
            onDrop={handleDragEnd}
            onDragEnd={handleDragEnd}
            isDragging={draggedId === widget.id}
            onDelete={() => deleteWidget(widget.id)}
          />
        ))}

        <AddWidgetDialog>
          <Button
            className='col-span-1 h-full min-h-[150px] border-2 border-dashed border-border'
            variant='outline'
          >
            <Plus className='size-4' />
            Add Widget
          </Button>
        </AddWidgetDialog>
      </main>
    );
  }

  return (
    <div ref={parentRef} className='h-[calc(100vh-120px)] overflow-y-auto py-4'>
      <div
        style={{
          height: `${totalHeight}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map(({ virtualItem, rowItems, isExtraRow }) => (
          <div
            key={virtualItem.key}
            className='absolute top-0 left-0 w-full px-1'
            style={{
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 h-full'>
              {isExtraRow ? (
                <AddWidgetDialog>
                  <Button
                    className='col-span-1 h-full min-h-[150px] border-2 border-dashed border-border'
                    variant='outline'
                  >
                    <Plus className='size-4' />
                    Add Widget
                  </Button>
                </AddWidgetDialog>
              ) : (
                <WidgetRow
                  widgets={rowItems}
                  draggedId={draggedId}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDelete={deleteWidget}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;
