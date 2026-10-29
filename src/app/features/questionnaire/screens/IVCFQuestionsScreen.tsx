import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, Lock, Pause, Play, RotateCcw, Timer, Volume2, VolumeX } from 'lucide-react-native';
import {
  calculateAge,
  Colors,
  defaultSpeechService,
  Participant,
  SpeechServiceContract,
  Typography,
} from '../../../shared';
import { IVCF_QUESTIONS, IVCFQuestion } from '../services/ivcfData';

export type IVCFQuestionsScreenProps = {
  participant?: Participant | null;
  onBackToSelection: () => void;
  onFinish: (answers: Record<number, number>) => void;
  speechService?: SpeechServiceContract;
};

function formatQuestionForSpeech(title: string): string {
  return title
    .replace(/sr\(a\)/gi, 'senhor ou senhora')
    .replace(/sra\./gi, 'senhora')
    .replace(/sr\./gi, 'senhor')
    .replace(/≥/g, 'maior ou igual a')
    .replace(/≤/g, 'menor ou igual a')
    .replace(/</g, 'menor que')
    .replace(/>/g, 'maior que')
    .replace(/IMC/g, 'índice de massa corporal')
    .trim();
}

function getInitialQ1(p?: Participant | null): { q1Options: string[]; q1Score: number } {
  if (!p?.birthDate) {
    return { q1Options: ['q1_0'], q1Score: 0 };
  }
  const age = calculateAge(p.birthDate);
  if (age >= 85) {
    return { q1Options: ['q1_3'], q1Score: 3 };
  }
  if (age >= 75) {
    return { q1Options: ['q1_1'], q1Score: 1 };
  }
  return { q1Options: ['q1_0'], q1Score: 0 };
}

