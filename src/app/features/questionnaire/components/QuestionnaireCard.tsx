import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, Clock, HelpCircle, ShieldAlert } from 'lucide-react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../../shared';
import { Questionnaire } from '../types/questionnaire.types';

export type QuestionnaireCardProps = {
  questionnaire: Questionnaire;
  onPress: () => void;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'sarcopenia':
      return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
    case 'funcionalidade':
      return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
    case 'humor':
      return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' };
    case 'fragilidade':
      return { bg: '#FAF5FF', text: '#7E22CE', border: '#E9D5FF' };
    default:
      return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
};

export const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  questionnaire,
  onPress,
}) => {
  const catColor = getCategoryColor(questionnaire.category);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: catColor.bg, borderColor: catColor.border },
            ]}
          >
            <Text style={[styles.categoryText, { color: catColor.text }]}>
              {questionnaire.categoryLabel}
            </Text>
          </View>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{questionnaire.code}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{questionnaire.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {questionnaire.description}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Clock size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>~{questionnaire.estimatedMinutes} min</Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <HelpCircle size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>
            {questionnaire.questions.length} perguntas
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Iniciar</Text>
          <ArrowRight size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  codeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  codeText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  description: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  spacer: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF4FF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});
