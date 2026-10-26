import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type MonthlyDataPoint = {
  month: string;
  value: number;
};

export type MonthlyAssessmentsBarChartProps = {
  data?: MonthlyDataPoint[];
  maxScale?: number;
};

const DEFAULT_DATA: MonthlyDataPoint[] = [
  { month: 'Jul/26', value: 4 },
  { month: 'Ago/26', value: 0 },
  { month: 'Set/26', value: 4 },
];

export const MonthlyAssessmentsBarChart: React.FC<MonthlyAssessmentsBarChartProps> = ({
  data = DEFAULT_DATA,
  maxScale = 10,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.rowsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.monthLabel}>{item.month}</Text>
            <View style={styles.trackArea}>
              {item.value > 0 && (
                <View
                  style={[
                    styles.bar,
                    { width: `${(item.value / maxScale) * 100}%` },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.valueText,
                  item.value === 0 ? styles.valueTextZero : styles.valueTextBesideBar,
                ]}
              >
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.axisWrapper}>
        <View style={styles.ticksRow}>
          <Text style={[styles.tickText, styles.tickZero]}>0</Text>
          <Text style={[styles.tickText, { left: '30%', transform: [{ translateX: -4 }] }]}>
            3
          </Text>
          <Text style={[styles.tickText, { left: '50%', transform: [{ translateX: -4 }] }]}>
            5
          </Text>
          <Text style={[styles.tickText, { left: '80%', transform: [{ translateX: -4 }] }]}>
            8
          </Text>
          <Text style={[styles.tickText, styles.tickTen]}>10</Text>
        </View>
        <Text style={styles.axisTitle}>Avaliações</Text>
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  rowsContainer: {
    gap: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthLabel: {
    width: 52,
    fontSize: 13,
    fontWeight: '500',
    color: '#0F172A',
  },
  trackArea: {
    flex: 1,
    marginRight: 24,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    height: 16,
    backgroundColor: '#142B5B',
    borderRadius: 3,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  valueTextBesideBar: {
    marginLeft: 8,
  },
  valueTextZero: {
    marginLeft: 0,
  },
  axisWrapper: {
    marginLeft: 52,
    marginRight: 24,
    marginTop: 6,
  },
  ticksRow: {
    height: 16,
    position: 'relative',
  },
  tickText: {
    position: 'absolute',
    fontSize: 11,
    color: '#64748B',
  },
  tickZero: {
    left: 0,
  },
  tickTen: {
    right: 0,
    transform: [{ translateX: 4 }],
  },
  axisTitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
});
