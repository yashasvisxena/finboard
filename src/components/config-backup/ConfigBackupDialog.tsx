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
import { Download, FolderUp, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

type ImportMode = 'replace' | 'merge';

export function ConfigBackupDialog() {
  const [open, setOpen] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const widgets = useWidgetStore((state) => state.widgets);
  const setWidgets = useWidgetStore((state) => state.setWidgets);
  const addWidget = useWidgetStore((state) => state.addWidget);

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
          setWidgets(importedWidgets);
          toast.success('Configuration restored', {
            description: `Replaced dashboard with ${importedWidgets.length} widget${importedWidgets.length !== 1 ? 's' : ''}.`,
          });
        } else {
          // Merge mode - add widgets with new IDs to avoid conflicts
          importedWidgets.forEach((widget) => {
            addWidget({
              ...widget,
              id: `${widget.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
      <DialogTrigger asChild>
        <Button variant='outline'>
          <FolderUp className='size-4 mr-2' />
          Backup
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Dashboard Configuration</DialogTitle>
          <DialogDescription>
            Export your dashboard configuration to a file or import a previously
            saved configuration.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {/* Export Section */}
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
