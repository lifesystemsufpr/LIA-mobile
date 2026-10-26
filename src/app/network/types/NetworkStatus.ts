export type NetworkConnectionState = 'online' | 'offline' | 'unknown';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  state: NetworkConnectionState;
};
