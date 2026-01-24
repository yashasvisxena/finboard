'use client';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export const WidgetApiSection = memo(() => {
  const { control, watch } = useFormContext();
  const useCustomUrl = watch('api.useCustomUrl');

  return (
    <div className='space-y-2'>
      <FormField
        control={control}
        name='api.useCustomUrl'
        render={({ field }) => (
          <FormItem className='flex items-center gap-2'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className='mb-0'>Use custom API URL</FormLabel>
          </FormItem>
        )}
      />

      {!useCustomUrl ? (
        <div className='space-y-2'>
          <FormField
            control={control}
            name='api.provider'
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Provider</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select provider' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='finnhub'>Finnhub</SelectItem>
                    <SelectItem value='indianApi'>Indian API</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='api.apiName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Name</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Market Gainers' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <FormField
          control={control}
          name='api.url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom API URL</FormLabel>
              <FormControl>
                <Input placeholder='https://api.example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
});

WidgetApiSection.displayName = 'WidgetApiSection';
