'use client';

import { useWidgetStore } from '@/store/widgetStore';
import { IWidget } from '@/types/widget.types';
import { useMemo } from 'react';

import { preset } from '../../../public/preset';
import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import {
  ConfigExportDialog,
  ConfigImportDialog,
} from '../config-backup/ConfigBackupDialog';
import { Button } from '../ui/button';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const widgetsCount = useWidgetStore((state) => state.widgets.length);
  const setWidgets = useWidgetStore((state) => state.setWidgets);

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
        <Button
          variant='outline'
          onClick={() => setWidgets([...(preset.widgets as IWidget[])])}
        >
          Preset
        </Button>
        <ConfigExportDialog />
        <ConfigImportDialog />
        <AddWidgetDialog />
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
