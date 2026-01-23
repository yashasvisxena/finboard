import { Widget, WidgetLayout } from '@/types/widgets/widgetTypes';

export const mockWidgets: Widget[] = [
  {
    id: 'w-1',
    title: 'Market Gainers',
    description: 'Top gaining stocks today',
    icon: 'card',
    api: {
      provider: 'alphaVantage',
      endpointKey: 'TOP_GAINERS',
      params: {
        symbol: 'NIFTY',
      },
      refreshInterval: 60,
    },
    data: {
      symbol: 'NIFTY',
      change: '+2.4%',
    },
  },
  {
    id: 'w-2',
    title: 'NIFTY 50 Overview',
    description: 'Index performance',
    icon: 'chart',
    api: {
      provider: 'alphaVantage',
      endpointKey: 'TIME_SERIES_DAILY',
      params: {
        symbol: 'NIFTY',
      },
      refreshInterval: 60,
    },
    data: {
      points: [22100, 22240, 22310, 22290],
    },
  },
  {
    id: 'w-3',
    title: 'Watchlist',
    description: 'Tracked stocks',
    icon: 'table',
    api: {
      provider: 'finnhub',
      endpointKey: 'QUOTE',
      params: {
        symbol: 'NIFTY',
      },
      refreshInterval: 60,
    },
    pagination: {
      limit: 5,
      offset: 0,
      total: 20,
    },
    data: [
      { symbol: 'TCS', price: 3850 },
      { symbol: 'INFY', price: 1620 },
    ],
  },
];

export const mockLayouts: WidgetLayout[] = [
  { i: 'w-1', x: 0, y: 0, w: 4, h: 3 },
  { i: 'w-2', x: 4, y: 0, w: 8, h: 4 },
  { i: 'w-3', x: 0, y: 3, w: 6, h: 4 },
];
