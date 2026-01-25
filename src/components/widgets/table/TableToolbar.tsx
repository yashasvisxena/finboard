'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { memo } from 'react';

import { PAGE_SIZES } from './table.types';

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}

export const TableToolbar = memo(
  ({
    searchTerm,
    onSearchChange,
    pageSize,
    onPageSizeChange,
  }: TableToolbarProps) => {
    return (
      <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between'>
        <div className='relative flex-1 max-w-xs'>
          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-8 h-8 text-sm'
          />
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Show</span>
          <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
            <SelectTrigger className='h-8 w-16'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
);

TableToolbar.displayName = 'TableToolbar';
