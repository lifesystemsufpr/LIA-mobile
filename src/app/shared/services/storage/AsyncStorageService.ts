import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageServiceContract } from './StorageServiceContract';

export class AsyncStorageService implements StorageServiceContract {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      // Handle or rethrow domain storage error if needed
      throw new Error(`Falha ao persistir chave ${key}: ${(error as Error).message}`);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore or log error silently
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
      // Ignore
    }
  }
}
