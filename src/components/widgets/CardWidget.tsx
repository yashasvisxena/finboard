'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { extractCardData, formatValue } from '@/lib/data-utils';
import { TResolvedValue } from '@/lib/dot-notation-resolver';
import { cn } from '@/lib/utils';
import { ICardMapping } from '@/types/mapping.types';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { memo, useMemo } from 'react';

interface CardWidgetProps {
  data: unknown;
  mapping: ICardMapping;
}

interface FieldData {
  key: string;
  label: string;
  value: unknown;
  format?: 'text' | 'number' | 'currency' | 'percentage';
}

const TrendIcon = ({ value }: { value: unknown }) => {
  const numValue = Number(value);
  if (isNaN(numValue))
    return <Minus className='size-4 text-muted-foreground' />;
  if (numValue > 0) return <TrendingUp className='size-4 text-green-500' />;
  if (numValue < 0) return <TrendingDown className='size-4 text-red-500' />;
  return <Minus className='size-4 text-muted-foreground' />;
};

const SingleCardView = ({ fields }: { fields: FieldData[] }) => {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {fields.map((field) => (
        <div key={field.key} className='space-y-1'>
          <p className='text-xs text-muted-foreground truncate'>
            {field.label}
          </p>
          <p className='text-sm font-medium truncate'>
            {formatValue(field.value as TResolvedValue, field.format)}
          </p>
        </div>
      ))}
    </div>
  );
};

const ListCardView = ({ items }: { items: FieldData[][] }) => {
  return (
    <div className='space-y-2 max-h-[200px] overflow-y-auto'>
      {items.map((itemFields, idx) => (
        <Card key={idx} className='bg-muted/30'>
          <CardContent className='p-3'>
            <div className='flex items-center justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                {itemFields.slice(0, 2).map((field) => (
                  <div key={field.key} className='truncate'>
                    {idx === 0 || field.key === itemFields[0]?.key ? (
                      <span className='text-sm font-medium'>
                        {formatValue(
                          field.value as TResolvedValue,
                          field.format
                        )}
                      </span>
                    ) : (
                      <span className='text-xs text-muted-foreground'>
                        {field.label}:{' '}
                        {formatValue(
                          field.value as TResolvedValue,
                          field.format
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {itemFields.length > 2 && (
                <div className='flex items-center gap-1 shrink-0'>
                  <TrendIcon value={itemFields[2]?.value} />
                  <Badge
                    variant='secondary'
                    className={cn(
                      'text-xs',
                      Number(itemFields[2]?.value) > 0 &&
                        'bg-green-500/10 text-green-600',
                      Number(itemFields[2]?.value) < 0 &&
                        'bg-red-500/10 text-red-600'
                    )}
                  >
                    {formatValue(
                      itemFields[2]?.value as TResolvedValue,
                      itemFields[2]?.format
                    )}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const CardWidget = memo(({ data, mapping }: CardWidgetProps) => {
  const { fields, isListView } = useMemo(() => {
    if (Array.isArray(data)) {
      const items = data.map((item) => extractCardData(item, mapping.fields));
      return { fields: items, isListView: true };
    }
    const singleFields = extractCardData(data, mapping.fields);
    return { fields: [singleFields], isListView: false };
  }, [data, mapping.fields]);

  if (mapping.fields.length === 0) {
    return (
      <div className='text-sm text-muted-foreground text-center py-4'>
        No fields configured for this card.
      </div>
    );
  }

  if (fields.length === 0 || (fields.length === 1 && fields[0].length === 0)) {
    return (
      <div className='text-sm text-muted-foreground text-center py-4'>
        No data available.
      </div>
    );
  }

  if (isListView && fields.length > 1) {
    return <ListCardView items={fields} />;
  }

  return <SingleCardView fields={fields[0]} />;
});

CardWidget.displayName = 'CardWidget';
