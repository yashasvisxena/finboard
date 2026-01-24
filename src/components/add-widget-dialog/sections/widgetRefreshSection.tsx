import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { memo } from 'react';

export const WidgetRefreshSection = memo(() => {
  return (
    <div className='space-y-2'>
      <Label>Refresh Interval (seconds)</Label>
      <Input type='number' placeholder='30' min={5} className='w-full' />
    </div>
  );
});

WidgetRefreshSection.displayName = 'WidgetRefreshSection';
