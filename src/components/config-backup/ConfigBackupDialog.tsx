'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  downloadConfigFile,
  importConfig,
  readFileAsText,
} from '@/lib/configBackup';
import { useWidgetStore } from '@/store/widgetStore';
import { ArrowDown, ArrowUp, Download, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type ImportMode = 'replace' | 'merge';

export function ConfigExportDialog() {
  const [open, setOpen] = useState(false);

  const widgets = useWidgetStore((state) => state.widgets);

  const handleExport = useCallback(() => {
    if (widgets.length === 0) {
      toast.warning('No widgets to export', {
        description: 'Add some widgets to your dashboard first.',
      });
      return;
    }

    try {
      downloadConfigFile(widgets);
      toast.success('Configuration exported', {
        description: `Exported ${widgets.length} widget${widgets.length !== 1 ? 's' : ''} successfully.`,
      });
      setOpen(false);
    } catch (error) {
      toast.error('Export failed', {
        description:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, [widgets]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <ArrowDown className='size-4' />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export Configuration</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Dashboard Configuration</DialogTitle>
          <DialogDescription>
            Export your dashboard configuration to a file.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2 p-4 border rounded-lg'>
            <div className='flex items-center gap-2'>
              <Download className='size-5 text-primary' />
              <h4 className='font-medium'>Export Configuration</h4>
            </div>
            <p className='text-sm text-muted-foreground'>
              Download your current dashboard configuration as a JSON file.
            </p>
            <Button onClick={handleExport} className='mt-2'>
              <Download className='size-4 mr-2' />
              Export ({widgets.length} widget{widgets.length !== 1 ? 's' : ''})
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfigImportDialog() {
  const [open, setOpen] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setWidgets = useWidgetStore((state) => state.setWidgets);
  const addWidget = useWidgetStore((state) => state.addWidget);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const content = await readFileAsText(file);
        const result = importConfig(content);

        if (!result.success) {
          toast.error('Import failed', {
            description: result.error,
          });
          return;
        }

        const importedWidgets = result.widgets;

        if (importMode === 'replace') {
          const widgetsWithNewIds = importedWidgets.map((widget) => ({
            ...widget,
            id: crypto.randomUUID(),
          }));
          setWidgets(widgetsWithNewIds);
          toast.success('Configuration restored', {
            description: `Replaced dashboard with ${importedWidgets.length} widget${importedWidgets.length !== 1 ? 's' : ''}.`,
          });
        } else {
          importedWidgets.forEach((widget) => {
            addWidget({
              ...widget,
              id: crypto.randomUUID(),
            });
          });
          toast.success('Widgets imported', {
            description: `Added ${importedWidgets.length} widget${importedWidgets.length !== 1 ? 's' : ''} to your dashboard.`,
          });
        }

        setOpen(false);
      } catch (error) {
        toast.error('Import failed', {
          description:
            error instanceof Error ? error.message : 'Failed to read file',
        });
      }
    },
    [importMode, setWidgets, addWidget]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImport(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [handleImport]
  );

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <ArrowUp className='size-4' />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Import Configuration</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Dashboard Configuration</DialogTitle>
          <DialogDescription>
            Import your dashboard configuration from a file.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {/* Import Section */}
          <div className='flex flex-col gap-2 p-4 border rounded-lg'>
            <div className='flex items-center gap-2'>
              <Upload className='size-5 text-primary' />
              <h4 className='font-medium'>Import Configuration</h4>
            </div>
            <p className='text-sm text-muted-foreground'>
              Upload a previously saved configuration file to restore your
              dashboard.
            </p>

            <div className='flex gap-2 mt-2'>
              <Button
                variant={importMode === 'replace' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setImportMode('replace')}
              >
                Replace All
              </Button>
              <Button
                variant={importMode === 'merge' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setImportMode('merge')}
              >
                Merge
              </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
              {importMode === 'replace'
                ? 'Replaces all existing widgets with imported ones.'
                : 'Adds imported widgets to your existing dashboard.'}
            </p>

            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              onChange={handleFileChange}
              className='hidden'
            />
            <Button
              onClick={triggerFileSelect}
              variant='secondary'
              className='mt-2'
            >
              <Upload className='size-4 mr-2' />
              Select File
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
