'use client';
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
  const { control } = useFormContext();

  return (
    <div className='space-y-3'>
      {/* Provider Selection */}
      <FormField
        control={control}
        name='api.provider'
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Provider *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue
                    defaultValue='custom'
                    placeholder='Select provider'
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='finnhub'>Finnhub</SelectItem>
                <SelectItem value='indianApi'>Indian API</SelectItem>
                <SelectItem value='alphaVantage'>Alpha Vantage</SelectItem>
                <SelectItem value='custom'>Custom</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* API URL Input */}
      <FormField
        control={control}
        name='api.url'
        render={({ field }) => (
          <FormItem>
            <FormLabel>API URL *</FormLabel>
            <FormControl>
              <Input
                placeholder='https://api.example.com/endpoint'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

WidgetApiSection.displayName = 'WidgetApiSection';
