export type NetworkConfig = {
  baseUrl: string;
  defaultTimeoutMs: number;
  defaultHeaders: Record<string, string>;
  maxRetryAttempts: number;
};

export const defaultNetworkConfig: NetworkConfig = {
  baseUrl: '',
  defaultTimeoutMs: 15000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  maxRetryAttempts: 3,
};
