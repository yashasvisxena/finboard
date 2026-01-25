'use client';

import { extractChartData } from '@/lib/data-utils';
import { IChartMapping } from '@/types/mapping.types';
import { useTheme } from 'next-themes';
import { memo, useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartWidgetProps {
  data: unknown;
  mapping: IChartMapping;
}

export const ChartWidget = memo(({ data, mapping }: ChartWidgetProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    const extracted = extractChartData(
      data,
      mapping.xAxis.keys,
      mapping.yAxis.key
    );
    return extracted.map((point, index) => ({
      name: point.x !== undefined ? String(point.x) : `Point ${index + 1}`,
      value: typeof point.y === 'number' ? point.y : Number(point.y) || 0,
    }));
  }, [data, mapping]);

  if (chartData.length === 0) {
    return (
      <div className='text-sm text-muted-foreground text-center py-8'>
        No chart data available. Check your API response and mapping
        configuration.
      </div>
    );
  }

  const strokeColor = isDark ? '#22c55e' : '#16a34a';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // Calculate min and max for Y-axis domain
  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  // Add 5% padding to min/max for better visualization
  const padding = (maxValue - minValue) * 0.05 || 1;
  const yDomain: [number, number] = [
    Math.floor(minValue - padding),
    Math.ceil(maxValue + padding),
  ];

  return (
    <div className='w-full h-[200px] sm:h-[250px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
          <XAxis
            dataKey='name'
            tick={{ fontSize: 11 }}
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 11 }}
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type='monotone'
            dataKey='value'
            stroke={strokeColor}
            strokeWidth={2}
            dot={chartData.length <= 20}
            activeDot={{ r: 4 }}
            name={mapping.yAxis.key}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

ChartWidget.displayName = 'ChartWidget';
