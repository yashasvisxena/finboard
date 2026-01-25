'use client';

import { ChartBar, Sheet, Table } from 'lucide-react';
import { memo } from 'react';

interface WidgetIconProps {
  icon: string;
}

export const WidgetIcon = memo(({ icon }: WidgetIconProps) => {
  switch (icon) {
    case 'table':
      return <Table className='size-4 sm:size-5' />;
    case 'chart':
      return <ChartBar className='size-4 sm:size-5' />;
    case 'card':
    default:
      return <Sheet className='size-4 sm:size-5' />;
  }
});

WidgetIcon.displayName = 'WidgetIcon';
