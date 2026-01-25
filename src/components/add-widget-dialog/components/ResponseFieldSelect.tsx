'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

// Extract all leaf field paths from an object/array
export function extractFields(obj: unknown, prefix = ''): string[] {
  // 1. Handle Array
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      return extractFields(obj[0], prefix);
    }
    return prefix ? [prefix] : [];
  }

  // 2. Handle Object
  if (obj !== null && typeof obj === 'object') {
    const fields: string[] = [];
    const keys = Object.keys(obj);

    if (keys.length === 0 && prefix) {
      return [prefix]; // Empty object is a leaf
    }

    for (const key of keys) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = (obj as Record<string, unknown>)[key];

      fields.push(...extractFields(value, newKey));
    }
    return fields;
  }

  // 3. Handle Primitive (Leaf)
  return prefix ? [prefix] : [];
}

interface ResponseFieldSelectProps {
  data: unknown;
  onSelect: (path: string) => void;
  selectedPaths: string[];
}

export function ResponseFieldSelect({
  data,
  onSelect,
  selectedPaths,
}: ResponseFieldSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const availableFields = useMemo(() => {
    return extractFields(data);
  }, [data]);

  const filteredFields = useMemo(() => {
    if (!searchTerm) return availableFields;
    return availableFields.filter((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableFields, searchTerm]);

  return (
    <div className='space-y-2'>
      <Input
        placeholder='Search for fields...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='h-8'
      />
      <div className='border rounded-md p-2 max-h-[200px] overflow-auto space-y-1'>
        {filteredFields.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-2'>
            No fields found
          </p>
        ) : (
          filteredFields.map((field) => {
            const isSelected = selectedPaths.includes(field);
            return (
              <div
                key={field}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded text-sm cursor-pointer group',
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => !isSelected && onSelect(field)}
              >
                <span className='truncate'>{field}</span>
                {isSelected ? (
                  <Check className='h-4 w-4 text-green-600 shrink-0' />
                ) : (
                  <Plus className='h-4 w-4 opacity-0 group-hover:opacity-100 shrink-0' />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface SelectedFieldsProps {
  fields: { key: string; label?: string }[];
  onRemove: (key: string) => void;
}

export function SelectedFields({ fields, onRemove }: SelectedFieldsProps) {
  if (fields.length === 0) return null;

  return (
    <div className='space-y-2'>
      <h4 className='text-sm font-medium'>Selected Fields</h4>
      <div className='space-y-1'>
        {fields.map((field) => (
          <div
            key={field.key}
            className='flex items-center justify-between bg-muted rounded px-2 py-1.5'
          >
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>{field.key}</span>
              {field.label && (
                <span className='text-sm ml-2 font-medium'>{field.label}</span>
              )}
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-5 w-5 text-destructive hover:text-destructive'
              onClick={() => onRemove(field.key)}
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
