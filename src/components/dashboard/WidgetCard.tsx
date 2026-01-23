import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Widget } from '@/types/widgets/widgetTypes';
import { GripVertical } from 'lucide-react';

import WidgetRenderer from './WidgetRenderer';

export default function WidgetCard({ widget }: { widget: Widget }) {
  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center gap-2'>
        <GripVertical className='drag-handle cursor-move' size={16} />
        <CardTitle>{widget.title}</CardTitle>
      </CardHeader>

      <CardContent className='h-full'>
        <WidgetRenderer widget={widget} />
      </CardContent>
    </Card>
  );
}
