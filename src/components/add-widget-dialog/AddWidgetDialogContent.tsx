import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { transformParams } from '@/lib/utils';
import { useWidgetStore } from '@/store/widgetStore';
import {
  TCreateWidgetSchema,
  createWidgetSchema,
} from '@/types/add-widget-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { WidgetApiSection } from './sections/widgetApiSection';
import { WidgetBasicSection } from './sections/widgetBasicSection';
import { WidgetMappingSection } from './sections/widgetMappingSectiom';
import { WidgetParamsField } from './sections/widgetParamsField';
import { WidgetRefreshSection } from './sections/widgetRefreshSection';

interface AddWidgetDialogContentProps {
  onOpenChange?: (open: boolean) => void;
}

export const AddWidgetDialogContent = ({
  onOpenChange,
}: AddWidgetDialogContentProps) => {
  const addWidget = useWidgetStore((s) => s.addWidget);

  const form = useForm<TCreateWidgetSchema>({
    resolver: zodResolver(createWidgetSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'card',
      api: {
        provider: 'finnhub',
        apiName: '',
        refreshInterval: 30,
        useCustomUrl: false,
        url: '',
        params: {},
        paramsArray: [],
      },
      mapping: {
        type: 'card',
        fields: [],
      },
    },
  });

  const onSubmit = (data: TCreateWidgetSchema) => {
    const apiParams = transformParams(data.api.paramsArray || []);

    const apiName = data.api.apiName || (data.api.useCustomUrl ? 'custom' : '');

    const widget = {
      ...data,
      id: crypto.randomUUID(),
      api: {
        ...data.api,
        params: apiParams,
        apiName: apiName,
      },
    };

    delete widget.api.paramsArray;

    addWidget(widget as any);
    console.log('Widget added:', widget);
    form.reset();
    onOpenChange?.(false);
  };

  const onError = (errors: any) => {
    console.error('Form Validation Errors:', errors);
  };

  return (
    <DialogContent className='max-w-xl '>
      <DialogHeader>
        <DialogTitle>Add Widget</DialogTitle>
        <DialogDescription>
          Configure a finance widget for your dashboard
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className='space-y-2'
        >
          <div className='space-y-2 max-h-[70vh] overflow-y-auto py-2 px-1'>
            <WidgetBasicSection />
            <WidgetApiSection />
            <WidgetParamsField />
            <WidgetMappingSection />
            <WidgetRefreshSection />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='destructive'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit'>Add Widget</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
