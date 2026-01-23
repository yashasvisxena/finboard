// components/dashboard/WidgetRenderer.tsx
import { Widget } from '@/types/widgets/widgetTypes';

interface Props {
  widget: Widget;
}

export default function WidgetRenderer({ widget }: Props) {
  switch (widget.icon) {
    case 'card':
      return;

    case 'table':
      return;

    case 'chart':
      return;

    default:
      return (
        <div className='text-sm text-muted-foreground'>
          Unsupported widget type
        </div>
      );
  }
}
