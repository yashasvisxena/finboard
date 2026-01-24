import z from 'zod';

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
      })
    )
    .min(1),
});

export const widgetMappingSchema = z.discriminatedUnion('type', [
  chartMappingSchema,
  tableMappingSchema,
  cardMappingSchema,
]);

export const createWidgetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['card', 'chart', 'table']),

  api: z
    .object({
      useCustomUrl: z.boolean(),

      provider: z.enum(['finnhub', 'indianApi']).optional(),

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
      if (!data.useCustomUrl) {
        if (!data.provider) {
          ctx.addIssue({
            path: ['provider'],
            message: 'API provider is required',
            code: 'custom',
          });
        }
        if (!data.apiName) {
          ctx.addIssue({
            path: ['apiName'],
            message: 'API name is required',
            code: 'custom',
          });
        }
      }

      if (data.useCustomUrl && !data.url) {
        ctx.addIssue({
          path: ['url'],
          message: 'Custom API URL is required',
          code: 'custom',
        });
      }
    }),

  mapping: widgetMappingSchema,
});

export type TCreateWidgetSchema = z.infer<typeof createWidgetSchema>;
