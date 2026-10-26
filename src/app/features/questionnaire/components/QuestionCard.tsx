import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../../shared';
import {
  QuestionOption,
  QuestionnaireQuestion,
} from '../types/questionnaire.types';

export type QuestionCardProps = {
  question: QuestionnaireQuestion;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (option: QuestionOption) => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>
            Pergunta {question.number} de {totalQuestions}
          </Text>
        </View>
      </View>

      <Text style={styles.questionTitle}>{question.title}</Text>
      {question.description ? (
        <Text style={styles.questionDescription}>{question.description}</Text>
      ) : null}

      <View style={styles.optionsList}>
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.75}
              onPress={() => onSelectOption(option)}
              style={[
                styles.optionRow,
                isSelected && styles.optionRowSelected,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : null}
              </View>

              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </View>

              <View
                style={[
                  styles.scoreBadge,
                  isSelected && styles.scoreBadgeSelected,
                ]}
              >
                <Text
                  style={[
                    styles.scoreText,
                    isSelected && styles.scoreTextSelected,
                  ]}
                >
                  {option.score} {option.score === 1 ? 'pt' : 'pts'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  questionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: 4,
  },
  questionDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  optionRowSelected: {
    backgroundColor: '#F0F5FF',
    borderColor: Colors.primary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textMain,
    lineHeight: 19,
  },
  optionLabelSelected: {
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#E5E7EB',
  },
  scoreBadgeSelected: {
    backgroundColor: 'rgba(41, 98, 255, 0.15)',
  },
  scoreText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
  scoreTextSelected: {
    color: Colors.primaryDark,
  },
});
