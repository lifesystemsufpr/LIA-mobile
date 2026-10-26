import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../theme';

export type MetricCardProps = {
  value: string | number;
  label: string;
  dotColor?: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({ value, label, dotColor }) => {
  return (
    <View style={styles.card}>
      <View style={styles.valueRow}>
        {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
        <Text style={[styles.value, dotColor ? { color: dotColor } : undefined]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: '#091223',
  },
  label: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
});

