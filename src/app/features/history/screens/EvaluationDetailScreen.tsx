import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CloudCheck, CloudOff, CloudUpload } from 'lucide-react-native';
import {
  Assessment,
  BorderRadius,
  Button,
  Colors,
  formatDateTimeBR,
  getInitials,
  Participant,
  Spacing,
  TopAppBar,
  Typography,
} from '../../../shared';

export type EvaluationDetailScreenProps = {
  assessment: Assessment;
  participant?: Participant | null;
  professionalName?: string;
  onBack?: () => void;
  onSyncNow?: (assessment: Assessment) => void;
};

export const EvaluationDetailScreen: React.FC<EvaluationDetailScreenProps> = ({
  assessment,
  participant,
  professionalName = 'Dr. Roberto Silva',
  onBack,
  onSyncNow,
}) => {
  const isSynced = assessment.syncStatus === 'synced';
  const participantName = participant?.fullName ?? 'Manuela Silva';
  const initials = getInitials(participantName);

  return (
    <View style={styles.container}>
      <TopAppBar title="Detalhes da Avaliação" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={[styles.statusCard, isSynced ? styles.statusSynced : styles.statusPending]}>
          <View style={[styles.statusIcon, isSynced ? styles.statusIconSynced : styles.statusIconPending]}>
            {isSynced ? (
              <CloudCheck size={24} color={Colors.success} />
            ) : (
              <CloudOff size={24} color="#D97706" />
            )}
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, isSynced ? styles.textSynced : styles.textPending]}>
              {isSynced ? 'Sincronizado' : 'Pendente de Sincronização'}
            </Text>
            <Text style={[styles.statusDesc, isSynced ? styles.descSynced : styles.descPending]}>
              {isSynced
                ? 'Os dados foram enviados para a LIA Web.'
                : 'Os dados estão salvos localmente neste dispositivo.'}
            </Text>
          </View>
        </View>

        {/* Main Test Header */}
        <View style={styles.testHeader}>
          <Text style={styles.testProtocol}>{assessment.protocolId}</Text>
          <Text style={styles.testDate}>
            Realizado em {formatDateTimeBR(assessment.createdAt)}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Participante</Text>
            <View style={styles.participantRow}>
              <View style={styles.participantAvatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.participantName}>{participantName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Profissional Responsável</Text>
            <Text style={styles.detailValue}>{professionalName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Resultado Obtido</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultValue}>
                {assessment.repetitions ?? assessment.resultValue ?? assessment.durationSeconds}
              </Text>
              <Text style={styles.resultUnit}>
                {assessment.resultUnit ?? (assessment.repetitions ? 'repetições' : 'segundos')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {assessment.protocolId === 'IVCF-20' ? 'Classificação Clínica' : 'Sensores Inerciais'}
            </Text>
            <Text style={styles.detailValue}>
              {assessment.protocolId === 'IVCF-20'
                ? (assessment.notes ?? 'Questionário Clínico-Funcional (20 questões)')
                : `Acelerômetro + Giroscópio (60 Hz) \u2022 ${assessment.sampleCount ?? 1800} amostras`}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!isSynced && onSyncNow && (
            <Button
              title="Sincronizar Agora"
              variant="primary"
              icon={<CloudUpload size={18} color="#FFFFFF" />}
              onPress={() => onSyncNow(assessment)}
              style={styles.syncBtn}
            />
          )}
          {onBack && (
            <Button
              title="Voltar"
              variant="outline"
              onPress={onBack}
              style={styles.backBtn}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  statusSynced: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  statusIconSynced: {
    backgroundColor: '#BBF7D0',
  },
  statusIconPending: {
    backgroundColor: '#FDE68A',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  textSynced: {
    color: Colors.success,
  },
  textPending: {
    color: '#D97706',
  },
  statusDesc: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  descSynced: {
    color: '#166534',
  },
  descPending: {
    color: '#92400E',
  },
  testHeader: {
    marginBottom: Spacing.lg,
  },
  testProtocol: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: 4,
  },
  testDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  card: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: Typography.sizes.md,
    color: Colors.textMain,
    fontWeight: Typography.weights.semibold,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  participantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(41, 98, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  participantName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  resultValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  resultUnit: {
    fontSize: Typography.sizes.md,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
  },
  syncBtn: {
    marginBottom: Spacing.xs,
  },
  backBtn: {
    width: '100%',
  },
});
