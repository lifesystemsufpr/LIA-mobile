import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react-native';
import { Assessment, formatDateBR } from '../../../shared';

export type AssessmentHistoryCardProps = {
  assessment: Assessment;
  participantName: string;
  onPress: () => void;
};

export const AssessmentHistoryCard: React.FC<AssessmentHistoryCardProps> = ({
  assessment,
  participantName,
  onPress,
}) => {
  const isPending = assessment.syncStatus === 'pending';

  const getBadgeText = (protocolId: string): string => {
    if (protocolId.startsWith('30s')) return '30s';
    if (protocolId.startsWith('1M')) return '1M';
    if (protocolId.startsWith('5T')) return '5T';
    return protocolId.slice(0, 3);
  };

  const getResultText = (): string => {
    if (
      (assessment.protocolId.startsWith('30s') || assessment.protocolId.startsWith('1M')) &&
      assessment.repetitions !== undefined
    ) {
      return `${assessment.repetitions} reps`;
    }
    const sec = assessment.durationSeconds ?? assessment.resultValue;
    return `${sec}s`;
  };

  const renderStatusIcon = () => {
    switch (assessment.syncStatus) {
      case 'synced':
        return <Cloud size={20} color="#10B981" strokeWidth={1.8} />;
      case 'pending':
        return <CloudOff size={20} color="#F59E0B" strokeWidth={1.8} />;
      case 'syncing':
        return <RefreshCw size={18} color="#2563EB" strokeWidth={1.8} />;
      case 'failed':
      default:
        return <CloudOff size={20} color="#EF4444" strokeWidth={1.8} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, isPending && styles.pendingCard]}
    >
      {isPending && <View style={styles.pendingStripe} />}

      <View style={[styles.badge, isPending ? styles.pendingBadge : styles.syncedBadge]}>
        <Text style={[styles.badgeText, isPending ? styles.pendingBadgeText : styles.syncedBadgeText]}>
          {getBadgeText(assessment.protocolId)}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <Text numberOfLines={1} style={styles.participantName}>
          {participantName}
        </Text>
        <Text style={styles.cardMeta}>
          {assessment.protocolId} • {formatDateBR(assessment.createdAt)} • {getResultText()}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        {renderStatusIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pendingCard: {
    borderColor: '#E5E7EB',
  },
  pendingStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#F59E0B',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  syncedBadge: {
    backgroundColor: '#EEF2FF',
  },
  pendingBadge: {
    backgroundColor: '#FEF9C3',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  syncedBadgeText: {
    color: '#0F172A',
  },
  pendingBadgeText: {
    color: '#D97706',
  },
  cardInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12.5,
    color: '#64748B',
  },
  statusContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
