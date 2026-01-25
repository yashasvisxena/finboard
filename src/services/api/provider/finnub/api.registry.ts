export const finnhubApiRegistry: any[] = [
  {
    provider: 'finnhub',
    name: 'Search Stock Symbols',
    endpoint: '/search',
    params: [{ name: 'q', required: true, type: 'string' }],
    sampleResponse: {
      count: 4,
      result: [
        {
          description: 'APPLE INC',
          displaySymbol: 'AAPL',
          symbol: 'AAPL',
          type: 'Common Stock',
        },
        {
          description: 'APPLE INC',
          displaySymbol: 'AAPL.SW',
          symbol: 'AAPL.SW',
          type: 'Common Stock',
        },
        {
          description: 'APPLE INC',
          displaySymbol: 'APC.BE',
          symbol: 'APC.BE',
          type: 'Common Stock',
        },
        {
          description: 'APPLE INC',
          displaySymbol: 'APC.DE',
          symbol: 'APC.DE',
          type: 'Common Stock',
        },
      ],
    },
  },
  {
    provider: 'finnhub',
    name: 'Market Holiday',
    endpoint: '/stock/market-holiday',
    params: [{ name: 'exchange', required: true, type: 'string' }],
    sampleResponse: {
      data: [
        {
          eventName: 'Christmas',
          atDate: '2023-12-25',
          tradingHour: '',
        },
        {
          eventName: 'Independence Day',
          atDate: '2023-07-03',
          tradingHour: '09:30-13:00',
        },
      ],
      exchange: 'US',
      timezone: 'America/New_York',
    },
  },

  {
    provider: 'finnhub',
    name: 'Company Profile',
    endpoint: '/stock/profile2',
    params: [{ name: 'symbol', required: true, type: 'string' }],
    sampleResponse: {
      country: 'US',
      currency: 'USD',
      exchange: 'NASDAQ/NMS (GLOBAL MARKET)',
      ipo: '1980-12-12',
      marketCapitalization: 1415993,
      name: 'Apple Inc',
      phone: '14089961010',
      shareOutstanding: 4375.47998046875,
      ticker: 'AAPL',
      weburl: 'https://www.apple.com/',
      logo: 'https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png',
      finnhubIndustry: 'Technology',
    },
  },

  {
    provider: 'finnhub',
    name: 'Market News',
    endpoint: '/news',
    params: [{ name: 'category', required: true, type: 'string' }],
    sampleResponse: [
      {
        category: 'technology',
        datetime: 1596589501,
        headline:
          'Square surges after reporting 64% jump in revenue, more customers using Cash App',
        id: 5085164,
        image:
          'https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069',
        related: '',
        source: 'CNBC',
        summary:
          'Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results and strong growth in its consumer payments app.',
        url: 'https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html',
      },
      {
        category: 'business',
        datetime: 1596588232,
        headline:
          'B&G Foods CEO expects pantry demand to hold up post-pandemic',
        id: 5085113,
        image:
          'https://image.cnbcfm.com/api/v1/image/106629991-1595532157669-gettyimages-1221952946-362857076_1-5.jpeg?v=1595532242',
        related: '',
        source: 'CNBC',
        summary:
          '"I think post-Covid, people will be working more at home, which means people will be eating more breakfast" and other meals at home, B&G CEO Ken Romanzi said.',
        url: 'https://www.cnbc.com/2020/08/04/bg-foods-ceo-expects-pantry-demand-to-hold-up-post-pandemic.html',
      },
      {
        category: 'top news',
        datetime: 1596584406,
        headline:
          'Anthony Levandowski gets 18 months in prison for stealing Google self-driving car files',
        id: 5084850,
        image:
          'https://image.cnbcfm.com/api/v1/image/106648265-1596584130509-UBER-LEVANDOWSKI.JPG?v=1596584247',
        related: '',
        source: 'CNBC',
        summary:
          "A U.S. judge on Tuesday sentenced former Google engineer Anthony Levandowski to 18 months in prison for stealing a trade secret from Google related to self-driving cars months before becoming the head of Uber Technologies Inc's rival unit.",
        url: 'https://www.cnbc.com/2020/08/04/anthony-levandowski-gets-18-months-in-prison-for-stealing-google-self-driving-car-files.html',
      },
    ],
  },

  {
    provider: 'finnhub',
    name: 'Quote',
    endpoint: '/quote',
    params: [{ name: 'symbol', required: true, type: 'string' }],
    sampleResponse: {
      c: 189.12,
      h: 191.0,
      l: 187.5,
      o: 188.0,
      pc: 186.9,
    },
  },

  {
    provider: 'finnhub',
    name: 'Basic Financials',
    endpoint: '/stock/metric',
    params: [
      { name: 'symbol', required: true, type: 'string' },
      { name: 'metric', required: false, type: 'string', default: 'all' },
    ],
    sampleResponse: {
      series: {
        annual: {
          currentRatio: [
            {
              period: '2019-09-28',
              v: 1.5401,
            },
            {
              period: '2018-09-29',
              v: 1.1329,
            },
          ],
          salesPerShare: [
            {
              period: '2019-09-28',
              v: 55.9645,
            },
            {
              period: '2018-09-29',
              v: 53.1178,
            },
          ],
          netMargin: [
            {
              period: '2019-09-28',
              v: 0.2124,
            },
            {
              period: '2018-09-29',
              v: 0.2241,
            },
          ],
        },
      },
      metric: {
        '10DayAverageTradingVolume': 32.50147,
        '52WeekHigh': 310.43,
        '52WeekLow': 149.22,
        '52WeekLowDate': '2019-01-14',
        '52WeekPriceReturnDaily': 101.96334,
        beta: 1.2989,
      },
      metricType: 'all',
      symbol: 'AAPL',
    },
  },

  {
    provider: 'finnhub',
    name: 'Company News',
    endpoint: '/company-news',
    params: [
      { name: 'symbol', required: true, type: 'string' },
      { name: 'from', required: true, type: 'date' },
      { name: 'to', required: true, type: 'date' },
    ],
    sampleResponse: [
      {
        category: 'company news',
        datetime: 1569550360,
        headline:
          'More sops needed to boost electronic manufacturing: Top govt official More sops needed to boost electronic manufacturing: Top govt official.  More sops needed to boost electronic manufacturing: Top govt official More sops needed to boost electronic manufacturing: Top govt official',
        id: 25286,
        image:
          'https://img.etimg.com/thumb/msid-71321314,width-1070,height-580,imgsize-481831,overlay-economictimes/photo.jpg',
        related: 'AAPL',
        source: 'The Economic Times India',
        summary:
          'NEW DELHI | CHENNAI: India may have to offer electronic manufacturers additional sops such as cheap credit and incentives for export along with infrastructure support in order to boost production and help the sector compete with China, Vietnam and Thailand, according to a top government official.These incentives, over and above the proposed reduction of corporate tax to 15% for new manufacturing units, are vital for India to successfully attract companies looking to relocate manufacturing facilities.“While the tax announcements made last week send a very good signal, in order to help attract investments, we will need additional initiatives,” the official told ET, pointing out that Indian electronic manufacturers incur 8-10% higher costs compared with other Asian countries.Sops that are similar to the incentives for export under the existing Merchandise Exports from India Scheme (MEIS) are what the industry requires, the person said.MEIS gives tax credit in the range of 2-5%. An interest subvention scheme for cheaper loans and a credit guarantee scheme for plant and machinery are some other possible measures that will help the industry, the official added.“This should be 2.0 (second) version of the electronic manufacturing cluster (EMC) scheme, which is aimed at creating an ecosystem with an anchor company plus its suppliers to operate in the same area,” he said.Last week, finance minister Nirmala Sitharaman announced a series of measures to boost economic growth including a scheme allowing any new manufacturing company incorporated on or after October 1, to pay income tax at 15% provided the company does not avail of any other exemption or incentives.',
        url: 'https://economictimes.indiatimes.com/industry/cons-products/electronics/more-sops-needed-to-boost-electronic-manufacturing-top-govt-official/articleshow/71321308.cms',
      },
      {
        category: 'company news',
        datetime: 1569528720,
        headline:
          'How to disable comments on your YouTube videos in 2 different ways',
        id: 25287,
        image:
          'https://amp.businessinsider.com/images/5d8d16182e22af6ab66c09e9-1536-768.jpg',
        related: 'AAPL',
        source: 'Business Insider',
        summary:
          "You can disable comments on your own YouTube video if you don't want people to comment on it. It's easy to disable comments on YouTube by adjusting the settings for one of your videos in the beta or classic version of YouTube Studio. Visit Business Insider's homepage for more stories . The comments section has a somewhat complicated reputation for creators, especially for those making videos on YouTube . While it can be useful to get the unfiltered opinions of your YouTube viewers and possibly forge a closer connection with them, it can also open you up to quite a bit of negativity. So it makes sense that there may be times when you want to turn off the feature entirely. Just keep in mind that the action itself can spark conversation. If you decide that you don't want to let people leave comments on your YouTube video, here's how to turn off the feature, using either the classic or beta version of the creator studio: How to disable comments on YouTube in YouTube Studio (beta) 1. Go to youtube.com and log into your account, if necessary. 2.",
        url: 'https://www.businessinsider.com/how-to-disable-comments-on-youtube',
      },
      {
        category: 'company news',
        datetime: 1569526180,
        headline:
          'Apple iPhone 11 Pro Teardowns Look Encouraging for STMicro and Sony',
        id: 25341,
        image:
          'http://s.thestreet.com/files/tsc/v2008/photos/contrib/uploads/ba140938-d409-11e9-822b-fda891ce1fc1.png',
        related: 'AAPL',
        source: 'TheStreet',
        summary:
          "STMicroelectronics and Sony each appear to be supplying four chips for Apple's latest flagship iPhones. Many other historical iPhone suppliers also make appearances in the latest teardowns….STM",
        url: 'https://realmoney.thestreet.com/investing/technology/iphone-11-pro-teardowns-look-encouraging-for-stmicro-sony-15105767',
      },
    ],
  },

  {
    provider: 'finnhub',
    name: 'Stock Candles',
    endpoint: '/stock/candle',
    params: [
      { name: 'symbol', required: true, type: 'string' },
      { name: 'resolution', required: true, type: 'string' },
      { name: 'from', required: true, type: 'number' },
      { name: 'to', required: true, type: 'number' },
    ],
    sampleResponse: {
      c: [150.0, 151.0, 152.0],
      h: [152.0, 153.0, 154.0],
      l: [149.0, 150.0, 151.0],
      o: [150.0, 151.0, 152.0],
      s: 'ok',
      t: [1678886400, 1678972800, 1679059200],
      v: [1000000, 2000000, 3000000],
    },
  },
];