export const IVCFQuestionsScreen: React.FC<IVCFQuestionsScreenProps> = ({
  participant,
  onBackToSelection,
  onFinish,
  speechService,
}) => {
  const initialQ1 = getInitialQ1(participant);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: initialQ1.q1Score,
  });
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<number, string[]>>({
    1: initialQ1.q1Options,
  });

  // Timer para o teste de velocidade da marcha (Questão 14)
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartRef = useRef<number>(0);
  const timerAccumulatedRef = useRef<number>(0);

  const handleStartTimer = () => {
    if (timerRunning) return;
    timerStartRef.current = Date.now();
    setTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = timerAccumulatedRef.current + (now - timerStartRef.current);
      setTimerElapsed(elapsed);
    }, 100);
  };

  const handlePauseTimer = () => {
    if (!timerRunning) return;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    const total = timerAccumulatedRef.current + (Date.now() - timerStartRef.current);
    timerAccumulatedRef.current = total;
    setTimerElapsed(total);
    setTimerRunning(false);

    // Se o tempo for superior a 5 segundos (> 5s), seleciona automaticamente a opção q14_marcha
    if (total / 1000 > 5) {
      if (!currentQuestionSelections.includes('q14_marcha')) {
        handleSelectOption('q14_marcha', 2);
      }
    }
  };

  const handleResetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timerAccumulatedRef.current = 0;
    timerStartRef.current = 0;
    setTimerElapsed(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const q1 = getInitialQ1(participant);
    setSelectedOptionIds((prev) => ({
      ...prev,
      1: q1.q1Options,
    }));
    setAnswers((prev) => ({
      ...prev,
      1: q1.q1Score,
    }));
  }, [participant]);

  // Leitura de voz (TTS) da pergunta atual usando a mesma voz da contagem (pt-br-x-pte-local)
  const speechRef = useRef<SpeechServiceContract>(speechService ?? defaultSpeechService);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    speechRef.current.stop();
    setIsSpeaking(false);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      speechRef.current.stop();
    };
  }, []);

  const handleToggleSpeech = async () => {
    if (isSpeaking) {
      await speechRef.current.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToSpeak = formatQuestionForSpeech(currentQuestion.title);

    await speechRef.current.speak(textToSpeak, {
      language: 'pt-BR',
      rate: 0.95,
      voice: 'pt-br-x-pte-local',
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const currentQuestion: IVCFQuestion = IVCF_QUESTIONS[currentIndex];
  const totalQuestions = IVCF_QUESTIONS.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isQuestion1 = currentQuestion.number === 1;
  const currentQuestionSelections = selectedOptionIds[currentQuestion.number] || [];

  const handleSelectOption = (optionId: string, score: number) => {
    // A primeira questão é bloqueada para alteração manual
    if (isQuestion1) {
      return;
    }

    const qNumber = currentQuestion.number;

    if (currentQuestion.isMultiSelect) {
      const isNoneOption = optionId.includes('nenhuma');
      let newSelections: string[];

      if (isNoneOption) {
        // Ao selecionar nenhuma das condições, desmarca todas as outras
        if (currentQuestionSelections.includes(optionId)) {
          newSelections = [];
        } else {
          newSelections = [optionId];
        }
      } else {
        // Ao selecionar qualquer condição, desmarca "nenhuma das condições"
        if (currentQuestionSelections.includes(optionId)) {
          newSelections = currentQuestionSelections.filter((id) => id !== optionId);
        } else {
          newSelections = [
            ...currentQuestionSelections.filter((id) => !id.includes('nenhuma')),
            optionId,
          ];
        }
      }

      setSelectedOptionIds((prev) => ({
        ...prev,
        [qNumber]: newSelections,
      }));

      setAnswers((prev) => {
        const updated = { ...prev };
        if (newSelections.length === 0) {
          delete updated[qNumber];
        } else if (newSelections.some((id) => !id.includes('nenhuma'))) {
          // Resposta positiva para condição: Q14 pontua 2; Q20 pontua 4
          updated[qNumber] = qNumber === 14 ? 2 : 4;
        } else {
          // "Nenhuma das condições" selecionada
          updated[qNumber] = 0;
        }
        return updated;
      });

      return;
    }

    // Questões de seleção única
    setSelectedOptionIds((prev) => ({
      ...prev,
      [qNumber]: [optionId],
    }));
    setAnswers((prev) => ({
      ...prev,
      [qNumber]: score,
    }));
  };

  const handleNext = () => {
    if (answers[currentQuestion.number] === undefined) {
      Alert.alert('Atenção', 'Por favor, selecione uma resposta para continuar.');
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBackToSelection();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header azul curvo do protótipo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IVCF-20</Text>

        {/* Linha de progresso sutil */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={styles.headerStepText}>
          QUESTÃO {currentIndex + 1} de {totalQuestions}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enunciado da Pergunta centralizado em azul */}
        <Text style={styles.questionTitle}>{currentQuestion.title}</Text>

        {/* Card branco com as opções */}
        <View style={styles.card}>
          {isQuestion1 && participant && (
            <View style={styles.lockedBadge}>
              <Lock size={15} color={Colors.primary} strokeWidth={2.2} />
              <Text style={styles.lockedBadgeText}>
                Idade calculada automaticamente pelo cadastro ({calculateAge(participant.birthDate)} anos)
              </Text>
            </View>
          )}

          {currentQuestion.isMultiSelect && (
            <Text style={styles.multiSelectHint}>
              Selecione todas as condições que se aplicam:
            </Text>
          )}

          <View style={styles.optionsList}>
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestionSelections.includes(option.id);
              const isMarchaOption = option.id === 'q14_marcha';

              if (isMarchaOption) {
                return (
                  <View key={option.id} style={styles.optionWithTimerRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleSelectOption(option.id, option.score)}
                      style={[
                        styles.optionButton,
                        styles.optionButtonWithTimer,
                        isSelected && styles.optionButtonSelected,
                        styles.optionButtonMulti,
                      ]}
                    >
                      <View style={styles.optionContentRow}>
                        <View
                          style={[
                            styles.checkboxSquare,
                            isSelected && styles.checkboxSquareSelected,
                          ]}
                        >
                          {isSelected && (
                            <Check size={14} color={Colors.primary} strokeWidth={2.5} />
                          )}
                        </View>

                        <Text
                          style={[
                            styles.optionButtonText,
                            isSelected && styles.optionButtonTextSelected,
                            styles.optionButtonTextMulti,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Botão de Timer com Iniciar e Pausar ao lado da opção */}
                    <View
                      style={[
                        styles.timerWidget,
                        timerRunning && styles.timerWidgetActive,
                      ]}
                    >
                      <View style={styles.timerHeader}>
                        <Timer
                          size={14}
                          color={timerRunning ? Colors.accent : Colors.primary}
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.timerDigits,
                            timerElapsed / 1000 > 5 && styles.timerDigitsAlert,
                          ]}
                        >
                          {(timerElapsed / 1000).toFixed(1)}s
                        </Text>
                      </View>

                      {timerElapsed / 1000 > 5 && (
                        <View style={styles.alertBadge}>
                          <Text style={styles.alertBadgeText}>&gt; 5s</Text>
                        </View>
                      )}

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={timerRunning ? handlePauseTimer : handleStartTimer}
                        style={[
                          styles.timerBtn,
                          timerRunning ? styles.timerBtnPause : styles.timerBtnStart,
                        ]}
                      >
                        {timerRunning ? (
                          <>
                            <Pause size={13} color={Colors.surface} />
                            <Text style={styles.timerBtnText}>Pausar</Text>
                          </>
                        ) : (
                          <>
                            <Play size={13} color={Colors.surface} fill={Colors.surface} />
                            <Text style={styles.timerBtnText}>
                              {timerElapsed > 0 ? 'Retomar' : 'Iniciar'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      {timerElapsed > 0 && !timerRunning && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={handleResetTimer}
                          style={styles.timerResetBtn}
                        >
                          <RotateCcw size={11} color={Colors.textMuted} />
                          <Text style={styles.timerResetBtnText}>Zerar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={isQuestion1 ? 1 : 0.8}
                  disabled={isQuestion1}
                  onPress={() => handleSelectOption(option.id, option.score)}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    isQuestion1 && !isSelected && styles.optionButtonDisabled,
                    currentQuestion.isMultiSelect && styles.optionButtonMulti,
                  ]}
                >
                  <View style={styles.optionContentRow}>
                    {currentQuestion.isMultiSelect && (
                      <View
                        style={[
                          styles.checkboxSquare,
                          isSelected && styles.checkboxSquareSelected,
                        ]}
                      >
                        {isSelected && (
                          <Check size={14} color={Colors.primary} strokeWidth={2.5} />
                        )}
                      </View>
                    )}

                    <Text
                      style={[
                        styles.optionButtonText,
                        isSelected && styles.optionButtonTextSelected,
                        currentQuestion.isMultiSelect && styles.optionButtonTextMulti,
                      ]}
                    >
                      {option.label}
                    </Text>

                    {isQuestion1 && isSelected && (
                      <Lock size={16} color={Colors.surface} strokeWidth={2.2} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Botão de áudio flutuante posicionado acima do botão Anterior */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggleSpeech}
        style={[
          styles.voiceFloatingButton,
          isSpeaking && styles.voiceFloatingButtonActive,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isSpeaking ? 'Parar leitura da pergunta' : 'Ouvir pergunta'}
      >
        {isSpeaking ? (
          <VolumeX size={22} color={Colors.surface} strokeWidth={2.2} />
        ) : (
          <Volume2 size={22} color={Colors.primary} strokeWidth={2.2} />
        )}
      </TouchableOpacity>

      {/* Botões de Ação Inferiores conforme protótipo */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePrev}
          style={styles.actionButtonOutline}
        >
          <Text style={styles.actionButtonOutlineText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.actionButtonSolid}
        >
          <Text style={styles.actionButtonSolidText}>
            {currentIndex === totalQuestions - 1 ? 'Finalizar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #F7F9FC
  },
  header: {
    backgroundColor: Colors.primary, // #142B5B
    paddingTop: 48,
    paddingBottom: 24,
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
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  progressBarBackground: {
    width: '64%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent, // #38B2AC
    borderRadius: 2,
  },
  headerStepText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 72,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary, // #142B5B
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.surface, // #FFFFFF
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border, // #E4E7EC
    padding: 22,
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  lockedBadgeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    lineHeight: 18,
  },
  multiSelectHint: {
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    marginBottom: 14,
    textAlign: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.surface, // #FFFFFF
    borderWidth: 1.5,
    borderColor: Colors.primary, // #142B5B
    borderRadius: 14,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonMulti: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary, // #142B5B
    borderColor: Colors.primary, // #142B5B
    shadowColor: Colors.primary, // #142B5B
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkboxSquareSelected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.surface,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary, // #142B5B
    textAlign: 'center',
  },
  optionButtonTextMulti: {
    textAlign: 'left',
    flex: 1,
    lineHeight: 20,
    fontSize: 14,
  },
  optionButtonTextSelected: {
    color: Colors.surface, // #FFFFFF
    fontWeight: Typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    backgroundColor: Colors.surface, // #FFFFFF
    borderTopWidth: 1,
    borderTopColor: Colors.border, // #E4E7EC
    gap: 16,
    alignItems: 'center',
  },
  voiceFloatingButton: {
    position: 'absolute',
    left: 20,
    bottom: 98,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface, // #FFFFFF
    borderWidth: 1.5,
    borderColor: Colors.primary, // #142B5B
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 20,
  },
  voiceFloatingButtonActive: {
    backgroundColor: Colors.primary, // #142B5B
    borderColor: Colors.primary, // #142B5B
    shadowColor: Colors.primary, // #142B5B
    shadowOpacity: 0.35,
  },
  actionButtonOutline: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface, // #FFFFFF
    borderWidth: 1.5,
    borderColor: Colors.primary, // #142B5B
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutlineText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.primary, // #142B5B
  },
  actionButtonSolid: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary, // #142B5B
    borderWidth: 1.5,
    borderColor: Colors.primary, // #142B5B
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary, // #142B5B
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
  optionWithTimerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    width: '100%',
  },
  optionButtonWithTimer: {
    flex: 1,
    minHeight: 84,
  },
  timerWidget: {
    width: 96,
    backgroundColor: Colors.surface, // #FFFFFF
    borderWidth: 1.5,
    borderColor: Colors.border, // #E4E7EC
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  timerWidgetActive: {
    borderColor: Colors.accent, // #38B2AC
    backgroundColor: '#F0FDFA',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  timerDigits: {
    fontSize: 15,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary, // #142B5B
  },
  timerDigitsAlert: {
    color: Colors.danger, // #EF4444
  },
  alertBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.danger, // #EF4444
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    height: 30,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timerBtnStart: {
    backgroundColor: Colors.primary, // #142B5B
    shadowColor: Colors.primary,
  },
  timerBtnPause: {
    backgroundColor: Colors.warning, // #F59E0B
    shadowColor: Colors.warning,
  },
  timerBtnText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
  },
  timerResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 5,
    paddingVertical: 2,
  },
  timerResetBtnText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted, // #667085
  },
});
