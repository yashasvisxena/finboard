'use client';

import { useWidgetStore } from '@/store/widgetStore';
import { ArrowBigDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GridLayout, { Layout, ResponsiveGridLayout } from 'react-grid-layout';
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
        className='layout'
        cols={{ lg: 3, md: 2, sm: 2, xs: 2, xxs: 1 }}
        width={width}
        dragConfig={{
          handle: '.drag-handle',
        }}
        resizeConfig={{
          handles: ['s', 'e', 'n', 'w', 'se', 'sw', 'ne', 'nw'],
        }}
        onLayoutChange={updateLayouts}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetCard widget={widget} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
