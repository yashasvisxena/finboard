import { AddWidgetDialog } from '../add-widget-dialog/AddWidgetDialog';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-4'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>FinBoard</h1>
        <p className='text-sm text-muted-foreground'>
          Your personal finance dashboard
        </p>
      </div>
      <div className='flex gap-2 items-center justify-end'>
        <AddWidgetDialog />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
