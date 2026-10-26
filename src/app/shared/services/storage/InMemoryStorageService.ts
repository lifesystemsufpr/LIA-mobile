import { StorageServiceContract } from './StorageServiceContract';

/**
 * In-memory storage implementation.
 * Stores data purely in runtime memory without touching device disk or localStorage.
 */
export class InMemoryStorageService implements StorageServiceContract {
  private store = new Map<string, unknown>();

  async getItem<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    if (value === undefined) return null;
    return value as T;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export const defaultStorageService: StorageServiceContract = new InMemoryStorageService();
