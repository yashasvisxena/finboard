'use client';

import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTestApi } from '@/hooks/useTestApi';
import { useFormContext } from 'react-hook-form';

import { JsonTree } from '../components/ResponseFieldSelect';

export const WidgetMappingSection = () => {
  const { watch, setValue, getValues, control } = useFormContext();
  const type = watch('type');
  const api = watch('api');
  const getSelectedPaths = () => {
    const mapping = getValues('mapping');

    if (mapping.type === 'card') {
      return mapping.fields.map((f: any) => f.key);
    }

    if (mapping.type === 'table') {
      return mapping.columns.map((c: any) => c.key);
    }

    if (mapping.type === 'chart') {
      return [...mapping.xAxis.keys, mapping.yAxis.key].filter(Boolean);
    }

    return [];
  };

  const applyMapping = (type: 'card' | 'table' | 'chart', path: string) => {
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

  const { data, loading, error, testApi } = useTestApi();

  const handleTestApi = () => {
    if (api.useCustomUrl && api.url) {
      testApi(api.url);
    }
  };

  const handleSelect = (path: string) => {
    applyMapping(type, path);
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <FormLabel>API Response Mapping</FormLabel>
        <Button
          type='button'
          size='sm'
          onClick={handleTestApi}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test API'}
        </Button>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <FormField
        control={control}
        name='mapping'
        render={() => (
          <FormItem>
            {data !== null && data !== undefined && (
              <JsonTree
                data={data}
                onSelect={handleSelect}
                selectedPaths={getSelectedPaths()}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
