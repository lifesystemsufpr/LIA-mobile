import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Assessment, Colors, ConfirmationDialog, createId, Participant, Typography } from '../../../shared';
import { defaultAssessmentsRepository } from '../../history';
import { defaultQuestionnairesRepository } from '../services/QuestionnairesRepository';
import { IVCFResultData } from '../services/ivcfData';

export type IVCFResultScreenProps = {
  result: IVCFResultData;
  answers: Record<number, number>;
  participant?: Participant | null;
  onBackToQuestions: () => void;
  onFinish: () => void;
};

const ROBUSTO_MAX_SCORE = 6;
const MODERATE_MIN_SCORE = 7;
const MODERATE_MAX_SCORE = 14;
const FRAGILE_MIN_SCORE = 15;

const SECTION_WIDTH_PERCENT = 100 / 3;
const SECTION_EDGE_PADDING_PERCENT = 2;

function getClassificationColor(severity: IVCFResultData['severity']): string {
  switch (severity) {
    case 'normal':
      return Colors.success;
    case 'warning':
      return Colors.warning;
    case 'alert':
      return Colors.danger;
  }
}

function getHeatmapPointerPercentage(score: number, maxScore: number): number {
  const clampedScore = Math.min(maxScore, Math.max(0, score));
  const usableSectionSpan = SECTION_WIDTH_PERCENT - SECTION_EDGE_PADDING_PERCENT * 2;

  if (clampedScore <= ROBUSTO_MAX_SCORE) {
    const ratio = clampedScore / ROBUSTO_MAX_SCORE;
    return SECTION_EDGE_PADDING_PERCENT + ratio * usableSectionSpan;
  }

  if (clampedScore <= MODERATE_MAX_SCORE) {
    const ratio =
      (clampedScore - MODERATE_MIN_SCORE) / (MODERATE_MAX_SCORE - MODERATE_MIN_SCORE);
    return SECTION_WIDTH_PERCENT + SECTION_EDGE_PADDING_PERCENT + ratio * usableSectionSpan;
  }

  const fragileSpan = Math.max(1, maxScore - FRAGILE_MIN_SCORE);
  const ratio = (clampedScore - FRAGILE_MIN_SCORE) / fragileSpan;
  return SECTION_WIDTH_PERCENT * 2 + SECTION_EDGE_PADDING_PERCENT + ratio * usableSectionSpan;
}

export const IVCFResultScreen: React.FC<IVCFResultScreenProps> = ({
  result,
  answers,
  participant,
  onBackToQuestions,
  onFinish,
}) => {
  const [confirmSendVisible, setConfirmSendVisible] = useState(false);

  const classificationColor = getClassificationColor(result.severity);
  const scorePercent = getHeatmapPointerPercentage(result.totalScore, result.maxScore);

  const handleConfirmSend = async () => {
    setConfirmSendVisible(false);
    try {
      await defaultQuestionnairesRepository.saveSubmission(answers, participant ?? undefined);
      const nowIso = new Date().toISOString();
      const ivcfAssessment: Assessment = {
        id: createId('eval'),
        participantId: participant?.id ?? 'part_01',
        professionalId: 'prof_01',
        protocolId: 'IVCF-20',
        startedAt: nowIso,
        completedAt: nowIso,
        resultValue: result.totalScore,
        resultUnit: 'pontos',
        notes: result.classification,
        syncStatus: 'synced',
        createdAt: nowIso,
      };
      await defaultAssessmentsRepository.save(ivcfAssessment);
    } catch {
      // Falha silenciosa de persistência local não impede avanço para tela de sincronização
    }
    onFinish();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header azul curvo do protótipo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IVCF-20</Text>
        <Text style={styles.headerSubtitle}>Resultado</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Principal Flutuante conforme protótipo */}
        <View style={styles.card}>
          {/* Círculo com anel colorido conforme a classificação e interior azul com pontuação */}
          <View style={[styles.scoreCircleOuter, { borderColor: classificationColor }]}>
            <View style={styles.scoreCircleInner}>
              <Text style={styles.scoreNumber}>{result.totalScore}</Text>
            </View>
          </View>

          <Text style={styles.pontosLabel}>PONTOS</Text>

          {/* Barra de escala colorida */}
          <View style={styles.scaleContainer}>
            <View style={styles.barTrack}>
              <View style={styles.gradientBar}>
                <View style={[styles.gradientSection, { backgroundColor: Colors.success }]} />
                <View style={[styles.gradientSection, { backgroundColor: Colors.warning }]} />
                <View style={[styles.gradientSection, { backgroundColor: Colors.danger }]} />
              </View>

              {/* Seta triangular indicadora */}
              <View style={[styles.pointerContainer, { left: `${scorePercent}%` }]}>
                <View style={styles.trianglePointer} />
              </View>
            </View>
          </View>

          {/* Nome da Classificação */}
          <Text style={styles.classificationText}>
            {result.classification}
          </Text>

          {/* Descrição e Conduta clínica */}
          <Text style={styles.recommendationText}>
            {result.recommendation}
          </Text>
        </View>
      </ScrollView>

      {/* Botões de Ação Inferiores conforme protótipo */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBackToQuestions}
          style={styles.actionButtonOutline}
        >
          <Text style={styles.actionButtonOutlineText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setConfirmSendVisible(true)}
          style={styles.actionButtonSolid}
        >
          <Text style={styles.actionButtonSolidText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação de Envio */}
      <ConfirmationDialog
        visible={confirmSendVisible}
        title="Enviar Dados?"
        message="Deseja confirmar o envio dos dados desta avaliação ?"
        confirmLabel="Sim"
        cancelLabel="Voltar"
        onConfirm={handleConfirmSend}
        onCancel={() => setConfirmSendVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #F7F9FC
  },
  header: {
    backgroundColor: Colors.primary, // #2962FF
    paddingTop: 48,
    paddingBottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: Typography.weights.extrabold,
    color: Colors.surface, // #FFFFFF
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: Colors.surface, // #FFFFFF
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border, // #E4E7EC
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: Colors.accent, // #38B2AC
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  scoreCircleInner: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: Colors.primary, // #2962FF
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: Typography.weights.extrabold,
    color: Colors.surface, // #FFFFFF
  },
  pontosLabel: {
    fontSize: 18,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary, // #2962FF
    letterSpacing: 1.2,
    marginTop: 8,
    marginBottom: 20,
  },
  scaleContainer: {
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  barTrack: {
    width: '100%',
    position: 'relative',
  },
  gradientBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  gradientSection: {
    flex: 1,
  },
  pointerContainer: {
    position: 'absolute',
    top: 10,
    marginLeft: -6,
    alignItems: 'center',
  },
  trianglePointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primaryDark, // #091223
  },
  classificationText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark, // #091223
    marginTop: 12,
    marginBottom: 14,
    textAlign: 'center',
  },
  recommendationText: {
    fontSize: 13,
    color: Colors.textMuted, // #667085
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    backgroundColor: Colors.surface, // #FFFFFF
    borderTopWidth: 1,
    borderTopColor: Colors.border, // #E4E7EC
    gap: 14,
  },
  actionButtonOutline: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface, // #FFFFFF
    borderWidth: 1.5,
    borderColor: Colors.primary, // #2962FF
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutlineText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.primary, // #2962FF
  },
  actionButtonSolid: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary, // #2962FF
    borderWidth: 1.5,
    borderColor: Colors.primary, // #2962FF
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary, // #2962FF
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonSolidText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
  },
});
