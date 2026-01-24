export type TPath = string;
export type TResolvedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | TResolvedValue[];

export function resolvePath(source: unknown, path: string): TResolvedValue {
  if (!path) return source as TResolvedValue;

  const segments = path.split('.');

  return resolveRecursive(source, segments);
}

function resolveRecursive(
  current: unknown,
  segments: string[]
): TResolvedValue {
  if (segments.length === 0) return current as TResolvedValue;
  if (current == null) return undefined;

  const [head, ...rest] = segments;

  // Wildcard handling
  if (head === '*') {
    if (Array.isArray(current)) {
      return current.map((item) => resolveRecursive(item, rest)).flat();
    }

    if (typeof current === 'object') {
      return Object.values(current as Record<string, unknown>)
        .map((value) => resolveRecursive(value, rest))
        .flat();
    }

    return undefined;
  }

  // Array index
  if (Array.isArray(current)) {
    const index = Number(head);
    if (Number.isNaN(index)) return undefined;
    return resolveRecursive(current[index], rest);
  }

  // Object key
  if (typeof current === 'object') {
    return resolveRecursive((current as Record<string, unknown>)[head], rest);
  }

  return undefined;
}
