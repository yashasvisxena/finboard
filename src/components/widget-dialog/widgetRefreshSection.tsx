import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const WidgetRefreshSection = () => {
  return (
    <div>
      <Label>Refresh Interval (seconds)</Label>
      <Input type='number' placeholder='30' min={5} />
      <p className='text-xs text-muted-foreground mt-1'>
        Minimum 5 seconds recommended to avoid rate limits
      </p>
    </div>
  );
};
