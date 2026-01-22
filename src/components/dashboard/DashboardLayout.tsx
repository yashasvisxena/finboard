'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { moveItem } from '@/lib/utils';
import { type DragEvent, useState } from 'react';

type Widget = {
  id: string;
  title: string;
  description: string;
  body: string;
};

const INITIAL_WIDGETS: Widget[] = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'High-level summary of your finances.',
    body: "This is a placeholder widget. You'll be able to configure real widgets here later.",
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    description: 'Track your latest transactions.',
    body: 'Add a transactions table widget to see your latest activity.',
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Visualize how your portfolio is moving.',
    body: 'Later this area will host charts powered by real market data.',
  },
];

const DashboardLayout = () => {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setActiveId(id);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, overId: string) => {
    event.preventDefault();

    if (!activeId || activeId === overId) return;

    setWidgets((prevWidgets) => {
      const currentIndex = prevWidgets.findIndex(
        (widget) => widget.id === activeId
      );
      const overIndex = prevWidgets.findIndex((widget) => widget.id === overId);

      if (currentIndex === -1 || overIndex === -1) return prevWidgets;

      const updated = moveItem(prevWidgets, currentIndex, overIndex);

      return updated;
    });
  };

  const handleDrop = () => {
    setActiveId(null);
  };

  return (
    <main className='grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-4'>
      {widgets.map((widget) => (
        <Card
          key={widget.id}
          draggable
          onDragStart={() => handleDragStart(widget.id)}
          onDragOver={(event) => handleDragOver(event, widget.id)}
          onDrop={handleDrop}
          onDragEnd={handleDrop}
          className={`cursor-move transition-shadow ${
            activeId === widget.id ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
        >
          <CardHeader>
            <CardTitle>{widget.title}</CardTitle>
            <CardDescription>{widget.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>{widget.body}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  );
};

export default DashboardLayout;
