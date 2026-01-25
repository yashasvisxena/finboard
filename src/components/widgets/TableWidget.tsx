'use client';

import { TruncatedText } from '@/components/ui/TruncatedText';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/useDebounce';
import {
  extractTableData,
  formatValue,
  getFieldName,
  paginateData,
} from '@/lib/data-utils';
import { TResolvedValue } from '@/lib/dot-notation-resolver';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { TablePagination, TableToolbar } from './table';
import { SortState, TableWidgetProps } from './table/table.types';

export const TableWidget = memo(
  ({ data, mapping, page = 1, pageSize = 10 }: TableWidgetProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [currentPage, setCurrentPage] = useState(page);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [sortState, setSortState] = useState<SortState>({
      key: null,
      direction: null,
    });

    const tableData = useMemo(
      () => extractTableData(data, mapping.columns),
      [data, mapping.columns]
    );

    const filteredData = useMemo(() => {
      if (!debouncedSearchTerm) return tableData;
      const lowerTerm = debouncedSearchTerm.toLowerCase();

      return tableData.filter((row) =>
        mapping.columns.some((col) => {
          const val = row[col.key] as TResolvedValue;
          const formatted = formatValue(val, col.format);
          return formatted.toLowerCase().includes(lowerTerm);
        })
      );
    }, [tableData, debouncedSearchTerm, mapping.columns]);

    const sortedData = useMemo(() => {
      if (!sortState.key || !sortState.direction) return filteredData;

      return [...filteredData].sort((a, b) => {
        const aVal = a[sortState.key!] as TResolvedValue;
        const bVal = b[sortState.key!] as TResolvedValue;

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortState.direction === 'asc' ? 1 : -1;
        if (bVal == null) return sortState.direction === 'asc' ? -1 : 1;

        // Compare based on type
        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
        } else {
          comparison = String(aVal).localeCompare(String(bVal), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        }

        return sortState.direction === 'asc' ? comparison : -comparison;
      });
    }, [filteredData, sortState]);

    const { items, totalPages, totalItems } = useMemo(
      () => paginateData(sortedData, currentPage, currentPageSize),
      [sortedData, currentPage, currentPageSize]
    );

    const handleSort = (key: string) => {
      setSortState((prev) => {
        if (prev.key !== key) {
          return { key, direction: 'asc' };
        }
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return { key: null, direction: null };
      });
      setCurrentPage(1);
    };

    const getSortIcon = (key: string) => {
      if (sortState.key !== key) {
        return <ArrowUpDown className='size-3 ml-1 opacity-50' />;
      }
      if (sortState.direction === 'asc') {
        return <ArrowUp className='size-3 ml-1' />;
      }
      return <ArrowDown className='size-3 ml-1' />;
    };

    const handleSearchChange = (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    };

    const handlePageSizeChange = (value: string) => {
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
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          pageSize={currentPageSize}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                {mapping.columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className='text-xs text-center font-semibold'
                  >
                    <button
                      type='button'
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        'inline-flex items-center justify-center gap-0.5 hover:text-foreground transition-colors w-full',
                        sortState.key === col.key && 'text-foreground'
                      )}
                    >
                      {col.label ?? getFieldName(col.key)}
                      {getSortIcon(col.key)}
                    </button>
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
                        className='text-sm max-w-[200px] text-center'
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

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={currentPageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  }
);

TableWidget.displayName = 'TableWidget';
