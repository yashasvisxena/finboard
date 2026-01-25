'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
  }: TablePaginationProps) => {
    if (totalPages <= 1) return null;

    return (
      <div className='flex items-center justify-between text-sm'>
        <span className='text-muted-foreground'>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </span>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <span className='px-2 min-w-[80px] text-center'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>
    );
  }
);

TablePagination.displayName = 'TablePagination';
