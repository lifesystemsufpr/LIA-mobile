import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Cloud, CloudCheck, CloudOff, RefreshCw } from 'lucide-react-native';
import { SyncStatus } from '../types';
import { BorderRadius, Colors, Spacing, Typography } from '../theme';

export type StatusChipProps = {
  status: SyncStatus;
  showText?: boolean;
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, showText = true }) => {
  switch (status) {
    case 'synced':
      return (
        <View style={[styles.badge, styles.syncedBadge]}>
          <CloudCheck size={14} color={Colors.success} />
          {showText && <Text style={[styles.text, styles.syncedText]}>Sincronizado</Text>}
        </View>
      );
    case 'syncing':
      return (
        <View style={[styles.badge, styles.syncingBadge]}>
          <RefreshCw size={14} color={Colors.primary} />
          {showText && <Text style={[styles.text, styles.syncingText]}>Sincronizando</Text>}
        </View>
      );
    case 'failed':
      return (
        <View style={[styles.badge, styles.failedBadge]}>
          <CloudOff size={14} color={Colors.danger} />
          {showText && <Text style={[styles.text, styles.failedText]}>Falha</Text>}
        </View>
      );
    case 'pending':
    default:
      return (
        <View style={[styles.badge, styles.pendingBadge]}>
          <CloudOff size={14} color={Colors.warning} />
          {showText && <Text style={[styles.text, styles.pendingText]}>Pendente</Text>}
        </View>
      );
  }
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  syncedBadge: {
    backgroundColor: '#DCFCE7',
  },
  syncedText: {
    color: Colors.success,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingText: {
    color: '#D97706',
  },
  syncingBadge: {
    backgroundColor: '#DBEAFE',
  },
  syncingText: {
    color: Colors.primary,
  },
  failedBadge: {
    backgroundColor: '#FEE2E2',
  },
  failedText: {
    color: Colors.danger,
  },
});
