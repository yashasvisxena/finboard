'use client';

import { useWidgetStore } from '@/store/widgetStore';
import { useMemo } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const { widgets } = useWidgetStore();

  const statusText = useMemo(
    () =>
      widgets.length > 0
        ? `${widgets.length} active widget${widgets.length !== 1 ? 's' : ''}`
        : 'Connect to APIs and build your custom dashboard',
    [widgets.length]
  );

  return (
    <div className='flex justify-between items-center p-4'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>FinBoard</h1>
        <p className='text-sm text-muted-foreground'>{statusText}</p>
      </div>
      <div className='flex gap-2 items-center justify-end'>
        <AddWidgetDialog />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
