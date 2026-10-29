import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Activity,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  MapPin,
  Play,
  User,
} from 'lucide-react-native';
import { RootStackParamList } from '../../../composition/AppRouteTypes';
import {
  Assessment,
  BorderRadius,
  calculateAge,
  Colors,
  EmptyState,
  formatCPF,
  formatDateBR,
  getInitials,
  Participant,
  Protocol,
  ProtocolId,
  Spacing,
  StatusChip,
  TopAppBar,
  Typography,
} from '../../../shared';
import { defaultAssessmentsRepository } from '../../history';
import { defaultProtocolsRepository } from '../../protocols';

export type ParticipantDetailScreenProps = {
  participant: Participant;
  onBack?: () => void;
  onStartAssessment?: (participant: Participant) => void;
  onViewAssessmentDetail?: (assessmentId: string) => void;
};

type PendingEvaluationItem = {
  id: ProtocolId;
  shortName: string;
  title: string;
  categoryLabel: string;
  protocol?: Protocol;
  isQuestionnaire?: boolean;
};

const CLASS_TO_INCOME_MAP: Record<string, string> = {
  'classe a': 'Mais de 20 salários mínimos',
  'classe b': '10 a 20 salários mínimos',
  'classe c': '4 a 10 salários mínimos',
  'classe d': '2 a 4 salários mínimos',
  'classe e': 'Até 2 salários mínimos',
  'a': 'Mais de 20 salários mínimos',
  'b': '10 a 20 salários mínimos',
  'c': '4 a 10 salários mínimos',
  'd': '2 a 4 salários mínimos',
  'e': 'Até 2 salários mínimos',
};

const INCOME_TO_CLASS_MAP: Record<string, string> = {
  'mais de 20': 'Classe A',
  '10 a 20': 'Classe B',
  '4 a 10': 'Classe C',
  '2 a 4': 'Classe D',
  'até 2': 'Classe E',
};

const extractIncomeRange = (socio?: string): string => {
  if (!socio) return 'Não informado';
  const trimmed = socio.trim();
  const match = trimmed.match(/\((.*?)\)/);
  if (match && match[1]?.trim()) {
    return match[1].trim();
  }

  const normalized = trimmed.toLowerCase();
  if (CLASS_TO_INCOME_MAP[normalized]) {
    return CLASS_TO_INCOME_MAP[normalized];
  }

  for (const [key, income] of Object.entries(CLASS_TO_INCOME_MAP)) {
    if (normalized.includes(key)) {
      return income;
    }
  }

  if (
    normalized.includes('salário') ||
    normalized.includes('salario') ||
    normalized.includes('mínimo') ||
    normalized.includes('minimo')
  ) {
    return trimmed;
  }

  return trimmed;
};

const extractSocialClass = (socio?: string): string => {
  if (!socio) return 'Não informado';
  const trimmed = socio.trim();
  const beforeParen = trimmed.split('(')[0]?.trim();
  if (beforeParen && beforeParen.toLowerCase().startsWith('classe')) {
    return beforeParen;
  }

  const normalized = trimmed.toLowerCase();
  for (const [incKey, cls] of Object.entries(INCOME_TO_CLASS_MAP)) {
    if (normalized.includes(incKey)) {
      return cls;
    }
  }

  if (CLASS_TO_INCOME_MAP[normalized]) {
    return normalized.toUpperCase().startsWith('CLASSE')
      ? trimmed
      : `Classe ${trimmed.toUpperCase()}`;
  }

  return beforeParen || trimmed;
};

type AddressDetails = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

const getDetailedAddress = (p: Participant): AddressDetails => {
  if (p.street || p.neighborhood || p.city || p.state) {
    return {
      cep: p.zipCode || 'Não informado',
      street: p.street || 'Não informado',
      number: p.number || 'S/N',
      complement: p.complement || 'Não informado',
      neighborhood: p.neighborhood || 'Não informado',
      city: p.city || 'Não informado',
      state: p.state || 'Não informado',
    };
  }

  let street = 'Não informado';
  let number = 'S/N';
  let complement = 'Não informado';
  let neighborhood = 'Não informado';
  let city = 'Não informado';
  let state = 'Não informado';

  if (p.address) {
    const rawParts = p.address.split(',').map((s) => s.trim()).filter(Boolean);
    if (rawParts.length >= 1) {
      street = rawParts[0];
    }
    if (rawParts.length >= 2) {
      number = rawParts[1];
    }
    if (rawParts.length >= 3) {
      neighborhood = rawParts[2];
    }
    if (rawParts.length >= 4) {
      if (rawParts[3].includes('-')) {
        const [c, s] = rawParts[3].split('-').map((str) => str.trim());
        city = c || city;
        state = s || state;
      } else {
        city = rawParts[3];
      }
    }
  }

  return {
    cep: p.zipCode || 'Não informado',
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  };
};

