import Navbar from '@/components/common/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardLayout = () => {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <Navbar />

      <main className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>High-level summary of your finances.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              This is a placeholder widget. You&apos;ll be able to configure real widgets here
              later.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Track your latest transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Add a transactions table widget to see your latest activity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Visualize how your portfolio is moving.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Later this area will host charts powered by real market data.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardLayout;
