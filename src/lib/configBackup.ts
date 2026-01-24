import { createWidgetSchema } from '@/types/add-widget-schema';
import { IWidget } from '@/types/widget.types';
import { z } from 'zod';

// Configuration version for future compatibility
const CONFIG_VERSION = '1.0';

const dashboardConfigSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  widgetCount: z.number(),
  widgets: z.array(createWidgetSchema),
});

export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;

/**
 * Creates a dashboard configuration object from widgets
 */
export function createConfig(widgets: IWidget[]): DashboardConfig {
  return {
    version: CONFIG_VERSION,
    exportedAt: new Date().toISOString(),
    widgetCount: widgets.length,
    widgets: widgets as DashboardConfig['widgets'],
  };
}

/**
 * Exports widgets to a JSON string
 */
export function exportConfig(widgets: IWidget[]): string {
  const config = createConfig(widgets);
  return JSON.stringify(config, null, 2);
}

/**
 * Validates and parses an imported configuration
 */
export function validateConfig(
  data: unknown
):
  | { success: true; data: DashboardConfig }
  | { success: false; error: string } {
  try {
    const parsed = dashboardConfigSchema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(
        (e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`
      );
      return {
        success: false,
        error: `Invalid configuration: ${messages.join(', ')}`,
      };
    }
    return { success: false, error: 'Failed to parse configuration file' };
  }
}

/**
 * Parses and validates a JSON configuration string
 */
export function importConfig(
  jsonString: string
): { success: true; widgets: IWidget[] } | { success: false; error: string } {
  try {
    const data = JSON.parse(jsonString);
    const result = validateConfig(data);

    if (!result.success) {
      return result;
    }

    return { success: true, widgets: result.data.widgets as IWidget[] };
  } catch {
    return { success: false, error: 'Invalid JSON format' };
  }
}

/**
 * Triggers a browser download of the configuration file
 */
export function downloadConfigFile(
  widgets: IWidget[],
  filename?: string
): void {
  const json = exportConfig(widgets);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename ||
    `finboard-config-${new Date().toISOString().split('T')[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Reads a File object and returns its contents as a string
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
