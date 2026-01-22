import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-4'>
      <div>
        <h1 className='text-2xl font-bold'>FinBoard</h1>
      </div>
      <div className='flex gap-2 items-center justify-end'>
        <Button className='p-2'>Add Widget</Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
