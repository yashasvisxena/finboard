'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface JsonTreeNodeProps {
  label: string;
  value: unknown;
  path: string[];
  onSelect: (path: string) => void;
  selectedPaths: string[];
  searchTerm: string;
}

function getNodeType(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

function getValuePreview(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string')
    return value.length > 30 ? value.slice(0, 30) + '...' : value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === 'object') return `{${Object.keys(value).length} keys}`;
  return String(value);
}

function normalizePath(path: string[]) {
  return path.map((p) => (p === '*' ? '0' : p)).join('.');
}

function getChildren(value: unknown): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.length > 0 ? [['*', value[0]]] : [];
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value);
  }

  return [];
}

export function JsonTreeNode({
  label,
  value,
  path,
  onSelect,
  selectedPaths,
  searchTerm,
}: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const nodeType = getNodeType(value);
  const isLeaf = nodeType !== 'array' && nodeType !== 'object';
  const valuePreview = isLeaf ? getValuePreview(value) : '';

  const children = expanded ? getChildren(value) : [];

  const currentPath = [...path, label];
  const normalizedPath = normalizePath(currentPath);
  const isSelected = selectedPaths.includes(normalizedPath);

  // Filter based on search term
  const matchesSearch =
    !searchTerm ||
    label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    normalizedPath.toLowerCase().includes(searchTerm.toLowerCase());

  // Always show if we have matching children (expand to show them)
  const hasMatchingChildren = useMemo(() => {
    if (!searchTerm) return true;
    const allChildren = getChildren(value);
    return allChildren.some(
      ([key]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${normalizedPath}.${key}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, value, normalizedPath]);

  if (!matchesSearch && !hasMatchingChildren) return null;

  return (
    <div className='ml-2'>
      <div
        className={cn(
          'flex items-center gap-2 cursor-pointer text-sm rounded px-1 py-0.5 group',
          isLeaf && 'hover:bg-primary/10',
          isSelected && 'bg-primary/10 text-primary font-medium'
        )}
        onClick={() => {
          if (!isLeaf) {
            setExpanded((prev) => !prev);
          }
        }}
      >
        {!isLeaf &&
          (expanded ? (
            <ChevronDown className='h-3 w-3 shrink-0' />
          ) : (
            <ChevronRight className='h-3 w-3 shrink-0' />
          ))}
        {isLeaf && <span className='w-3' />}

        <span className='font-medium'>{label}</span>
        <span className='text-muted-foreground text-xs'>{nodeType}</span>

        {isLeaf && valuePreview && (
          <span className='text-muted-foreground text-xs truncate max-w-[150px]'>
            | {valuePreview}
          </span>
        )}

        {isLeaf && !isSelected && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-5 w-5 opacity-0 group-hover:opacity-100 ml-auto'
            onClick={(e) => {
              e.stopPropagation();
              onSelect(normalizedPath);
            }}
          >
            <Plus className='h-3 w-3' />
          </Button>
        )}

        {isSelected && <Check className='h-3 w-3 text-green-600 ml-auto' />}
      </div>

      {expanded &&
        children.map(([childKey, childValue]) => (
          <JsonTreeNode
            key={childKey}
            label={childKey}
            value={childValue}
            path={currentPath}
            onSelect={onSelect}
            selectedPaths={selectedPaths}
            searchTerm={searchTerm}
          />
        ))}
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

interface JsonTreeProps {
  data: unknown;
  onSelect: (path: string) => void;
  selectedPaths: string[];
}

export function JsonTree({ data, onSelect, selectedPaths }: JsonTreeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (data === null || typeof data !== 'object') return null;

  const isRootArray = Array.isArray(data);
  const displayData = isRootArray && data.length > 0 ? { '*': data[0] } : data;

  return (
    <div className='space-y-2'>
      <Input
        placeholder='Search for fields...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='h-8'
      />
      {isRootArray && (
        <p className='text-xs text-muted-foreground'>
          Array with {data.length} items (showing sample structure)
        </p>
      )}
      <div className='border rounded-md p-2 max-h-[250px] overflow-auto'>
        {Object.entries(displayData).map(([key, value]) => (
          <JsonTreeNode
            key={key}
            label={key}
            value={value}
            path={[]}
            onSelect={onSelect}
            selectedPaths={selectedPaths}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}
