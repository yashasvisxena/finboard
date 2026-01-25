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
import { useDebounce } from '@/hooks/useDebounce';
import { memo, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const WidgetApiSection = memo(() => {
  const { control, setValue } = useFormContext();
  const apiUrl = useWatch({ control, name: 'api.url' });
  const debouncedApiUrl = useDebounce(apiUrl, 300);

  useEffect(() => {
    if (!debouncedApiUrl) return;

    const lowerUrl = debouncedApiUrl.toLowerCase();

    if (lowerUrl.includes('finnhub.io')) {
      setValue('api.provider', 'finnhub');
    } else if (lowerUrl.includes('indianapi.in')) {
      setValue('api.provider', 'indianApi');
    } else if (lowerUrl.includes('alphavantage.co')) {
      setValue('api.provider', 'alphaVantage');
    }

    return () => {
      setValue('api.provider', 'custom');
    };
  }, [debouncedApiUrl, setValue]);

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
