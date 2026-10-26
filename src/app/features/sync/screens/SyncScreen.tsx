import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Check, CloudUpload, Home, Play } from 'lucide-react-native';
import { Assessment, BorderRadius, Button, Colors, Spacing, Typography } from '../../../shared';
import { defaultLiaSyncAdapter } from '../services/LiaSyncAdapter';

export type SyncScreenProps = {
  assessment?: Assessment | null;
  onFinishSync: () => void;
  onNewTest: () => void;
};

export const SyncScreen: React.FC<SyncScreenProps> = ({
  assessment,
  onFinishSync,
  onNewTest,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    // Step progression simulation
    const t1 = setTimeout(() => setStep(2), 700);
    const t2 = setTimeout(() => setStep(3), 1500);
    const t3 = setTimeout(async () => {
      if (assessment) {
        await defaultLiaSyncAdapter.uploadAssessment(assessment);
      }
      setStep(4);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [assessment]);

  const isCompleted = step === 4;

  return (
    <View style={styles.container}>
      {/* Central Icon */}
      <View style={styles.iconContainer}>
        {isCompleted ? (
          <View style={styles.successIconBadge}>
            <Check size={48} color={Colors.success} />
          </View>
        ) : (
          <View style={styles.spinnerWrapper}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <CloudUpload size={28} color={Colors.primaryDark} style={styles.cloudIcon} />
          </View>
        )}
      </View>

      <Text style={styles.title}>
        {isCompleted ? 'Sincronização Concluída' : 'Sincronizando avaliação'}
      </Text>
      <Text style={styles.subtitle}>
        {isCompleted
          ? 'Os dados já estão disponíveis na LIA Web.'
          : 'Aguarde enquanto os dados são enviados...'}
      </Text>

      {/* Steps List */}
      <View style={styles.stepsList}>
        {/* Step 1 */}
        <View style={styles.stepRow}>
          <View style={styles.checkBadge}>
            <Check size={14} color={Colors.success} />
          </View>
          <Text style={styles.stepTextDone}>Dados coletados</Text>
        </View>

        {/* Step 2 */}
        <View style={styles.stepRow}>
          <View style={[styles.checkBadge, step < 2 && styles.badgePending]}>
            {step >= 2 ? (
              <Check size={14} color={Colors.success} />
            ) : (
              <ActivityIndicator size="small" color={Colors.primary} />
            )}
          </View>
          <Text style={step >= 2 ? styles.stepTextDone : styles.stepTextActive}>
            Arquivos organizados
          </Text>
        </View>

        {/* Step 3 */}
        <View style={styles.stepRow}>
          <View style={[styles.checkBadge, step < 4 && styles.badgePending]}>
            {isCompleted ? (
              <Check size={14} color={Colors.success} />
            ) : (
              <ActivityIndicator size="small" color={Colors.primary} />
            )}
          </View>
          <Text style={isCompleted ? styles.stepTextDone : styles.stepTextActive}>
            {isCompleted ? 'Sincronizado com sucesso' : 'Sincronizando na nuvem...'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {isCompleted && (
        <View style={styles.actionsContainer}>
          <Button
            title="Novo Teste"
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play size={18} color="#FFFFFF" />}
            onPress={onNewTest}
            style={styles.newTestBtn}
          />
          <Button
            title="Voltar ao Início"
            variant="outline"
            size="lg"
            fullWidth
            icon={<Home size={18} color={Colors.primaryDark} />}
            onPress={onFinishSync}
            style={styles.homeBtn}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  spinnerWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudIcon: {
    position: 'absolute',
  },
  successIconBadge: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  stepsList: {
    width: '100%',
    maxWidth: 280,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePending: {
    backgroundColor: '#EEF4FF',
  },
  stepTextDone: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.success,
  },
  stepTextActive: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  actionsContainer: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  newTestBtn: {
    width: '100%',
    borderRadius: 14,
  },
  homeBtn: {
    width: '100%',
    borderRadius: 14,
  },
});
