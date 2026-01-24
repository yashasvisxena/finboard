import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { WidgetApiSection } from './sections/widgetApiSection';
import { WidgetBasicSection } from './sections/widgetBasicSection';
import { WidgetRefreshSection } from './sections/widgetRefreshSection';

export const AddWidgetDialogContent = () => {
  return (
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
  );
};
