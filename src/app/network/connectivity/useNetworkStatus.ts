import { useEffect, useState } from 'react';
import { NetworkStatus } from '../types';
import { defaultNetworkStatusService, NetworkStatusService } from './NetworkStatusService';

export function useNetworkStatus(
  service: NetworkStatusService = defaultNetworkStatusService
): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(service.getStatus());

  useEffect(() => {
    return service.subscribe((newStatus) => {
      setStatus(newStatus);
    });
  }, [service]);

  return status;
}
