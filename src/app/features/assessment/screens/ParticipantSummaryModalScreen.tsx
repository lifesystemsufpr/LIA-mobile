import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import {
  BorderRadius,
  Button,
  calculateAge,
  Colors,
  formatCPF,
  formatDateBR,
  getInitials,
  Participant,
  Spacing,
  Typography,
} from '../../../shared';

export type ParticipantSummaryModalScreenProps = {
  participant: Participant;
  lastAssessmentDate?: string;
  onContinue: () => void;
  onCancel: () => void;
};

export const ParticipantSummaryModalScreen: React.FC<ParticipantSummaryModalScreenProps> = ({
  participant,
  lastAssessmentDate = '12/08/2025',
  onContinue,
  onCancel,
}) => {
  const age = calculateAge(participant.birthDate);
  const initials = getInitials(participant.fullName);
  const formattedCpf = formatCPF(participant.cpf);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.dragHandle} />

        <Text style={styles.title}>Resumo do Participante</Text>

        {/* Profile Card */}
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.participantName}>{participant.fullName}</Text>

          <View style={styles.dataList}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>CPF</Text>
              <Text style={styles.dataValue}>{formattedCpf}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>NASCIMENTO</Text>
              <Text style={styles.dataValue}>
                {formatDateBR(participant.birthDate)} ({age} anos)
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ÚLTIMA AVALIAÇÃO</Text>
              <Text style={styles.dataValueHighlight}>{lastAssessmentDate}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Cancelar"
            variant="outline"
            size="lg"
            onPress={onCancel}
            style={styles.actionBtn}
          />
          <Button
            title="Continuar"
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            iconPosition="right"
            onPress={onContinue}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    marginBottom: Spacing.lg,
  },
  profileBox: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  participantName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.lg,
  },
  dataList: {
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dataLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
  },
  dataValueHighlight: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
  },
});
