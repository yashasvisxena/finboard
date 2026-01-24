'use client';

import { useWidgetStore } from '@/store/widgetStore';
import { useMemo } from 'react';

import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { ConfigBackupDialog } from '../config-backup/ConfigBackupDialog';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const widgetsCount = useWidgetStore((state) => state.widgets.length);

  const statusText = useMemo(
    () =>
      widgetsCount > 0
        ? `${widgetsCount} active widget${widgetsCount !== 1 ? 's' : ''}`
        : 'Connect to APIs and build your custom dashboard',
    [widgetsCount]
  );

  return (
    <div className='flex justify-between items-center p-4'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>FinBoard</h1>
        <p className='text-sm text-muted-foreground'>{statusText}</p>
      </div>
      <div className='flex gap-2 items-center justify-end'>
        <ConfigBackupDialog />
        <AddWidgetDialog />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
