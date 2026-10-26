import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClipboardCheck, FileText, Search, Sparkles } from 'lucide-react-native';
import {
  BorderRadius,
  Colors,
  EmptyState,
  Spacing,
  TopAppBar,
  Typography,
} from '../../../shared';
import { QuestionnaireCard } from '../components/QuestionnaireCard';
import { useQuestionnaires } from '../hooks/useQuestionnaires';
import { QuestionnaireCategory } from '../types/questionnaire.types';

export type QuestionnairesListScreenProps = {
  onSelectQuestionnaire: (questionnaireId: string) => void;
  onBack?: () => void;
};

const CATEGORIES: { key: QuestionnaireCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'sarcopenia', label: 'Sarcopenia' },
  { key: 'funcionalidade', label: 'Funcionalidade' },
  { key: 'humor', label: 'Humor' },
  { key: 'fragilidade', label: 'Fragilidade' },
];

export const QuestionnairesListScreen: React.FC<QuestionnairesListScreenProps> = ({
  onSelectQuestionnaire,
  onBack,
}) => {
  const {
    filteredQuestionnaires,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    submissions,
  } = useQuestionnaires();

  return (
    <View style={styles.container}>
      <TopAppBar title="Questionários" onBack={onBack} />

      <View style={styles.content}>
        {/* Banner informativo */}
        <View style={styles.banner}>
          <View style={styles.bannerIconBg}>
            <ClipboardCheck size={20} color={Colors.primary} />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Avaliação Multidimensional</Text>
            <Text style={styles.bannerSubtitle}>
              Instrumentos validados para rastreio funcional e geriátrico.
            </Text>
          </View>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>
              {submissions.length} aplicados
            </Text>
          </View>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar questionário (ex: SARC-F, Katz...)"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros de Categoria */}
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(cat.key)}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Questionários */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredQuestionnaires}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <QuestionnaireCard
                questionnaire={item}
                onPress={() => onSelectQuestionnaire(item.id)}
              />
            )}
            ListEmptyComponent={
              <EmptyState
                title="Nenhum questionário encontrado"
                description="Tente ajustar os filtros ou termo de busca."
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#D0E1FD',
    gap: Spacing.sm,
  },
  bannerIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  bannerBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#D0E1FD',
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textMain,
  },
  categoriesWrapper: {
    marginBottom: Spacing.md,
  },
  categoriesContainer: {
    gap: Spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
});
