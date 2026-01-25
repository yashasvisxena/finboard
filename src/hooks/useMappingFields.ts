'use client';

import { useFormContext } from 'react-hook-form';

type AxisMode = 'xAxis' | 'yAxis';

interface FieldItem {
  key: string;
  label?: string;
}

export function useMappingFields(axisMode: AxisMode) {
  const { watch, setValue, getValues } = useFormContext();
  const type = watch('type');
  const mapping = watch('mapping');

  const getSelectedFields = (): FieldItem[] => {
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

  const getSelectedPaths = (): string[] => {
    return getSelectedFields().map((f) => f.key);
  };

  const addField = (path: string) => {
    const currentMapping = getValues('mapping');

    switch (type) {
      case 'card':
        setValue('mapping', {
          type: 'card',
          fields: [...(currentMapping.fields ?? []), { key: path }],
        });
        break;

      case 'table':
        setValue('mapping', {
          type: 'table',
          columns: [...(currentMapping.columns ?? []), { key: path }],
        });
        break;

      case 'chart':
        if (axisMode === 'yAxis') {
          setValue('mapping', {
            type: 'chart',
            xAxis: currentMapping.xAxis ?? { keys: [] },
            yAxis: { key: path },
          });
        } else {
          setValue('mapping', {
            type: 'chart',
            xAxis: {
              keys: [...(currentMapping.xAxis?.keys ?? []), path],
            },
            yAxis: currentMapping.yAxis ?? { key: '' },
          });
        }
        break;
    }
  };

  const removeField = (key: string) => {
    const currentMapping = getValues('mapping');

    switch (type) {
      case 'card':
        setValue('mapping', {
          type: 'card',
          fields: (currentMapping.fields ?? []).filter(
            (f: { key: string }) => f.key !== key
          ),
        });
        break;

      case 'table':
        setValue('mapping', {
          type: 'table',
          columns: (currentMapping.columns ?? []).filter(
            (c: { key: string }) => c.key !== key
          ),
        });
        break;

      case 'chart':
        setValue('mapping', {
          type: 'chart',
          xAxis: {
            keys: (currentMapping.xAxis?.keys ?? []).filter(
              (k: string) => k !== key
            ),
          },
          yAxis:
            currentMapping.yAxis?.key === key
              ? { key: '' }
              : (currentMapping.yAxis ?? { key: '' }),
          interval: currentMapping.interval,
        });
        break;
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

  return {
    type,
    mapping,
    getSelectedFields,
    getSelectedPaths,
    addField,
    removeField,
    handleTypeChange,
  };
}
