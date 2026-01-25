'use client';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { API_BASE_URLS, API_KEYS } from '@/constants';
import { useTestApi } from '@/hooks/useTestApi';
import { finnhubApiRegistry } from '@/services/api/provider/finnub/api.registry';
import { BarChart3, LayoutGrid, Loader2, Table } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { JsonTree, SelectedFields } from '../components/ResponseFieldSelect';

export const WidgetMappingSection = () => {
  const { watch, setValue, getValues, control } = useFormContext();
  const type = watch('type');
  const api = watch('api');
  const mapping = watch('mapping');

  const getSelectedFields = () => {
    if (mapping.type === 'card') {
      return mapping.fields || [];
    }

    if (mapping.type === 'table') {
      return mapping.columns || [];
    }

    if (mapping.type === 'chart') {
      const keys = [...(mapping.xAxis?.keys || []), mapping.yAxis?.key].filter(
        Boolean
      );
      return keys.map((k: string) => ({ key: k }));
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
        setValue('mapping', {
          type: 'chart',
          xAxis: {
            keys: [...(mapping.xAxis?.keys ?? []), path],
          },
          yAxis: mapping.yAxis ?? { key: '' },
        });
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
        });
        break;
    }
  };

  const { data, loading, error, testApi } = useTestApi();

  const handleTestApi = () => {
    const provider = api.provider;
    const useCustomUrl = api.useCustomUrl;

    if (provider === 'finnhub' && !useCustomUrl) {
      const selectedApi = finnhubApiRegistry.find(
        (a) => a.name === api.apiName
      );
      if (selectedApi) {
        const url = `${API_BASE_URLS.FINNHUB}${selectedApi.endpoint}`;
        const params = { ...api.params, token: API_KEYS.FINNHUB! };
        testApi(url, params);
      }
    } else if (api.url) {
      let params = { ...api.params };
      let url = api.url;

      const isRelativePath = url.startsWith('/') && !url.startsWith('//');

      if (provider === 'alphaVantage') {
        if (isRelativePath) {
          url = `${API_BASE_URLS.ALPHA_VANTAGE}${url}`;
        }
        params = { ...params, apikey: API_KEYS.ALPHA_VANTAGE! };
      } else if (provider === 'finnhub') {
        if (isRelativePath) {
          url = `${API_BASE_URLS.FINNHUB}${url}`;
        }
        params = { ...params, token: API_KEYS.FINNHUB! };
      } else if (provider === 'indianApi') {
        if (isRelativePath) {
          url = `${API_BASE_URLS.INDIAN_API}${url}`;
        }
      }

      testApi(url, params);
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

  const canTest =
    api.provider &&
    ((api.provider === 'finnhub' && !api.useCustomUrl && api.apiName) ||
      api.url);

  return (
    <div className='space-y-3'>
      {/* Display Mode Toggle */}
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

      <div className='flex items-center gap-2'>
        <Button
          type='button'
          size='sm'
          onClick={handleTestApi}
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

      <FormField
        control={control}
        name='mapping'
        render={() => (
          <FormItem>
            <FormLabel>Select Fields to Display</FormLabel>
            {data !== null && data !== undefined && (
              <JsonTree
                data={data}
                onSelect={addField}
                selectedPaths={getSelectedPaths()}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <SelectedFields fields={getSelectedFields()} onRemove={removeField} />
    </div>
  );
};
