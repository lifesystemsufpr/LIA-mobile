import { create } from 'zustand';
import { SensorSample } from '../../../shared';

export type MovementPhase = 'Aguardando...' | 'Levantando...' | 'Em pé' | 'Sentando...' | 'Sentado' | 'Concluído';

export type SensorCollectionState = {
  isCollecting: boolean;
  timeLeftSeconds: number;
  repetitions: number;
  currentPhase: MovementPhase;
  samples: SensorSample[];
  startCountdown: (durationSeconds?: number) => void;
  startExecution: (durationSeconds: number) => void;
  startCollection: (durationSeconds: number) => void;
  updateTimeLeft: (time: number) => void;
  incrementRepetition: () => void;
  setPhase: (phase: MovementPhase) => void;
  addSample: (sample: SensorSample) => void;
  reset: () => void;
  finish: (collectedSamples?: SensorSample[]) => void;
};

export const useSensorCollectionStore = create<SensorCollectionState>((set) => ({
  isCollecting: false,
  timeLeftSeconds: 30,
  repetitions: 0,
  currentPhase: 'Aguardando...',
  samples: [],

  startCountdown: (durationSeconds = 30) =>
    set({
      isCollecting: true,
      timeLeftSeconds: durationSeconds,
      currentPhase: 'Aguardando...',
      samples: [],
    }),

  startExecution: (durationSeconds) =>
    set({
      isCollecting: true,
      timeLeftSeconds: durationSeconds,
      repetitions: 0,
      currentPhase: 'Aguardando...',
    }),

  startCollection: (durationSeconds) =>
    set({
      isCollecting: true,
      timeLeftSeconds: durationSeconds,
      repetitions: 0,
      currentPhase: 'Aguardando...',
      samples: [],
    }),

  updateTimeLeft: (timeLeftSeconds) => set({ timeLeftSeconds }),

  incrementRepetition: () =>
    set((state) => ({ repetitions: state.repetitions + 1 })),

  setPhase: (currentPhase) => set({ currentPhase }),

  addSample: (sample) =>
    set((state) => ({ samples: [...state.samples, sample] })),

  reset: () =>
    set({
      isCollecting: false,
      timeLeftSeconds: 30,
      repetitions: 0,
      currentPhase: 'Aguardando...',
      samples: [],
    }),

  finish: (collectedSamples) =>
    set((state) => ({
      isCollecting: false,
      currentPhase: 'Concluído',
      samples: collectedSamples ?? state.samples,
    })),
}));
