import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClipboardList, Plus, Search } from 'lucide-react-native';
import { Assessment, EmptyState } from '../../../shared';
import { AssessmentHistoryCard, HistoryFilterBar } from '../components';
import { useHistory } from '../hooks/useHistory';
import { INITIAL_ASSESSMENTS } from '../services/AssessmentsRepository';
import { Colors } from '../../../shared';

const MOCK_PARTICIPANTS_NAMES: Record<string, string> = {
  part_01: 'Manuela Silva',
  part_02: 'João Oliveira',
  part_03: 'Maria Santos',
  part_04: 'Carlos Pereira',
};

export type HistoryListScreenProps = {
  onSelectAssessment: (assessment: Assessment) => void;
  onStartNewAssessment?: () => void;
};

export const HistoryListScreen: React.FC<HistoryListScreenProps> = ({
  onSelectAssessment,
  onStartNewAssessment,
}) => {
  const {
    assessments,
    filters,
    participantsMap,
    setSearchQuery,
    setProtocolFilter,
    setSyncStatusFilter,
    setDateFilter,
  } = useHistory();

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.protocolFilter !== null ||
    filters.syncStatusFilter !== 'all' ||
    filters.dateFilter !== null;

  const displayAssessments =
    assessments.length > 0 || hasActiveFilters ? assessments : INITIAL_ASSESSMENTS;

  const renderItem = ({ item }: { item: Assessment }) => {
    const participantName =
      participantsMap.get(item.participantId) ??
      MOCK_PARTICIPANTS_NAMES[item.participantId] ??
      'Participante';

    return (
      <AssessmentHistoryCard
        assessment={item}
        participantName={participantName}
        onPress={() => onSelectAssessment(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Avaliações</Text>
          <Text style={styles.subtitle}>Histórico de avaliações realizadas.</Text>
        </View>
        <View style={styles.headerIconWrapper}>
          <ClipboardList size={26} color={Colors.primary} strokeWidth={2} />
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar participante..."
          placeholderTextColor="#94A3B8"
          value={filters.searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Filter Chips Bar */}
      <HistoryFilterBar
        selectedProtocol={filters.protocolFilter}
        selectedSyncStatus={filters.syncStatusFilter}
        selectedDate={filters.dateFilter}
        onSelectProtocol={setProtocolFilter}
        onSelectSyncStatus={setSyncStatusFilter}
        onSelectDate={setDateFilter}
      />

      {/* List */}
      <FlatList
        data={displayAssessments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma avaliação encontrada"
            description="Tente ajustar os filtros ou realize uma nova coleta motora."
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      {onStartNewAssessment && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onStartNewAssessment}
          style={styles.fab}
          accessibilityLabel="Iniciar nova avaliação"
        >
          <Plus size={26} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#091223',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  headerIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '400',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
