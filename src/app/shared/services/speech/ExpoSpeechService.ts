import * as Speech from 'expo-speech';
import { SpeechOptions, SpeechServiceContract } from './SpeechServiceContract';

export class ExpoSpeechService implements SpeechServiceContract {
  async speak(text: string, options?: SpeechOptions): Promise<void> {
    try {
      await Speech.stop();
      const speechOptions: Speech.SpeechOptions = {
        language: options?.language ?? 'pt-BR',
        pitch: options?.pitch ?? 1.0,
        rate: options?.rate ?? 0.95,
        voice: options?.voice ?? 'pt-br-x-pte-local',
        onDone: options?.onDone,
        onError: options?.onError,
      };
      Speech.speak(text, speechOptions);
    } catch {
      if (options?.onError) {
        options.onError();
      }
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch {
      // Ignore
    }
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch {
      return [];
    }
  }
}

export const defaultSpeechService = new ExpoSpeechService();
