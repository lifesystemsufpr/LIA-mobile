import { useCallback, useEffect, useRef } from 'react';
import { defaultSensorService, SensorServiceContract } from '../../../shared';
import { useSensorCollectionStore } from '../store/sensorCollectionStore';

export function useSensorCollection(sensorService?: SensorServiceContract) {
  const isCollecting = useSensorCollectionStore((state) => state.isCollecting);
  const timeLeftSeconds = useSensorCollectionStore((state) => state.timeLeftSeconds);
  const repetitions = useSensorCollectionStore((state) => state.repetitions);
  const currentPhase = useSensorCollectionStore((state) => state.currentPhase);
  const samples = useSensorCollectionStore((state) => state.samples);

  const serviceRef = useRef<SensorServiceContract>(
    sensorService ?? defaultSensorService
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(async (durationSeconds: number = 30) => {
    useSensorCollectionStore.getState().startCountdown(durationSeconds);
    await serviceRef.current.startCollection(60);
  }, []);

  const stop = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const collectedSamples = await serviceRef.current.stopCollection();
      useSensorCollectionStore.getState().finish(collectedSamples);
      return collectedSamples;
    } catch {
      useSensorCollectionStore.getState().finish([]);
      return [];
    }
  }, []);

  const cancel = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await serviceRef.current.stopCollection();
    } catch {
      // Ignore
    }
    useSensorCollectionStore.getState().reset();
  }, []);

  const start = useCallback(
    async (durationSeconds: number = 30) => {
      // Clear any running interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Inicia a execução preservando as amostras já lidas durante a contagem regressiva
      useSensorCollectionStore.getState().startExecution(durationSeconds);
      await serviceRef.current.startCollection(60);

      let currentSec = durationSeconds;
      timerRef.current = setInterval(() => {
        currentSec--;
        useSensorCollectionStore.getState().updateTimeLeft(currentSec);

        if (currentSec <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          stop();
        }
      }, 1000);
    },
    [stop]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    isCollecting,
    timeLeftSeconds,
    repetitions,
    currentPhase,
    samples,
    startCountdown,
    start,
    stop,
    cancel,
  };
}
