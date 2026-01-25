import Navbar from '@/components/common/navbar';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('@/components/dashboard/index'), {
  loading: () => (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='h-[200px] animate-pulse bg-muted rounded-xl border'
        />
      ))}
    </div>
  ),
});

export default function Home() {
  return (
    <div>
      <Navbar />
      <DashboardLayout />
    </div>
  );
}
