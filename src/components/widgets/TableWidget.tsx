'use client';

import { TruncatedText } from '@/components/ui/TruncatedText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  extractTableData,
  filterBySearch,
  formatValue,
  getFieldName,
  paginateData,
} from '@/lib/data-utils';
import { TResolvedValue } from '@/lib/dot-notation-resolver';
import { ITableMapping } from '@/types/mapping.types';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

interface TableWidgetProps {
  data: unknown;
  mapping: ITableMapping;
  page?: number;
  pageSize?: number;
}

const PAGE_SIZES = [5, 10, 20, 50];

export const TableWidget = memo(
  ({ data, mapping, page = 1, pageSize = 10 }: TableWidgetProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(page);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    const tableData = useMemo(
      () => extractTableData(data, mapping.columns),
      [data, mapping.columns]
    );

    const filteredData = useMemo(
      () => filterBySearch(tableData, searchTerm),
      [tableData, searchTerm]
    );

    const { items, totalPages, totalItems } = useMemo(
      () => paginateData(filteredData, currentPage, currentPageSize),
      [filteredData, currentPage, currentPageSize]
    );

    const onSearch = (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    };

    const onPageSizeChange = (value: string) => {
      setCurrentPageSize(Number(value));
      setCurrentPage(1);
    };

    if (mapping.columns.length === 0) {
      return (
        <div className='text-sm text-muted-foreground text-center py-4'>
          No columns configured for this table.
        </div>
      );
    }

    return (
      <div className='space-y-3'>
        {/* Search and Page Size */}
        <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between'>
          <div className='relative flex-1 max-w-xs'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className='pl-8 h-8 text-sm'
            />
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>Show</span>
            <Select
              value={String(currentPageSize)}
              onValueChange={onPageSizeChange}
            >
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

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                {mapping.columns.map((col) => (
                  <TableHead key={col.key} className='text-xs font-semibold'>
                    {col.label ?? getFieldName(col.key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={mapping.columns.length}
                    className='text-center text-muted-foreground py-8'
                  >
                    {searchTerm ? 'No results found' : 'No data available'}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row, idx) => (
                  <TableRow key={idx}>
                    {mapping.columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className='text-sm max-w-[200px]'
                      >
                        <TruncatedText
                          text={formatValue(
                            row[col.key] as TResolvedValue,
                            col.format
                          )}
                          className='truncate block'
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>
              Showing {(currentPage - 1) * currentPageSize + 1} to{' '}
              {Math.min(currentPage * currentPageSize, totalItems)} of{' '}
              {totalItems}
            </span>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon-sm'
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className='size-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TableWidget.displayName = 'TableWidget';
