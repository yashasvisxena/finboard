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
  }[];
}

export interface ICardMapping {
  type: 'card';

  fields: {
    key: TResponseKey;
    label?: string;
  }[];
}

export type IWidgetDataMapping = IChartMapping | ITableMapping | ICardMapping;
