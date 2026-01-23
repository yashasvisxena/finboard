import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const WidgetBasicSection = () => {
  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <Label>Widget Name</Label>
        <Input placeholder='e.g. Market Gainers' />
      </div>

      <div className='space-y-2'>
        <Label>Widget Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select widget type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='card'>Card</SelectItem>
            <SelectItem value='table'>Table</SelectItem>
            <SelectItem value='chart'>Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
