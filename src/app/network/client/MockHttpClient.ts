import { RequestOptions } from '../types';
import { HttpClient } from './HttpClient';

export class MockHttpClient implements HttpClient {
  private mockResponses: Map<string, unknown> = new Map();
  public delayMs: number = 200;

  setMockResponse<T>(path: string, response: T): void {
    this.mockResponses.set(path, response);
  }

  async get<T>(path: string, _options?: RequestOptions): Promise<T> {
    await this.simulateDelay();
    return (this.mockResponses.get(path) ?? { success: true }) as T;
  }

  async post<T, B = unknown>(path: string, _body?: B, _options?: RequestOptions<B>): Promise<T> {
    await this.simulateDelay();
    return (this.mockResponses.get(path) ?? { success: true }) as T;
  }

  async put<T, B = unknown>(path: string, _body?: B, _options?: RequestOptions<B>): Promise<T> {
    await this.simulateDelay();
    return (this.mockResponses.get(path) ?? { success: true }) as T;
  }

  async patch<T, B = unknown>(path: string, _body?: B, _options?: RequestOptions<B>): Promise<T> {
    await this.simulateDelay();
    return (this.mockResponses.get(path) ?? { success: true }) as T;
  }

  async delete<T>(path: string, _options?: RequestOptions): Promise<T> {
    await this.simulateDelay();
    return (this.mockResponses.get(path) ?? { success: true }) as T;
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }
}
