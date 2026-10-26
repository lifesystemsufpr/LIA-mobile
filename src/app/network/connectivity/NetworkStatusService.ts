import { NetworkStatus } from '../types';

export type NetworkStatusListener = (status: NetworkStatus) => void;

export class NetworkStatusService {
  private currentStatus: NetworkStatus = {
    isConnected: true,
    isInternetReachable: true,
    state: 'online',
  };
  private listeners: Set<NetworkStatusListener> = new Set();

  getStatus(): NetworkStatus {
    return { ...this.currentStatus };
  }

  setStatus(status: Partial<NetworkStatus>): void {
    this.currentStatus = {
      ...this.currentStatus,
      ...status,
      state: status.isConnected === false ? 'offline' : 'online',
    };
    this.notify();
  }

  subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const status = this.getStatus();
    this.listeners.forEach((listener) => listener(status));
  }
}

export const defaultNetworkStatusService = new NetworkStatusService();
