'use client';

import { useWidgetStore } from '@/store/widgetStore';
import { useEffect, useRef, useState } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetCard from './WidgetCard';

export default function DashboardGrid() {
  const { widgets, layouts, updateLayouts } = useWidgetStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className='w-full'>
      <ResponsiveGridLayout
        cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 }}
        width={width}
        dragConfig={{
          handle: '.drag-handle',
        }}
        resizeConfig={{
          handles: ['s', 'e', 'n', 'w', 'se', 'sw', 'ne', 'nw'],
        }}
        onLayoutChange={updateLayouts}
      >
        {widgets.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground'>
              No widgets added yet. Add some widgets to get started.
            </p>
          </div>
        ) : (
          widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetCard widget={widget} />
            </div>
          ))
        )}
      </ResponsiveGridLayout>
    </div>
  );
}
