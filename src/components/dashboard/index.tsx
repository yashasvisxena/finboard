'use client';
import { Button } from '@/components/ui/button';
import { moveItem } from '@/lib/utils';
import { useWidgetStore } from '@/store/widgetStore';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { WidgetCard } from './WidgetCard';

const DashboardLayout = () => {
  const widgets = useWidgetStore((state) => state.widgets);
  const setWidgets = useWidgetStore((state) => state.setWidgets);
  const deleteWidget = useWidgetStore((state) => state.deleteWidget);
  const [draggedId, setDraggedId] = useState<string | null>(null);

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
};

export default DashboardLayout;
