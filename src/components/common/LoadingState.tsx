'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'spinner' | 'skeleton';
  skeletonRows?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

const containerSizeClasses = {
  sm: 'min-h-[80px] p-2 gap-2',
  md: 'min-h-[120px] p-4 gap-3',
  lg: 'min-h-[200px] p-6 gap-4',
};

export function LoadingState({
  size = 'md',
  message,
  variant = 'spinner',
  skeletonRows = 3,
  className,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4 w-full', i === skeletonRows - 1 && 'w-3/4')}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-muted-foreground',
        containerSizeClasses[size],
        className
      )}
    >
      <Spinner className={cn(sizeClasses[size], 'text-primary')} />
      {message && (
        <p
          className={cn(
            'text-center',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base'
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function WidgetLoadingSkeleton() {
  return (
    <div className='space-y-4 p-4'>
      <div className='flex items-center gap-3'>
        <Skeleton className='size-8 rounded-lg' />
        <Skeleton className='h-5 w-32' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  );
}
