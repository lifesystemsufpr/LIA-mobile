import { SensorSample } from '../../types';

export type SensorListener = (sample: SensorSample) => void;

export type SensorServiceContract = {
  isAvailable(): Promise<boolean>;
  startCollection(frequencyHz?: number): Promise<void>;
  stopCollection(): Promise<SensorSample[]>;
  subscribe(listener: SensorListener): () => void;
  getSamples(): SensorSample[];
};
