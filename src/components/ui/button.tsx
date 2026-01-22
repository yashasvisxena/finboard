import { cn } from '@/lib/utils';
import * as React from 'react';

function Button({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot='button'
      className={cn(
        'flex items-center gap-2 justify-center border border-border rounded-md bg-foreground text-background font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-foreground/80',
        className
      )}
      {...props}
    />
  );
}

export { Button };
