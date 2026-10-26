import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lock, Unlock } from 'lucide-react-native';
import {
  BorderRadius,
  Button,
  Colors,
  ConfirmationDialog,
  ExpoSpeechService,
  Protocol,
  SensorSample,
  Spacing,
  SpeechServiceContract,
  Typography,
} from '../../../shared';
import { useSensorCollection } from '../hooks/useSensorCollection';

export type TestExecutionScreenProps = {
  protocol: Protocol;
  onFinishTest: (repetitions: number, durationSeconds: number, samples: SensorSample[]) => void;
  onRestartTest: () => void;
  onCancelTest: () => void;
};

export const TestExecutionScreen: React.FC<TestExecutionScreenProps> = ({
  protocol,
  onFinishTest,
  onRestartTest,
  onCancelTest,
}) => {
  const duration = protocol.durationSeconds ?? 30;
  const { isCollecting, timeLeftSeconds, repetitions, samples, start, stop, cancel } =
    useSensorCollection();

  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [confirmFinishVisible, setConfirmFinishVisible] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [tapHint, setTapHint] = useState<string | null>(null);

  const hasStartedRef = useRef(false);
  const isTestActiveRef = useRef(false);
  const hasAnnouncedEndRef = useRef(false);
  const speechRef = useRef<SpeechServiceContract>(new ExpoSpeechService());
  const lastTapTimeRef = useRef<number>(0);
  const unlockTimeRef = useRef<number>(0);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      speechRef.current.stop();
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      hasAnnouncedEndRef.current = false;
      isTestActiveRef.current = true;
      setIsTestFinished(false);
      start(duration);
    }
  }, [duration, start]);

  useEffect(() => {
    // Só anuncia e finaliza se o teste tiver de fato iniciado/ativo e o tempo tiver zerado
    if (isTestActiveRef.current && timeLeftSeconds <= 0 && !hasAnnouncedEndRef.current) {
      hasAnnouncedEndRef.current = true;
      isTestActiveRef.current = false;
      setIsTestFinished(true);
      setIsLocked(false);
      speechRef.current.speak('Contagem encerrada');
    }
  }, [timeLeftSeconds]);

  const handleLockPress = () => {
    const now = Date.now();

    if (!isLocked) {
      if (now - unlockTimeRef.current < 600) {
        return;
      }
      setIsLocked(true);
      setTapHint(null);
      return;
    }

    const timeSinceLastTap = now - lastTapTimeRef.current;

    if (timeSinceLastTap > 0 && timeSinceLastTap <= 600) {
      lastTapTimeRef.current = 0;
      unlockTimeRef.current = now;
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      setIsLocked(false);
      setTapHint(null);
    } else {
      lastTapTimeRef.current = now;
      setTapHint('Pressione mais 1 vez para liberar!');
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setTapHint(null);
        lastTapTimeRef.current = 0;
      }, 1000);
    }
  };

  const handleBlockedAreaPress = () => {
    setTapHint('Pressione 2x seguidas no cadeado!');
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
    hintTimeoutRef.current = setTimeout(() => {
      setTapHint(null);
    }, 1500);
  };

  const handleFinish = () => {
    setConfirmFinishVisible(true);
  };

  const handleConfirmFinish = async () => {
    setConfirmFinishVisible(false);
    const collectedSamples = await stop();
    onFinishTest(repetitions, duration, collectedSamples);
  };

  const handleRestart = async () => {
    speechRef.current.stop();
    hasAnnouncedEndRef.current = false;
    isTestActiveRef.current = false;
    hasStartedRef.current = false;
    setIsTestFinished(false);
    await cancel();
    setIsLocked(true);
    setTapHint(null);
    onRestartTest();
  };

  const handleConfirmCancel = async () => {
    speechRef.current.stop();
    hasAnnouncedEndRef.current = false;
    isTestActiveRef.current = false;
    hasStartedRef.current = false;
    setIsTestFinished(false);
    setConfirmCancelVisible(false);
    await cancel();
    onCancelTest();
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeftSeconds / duration) * 100));

  return (
    <View style={styles.container}>
      {/* Top Status Header */}
      <View style={styles.topRow}>
        <View style={styles.protocolBadge}>
          <Text style={styles.protocolBadgeText}>{protocol.shortName}</Text>
        </View>

        <View style={styles.runningBadge}>
          <View style={[styles.pulseDot, isTestFinished && styles.pulseDotFinished]} />
          <Text style={[styles.runningBadgeText, isTestFinished && styles.runningBadgeTextFinished]}>
            {isTestFinished ? 'Finalizado' : 'Em execução'}
          </Text>
        </View>
      </View>

      {/* Timer Section (Focused and Clean) */}
      <View style={styles.centerContainer}>
        <Text style={styles.timerLabel}>TEMPO RESTANTE</Text>
        <Text style={styles.timerValue}>
          {timeLeftSeconds}
          <Text style={styles.timerUnit}>s</Text>
        </Text>

        {/* Visual Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercent}%` },
              isTestFinished && styles.progressBarFinished,
            ]}
          />
        </View>

        <Text style={styles.helperText}>
          {isTestFinished
            ? 'Avaliação concluída! Toque abaixo para prosseguir.'
            : 'Mantenha os movimentos contínuos até o término do tempo.'}
        </Text>
      </View>

      {/* Bottom Controls with Padlock */}
      <View style={styles.bottomSection}>
        {!isTestFinished && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLockPress}
            style={[
              styles.lockBanner,
              isLocked ? styles.lockBannerLocked : styles.lockBannerUnlocked,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isLocked
                ? 'Tela bloqueada. Pressione duas vezes para liberar.'
                : 'Tela desbloqueada. Toque para bloquear.'
            }
          >
            <View
              style={[
                styles.lockIconCircle,
                isLocked ? styles.lockIconCircleLocked : styles.lockIconCircleUnlocked,
                tapHint && isLocked && styles.lockIconCircleActive,
              ]}
            >
              {isLocked ? (
                <Lock size={18} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <Unlock size={18} color="#22C55E" strokeWidth={2.5} />
              )}
            </View>
            <View style={styles.lockTextContainer}>
              <Text
                style={[
                  styles.lockTitle,
                  isLocked ? styles.lockTitleLocked : styles.lockTitleUnlocked,
                ]}
              >
                {isLocked ? 'Interação Bloqueada' : 'Interação Liberada'}
              </Text>
              <Text style={styles.lockSubtitle}>
                {isLocked
                  ? tapHint ?? 'Pressione 2x seguidas no cadeado para liberar'
                  : 'Toque para bloquear novamente'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <View
            style={[
              styles.actionsRow,
              isLocked && !isTestFinished && styles.actionsRowLocked,
            ]}
            pointerEvents={isLocked && !isTestFinished ? 'none' : 'auto'}
          >
            {isTestFinished ? (
              <>
                <Button
                  title="Finalizar"
                  variant="primary"
                  size="lg"
                  onPress={handleFinish}
                  style={styles.actionBtn}
                />
                <Button
                  title="Cancelar"
                  variant="danger"
                  size="lg"
                  onPress={() => setConfirmCancelVisible(true)}
                  style={styles.actionBtn}
                />
              </>
            ) : (
              <>
                <Button
                  title="Reiniciar"
                  variant="outline"
                  size="lg"
                  onPress={handleRestart}
                  style={styles.actionBtn}
                />
                <Button
                  title="Cancelar"
                  variant="danger"
                  size="lg"
                  onPress={() => setConfirmCancelVisible(true)}
                  style={styles.actionBtn}
                />
              </>
            )}
          </View>

          {/* Touch interceptor to give feedback when user taps buttons while locked */}
          {isLocked && !isTestFinished && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleBlockedAreaPress}
              style={styles.lockedActionsOverlay}
            />
          )}
        </View>
      </View>

      {/* Finish Confirmation Dialog */}
      <ConfirmationDialog
        visible={confirmFinishVisible}
        title="Finalizar Avaliação?"
        message="Deseja concluir o teste e avançar para o resumo dos resultados?"
        confirmLabel="Sim, finalizar"
        cancelLabel="Voltar"
        onConfirm={handleConfirmFinish}
        onCancel={() => setConfirmFinishVisible(false)}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        visible={confirmCancelVisible}
        title="Cancelar Avaliação?"
        message="Deseja realmente cancelar este teste? Os dados coletados até agora serão descartados."
        confirmLabel="Sim, cancelar"
        cancelLabel="Voltar"
        isDanger
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmCancelVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  protocolBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  protocolBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  runningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  pulseDotFinished: {
    backgroundColor: Colors.secondary,
  },
  runningBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
  },
  runningBadgeTextFinished: {
    color: Colors.secondary,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  timerLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'rgba(147, 197, 253, 0.6)',
    letterSpacing: 2,
    marginBottom: 6,
  },
  timerValue: {
    fontSize: 96,
    fontWeight: Typography.weights.black,
    color: Colors.surface,
    marginBottom: Spacing.lg,
    letterSpacing: -2,
  },
  timerUnit: {
    fontSize: 32,
    color: 'rgba(147, 197, 253, 0.4)',
  },
  progressTrack: {
    width: 220,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressBarFinished: {
    backgroundColor: Colors.success,
  },
  helperText: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(147, 197, 253, 0.7)',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  bottomSection: {
    gap: Spacing.md,
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  lockBannerLocked: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  lockBannerUnlocked: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  lockIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lockIconCircleLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  lockIconCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: '#93C5FD',
    borderWidth: 1.5,
  },
  lockIconCircleUnlocked: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  lockTextContainer: {
    flex: 1,
  },
  lockTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  lockTitleLocked: {
    color: '#FFFFFF',
  },
  lockTitleUnlocked: {
    color: '#86EFAC',
  },
  lockSubtitle: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(147, 197, 253, 0.8)',
    marginTop: 2,
  },
  actionsContainer: {
    position: 'relative',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionsRowLocked: {
    opacity: 0.3,
  },
  lockedActionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionBtn: {
    flex: 1,
  },
});