export const ParticipantDetailScreen: React.FC<ParticipantDetailScreenProps> = ({
  participant,
  onBack,
  onViewAssessmentDetail,
}) => {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'dados' | 'historico'>('dados');
  const [participantAssessments, setParticipantAssessments] = useState<Assessment[]>([]);

  const loadParticipantAssessments = useCallback(async () => {
    const items = await defaultAssessmentsRepository.getByParticipantId(participant.id);
    setParticipantAssessments(items);
  }, [participant.id]);

  useEffect(() => {
    loadParticipantAssessments();
  }, [loadParticipantAssessments, activeTab]);

  const age = calculateAge(participant.birthDate);
  const formattedCpf = formatCPF(participant.cpf);
  const initials = getInitials(participant.fullName);
  const addressData = getDetailedAddress(participant);
  const sexLabel =
    participant.biologicalSex === 'female'
      ? 'Feminino'
      : participant.biologicalSex === 'male'
      ? 'Masculino'
      : participant.biologicalSex === 'other'
      ? 'Outro'
      : undefined;

  // Cálculo de IMC se peso e altura estiverem disponíveis
  const imc =
    participant.weightKg && participant.heightCm
      ? (
          participant.weightKg /
          Math.pow(participant.heightCm / 100, 2)
        ).toFixed(1)
      : null;

  const pendingEvaluations = useMemo<PendingEvaluationItem[]>(() => {
    const completedIds = new Set<ProtocolId>(
      participantAssessments.map((a) => a.protocolId)
    );

    const activeFunctional = defaultProtocolsRepository
      .getAll()
      .filter((p) => p.enabled !== false)
      .map<PendingEvaluationItem>((p) => ({
        id: p.id,
        shortName: p.shortName,
        title: p.name,
        categoryLabel: 'Avaliação Funcional',
        protocol: p,
      }));

    const ivcfItem: PendingEvaluationItem = {
      id: 'IVCF-20',
      shortName: 'IVCF-20',
      title: 'Índice de Vulnerabilidade Clínico-Funcional',
      categoryLabel: 'Questionário • 20 questões',
      isQuestionnaire: true,
    };

    return [...activeFunctional, ivcfItem].filter(
      (item) => !completedIds.has(item.id)
    );
  }, [participantAssessments]);

  const handleApplyEvaluation = (item: PendingEvaluationItem) => {
    if (item.isQuestionnaire) {
      rootNav.navigate('IVCFQuestionnaire', { participant });
      return;
    }
    if (item.protocol) {
      rootNav.navigate('TestGuide', {
        protocol: item.protocol,
        participant,
      });
    }
  };

  const handleOpenAssessmentDetail = (assessment: Assessment) => {
    if (onViewAssessmentDetail) {
      onViewAssessmentDetail(assessment.id);
      return;
    }
    rootNav.navigate('EvaluationDetail', { assessment });
  };

  const formatAssessmentResult = (a: Assessment): string => {
    if (a.protocolId === 'IVCF-20') {
      const score = a.resultValue ?? 0;
      return a.notes ? `${score} pts (${a.notes})` : `${score} pts`;
    }
    if (
      (a.protocolId.startsWith('30s') || a.protocolId.startsWith('1M')) &&
      a.repetitions !== undefined
    ) {
      return `${a.repetitions} reps`;
    }
    const sec = a.durationSeconds ?? a.resultValue ?? 0;
    return `${sec} s`;
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Participante" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Profile Box */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.fullName}>{participant.fullName}</Text>
            <Text style={styles.subInfo}>
              CPF: {formattedCpf || 'Não informado'} &bull; {age} anos
            </Text>
            {sexLabel ? (
              <View style={styles.sexBadge}>
                <Text style={styles.sexBadgeText}>{sexLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('dados')}
            style={[styles.tabButton, activeTab === 'dados' && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === 'dados' && styles.tabTextActive]}>
              Dados do Participante
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('historico')}
            style={[styles.tabButton, activeTab === 'historico' && styles.tabButtonActive]}
          >
            <View style={styles.tabLabelRow}>
              <Text
                style={[styles.tabText, activeTab === 'historico' && styles.tabTextActive]}
              >
                Histórico de Avaliações
              </Text>
              {pendingEvaluations.length > 0 && (
                <View style={styles.pendingCountBadge}>
                  <Text style={styles.pendingCountBadgeText}>
                    {pendingEvaluations.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'dados' ? (
          <View style={styles.tabContent}>
            {/* 1. Dados Pessoais */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBg}>
                  <User size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Nome Completo</Text>
                  <Text style={styles.metaValue}>{participant.fullName}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>CPF</Text>
                  <Text style={styles.metaValue}>{formattedCpf || 'Não informado'}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Data de Nascimento</Text>
                  <Text style={styles.metaValue}>
                    {formatDateBR(participant.birthDate)} ({age} anos)
                  </Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Sexo</Text>
                  <Text style={styles.metaValue}>{sexLabel || 'Não informado'}</Text>
                </View>
              </View>
            </View>

            {/* 2. Medidas Corporais */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBg}>
                  <Activity size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Medidas Corporais</Text>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Peso</Text>
                  <Text style={styles.metaValue}>
                    {participant.weightKg ? `${participant.weightKg} kg` : 'Não informado'}
                  </Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Altura</Text>
                  <Text style={styles.metaValue}>
                    {participant.heightCm ? `${participant.heightCm} cm` : 'Não informado'}
                  </Text>
                </View>
                {imc ? (
                  <View style={styles.gridCol}>
                    <Text style={styles.metaLabel}>IMC Estimado</Text>
                    <Text style={styles.metaValue}>{imc} kg/m²</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* 3. Escolaridade */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBg}>
                  <GraduationCap size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Escolaridade</Text>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.metaLabel}>Grau de Instrução</Text>
                <Text style={styles.metaValue}>
                  {participant.education || 'Não informado'}
                </Text>
              </View>
            </View>

            {/* 4. Dados Socioeconômicos */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBg}>
                  <Briefcase size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Dados Socioeconômicos</Text>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Faixa de Renda</Text>
                  <Text style={styles.metaValue}>
                    {extractIncomeRange(participant.socioeconomicLevel)}
                  </Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.metaLabel}>Classe Social</Text>
                  <Text style={styles.metaValue}>
                    {extractSocialClass(participant.socioeconomicLevel)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 5. Endereço Completo */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBg}>
                  <MapPin size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Endereço Completo</Text>
              </View>

              {/* Linha 1: CEP e Logradouro / Rua */}
              <View style={styles.gridRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>CEP</Text>
                  <Text style={styles.metaValue}>{addressData.cep}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.metaLabel}>Logradouro / Rua</Text>
                  <Text style={styles.metaValue}>{addressData.street}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Linha 2: Número e Complemento */}
              <View style={styles.gridRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Número</Text>
                  <Text style={styles.metaValue}>{addressData.number}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.metaLabel}>Complemento</Text>
                  <Text style={styles.metaValue}>{addressData.complement}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Linha 3: Bairro, Cidade e UF */}
              <View style={styles.gridRow}>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.metaLabel}>Bairro</Text>
                  <Text style={styles.metaValue}>{addressData.neighborhood}</Text>
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.metaLabel}>Cidade</Text>
                  <Text style={styles.metaValue}>{addressData.city}</Text>
                </View>
                <View style={{ flex: 0.6 }}>
                  <Text style={styles.metaLabel}>UF</Text>
                  <Text style={styles.metaValue}>{addressData.state}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.tabContent}>
            {/* Seção 1: Avaliações Pendentes (Não Realizadas) */}
            <View style={styles.historyGroupHeader}>
              <View style={styles.historyGroupTitleRow}>
                <Clock size={16} color="#D97706" />
                <Text style={styles.historyGroupTitle}>
                  Avaliações Pendentes ({pendingEvaluations.length})
                </Text>
              </View>
              <Text style={styles.historyGroupSubtitle}>
                Protocolos ativos que ainda não foram aplicados a este participante.
              </Text>
            </View>

            {pendingEvaluations.length > 0 ? (
              <View style={styles.pendingList}>
                {pendingEvaluations.map((pending) => (
                  <View key={pending.id} style={styles.pendingCard}>
                    <View style={styles.pendingIconBox}>
                      {pending.isQuestionnaire ? (
                        <ClipboardCheck size={20} color="#D97706" />
                      ) : (
                        <Activity size={20} color="#D97706" />
                      )}
                    </View>

                    <View style={styles.pendingInfo}>
                      <View style={styles.pendingTitleRow}>
                        <Text style={styles.pendingShortName}>{pending.shortName}</Text>
                        <View style={styles.notDonePill}>
                          <Text style={styles.notDonePillText}>Não realizada</Text>
                        </View>
                      </View>
                      <Text style={styles.pendingFullName} numberOfLines={1}>
                        {pending.title}
                      </Text>
                      <Text style={styles.pendingCategory}>{pending.categoryLabel}</Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleApplyEvaluation(pending)}
                      style={styles.applyButton}
                    >
                      <Play size={13} color={Colors.surface} fill={Colors.surface} />
                      <Text style={styles.applyButtonText}>Aplicar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.allDoneBanner}>
                <CheckCircle2 size={20} color={Colors.success} />
                <Text style={styles.allDoneText}>
                  Todas as avaliações ativas já foram realizadas por este participante.
                </Text>
              </View>
            )}

            {/* Seção 2: Avaliações Realizadas */}
            <View style={[styles.historyGroupHeader, styles.completedGroupHeader]}>
              <View style={styles.historyGroupTitleRow}>
                <CheckCircle2 size={16} color={Colors.primary} />
                <Text style={styles.historyGroupTitle}>
                  Avaliações Realizadas ({participantAssessments.length})
                </Text>
              </View>
              <Text style={styles.historyGroupSubtitle}>
                Coletas e questionários já concluídos por este participante.
              </Text>
            </View>

            {participantAssessments.length > 0 ? (
              participantAssessments.map((item) => {
                const badgeText =
                  item.protocolId === 'IVCF-20'
                    ? 'IVCF'
                    : item.protocolId.startsWith('30s')
                    ? '30s'
                    : item.protocolId.startsWith('1M')
                    ? '1M'
                    : item.protocolId.startsWith('5T')
                    ? '5T'
                    : item.protocolId.slice(0, 3);

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleOpenAssessmentDetail(item)}
                    style={styles.assessmentCard}
                  >
                    <View style={styles.protocolBadge}>
                      <Text style={styles.protocolBadgeText}>{badgeText}</Text>
                    </View>
                    <View style={styles.assessmentInfo}>
                      <Text style={styles.assessmentProtocol}>{item.protocolId}</Text>
                      <Text style={styles.assessmentMeta}>
                        {formatDateBR(item.createdAt)} &bull; {formatAssessmentResult(item)}
                      </Text>
                    </View>
                    <StatusChip status={item.syncStatus} showText={false} />
                  </TouchableOpacity>
                );
              })
            ) : (
              <EmptyState
                title="Sem avaliações anteriores"
                description="Este participante ainda não possui coletas registradas."
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
  },
  subInfo: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  sexBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  sexBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  tabContent: {
    marginBottom: Spacing.lg,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridCol: {
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Spacing.sm,
  },
  metaLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMain,
    fontWeight: Typography.weights.semibold,
  },
  fullAddressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMain,
    fontWeight: Typography.weights.semibold,
    lineHeight: 20,
  },
  assessmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  protocolBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(41, 98, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  protocolBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  assessmentInfo: {
    flex: 1,
  },
  assessmentProtocol: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  assessmentMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingCountBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCountBadgeText: {
    fontSize: 11,
    fontWeight: Typography.weights.extrabold,
    color: '#D97706',
  },
  historyGroupHeader: {
    marginBottom: Spacing.sm,
  },
  completedGroupHeader: {
    marginTop: Spacing.lg,
  },
  historyGroupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  historyGroupTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  historyGroupSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  pendingList: {
    gap: Spacing.sm,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  pendingIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  pendingInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  pendingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  pendingShortName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
  },
  notDonePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  notDonePillText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pendingFullName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  pendingCategory: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
  },
  applyButtonText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.surface,
  },
  allDoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  allDoneText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: '#166534',
    lineHeight: 18,
  },
});
