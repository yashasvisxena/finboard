'use client';

import { FormLabel } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { memo } from 'react';

export type AxisMode = 'xAxis' | 'yAxis';

interface AxisModeSelectorProps {
  value: AxisMode;
  onChange: (value: AxisMode) => void;
}

export const AxisModeSelector = memo(
  ({ value, onChange }: AxisModeSelectorProps) => {
    return (
      <div className='space-y-2'>
        <FormLabel>Select Axis</FormLabel>
        <ToggleGroup
          type='single'
          value={value}
          onValueChange={(val) => val && onChange(val as AxisMode)}
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
          {value === 'xAxis'
            ? 'Select fields for X-axis labels (e.g., dates, categories)'
            : 'Select a single field for Y-axis values (e.g., price, count)'}
        </p>
      </div>
    );
  }
);

AxisModeSelector.displayName = 'AxisModeSelector';
