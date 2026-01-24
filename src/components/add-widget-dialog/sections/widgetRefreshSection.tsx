'use client';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export const WidgetRefreshSection = memo(() => {
  const { control, watch, setValue } = useFormContext();

  const type = watch('type');

  useEffect(() => {
    if (!type) return;

    switch (type) {
      case 'card':
        setValue('mapping', {
          type: 'card',
          fields: [],
        });
        break;

      case 'table':
        setValue('mapping', {
          type: 'table',
          columns: [],
        });
        break;

      case 'chart':
        setValue('mapping', {
          type: 'chart',
          xAxis: { keys: [] },
          yAxis: { key: '' },
        });
        break;
    }
  }, [type]);

  return (
    <div className='space-y-2'>
      <FormField
        control={control}
        name='api.refreshInterval'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refresh Interval (seconds)</FormLabel>
            <FormControl>
              <Input
                type='number'
                min={5}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

WidgetRefreshSection.displayName = 'WidgetRefreshSection';
