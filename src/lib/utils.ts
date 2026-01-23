import { type ClassValue, clsx } from 'clsx';
import { ChartBar, Sheet, Table } from 'lucide-react';
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

export const getIcon = (widgetType: string) => {
  const icons: Record<string, any> = {
    card: Sheet,
    table: Table,
    chart: ChartBar,
  };
  const Icon = icons[widgetType] || Sheet;
  return Icon;
};
