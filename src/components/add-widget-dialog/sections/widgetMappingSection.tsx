'use client';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { apiKeyFetchers } from '@/constants';
import { useMappingFields } from '@/hooks/useMappingFields';
import { useTestApi } from '@/hooks/useTestApi';
import { transformParams } from '@/lib/utils';
import { BarChart3, LayoutGrid, Loader2, Table } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ResponseFieldSelect,
  SelectedFields,
} from '../components/ResponseFieldSelect';
import { AxisMode, AxisModeSelector } from './AxisModeSelector';

export const WidgetMappingSection = () => {
  const { watch, control } = useFormContext();
  const provider = watch('api.provider');
  const api = watch('api');

  const [axisMode, setAxisMode] = useState<AxisMode>('xAxis');

  const {
    type,
    getSelectedFields,
    getSelectedPaths,
    addField,
    removeField,
    handleTypeChange,
  } = useMappingFields(axisMode);

  const { data, loading, error, testApi } = useTestApi();

  const handleTestApi = () => {
    const apiParams = transformParams(api.paramsArray || []);
    if (api.url) {
      if (provider === 'indianApi') {
        testApi(api.url, provider, apiParams);
      } else if (provider in apiKeyFetchers) {
        const apiKey =
          apiKeyFetchers[provider as keyof typeof apiKeyFetchers]();
        const params = { ...apiKey, ...apiParams };
        testApi(api.url, provider, params);
      } else {
        testApi(api.url, provider, apiParams);
      }
    }
  };

  const canTest = !!api.url;

  return (
    <div className='space-y-3'>
      <div className='flex flex-col items-center gap-2'>
        <Button
          type='button'
          size='sm'
          onClick={handleTestApi}
          className='w-full'
          disabled={loading || !canTest}
        >
          {loading ? (
            <>
              <Loader2 className='h-4 w-4 mr-1 animate-spin' />
              Testing...
            </>
          ) : (
            'Test API'
          )}
        </Button>
        {data !== null && data !== undefined && (
          <span className='text-sm text-green-600'>
            ✓ API connection successful!
          </span>
        )}
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <div className='space-y-2'>
        <FormLabel>Display Mode</FormLabel>
        <ToggleGroup
          type='single'
          value={type}
          onValueChange={handleTypeChange}
          className='justify-start'
        >
          <ToggleGroupItem value='card' aria-label='Card view'>
            <LayoutGrid className='h-4 w-4 mr-1' />
            Card
          </ToggleGroupItem>
          <ToggleGroupItem value='table' aria-label='Table view'>
            <Table className='h-4 w-4 mr-1' />
            Table
          </ToggleGroupItem>
          <ToggleGroupItem value='chart' aria-label='Chart view'>
            <BarChart3 className='h-4 w-4 mr-1' />
            Chart
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {type === 'chart' && (
        <AxisModeSelector value={axisMode} onChange={setAxisMode} />
      )}

      {data !== null && data !== undefined && (
        <FormField
          control={control}
          name='mapping'
          render={() => (
            <FormItem>
              <FormLabel>Select Fields to Display</FormLabel>
              {data !== null && data !== undefined && (
                <ResponseFieldSelect
                  data={data}
                  onSelect={addField}
                  selectedPaths={getSelectedPaths()}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <SelectedFields fields={getSelectedFields()} onRemove={removeField} />
    </div>
  );
};
