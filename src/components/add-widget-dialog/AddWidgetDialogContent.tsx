'use client';

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
import { IWidget } from '@/types/widget.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { WidgetApiSection } from './sections/widgetApiSection';
import { WidgetBasicSection } from './sections/widgetBasicSection';
import { WidgetMappingSection } from './sections/widgetMappingSection';
import { WidgetParamsField } from './sections/widgetParamsField';
import { WidgetRefreshSection } from './sections/widgetRefreshSection';

interface AddWidgetDialogContentProps {
  onOpenChange?: (open: boolean) => void;
  /** If provided, the dialog operates in edit mode */
  editWidget?: IWidget;
}

export const AddWidgetDialogContent = ({
  onOpenChange,
  editWidget,
}: AddWidgetDialogContentProps) => {
  const addWidget = useWidgetStore((s) => s.addWidget);
  const updateWidget = useWidgetStore((s) => s.updateWidget);

  const isEditMode = Boolean(editWidget);

  // Convert widget params object to array format for the form (for edit mode)
  const getParamsArray = () => {
    if (!editWidget) return [];
    return Object.entries(editWidget.api.params || {}).map(([key, value]) => ({
      key,
      type: typeof value as 'string' | 'number' | 'boolean',
      value,
    }));
  };

  const form = useForm<TCreateWidgetSchema>({
    resolver: zodResolver(createWidgetSchema),
    defaultValues: editWidget
      ? {
          title: editWidget.title,
          description: editWidget.description || '',
          type: editWidget.type,
          api: {
            provider: editWidget.api.provider || 'finnhub',
            apiName: editWidget.api.apiName || '',
            refreshInterval: editWidget.api.refreshInterval || 30,
            useCustomUrl: editWidget.api.useCustomUrl || false,
            url: editWidget.api.url || '',
            params: editWidget.api.params || {},
            paramsArray: getParamsArray(),
          },
          mapping: editWidget.mapping,
        }
      : {
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

    const widgetData = {
      ...data,
      api: {
        ...data.api,
        params: apiParams,
        apiName: apiName,
      },
    };

    delete widgetData.api.paramsArray;

    if (isEditMode && editWidget) {
      // Update existing widget
      updateWidget(editWidget.id, widgetData as any);
      console.log('Widget updated:', widgetData);
    } else {
      // Add new widget
      const widget = {
        ...widgetData,
        id: crypto.randomUUID(),
      };
      addWidget(widget as any);
      console.log('Widget added:', widget);
      form.reset();
    }

    onOpenChange?.(false);
  };

  const onError = (errors: any) => {
    console.error('Form Validation Errors:', errors);
  };

  return (
    <DialogContent className='max-w-xl '>
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit Widget' : 'Add Widget'}</DialogTitle>
        <DialogDescription>
          {isEditMode
            ? 'Update your widget configuration'
            : 'Configure a finance widget for your dashboard'}
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
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit'>
              {isEditMode ? 'Update Widget' : 'Add Widget'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
