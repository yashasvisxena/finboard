import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { WidgetApiSection } from './widgetApiSection';
import { WidgetBasicSection } from './widgetBasicSection';
import { WidgetRefreshSection } from './widgetRefreshSection';

export const AddWidgetDialog = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button size='lg'>Add Widget</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-xl max-h-[70vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Configure a finance widget for your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          <WidgetBasicSection />
          <WidgetApiSection />
          <WidgetRefreshSection />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='destructive'>Cancel</Button>
          </DialogClose>
          <Button>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
