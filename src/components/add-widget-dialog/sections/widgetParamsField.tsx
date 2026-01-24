import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

type ParamType = 'string' | 'number' | 'boolean';

export function WidgetParamsField() {
  const { control, register, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'api.paramsArray',
  });

  const paramsArray = watch('api.paramsArray');

  return (
    <div className='space-y-3'>
      <div className='text-sm font-medium'>API Params</div>

      {fields.map((field, index) => {
        const type: ParamType = paramsArray?.[index]?.type ?? 'string';

        return (
          <div key={field.id} className='flex gap-2 items-center'>
            {/* Key */}
            <Input
              placeholder='Key'
              {...register(`api.paramsArray.${index}.key`, {
                required: true,
              })}
            />

            {/* Type */}
            <Select
              value={type}
              onValueChange={(val) =>
                register(`api.paramsArray.${index}.type`).onChange({
                  target: { value: val },
                })
              }
            >
              <SelectTrigger className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='string'>String</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
                <SelectItem value='boolean'>Boolean</SelectItem>
              </SelectContent>
            </Select>

            {/* Value */}
            {type === 'boolean' ? (
              <Select
                onValueChange={(val) =>
                  register(`api.paramsArray.${index}.value`).onChange({
                    target: { value: val === 'true' },
                  })
                }
              >
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder='Value' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>true</SelectItem>
                  <SelectItem value='false'>false</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder='Value'
                type={type === 'number' ? 'number' : 'text'}
                {...register(`api.paramsArray.${index}.value`)}
              />
            )}

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(index)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      })}

      <Button
        type='button'
        variant='outline'
        onClick={() =>
          append({
            key: '',
            type: 'string',
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
