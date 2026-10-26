import { Accelerometer, Gyroscope } from 'expo-sensors';
import { SensorSample } from '../../types';
import { SensorListener, SensorServiceContract } from './SensorServiceContract';

export class ExpoSensorService implements SensorServiceContract {
  private samples: SensorSample[] = [];
  private listeners: Set<SensorListener> = new Set();
  private accelSubscription: { remove: () => void } | null = null;
  private gyroSubscription: { remove: () => void } | null = null;
  private lastAccel = { x: 0, y: 0, z: 0 };
  private lastGyro = { x: 0, y: 0, z: 0 };
  private isCollecting = false;

  async isAvailable(): Promise<boolean> {
    try {
      const [accelAvailable, gyroAvailable] = await Promise.all([
        Accelerometer.isAvailableAsync(),
        Gyroscope.isAvailableAsync(),
      ]);
      return accelAvailable && gyroAvailable;
    } catch {
      return false;
    }
  }

  async startCollection(frequencyHz: number = 60): Promise<void> {
    if (this.isCollecting) return;
    this.samples = [];
    this.isCollecting = true;

    const intervalMs = Math.round(1000 / frequencyHz);
    Accelerometer.setUpdateInterval(intervalMs);
    Gyroscope.setUpdateInterval(intervalMs);

    this.accelSubscription = Accelerometer.addListener((data) => {
      this.lastAccel = { x: data.x, y: data.y, z: data.z };
      this.recordSample();
    });

    this.gyroSubscription = Gyroscope.addListener((data) => {
      this.lastGyro = { x: data.x, y: data.y, z: data.z };
    });
  }

  private recordSample(): void {
    if (!this.isCollecting) return;
    const sample: SensorSample = {
      timestamp: Date.now(),
      accelerationX: this.lastAccel.x,
      accelerationY: this.lastAccel.y,
      accelerationZ: this.lastAccel.z,
      gyroscopeX: this.lastGyro.x,
      gyroscopeY: this.lastGyro.y,
      gyroscopeZ: this.lastGyro.z,
    };
    this.samples.push(sample);
    this.listeners.forEach((listener) => listener(sample));
  }

  async stopCollection(): Promise<SensorSample[]> {
    this.isCollecting = false;
    if (this.accelSubscription) {
      this.accelSubscription.remove();
      this.accelSubscription = null;
    }
    if (this.gyroSubscription) {
      this.gyroSubscription.remove();
      this.gyroSubscription = null;
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
