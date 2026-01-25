import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IWidget } from '@/types/widget.types';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';

const DialogContentLazy = dynamic(
  () =>
    import('./AddWidgetDialogContent').then((mod) => ({
      default: mod.AddWidgetDialogContent,
    })),
  {
    loading: () => (
      <DialogContent className='max-w-xl max-h-[70vh] overflow-y-auto'>
        <DialogTitle className='sr-only'>Loading Widget Dialog</DialogTitle>
        <DialogDescription className='sr-only'>
          Please wait while the widget configuration options are loading.
        </DialogDescription>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='h-[10vh] animate-pulse bg-muted rounded' />
        ))}
      </DialogContent>
    ),
  }
);

interface AddWidgetDialogProps {
  children?: React.ReactNode;
  editWidget?: IWidget;
}

export const AddWidgetDialog = memo(
  ({ children, editWidget }: AddWidgetDialogProps) => {
    const [open, setOpen] = useState(false);

    const isEditMode = Boolean(editWidget);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button>{isEditMode ? 'Edit Widget' : 'Add Widget'}</Button>
          )}
        </DialogTrigger>
        {open && (
          <DialogContentLazy onOpenChange={setOpen} editWidget={editWidget} />
        )}
      </Dialog>
    );
  }
);

AddWidgetDialog.displayName = 'AddWidgetDialog';
