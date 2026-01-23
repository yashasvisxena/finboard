import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const WidgetRefreshSection = () => {
  return (
    <div className='space-y-2'>
      <Label>Refresh Interval (seconds)</Label>
      <Input type='number' placeholder='30' min={5} className='w-full' />
    </div>
  );
};
