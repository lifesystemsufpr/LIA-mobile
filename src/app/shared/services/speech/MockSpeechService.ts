import { SpeechOptions, SpeechServiceContract } from './SpeechServiceContract';

export class MockSpeechService implements SpeechServiceContract {
  private speaking = false;

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    this.speaking = true;
    setTimeout(() => {
      this.speaking = false;
      if (options?.onDone) {
        options.onDone();
      }
    }, 500);
  }

  async stop(): Promise<void> {
    this.speaking = false;
  }

  async isSpeaking(): Promise<boolean> {
    return this.speaking;
  }
}
