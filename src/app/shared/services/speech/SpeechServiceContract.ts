export type SpeechOptions = {
  rate?: number;
  pitch?: number;
  language?: string;
  voice?: string;
  onDone?: () => void;
  onError?: () => void;
};

export type SpeechServiceContract = {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
  getAvailableVoices?(): Promise<Array<{ identifier: string; name: string; language: string; quality?: string }>>;
};
