import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function WidgetParamsField() {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'api.paramsArray',
  });

  return (
    <div className='space-y-3'>
      <div className='text-sm font-medium'>API Params</div>

      {fields.map((field, index) => (
        <div key={field.id} className='flex gap-2 items-center'>
          <Input
            placeholder='Key'
            {...register(`api.paramsArray.${index}.key`, {
              required: true,
            })}
          />

          <Input
            placeholder='Value'
            {...register(`api.paramsArray.${index}.value`)}
          />

          <Button
            type='button'
            variant='destructive'
            size='icon'
            onClick={() => remove(index)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}

      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='px-0'
        onClick={() =>
          append({
            key: '',
            value: '',
          })
        }
      >
        <Plus />
        Add param
      </Button>
    </div>
  );
}
