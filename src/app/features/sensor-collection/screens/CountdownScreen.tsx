import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, ExpoSpeechService, Protocol, SpeechServiceContract, Typography } from '../../../shared';
import { useSensorCollection } from '../hooks/useSensorCollection';

export type CountdownScreenProps = {
  protocol?: Protocol;
  onFinishCountdown: () => void;
  speechService?: SpeechServiceContract;
};

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  protocol,
  onFinishCountdown,
  speechService,
}) => {
  const duration = protocol?.durationSeconds ?? 30;
  const { startCountdown, cancel } = useSensorCollection();
  const [displayText, setDisplayText] = useState<string>('5');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const speechRef = useRef<SpeechServiceContract>(speechService ?? new ExpoSpeechService());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTriggeredRef = useRef<boolean>(false);
  const hasStartedCountdownRef = useRef<boolean>(false);
  const onFinishRef = useRef(onFinishCountdown);

  useEffect(() => {
    onFinishRef.current = onFinishCountdown;
  }, [onFinishCountdown]);

  const handleFinish = () => {
    if (finishTriggeredRef.current) return;
    finishTriggeredRef.current = true;
    onFinishRef.current();
  };

  useEffect(() => {
    let current = 5;

    const startNumericCountdown = () => {
      if (hasStartedCountdownRef.current) return;
      hasStartedCountdownRef.current = true;

      // Inicia a execução dos sensores no momento em que a contagem de 5 segundos começa
      startCountdown(duration);
      setIsCounting(true);

      speechRef.current.speak(String(current));

      timerRef.current = setInterval(() => {
        current--;
        if (current > 0) {
          setDisplayText(String(current));
          speechRef.current.speak(String(current));
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // Display 'Já!' on screen simultaneously as it is spoken
          setDisplayText('Já!');
          setIsStarted(true);

          speechRef.current.speak('Já!', {
            onDone: () => {
              setTimeout(handleFinish, 350);
            },
            onError: () => {
              setTimeout(handleFinish, 350);
            },
          });

          // Fallback timeout in case onDone doesn't fire
          fallbackTimeoutRef.current = setTimeout(handleFinish, 850);
        }
      }, 1000);
    };

    // Start with speech prompt, then start the 5-second countdown and sensors
    speechRef.current.speak(
      'Cinco segundos para iniciar o teste, faça os ajustes necessários',
      {
        onDone: () => {
          startNumericCountdown();
        },
        onError: () => {
          startNumericCountdown();
        },
      }
    );

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      speechRef.current.stop();
      if (!finishTriggeredRef.current) {
        cancel();
      }
    };
  }, [startCountdown, cancel]);

  const currentNumber = Number(displayText);
  const progressPercent = isStarted
    ? 100
    : isNaN(currentNumber)
      ? 0
      : (currentNumber / 5) * 100;

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, isStarted && styles.subtitleStarted]}>
        {isStarted ? 'COMECE O TESTE!' : 'PREPARE-SE'}
      </Text>
      <Text style={[styles.countdownNumber, isStarted && styles.countdownJa]}>
        {displayText}
      </Text>

      {/* Progress Bar */}
      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            { width: `${progressPercent}%` },
            isStarted && styles.barStarted,
          ]}
        />
      </View>

      {/* Sensor Active Indicator */}
      <View style={styles.sensorStatusBadge}>
        <View style={[styles.sensorDot, isCounting && styles.sensorDotActive]} />
        <Text style={styles.sensorStatusText}>
          {isCounting ? 'Sensores ativos e gravando' : 'Aguardando início da contagem...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sensorStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sensorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(147, 197, 253, 0.4)',
  },
  sensorDotActive: {
    backgroundColor: Colors.success,
  },
  sensorStatusText: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(147, 197, 253, 0.8)',
    fontWeight: Typography.weights.medium,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: 'rgba(147, 197, 253, 0.7)',
    letterSpacing: 4,
    marginBottom: 40,
  },
  subtitleStarted: {
    color: '#86EFAC',
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: Typography.weights.black,
    color: Colors.surface,
    marginBottom: 40,
  },
  countdownJa: {
    fontSize: 104,
    color: Colors.success,
  },
  track: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(92, 141, 255, 0.2)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  barStarted: {
    backgroundColor: Colors.success,
  },
});
