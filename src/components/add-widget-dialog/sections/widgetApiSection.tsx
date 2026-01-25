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
import { finnhubApiRegistry } from '@/services/api/provider/finnub/api.registry';
import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const WidgetApiSection = memo(() => {
  const { control, watch, setValue } = useFormContext();
  const provider = watch('api.provider');
  const useCustomUrl = watch('api.useCustomUrl');

  // Only show custom URL toggle for Finnhub (others are custom URL only)
  const showCustomUrlToggle = provider === 'finnhub';

  // For non-finnhub providers, force custom URL mode
  const isCustomUrlMode = provider !== 'finnhub' || useCustomUrl;

  // Get finnhub API options for dropdown
  const finnhubApiOptions = useMemo(() => {
    return finnhubApiRegistry.map((api) => ({
      value: api.name,
      label: api.name,
      endpoint: api.endpoint,
    }));
  }, []);

  // Handle API selection from registry
  const handleApiSelect = (apiName: string) => {
    const selectedApi = finnhubApiRegistry.find((api) => api.name === apiName);
    if (selectedApi) {
      setValue('api.apiName', apiName);
      // Store the endpoint in a way we can construct the full URL later
      setValue('api.endpoint', selectedApi.endpoint);
    }
  };

  return (
    <div className='space-y-3'>
      {/* Provider Selection - Always Required */}
      <FormField
        control={control}
        name='api.provider'
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Provider *</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                // Reset URL/apiName when provider changes
                setValue('api.url', '');
                setValue('api.apiName', '');
                setValue('api.useCustomUrl', value !== 'finnhub');
              }}
            >
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select provider' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='finnhub'>Finnhub</SelectItem>
                <SelectItem value='indianApi'>Indian API</SelectItem>
                <SelectItem value='alphaVantage'>Alpha Vantage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Custom URL Toggle - Only for Finnhub */}
      {showCustomUrlToggle && (
        <FormField
          control={control}
          name='api.useCustomUrl'
          render={({ field }) => (
            <FormItem className='flex items-center gap-2'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    // Reset when toggling
                    setValue('api.url', '');
                    setValue('api.apiName', '');
                  }}
                />
              </FormControl>
              <FormLabel className='mb-0 cursor-pointer'>
                Use custom URL instead of registry
              </FormLabel>
            </FormItem>
          )}
        />
      )}

      {/* Finnhub Registry Dropdown */}
      {provider === 'finnhub' && !useCustomUrl && (
        <FormField
          control={control}
          name='api.apiName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select API *</FormLabel>
              <Select value={field.value} onValueChange={handleApiSelect}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Choose an API endpoint' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {finnhubApiOptions.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Custom URL Input - For custom mode or non-finnhub providers */}
      {isCustomUrlMode && (
        <FormField
          control={control}
          name='api.url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                API URL *
                {provider === 'alphaVantage' && (
                  <span className='text-xs text-muted-foreground ml-2'>
                    (API key added automatically)
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    provider === 'alphaVantage'
                      ? 'https://www.alphavantage.co/query?function=...'
                      : 'https://api.example.com/endpoint'
                  }
                  {...field}
                />
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
