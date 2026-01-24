'use client';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface JsonTreeNodeProps {
  label: string;
  value: unknown;
  path: string[];
  onSelect: (path: string) => void;
}

function getNodeType(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  return 'primitive';
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
}: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const nodeType = getNodeType(value);
  const isLeaf = nodeType === 'primitive';

  const children = expanded ? getChildren(value) : [];

  const currentPath = [...path, label];

  return (
    <div className='ml-2'>
      <div
        className={cn(
          'flex items-center gap-1 cursor-pointer text-sm',
          isLeaf && 'text-blue-600 hover:underline'
        )}
        onClick={() => {
          if (isLeaf) {
            onSelect(currentPath.join('.'));
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
      </div>

      {expanded &&
        children.map(([childKey, childValue]) => (
          <JsonTreeNode
            key={childKey}
            label={childKey}
            value={childValue}
            path={currentPath}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

interface JsonTreeProps {
  data: unknown;
  onSelect: (path: string) => void;
}

export function JsonTree({ data, onSelect }: JsonTreeProps) {
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
        />
      ))}
    </div>
  );
}
