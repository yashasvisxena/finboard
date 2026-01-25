import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export const WidgetBasicSection = memo(() => {
  const { control } = useFormContext();

  return (
    <div className='space-y-2'>
      <FormField
        control={control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Widget Name</FormLabel>
            <FormControl>
              <Input placeholder='e.g. Market Gainers' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Widget Description</FormLabel>
            <FormControl>
              <Input placeholder='e.g. Market Gainers' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

WidgetBasicSection.displayName = 'WidgetBasicSection';
