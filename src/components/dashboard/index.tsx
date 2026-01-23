// 'use client';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { moveItem } from '@/lib/utils';
// import { Widget } from '@/types/widgets';
// import { Plus } from 'lucide-react';
// import { type DragEvent, useState } from 'react';

// import { AddWidgetDialog } from '../widget-dialog/AddWidgetDialog';

// const INITIAL_WIDGETS: Widget[] = [
//   {
//     id: 'overview',
//     title: 'Overview',
//     description: 'High-level summary of your finances.',
//     icon: 'card',
//     link: '/dashboard/overview',
//     data: {},
//   },
//   {
//     id: 'recent-activity',
//     title: 'Recent Activity',
//     description: 'Track your latest transactions.',
//     icon: 'table',
//     link: '/dashboard/recent-activity',
//     data: {},
//   },
//   {
//     id: 'performance',
//     title: 'Performance',
//     description: 'Visualize how your portfolio is moving.',
//     icon: 'chart',
//     link: '/dashboard/performance',
//     data: {},
//   },
// ];

// const DashboardLayout = () => {
//   const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const handleDragStart = (id: string) => {
//     setActiveId(id);
//   };

//   const handleDragOver = (event: DragEvent<HTMLDivElement>, overId: string) => {
//     event.preventDefault();

//     if (!activeId || activeId === overId) return;

//     setWidgets((prevWidgets) => {
//       const currentIndex = prevWidgets.findIndex(
//         (widget) => widget.id === activeId
//       );
//       const overIndex = prevWidgets.findIndex((widget) => widget.id === overId);

//       if (currentIndex === -1 || overIndex === -1) return prevWidgets;

//       const updated = moveItem(prevWidgets, currentIndex, overIndex);

//       return updated;
//     });
//   };

//   const handleDrop = () => {
//     setActiveId(null);
//   };

//   return (
//     <main className='grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4'>
//       {widgets.map((widget) => (
//         <Card
//           key={widget.id}
//           draggable
//           onDragStart={() => handleDragStart(widget.id)}
//           onDragOver={(event) => handleDragOver(event, widget.id)}
//           onDrop={handleDrop}
//           onDragEnd={handleDrop}
//           className={`cursor-move transition-shadow ${
//             activeId === widget.id ? 'ring-2 ring-primary shadow-lg' : ''
//           }`}
//         >
//           <CardHeader>
//             <CardTitle>{widget.title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className='text-sm text-muted-foreground'>
//               {widget.description}
//             </p>
//           </CardContent>
//         </Card>
//       ))}
//       <AddWidgetDialog>
//         <Button
//           className='col-span-1 h-full min-h-[150px] border-2 border-dashed border-border'
//           variant='outline'
//         >
//           <Plus className='size-4' />
//           Add Widget
//         </Button>
//       </AddWidgetDialog>
//     </main>
//   );
// };

// export default DashboardLayout;
