'use client';

import { Button } from '@/components/ui/button';
import { moveItem } from '@/lib/utils';
import { useWidgetStore } from '@/store/widgetStore';
import { IWidget } from '@/types/widget.types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Plus } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { WidgetCard } from './WidgetCard';

const VIRTUALIZATION_THRESHOLD = 6;
const WIDGET_HEIGHT = 280;

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
  const parentRef = useRef<HTMLDivElement>(null);

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

  const widgetRows: IWidget[][] = [];
  for (let i = 0; i < widgets.length; i += 3) {
    widgetRows.push(widgets.slice(i, i + 3));
  }

  const virtualizer = useVirtualizer({
    count: widgetRows.length + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => WIDGET_HEIGHT,
    overscan: 2,
  });

  const useVirtualization = widgets.length > VIRTUALIZATION_THRESHOLD;

  if (!useVirtualization) {
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
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const isAddButtonRow = virtualRow.index === widgetRows.length;

          return (
            <div
              key={virtualRow.key}
              className='absolute top-0 left-0 w-full px-1'
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 h-full'>
                {isAddButtonRow ? (
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
                    widgets={widgetRows[virtualRow.index]}
                    draggedId={draggedId}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDelete={deleteWidget}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardLayout;
