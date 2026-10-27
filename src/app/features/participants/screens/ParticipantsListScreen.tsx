import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, ChevronRight, Search, UserPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  calculateAge,
  Colors,
  EmptyState,
  formatCPF,
  getInitials,
  Participant,
} from '../../../shared';
import { useParticipants } from '../hooks/useParticipants';

export type ParticipantsListScreenProps = {
  onSelectParticipant?: (participant: Participant) => void;
  onAddNewParticipant?: () => void;
  isSelectionMode?: boolean;
  onBack?: () => void;
};

export const ParticipantsListScreen: React.FC<ParticipantsListScreenProps> = ({
  onSelectParticipant,
  onAddNewParticipant,
  isSelectionMode = false,
  onBack,
}) => {
  const navigation = useNavigation();
  const { participants, searchQuery, setSearchQuery, selectParticipant } = useParticipants();

  const handleBack = onBack ?? (() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  const handlePressParticipant = (participant: Participant) => {
    selectParticipant(participant);
    if (onSelectParticipant) {
      onSelectParticipant(participant);
    }
  };

  const renderItem = ({ item }: { item: Participant }) => {
    const age = calculateAge(item.birthDate);
    const initials = getInitials(item.fullName);
    const formattedCpf = formatCPF(item.cpf);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePressParticipant(item)}
        style={styles.card}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.meta}>
            {age} anos • CPF: {formattedCpf}
          </Text>
        </View>

        <ChevronRight size={18} color="#CBD5E1" strokeWidth={2} style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {isSelectionMode ? (
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selecionar Participante</Text>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Participantes</Text>
        </View>
      )}

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar por nome ou CPF..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Participants List */}
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum participante encontrado"
            description="Tente refinar sua busca ou cadastre um novo participante."
          />
        }
      />

      {/* Floating Action Button */}
      {onAddNewParticipant && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAddNewParticipant}
          style={styles.fab}
          accessibilityLabel="Adicionar participante"
        >
          <UserPlus size={24} color="#FFFFFF" strokeWidth={2} />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#091223',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  chevron: {
    marginLeft: 8,
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
