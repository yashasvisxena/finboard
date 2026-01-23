import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const WidgetApiSection = () => {
  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <Label>API Provider</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select provider' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='alphaVantage'>Alpha Vantage</SelectItem>
            <SelectItem value='finnhub'>Finnhub</SelectItem>
            <SelectItem value='indianApi'>Indian API</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>API Endpoint</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select endpoint' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='TIME_SERIES_DAILY'>
              Time Series (Daily)
            </SelectItem>
            <SelectItem value='TOP_GAINERS'>Top Gainers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Optional advanced */}
      <div className='flex items-center gap-2'>
        <Checkbox />
        <span className='text-sm'>Use custom API URL</span>
      </div>
    </div>
  );
};
