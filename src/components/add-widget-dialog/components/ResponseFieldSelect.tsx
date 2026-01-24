'use client';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface JsonTreeNodeProps {
  label: string;
  value: unknown;
  path: string[];
  onSelect: (path: string) => void;
  selectedPaths: string[];
}

function getNodeType(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  return 'primitive';
}

function normalizePath(path: string[]) {
  return path.map((p, i) => (p === '*' ? '0' : p)).join('.');
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
}: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const nodeType = getNodeType(value);
  const isLeaf = nodeType === 'primitive';

  const children = expanded ? getChildren(value) : [];

  const currentPath = [...path, label];

  const normalizedPath = normalizePath(path);
  const isSelected = selectedPaths.includes(normalizedPath);
  return (
    <div className='ml-2'>
      <div
        className={cn(
          'flex items-center gap-2 cursor-pointer text-sm rounded px-1',
          isLeaf && 'hover:bg-primary/10 hover:text-primary',
          isSelected && 'bg-primary/10 text-primary font-medium'
        )}
        onClick={() => {
          if (isLeaf) {
            onSelect(normalizePath(currentPath));
          } else {
            setExpanded((prev) => !prev);
          }
        }}
      >
        {!isLeaf &&
          (expanded ? (
            <ChevronDown className='h-3 w-3' />
          ) : (
            <ChevronRight className='h-3 w-3' />
          ))}

        <span>{label}</span>
        <span className='text-muted-foreground text-xs'>{nodeType}</span>
        {isSelected && <Check className='h-3 w-3 text-green-600' />}
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
          />
        ))}
    </div>
  );
}

interface JsonTreeProps {
  data: unknown;
  onSelect: (path: string) => void;
  selectedPaths: string[];
}

export function JsonTree({ data, onSelect, selectedPaths }: JsonTreeProps) {
  if (data === null || typeof data !== 'object') return null;

  return (
    <div className='border rounded-md p-2 max-h-[400px] overflow-auto'>
      {Object.entries(data).map(([key, value]) => (
        <JsonTreeNode
          key={key}
          label={key}
          value={value}
          path={[]}
          onSelect={onSelect}
          selectedPaths={selectedPaths}
        />
      ))}
    </div>
  );
}
