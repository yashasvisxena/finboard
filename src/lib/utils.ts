import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moveItem<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

export function transformParams(
  paramsArray: { key: string; value: string }[]
): Record<string, string> {
  return paramsArray.reduce(
    (acc, item) => {
      if (!item.key) return acc;
      acc[item.key] = item.value;
      return acc;
    },
    {} as Record<string, string>
  );
}
