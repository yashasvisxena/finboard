export type IconType = 'table' | 'chart' | 'card';

export interface BaseWidget {
  id: string;
  title: string;
  description?: string;
  link: string;
  icon: IconType;
  data: any;
}

export interface TableWidget extends BaseWidget {
  icon: 'table';
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ChartWidget extends BaseWidget {
  icon: 'chart';
}

export interface CardWidget extends BaseWidget {
  icon: 'card';
}

export type Widget = TableWidget | ChartWidget | CardWidget;
