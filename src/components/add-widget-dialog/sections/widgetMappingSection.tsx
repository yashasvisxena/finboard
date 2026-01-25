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
import { useTestApi } from '@/hooks/useTestApi';
import { transformParams } from '@/lib/utils';
import { BarChart3, LayoutGrid, Loader2, Table } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ResponseFieldSelect,
  SelectedFields,
} from '../components/ResponseFieldSelect';

export const WidgetMappingSection = () => {
  const { watch, setValue, getValues, control } = useFormContext();
  const provider = watch('api.provider');
  const type = watch('type');
  const api = watch('api');
  const mapping = watch('mapping');

  const [axisMode, setAxisMode] = useState<'xAxis' | 'yAxis'>('xAxis');

  const getSelectedFields = () => {
    if (mapping.type === 'card') {
      return mapping.fields || [];
    }

    if (mapping.type === 'table') {
      return mapping.columns || [];
    }

    if (mapping.type === 'chart') {
      const xAxisFields = (mapping.xAxis?.keys || []).map((k: string) => ({
        key: k,
        label: 'X-Axis',
      }));
      const yAxisField = mapping.yAxis?.key
        ? [{ key: mapping.yAxis.key, label: 'Y-Axis' }]
        : [];
      return [...xAxisFields, ...yAxisField];
    }

    return [];
  };

  const getSelectedPaths = () => {
    return getSelectedFields().map((f: { key: string }) => f.key);
  };

  const addField = (path: string) => {
    const mapping = getValues('mapping');

    switch (type) {
      case 'card':
        setValue('mapping', {
          type: 'card',
          fields: [...(mapping.fields ?? []), { key: path }],
        });
        break;

      case 'table':
        setValue('mapping', {
          type: 'table',
          columns: [...(mapping.columns ?? []), { key: path }],
        });
        break;

      case 'chart':
        if (axisMode === 'yAxis') {
          setValue('mapping', {
            type: 'chart',
            xAxis: mapping.xAxis ?? { keys: [] },
            yAxis: { key: path },
          });
        } else {
          setValue('mapping', {
            type: 'chart',
            xAxis: {
              keys: [...(mapping.xAxis?.keys ?? []), path],
            },
            yAxis: mapping.yAxis ?? { key: '' },
          });
        }
        break;
    }
  };

  const removeField = (key: string) => {
    const mapping = getValues('mapping');

    switch (type) {
      case 'card':
        setValue('mapping', {
          type: 'card',
          fields: (mapping.fields ?? []).filter(
            (f: { key: string }) => f.key !== key
          ),
        });
        break;

      case 'table':
        setValue('mapping', {
          type: 'table',
          columns: (mapping.columns ?? []).filter(
            (c: { key: string }) => c.key !== key
          ),
        });
        break;

      case 'chart':
        setValue('mapping', {
          type: 'chart',
          xAxis: {
            keys: (mapping.xAxis?.keys ?? []).filter((k: string) => k !== key),
          },
          yAxis:
            mapping.yAxis?.key === key
              ? { key: '' }
              : (mapping.yAxis ?? { key: '' }),
          interval: mapping.interval,
        });
        break;
    }
  };

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

  const handleTypeChange = (newType: string) => {
    if (!newType) return;

    setValue('type', newType);

    switch (newType) {
      case 'card':
        setValue('mapping', { type: 'card', fields: [] });
        break;
      case 'table':
        setValue('mapping', { type: 'table', columns: [] });
        break;
      case 'chart':
        setValue('mapping', {
          type: 'chart',
          xAxis: { keys: [] },
          yAxis: { key: '' },
        });
        break;
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
        <div className='space-y-2'>
          <FormLabel>Select Axis</FormLabel>
          <ToggleGroup
            type='single'
            value={axisMode}
            onValueChange={(val) =>
              val && setAxisMode(val as 'xAxis' | 'yAxis')
            }
            className='justify-start'
          >
            <ToggleGroupItem value='xAxis' aria-label='X-Axis'>
              X-Axis (Labels)
            </ToggleGroupItem>
            <ToggleGroupItem value='yAxis' aria-label='Y-Axis'>
              Y-Axis (Values)
            </ToggleGroupItem>
          </ToggleGroup>
          <p className='text-xs text-muted-foreground'>
            {axisMode === 'xAxis'
              ? 'Select fields for X-axis labels (e.g., dates, categories)'
              : 'Select a single field for Y-axis values (e.g., price, count)'}
          </p>
        </div>
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
