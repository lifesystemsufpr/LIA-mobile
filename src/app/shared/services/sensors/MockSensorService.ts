import { SensorSample } from '../../types';
import { SensorListener, SensorServiceContract } from './SensorServiceContract';

export class MockSensorService implements SensorServiceContract {
  private samples: SensorSample[] = [];
  private listeners: Set<SensorListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isCollecting = false;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async startCollection(frequencyHz: number = 60): Promise<void> {
    if (this.isCollecting) return;
    this.samples = [];
    this.isCollecting = true;

    const intervalMs = Math.round(1000 / frequencyHz);
    let step = 0;

    this.intervalId = setInterval(() => {
      if (!this.isCollecting) return;
      step++;
      const timeSec = step * (intervalMs / 1000);
      // Simulate periodic sit-to-stand motion wave
      const wave = Math.sin(timeSec * 2);
      const sample: SensorSample = {
        timestamp: Date.now(),
        accelerationX: Number((0.05 * Math.sin(timeSec * 4)).toFixed(3)),
        accelerationY: Number((0.98 + 0.3 * wave).toFixed(3)),
        accelerationZ: Number((0.15 * Math.cos(timeSec * 2)).toFixed(3)),
        gyroscopeX: Number((0.2 * wave).toFixed(3)),
        gyroscopeY: 0.01,
        gyroscopeZ: 0.02,
      };

      this.samples.push(sample);
      this.listeners.forEach((listener) => listener(sample));
    }, intervalMs);
  }

  async stopCollection(): Promise<SensorSample[]> {
    this.isCollecting = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    return [...this.samples];
  }

  subscribe(listener: SensorListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSamples(): SensorSample[] {
    return [...this.samples];
  }
}
