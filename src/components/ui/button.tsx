import { cn } from '@/lib/utils';
import * as React from 'react';

function Button({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
}) {
  return (
    <button
      data-slot='button'
      className={cn(
        'flex items-center gap-2 justify-center border border-border rounded-md bg-foreground text-background',
        className
      )}
      {...props}
    />
  );
}

export { Button };
