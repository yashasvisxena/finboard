import z from 'zod';

// Field format types for custom formatting
export const fieldFormatSchema = z.enum([
  'text',
  'number',
  'currency',
  'percentage',
]);
export type TFieldFormat = z.infer<typeof fieldFormatSchema>;

const chartMappingSchema = z.object({
  type: z.literal('chart'),
  xAxis: z.object({
    keys: z.array(z.string()).min(1),
  }),
  yAxis: z.object({
    key: z.string().min(1),
  }),
});

const tableMappingSchema = z.object({
  type: z.literal('table'),
  columns: z
    .array(
      z.object({
        key: z.string(),
        label: z.string().optional(),
        format: fieldFormatSchema.optional(),
      })
    )
    .min(1),
});

const cardMappingSchema = z.object({
  type: z.literal('card'),
  fields: z
    .array(
      z.object({
        key: z.string(),
        label: z.string().optional(),
        format: fieldFormatSchema.optional(),
      })
    )
    .min(1),
});

export const widgetMappingSchema = z.discriminatedUnion('type', [
  chartMappingSchema,
  tableMappingSchema,
  cardMappingSchema,
]);

export const widgetApiConfigSchema = z.object({
  provider: z.enum(['finnhub', 'indianApi', 'alphaVantage', 'custom']),
  url: z.string().url('Invalid URL'),
  refreshInterval: z.number().min(1, 'Minimum 1 second'),
  params: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  paramsArray: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const createWidgetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['card', 'chart', 'table']),

  api: widgetApiConfigSchema,

  mapping: widgetMappingSchema,
});

export type TCreateWidgetSchema = z.infer<typeof createWidgetSchema>;
