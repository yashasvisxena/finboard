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

export const widgetApiConfigSchema = z
  .object({
    useCustomUrl: z.boolean(),

    provider: z.enum(['finnhub', 'indianApi', 'alphaVantage']),

    url: z.string().url('Invalid URL').or(z.literal('')).optional(),

    apiName: z.string().optional(),
    refreshInterval: z.number().min(1, 'Minimum 1 second'),
    params: z.record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean()])
    ),
    paramsArray: z
      .array(
        z.object({
          key: z.string(),
          type: z.enum(['string', 'number', 'boolean']),
          value: z.union([z.string(), z.number(), z.boolean()]),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Provider is always required
    if (!data.provider) {
      ctx.addIssue({
        path: ['provider'],
        message: 'API provider is required',
        code: 'custom',
      });
      return;
    }

    // For non-finnhub providers, URL is always required (custom URL only)
    if (data.provider !== 'finnhub' && !data.url) {
      ctx.addIssue({
        path: ['url'],
        message: 'API URL is required for this provider',
        code: 'custom',
      });
    }

    // For finnhub: either apiName (registry) or URL (custom) is required
    if (data.provider === 'finnhub') {
      if (data.useCustomUrl && !data.url) {
        ctx.addIssue({
          path: ['url'],
          message: 'Custom API URL is required',
          code: 'custom',
        });
      }
      if (!data.useCustomUrl && !data.apiName) {
        ctx.addIssue({
          path: ['apiName'],
          message: 'API name is required',
          code: 'custom',
        });
      }
    }
  });

export const createWidgetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['card', 'chart', 'table']),

  api: widgetApiConfigSchema,

  mapping: widgetMappingSchema,
});

export type TCreateWidgetSchema = z.infer<typeof createWidgetSchema>;
