import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DonutChart, DonutSegment } from './DonutChart';

export type LegendItem = {
  label: string;
  valueDescription: string;
  color: string;
};

export type DonutDistributionCardProps = {
  title: string;
  segments: DonutSegment[];
  legends: LegendItem[];
  centerIcon: React.ReactNode;
  cardWidth?: number;
};

export const DonutDistributionCard: React.FC<DonutDistributionCardProps> = ({
  title,
  segments,
  legends,
  centerIcon,
  cardWidth = 295,
}) => {
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        <DonutChart
          size={88}
          strokeWidth={16}
          segments={segments}
          centerIcon={centerIcon}
        />
        <View style={styles.legendContainer}>
          {legends.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <View style={styles.legendTextCol}>
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.valueDescription}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  legendContainer: {
    gap: 12,
    flex: 1,
    marginLeft: 18,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  legendTextCol: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendValue: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
