'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCcw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  title?: string;
  type?: 'generic' | 'network';
  onRetry?: () => void;
  isRetrying?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'min-h-[80px] p-3 gap-2',
    icon: 'size-4',
    iconContainer: 'size-8',
    title: 'text-sm font-medium',
    message: 'text-xs',
  },
  md: {
    container: 'min-h-[120px] p-4 gap-3',
    icon: 'size-5',
    iconContainer: 'size-10',
    title: 'text-base font-semibold',
    message: 'text-sm',
  },
  lg: {
    container: 'min-h-[200px] p-6 gap-4',
    icon: 'size-6',
    iconContainer: 'size-12',
    title: 'text-lg font-semibold',
    message: 'text-sm',
  },
};

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  title = 'Error',
  type = 'generic',
  onRetry,
  isRetrying = false,
  size = 'md',
  className,
}: ErrorStateProps) {
  const Icon = type === 'network' ? WifiOff : AlertCircle;
  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-lg border border-destructive/20 bg-destructive/5',
        styles.container,
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-destructive/10',
          styles.iconContainer
        )}
      >
        <Icon className={cn('text-destructive', styles.icon)} />
      </div>

      <div className='space-y-1'>
        <h4 className={styles.title}>{title}</h4>
        <p className={cn('text-muted-foreground max-w-xs', styles.message)}>
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant='outline'
          size={size === 'sm' ? 'sm' : 'default'}
          disabled={isRetrying}
          className='gap-2'
        >
          <RefreshCcw className={cn('size-4', isRetrying && 'animate-spin')} />
          {isRetrying ? 'Retrying...' : 'Try again'}
        </Button>
      )}
    </div>
  );
}
