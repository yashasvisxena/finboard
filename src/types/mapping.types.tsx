export type TResponseKey = string;

export interface IChartMapping {
  type: 'chart';

  xAxis: {
    keys: TResponseKey[];
  };

  yAxis: {
    key: TResponseKey;
  };
}

export interface ITableMapping {
  type: 'table';

  columns: {
    key: TResponseKey;
    label?: string;
    format?: 'text' | 'number' | 'currency' | 'percentage';
  }[];
}

export interface ICardMapping {
  type: 'card';

  fields: {
    key: TResponseKey;
    label?: string;
    format?: 'text' | 'number' | 'currency' | 'percentage';
  }[];
}

export type IWidgetDataMapping = IChartMapping | ITableMapping | ICardMapping;
