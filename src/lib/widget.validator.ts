import {
  IApiConfig,
  IApiParams,
  TApiProvider,
} from '@/services/api/core/api.types';
import { IWidget } from '@/types/widget.types';

export interface IValidationError {
  path: string;
  message: string;
}

export interface IValidationResult {
  valid: boolean;
  errors: IValidationError[];
}

function isValidType(value: unknown, type: IApiParams['type']): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object';
    case 'array':
      return Array.isArray(value);
    default:
      return false;
  }
}
export function getApiFromRegistry(
  registry: IApiConfig[],
  provider: TApiProvider,
  apiName: string
): IApiConfig | undefined {
  return registry.find(
    (api) => api.provider === provider && api.name === apiName
  );
}

export function validateApiParams(
  api: IApiConfig,
  widgetParams: Record<string, unknown>
): IValidationError[] {
  const errors: IValidationError[] = [];

  for (const param of api.params) {
    const value = widgetParams[param.name];

    // Required check
    if (param.required && value === undefined) {
      errors.push({
        path: `api.params.${param.name}`,
        message: 'Required parameter missing',
      });
      continue;
    }

    if (value === undefined) continue;

    // Type check
    if (!isValidType(value, param.type)) {
      errors.push({
        path: `api.params.${param.name}`,
        message: `Expected ${param.type}, got ${typeof value}`,
      });
    }
  }

  return errors;
}

export function validateWidgetMapping(widget: IWidget): IValidationError[] {
  const errors: IValidationError[] = [];

  switch (widget.type) {
    case 'chart': {
      if (widget.mapping.type !== 'chart') {
        errors.push({
          path: 'mapping.type',
          message: 'Mapping type must be chart',
        });
        break;
      }

      if (!widget.mapping.xAxis.keys.length) {
        errors.push({
          path: 'mapping.xAxis',
          message: 'Chart must have x-axis keys',
        });
      }

      if (!widget.mapping.yAxis.key) {
        errors.push({
          path: 'mapping.yAxis',
          message: 'Chart must have y-axis key',
        });
      }

      break;
    }

    case 'table': {
      if (widget.mapping.type !== 'table') {
        errors.push({
          path: 'mapping.type',
          message: 'Mapping type must be table',
        });
        break;
      }

      if (!widget.mapping.columns.length) {
        errors.push({
          path: 'mapping.columns',
          message: 'Table must have at least one column',
        });
      }
      break;
    }

    case 'card': {
      if (widget.mapping.type !== 'card') {
        errors.push({
          path: 'mapping.type',
          message: 'Mapping type must be card',
        });
        break;
      }

      if (!widget.mapping.fields.length) {
        errors.push({
          path: 'mapping.fields',
          message: 'Card must have at least one field',
        });
      }
      break;
    }
  }

  return errors;
}

export function validateWidget(
  widget: IWidget,
  registry: IApiConfig[]
): IValidationResult {
  const errors: IValidationError[] = [];

  const api = getApiFromRegistry(
    registry,
    widget.api.provider,
    widget.api.apiName
  );

  if (!api) {
    errors.push({
      path: 'api.apiName',
      message: 'API not found in registry',
    });
    return { valid: false, errors };
  }

  errors.push(
    ...validateApiParams(api, widget.api.params),
    ...validateWidgetMapping(widget)
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}
