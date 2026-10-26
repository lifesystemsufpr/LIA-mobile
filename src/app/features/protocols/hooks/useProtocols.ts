import { useMemo } from 'react';
import { Protocol, ProtocolId } from '../../../shared';
import { defaultProtocolsRepository } from '../services/ProtocolsRepository';

export function useProtocols() {
  const protocols = useMemo(() => defaultProtocolsRepository.getAll(), []);

  const getProtocol = (id: ProtocolId): Protocol | null => {
    return defaultProtocolsRepository.getById(id);
  };

  return {
    protocols,
    getProtocol,
  };
}
