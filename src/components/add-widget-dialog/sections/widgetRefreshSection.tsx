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
  const { control } = useFormContext();

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
