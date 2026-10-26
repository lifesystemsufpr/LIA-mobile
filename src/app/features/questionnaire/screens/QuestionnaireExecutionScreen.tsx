import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  User,
} from 'lucide-react-native';
import { defaultParticipantsRepository } from '../../participants';
import {
  BorderRadius,
  Colors,
  getInitials,
  Participant,
  Spacing,
  TopAppBar,
  Typography,
} from '../../../shared';
import { QuestionCard } from '../components/QuestionCard';
import {
  defaultQuestionnairesRepository,
  QuestionnairesRepository,
} from '../services/QuestionnairesRepository';
import {
  Questionnaire,
  QuestionnaireAnswer,
  QuestionOption,
  QuestionnaireResult,
} from '../types/questionnaire.types';

export type QuestionnaireExecutionScreenProps = {
  questionnaireId: string;
  participantId?: string;
  onBack: () => void;
  onFinish: () => void;
  repository?: QuestionnairesRepository;
};

export const QuestionnaireExecutionScreen: React.FC<QuestionnaireExecutionScreenProps> = ({
  questionnaireId,
  participantId,
  onBack,
  onFinish,
  repository = defaultQuestionnairesRepository,
}) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionnaireAnswer>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [qData, partList] = await Promise.all([
          repository.getById(questionnaireId),
          defaultParticipantsRepository.getAll(),
        ]);

        setQuestionnaire(qData);
        setParticipants(partList);

        if (participantId) {
          const match = partList.find((p) => p.id === participantId);
          setSelectedParticipant(match ?? partList[0] ?? null);
        } else if (partList.length > 0) {
          setSelectedParticipant(partList[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [questionnaireId, participantId, repository]);

  if (loading || !questionnaire) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const currentQuestion = questionnaire.questions[currentIndex];
  const totalQuestions = questionnaire.questions.length;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (option: QuestionOption) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: option.id,
        score: option.score,
        label: option.label,
      },
    }));
  };

  const handleNext = async () => {
    if (!currentAnswer) {
      Alert.alert('Atenção', 'Por favor, selecione uma resposta antes de continuar.');
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finalizar e calcular resultado
      if (!selectedParticipant) {
        Alert.alert('Atenção', 'Selecione um participante para salvar o resultado.');
        return;
      }

      const answersList = Object.values(answers);
      const computed = repository.calculateResult(
        questionnaire,
        answersList,
        selectedParticipant
      );
      await repository.saveSubmission(computed);
      setResult(computed);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Se finalizou, exibir a tela de resultado detalhada
  if (result) {
    const isAlert = result.severity === 'alert';
    const isWarning = result.severity === 'warning';
    const resultColor = isAlert ? '#DC2626' : isWarning ? '#D97706' : '#16A34A';
    const resultBg = isAlert ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#F0FDF4';

    return (
      <View style={styles.container}>
        <TopAppBar title="Resultado" onBack={onFinish} />

        <ScrollView contentContainerStyle={styles.resultScroll}>
          {/* Header de Sucesso */}
          <View style={styles.resultHeaderArea}>
            <View style={[styles.resultIconCircle, { backgroundColor: resultBg }]}>
              {isAlert ? (
                <AlertCircle size={36} color={resultColor} />
              ) : (
                <CheckCircle2 size={36} color={resultColor} />
              )}
            </View>
            <Text style={styles.resultTitle}>Questionário Concluído</Text>
            <Text style={styles.resultSubtitle}>
              {result.questionnaireTitle} ({result.questionnaireCode})
            </Text>
          </View>

          {/* Card do Participante */}
          <View style={styles.participantSummaryCard}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {getInitials(result.participantName)}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{result.participantName}</Text>
              <Text style={styles.participantSub}>
                Concluído em {new Date(result.completedAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>

          {/* Card de Score e Classificação */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>PONTUAÇÃO TOTAL</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: resultColor }]}>
                {result.totalScore}
              </Text>
              <Text style={styles.scoreMax}>/ {result.maxScore} pts</Text>
            </View>

            <View style={[styles.classificationBadge, { backgroundColor: resultBg }]}>
              <Text style={[styles.classificationText, { color: resultColor }]}>
                {result.classification}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.recommendationTitle}>Conduta Recomendada</Text>
            <Text style={styles.recommendationText}>{result.recommendation}</Text>
          </View>

          {/* Botão Concluir */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onFinish}
            style={styles.finishButton}
          >
            <Text style={styles.finishButtonText}>Concluir e Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopAppBar
        title={questionnaire.code}
        onBack={currentIndex === 0 ? onBack : handlePrev}
      />

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card do Participante Avaliado */}
        {selectedParticipant ? (
          <View style={styles.participantBar}>
            <View style={styles.participantMiniAvatar}>
              <User size={14} color={Colors.primary} />
            </View>
            <View style={styles.participantBarInfo}>
              <Text style={styles.participantBarLabel}>Participante</Text>
              <Text style={styles.participantBarName}>
                {selectedParticipant.fullName}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Pergunta Atual */}
        {currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            totalQuestions={totalQuestions}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onSelectOption={handleSelectOption}
          />
        ) : null}
      </ScrollView>

      {/* Barra de Ação Inferior */}
      <View style={styles.footerBar}>
        {currentIndex > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePrev}
            style={styles.prevButton}
          >
            <ArrowLeft size={16} color={Colors.textMain} />
            <Text style={styles.prevButtonText}>Anterior</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={[
            styles.nextButton,
            !currentAnswer && styles.nextButtonDisabled,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
          </Text>
          {currentIndex === totalQuestions - 1 ? (
            <FileCheck size={16} color="#FFFFFF" />
          ) : (
            <ArrowRight size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  participantBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  participantMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantBarInfo: {
    flex: 1,
  },
  participantBarLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    textTransform: 'uppercase',
  },
  participantBarName: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMain,
    fontWeight: Typography.weights.bold,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.xs,
  },
  prevButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
  },
  nextButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    gap: Spacing.xs,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  resultScroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  resultHeaderArea: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  resultTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  participantSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantAvatarText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
  },
  participantSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  scoreCardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: Typography.weights.extrabold,
  },
  scoreMax: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
  classificationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  classificationText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Spacing.md,
  },
  recommendationTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  finishButton: {
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  finishButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});
