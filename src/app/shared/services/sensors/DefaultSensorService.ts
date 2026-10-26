import { SensorSample } from '../../types';
import { ExpoSensorService } from './ExpoSensorService';
import { MockSensorService } from './MockSensorService';
import { SensorListener, SensorServiceContract } from './SensorServiceContract';

export class DefaultSensorService implements SensorServiceContract {
  private activeService: SensorServiceContract | null = null;
  private expoService = new ExpoSensorService();
  private mockService = new MockSensorService();
  private isCollecting = false;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async startCollection(frequencyHz: number = 60): Promise<void> {
    // Se a leitura já estiver em andamento (iniciada na contagem), mantém a coleta contínua
    if (this.isCollecting && this.activeService) {
      return;
    }

    try {
      const isRealAvailable = await this.expoService.isAvailable();
      if (isRealAvailable) {
        this.activeService = this.expoService;
      } else {
        this.activeService = this.mockService;
      }
    } catch {
      this.activeService = this.mockService;
    }

    this.isCollecting = true;
    await this.activeService.startCollection(frequencyHz);
  }

  async stopCollection(): Promise<SensorSample[]> {
    this.isCollecting = false;
    if (this.activeService) {
      const samples = await this.activeService.stopCollection();
      return samples;
    }
    return [];
  }

  subscribe(listener: SensorListener): () => void {
    if (this.activeService) {
      return this.activeService.subscribe(listener);
    }
    const unsubExpo = this.expoService.subscribe(listener);
    const unsubMock = this.mockService.subscribe(listener);
    return () => {
      unsubExpo();
      unsubMock();
    };
  }

  getSamples(): SensorSample[] {
    return this.activeService ? this.activeService.getSamples() : [];
  }

  getIsCollecting(): boolean {
    return this.isCollecting;
  }
}

export const defaultSensorService = new DefaultSensorService();
