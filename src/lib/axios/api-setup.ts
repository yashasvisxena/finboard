import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const MAX_REQUESTS_PER_SECOND = 30;
const INTERVAL = 1000;

let queue: {
  resolve: (value: InternalAxiosRequestConfig) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

let requestsThisInterval = 0;

setInterval(() => {
  requestsThisInterval = 0;

  while (queue.length && requestsThisInterval < MAX_REQUESTS_PER_SECOND) {
    const item = queue.shift();
    if (!item) break;

    requestsThisInterval++;
    item.resolve(item.config);
  }
}, INTERVAL);

export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return new Promise((resolve) => {
      if (requestsThisInterval < MAX_REQUESTS_PER_SECOND) {
        requestsThisInterval++;
        resolve(config);
      } else {
        queue.push({ resolve, config });
      }
    });
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const response = error.response;
      const config = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (response?.status === 429 && !config._retry) {
        config._retry = true;

        const retryAfter = Number(response.headers?.['retry-after']) || 2;

        console.warn(`Too many requests. Retrying after ${retryAfter}s`);

        await new Promise((res) => setTimeout(res, retryAfter * 1000));

        return client(config);
      }

      return Promise.reject(error);
    }
  );

  return client;
};
