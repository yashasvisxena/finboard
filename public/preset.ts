export const preset = {
  version: '1.0',
  exportedAt: '2026-01-25T16:41:42.413Z',
  widgetCount: 3,
  widgets: [
    {
      title: 'Chart',
      description: '',
      type: 'chart',
      api: {
        provider: 'indianApi',
        url: 'https://stock.indianapi.in/commodities',
        refreshInterval: 30,
        params: {},
      },
      mapping: {
        type: 'chart',
        xAxis: {
          keys: ['product'],
        },
        yAxis: {
          key: 'change',
        },
      },
      id: 'bc864ef0-bb25-472e-abe9-2f6df82b57e0',
    },
    {
      title: 'SOL Exchange Rate',
      description: '',
      type: 'card',
      api: {
        provider: 'custom',
        url: 'https://api.coinbase.com/v2/exchange-rates',
        refreshInterval: 60,
        params: {
          currency: 'SOL',
        },
      },
      mapping: {
        type: 'card',
        fields: [
          {
            key: 'data.currency',
          },
          {
            key: 'data.rates.INR',
          },
          {
            key: 'data.rates.USD',
          },
        ],
      },
      id: 'f7dffae5-806f-47bb-89bd-69e70ee73cbe',
    },
    {
      title: 'Table',
      description: '',
      type: 'table',
      api: {
        provider: 'indianApi',
        url: 'https://stock.indianapi.in/trending',
        refreshInterval: 30,
        params: {},
      },
      mapping: {
        type: 'table',
        columns: [
          {
            key: 'trending_stocks.top_gainers.company_name',
          },
          {
            key: 'trending_stocks.top_gainers.price',
          },
          {
            key: 'trending_stocks.top_gainers.percent_change',
          },
          {
            key: 'trending_stocks.top_gainers.net_change',
          },
          {
            key: 'trending_stocks.top_gainers.bid',
          },
          {
            key: 'trending_stocks.top_gainers.ask',
          },
          {
            key: 'trending_stocks.top_gainers.high',
          },
          {
            key: 'trending_stocks.top_gainers.low',
          },
          {
            key: 'trending_stocks.top_gainers.open',
          },
        ],
      },
      id: 'd95e1c1f-63f0-4af2-a28b-7eec7efa8fcc',
    },
  ],
};
