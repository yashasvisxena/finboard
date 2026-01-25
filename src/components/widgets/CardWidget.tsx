'use client';

import { TruncatedText } from '@/components/ui/TruncatedText';
import { extractCardData, formatValue } from '@/lib/data-utils';
import { TResolvedValue } from '@/lib/dot-notation-resolver';
import { ICardMapping } from '@/types/mapping.types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useMemo, useRef } from 'react';

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

const CardFieldItem = memo(({ field }: { field: FieldData }) => {
  const formattedValue = formatValue(
    field.value as TResolvedValue,
    field.format
  );
  const label = field.label?.replace(/_/g, ' ');

  return (
    <div className='space-y-1'>
      <TruncatedText
        text={label}
        className='text-xs md:text-sm text-muted-foreground truncate capitalize'
      />
      <TruncatedText
        text={formattedValue}
        className='text-base md:text-lg font-medium truncate'
      />
    </div>
  );
});
CardFieldItem.displayName = 'CardFieldItem';

const SimpleCardGrid = memo(({ fields }: { fields: FieldData[] }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto'>
    {fields.map((field) => (
      <CardFieldItem key={field.key} field={field} />
    ))}
  </div>
));
SimpleCardGrid.displayName = 'SimpleCardGrid';

export const CardWidget = memo(({ data, mapping }: CardWidgetProps) => {
  const fields = useMemo(() => {
    if (Array.isArray(data)) {
      return data.length > 0 ? extractCardData(data[0], mapping.fields) : [];
    }
    return extractCardData(data, mapping.fields);
  }, [data, mapping.fields]);

  if (mapping.fields.length === 0) {
    return (
      <div className='text-sm text-muted-foreground text-center py-4'>
        No fields configured for this card.
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className='text-sm text-muted-foreground text-center py-4'>
        No data available.
      </div>
    );
  }

  return <SimpleCardGrid fields={fields} />;
});

CardWidget.displayName = 'CardWidget';
