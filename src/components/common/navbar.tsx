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
    <header className='flex gap-3 p-4 flex-row justify-between items-center'>
      <div className='flex flex-col min-w-0'>
        <h1 className='text-xl font-bold sm:text-2xl'>FinBoard</h1>
        <p className='text-xs text-muted-foreground truncate sm:text-sm'>
          {statusText}
        </p>
      </div>
      <nav className='flex gap-2 items-center'>
        <ConfigBackupDialog />
        <AddWidgetDialog />
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
