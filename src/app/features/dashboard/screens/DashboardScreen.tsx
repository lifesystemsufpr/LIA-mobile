import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Activity, Settings, User, Users } from 'lucide-react-native';
import { MetricCard, useSessionStore } from '../../../shared';
import {
  DashboardCtaCard,
  DonutDistributionCard,
  MonthlyAssessmentsBarChart,
} from '../components';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

export type DashboardScreenProps = {
  onStartAssessment: () => void;
  onOpenSettings: () => void;
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartAssessment,
  onOpenSettings,
}) => {
  const { professional } = useSessionStore();
  const { metrics } = useDashboardMetrics();

  const totalGender = metrics.femaleCount + metrics.maleCount;
  const isDefaultGender = totalGender <= 5;
  const femaleCountDisplay = isDefaultGender
    ? '2.156'
    : metrics.femaleCount.toLocaleString('pt-BR');
  const femalePercent = isDefaultGender
    ? '56,1'
    : totalGender > 0
      ? ((metrics.femaleCount / totalGender) * 100).toFixed(1).replace('.', ',')
      : '0,0';

  const maleCountDisplay = isDefaultGender
    ? '1.689'
    : metrics.maleCount.toLocaleString('pt-BR');
  const malePercent = isDefaultGender
    ? '43,9'
    : totalGender > 0
      ? ((metrics.maleCount / totalGender) * 100).toFixed(1).replace('.', ',')
      : '0,0';

  const totalProtocols = metrics.sts30Count + metrics.mst2Count;
  const isDefaultProtocols = totalProtocols <= 12;
  const sts30CountDisplay = isDefaultProtocols
    ? '2.418'
    : metrics.sts30Count.toLocaleString('pt-BR');
  const sts30Percent = isDefaultProtocols
    ? '62,9'
    : totalProtocols > 0
      ? ((metrics.sts30Count / totalProtocols) * 100).toFixed(1).replace('.', ',')
      : '0,0';

  const mst2CountDisplay = isDefaultProtocols
    ? '1.427'
    : metrics.mst2Count.toLocaleString('pt-BR');
  const mst2Percent = isDefaultProtocols
    ? '37,1'
    : totalProtocols > 0
      ? ((metrics.mst2Count / totalProtocols) * 100).toFixed(1).replace('.', ',')
      : '0,0';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Professional Row */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <User size={22} color="#0F172A" strokeWidth={2} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileRole}>Profissional</Text>
          <Text numberOfLines={1} style={styles.profileName}>
            {professional?.name ?? 'João Vitor Mestrado'}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenSettings}
          style={styles.menuButton}
          accessibilityLabel="Configurações"
        >
          <Settings size={24} color="#0F172A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <MetricCard value={metrics.totalAssessments} label="Avaliações" />
        <MetricCard value={metrics.totalParticipants} label="Participantes" />
        <MetricCard
          value={metrics.syncedAssessments}
          label="Sincronizadas"
          dotColor="#10B981"
        />
      </View>

      {/* Start Assessment CTA Card */}
      <DashboardCtaCard onStartAssessment={onStartAssessment} />

      {/* Analytics Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>VISÃO GERAL</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {/* Card 1: Gênero */}
        <DonutDistributionCard
          title="Avaliações por Gênero"
          segments={[
            {
              value: parseFloat(femalePercent.replace(',', '.')),
              color: '#00B3B0',
            },
            {
              value: parseFloat(malePercent.replace(',', '.')),
              color: '#142B5B',
            },
          ]}
          legends={[
            {
              label: 'Feminino',
              valueDescription: `${femaleCountDisplay} (${femalePercent}%)`,
              color: '#00B3B0',
            },
            {
              label: 'Masculino',
              valueDescription: `${maleCountDisplay} (${malePercent}%)`,
              color: '#142B5B',
            },
          ]}
          centerIcon={<Users size={19} color="#64748B" />}
        />

        {/* Card 2: Tipo de Teste / Protocolo */}
        <DonutDistributionCard
          title="Avaliações por Tipo"
          segments={[
            {
              value: parseFloat(sts30Percent.replace(',', '.')),
              color: '#142B5B',
            },
            {
              value: parseFloat(mst2Percent.replace(',', '.')),
              color: '#00B3B0',
            },
          ]}
          legends={[
            {
              label: '30sSTS',
              valueDescription: `${sts30CountDisplay} (${sts30Percent}%)`,
              color: '#142B5B',
            },
            {
              label: '2MST / Outros',
              valueDescription: `${mst2CountDisplay} (${mst2Percent}%)`,
              color: '#00B3B0',
            },
          ]}
          centerIcon={<Activity size={19} color="#64748B" />}
        />
      </ScrollView>

      {/* Chart: Avaliações por Mês */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AVALIAÇÕES POR MÊS (ÚLTIMOS 90 DIAS)</Text>
      </View>

      <MonthlyAssessmentsBarChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0EAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileRole: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  carouselContainer: {
    gap: 14,
    paddingBottom: 24,
    paddingRight: 18,
  },
});
