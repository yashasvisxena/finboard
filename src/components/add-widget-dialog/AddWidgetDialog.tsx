import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
        <DialogTitle className='sr-only'>Loading Add Widget Dialog</DialogTitle>
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
}

export const AddWidgetDialog = memo(({ children }: AddWidgetDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button size='lg'>Add Widget</Button>}
      </DialogTrigger>
      {open && <DialogContentLazy onOpenChange={setOpen} />}
    </Dialog>
  );
});

AddWidgetDialog.displayName = 'AddWidgetDialog';
