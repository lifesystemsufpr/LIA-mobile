import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Activity,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Footprints,
  Repeat,
} from 'lucide-react-native';
import {
  BorderRadius,
  Colors,
  Protocol,
  ProtocolId,
  Spacing,
  TopAppBar,
  Typography,
} from '../../../shared';
import { useProtocols } from '../hooks/useProtocols';

export type ProtocolsCatalogScreenProps = {
  onSelectProtocol: (protocol: Protocol) => void;
  onBack?: () => void;
};

export const ProtocolsCatalogScreen: React.FC<ProtocolsCatalogScreenProps> = ({
  onSelectProtocol,
  onBack,
}) => {
  const { protocols } = useProtocols();

  const getProtocolIcon = (id: ProtocolId, isEnabled: boolean) => {
    const iconColor = isEnabled ? Colors.primary : '#94A3B8';
    switch (id) {
      case '30sSTS':
      case '1MSTS':
        return <ArrowUpDown size={28} color={iconColor} />;
      case '5TSTS':
        return <Repeat size={28} color={iconColor} />;
      case '2MST':
        return <Footprints size={28} color={iconColor} />;
      case 'UTT':
        return <ArrowUp size={28} color={iconColor} />;
      case 'TUG':
      default:
        return <Activity size={28} color={iconColor} />;
    }
  };

  const getProtocolTag = (p: Protocol) => {
    if (p.durationSeconds) {
      return `${p.durationSeconds >= 60 ? `${p.durationSeconds / 60} min` : `${p.durationSeconds} seg`}`;
    }
    if (p.targetReps) {
      return `${p.targetReps} repetições`;
    }
    return 'Teste funcional';
  };

  const renderItem = ({ item }: { item: Protocol }) => {
    const isEnabled = item.enabled !== false;

    return (
      <TouchableOpacity
        activeOpacity={isEnabled ? 0.7 : 1}
        disabled={!isEnabled}
        onPress={() => isEnabled && onSelectProtocol(item)}
        style={[styles.card, !isEnabled && styles.cardDisabled]}
      >
        <View style={[styles.iconContainer, !isEnabled && styles.iconContainerDisabled]}>
          {getProtocolIcon(item.id, isEnabled)}
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={[styles.protocolShort, !isEnabled && styles.textDisabled]}>
              {item.shortName}
            </Text>
            {!isEnabled && (
              <View style={styles.disabledBadge}>
                <Text style={styles.disabledBadgeText}>Desativado</Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.protocolDesc, !isEnabled && styles.textMutedDisabled]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <Text style={[styles.protocolTag, !isEnabled && styles.tagDisabled]}>
            {getProtocolTag(item).toUpperCase()}
          </Text>
        </View>

        {isEnabled && <ChevronRight size={20} color={Colors.border} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Nova Avaliação" onBack={onBack} />

      <FlatList
        data={protocols}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Escolha o teste</Text>
            <Text style={styles.subtitle}>
              Selecione o protocolo clínico que será realizado.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  mainTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(41, 98, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconContainerDisabled: {
    backgroundColor: '#F1F5F9',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  protocolShort: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
  },
  textDisabled: {
    color: '#64748B',
  },
  disabledBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  disabledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  protocolDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    lineHeight: 18,
    marginBottom: 6,
  },
  textMutedDisabled: {
    color: '#94A3B8',
  },
  protocolTag: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  tagDisabled: {
    color: '#94A3B8',
  },
});
