import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Activity,
  Calendar,
  Check,
  ChevronDown,
  Cloud,
  X,
} from 'lucide-react-native';
import { SyncStatus } from '../../../shared';
import { DateRangeFilter } from '../store/historyStore';
import { Colors } from '../../../shared';

export type HistoryFilterBarProps = {
  selectedProtocol: string | null;
  selectedSyncStatus: SyncStatus | 'all';
  selectedDate: DateRangeFilter | null;
  onSelectProtocol: (protocol: string | null) => void;
  onSelectSyncStatus: (status: SyncStatus | 'all') => void;
  onSelectDate: (date: DateRangeFilter | null) => void;
};

export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = ({
  selectedProtocol,
  selectedSyncStatus,
  selectedDate,
  onSelectProtocol,
  onSelectSyncStatus,
  onSelectDate,
}) => {
  const [protocolModalVisible, setProtocolModalVisible] = useState(false);
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const maskDateInput = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const dateRangeLabel = useMemo(() => {
    if (!selectedDate) {
      return 'Todas as datas';
    }
    const { startDate, endDate } = selectedDate;
    if (startDate && endDate) {
      if (startDate === endDate) return startDate;
      return `${startDate} - ${endDate}`;
    }
    if (startDate) return `De ${startDate}`;
    if (endDate) return `Até ${endDate}`;
    return 'Todas as datas';
  }, [selectedDate]);

  const handleOpenDateModal = () => {
    if (selectedDate) {
      setStartDateInput(selectedDate.startDate ?? '');
      setEndDateInput(selectedDate.endDate ?? '');
    } else {
      setStartDateInput('');
      setEndDateInput('');
    }
    setDateModalVisible(true);
  };

  const protocols = [
    { label: 'Todos os testes', value: null },
    { label: '30sSTS', value: '30sSTS' },
    { label: '1MSTS', value: '1MSTS' },
    { label: '5TSTS', value: '5TSTS' },
    { label: 'TUG', value: 'TUG' },
    { label: '2MST', value: '2MST' },
  ];

  const syncOptions: { label: string; value: SyncStatus | 'all' }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Sincronizadas', value: 'synced' },
    { label: 'Pendentes', value: 'pending' },
  ];

  const protocolLabel = selectedProtocol ?? 'Tipo de Teste';
  const syncLabel =
    selectedSyncStatus === 'synced'
      ? 'Sincronizadas'
      : selectedSyncStatus === 'pending'
        ? 'Pendentes'
        : selectedSyncStatus === 'syncing'
          ? 'Sincronizando'
          : selectedSyncStatus === 'failed'
            ? 'Falha'
            : 'Sincronização';


  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        {/* Date Filter */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenDateModal}
          style={[styles.chip, selectedDate !== null && styles.chipActive]}
        >
          <Calendar size={18} color={Colors.primary} strokeWidth={2} />
          <Text style={[styles.chipText, selectedDate !== null && styles.chipTextActive]}>
            {dateRangeLabel}
          </Text>
          <ChevronDown size={15} color="#94A3B8" strokeWidth={2} />
        </TouchableOpacity>

        {/* Protocol Filter */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setProtocolModalVisible(true)}
          style={styles.chip}
        >
          <Activity size={18} color={Colors.primary} strokeWidth={2.4} />
          <Text style={styles.chipText}>
            {selectedProtocol ?? 'Tipo de Teste'}
          </Text>
          <ChevronDown size={15} color="#94A3B8" strokeWidth={2} />
        </TouchableOpacity>

        {/* Sync Status Filter */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSyncModalVisible(true)}
          style={styles.chip}
        >
          <Cloud size={18} color={Colors.primary} strokeWidth={2.2} />
          <Text style={styles.chipText}>
            {selectedSyncStatus === 'synced'
              ? 'Sincronizadas'
              : selectedSyncStatus === 'pending'
                ? 'Pendentes'
                : 'Sincronização'}
          </Text>
          <ChevronDown size={15} color="#94A3B8" strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>

      {/* Protocol Selection Modal */}
      <Modal
        visible={protocolModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProtocolModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setProtocolModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filtrar por Tipo de Teste</Text>
                {protocols.map((p) => {
                  const isSelected = selectedProtocol === p.value;
                  return (
                    <TouchableOpacity
                      key={p.label}
                      style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                      onPress={() => {
                        onSelectProtocol(p.value);
                        setProtocolModalVisible(false);
                      }}
                    >
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                        {p.label}
                      </Text>
                      {isSelected && <Check size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Sync Status Modal */}
      <Modal
        visible={syncModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSyncModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSyncModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filtrar por Sincronização</Text>
                {syncOptions.map((s) => {
                  const isSelected = selectedSyncStatus === s.value;
                  return (
                    <TouchableOpacity
                      key={s.value}
                      style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                      onPress={() => {
                        onSelectSyncStatus(s.value);
                        setSyncModalVisible(false);
                      }}
                    >
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                        {s.label}
                      </Text>
                      {isSelected && <Check size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Selection Modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDateModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>Filtrar por Data</Text>
                  <TouchableOpacity
                    onPress={() => setDateModalVisible(false)}
                    style={styles.closeButton}
                    accessibilityLabel="Fechar"
                  >
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Option 1: Todos os testes de todas as datas */}
                <TouchableOpacity
                  style={[
                    styles.allDatesItem,
                    selectedDate === null && styles.allDatesItemSelected,
                  ]}
                  onPress={() => {
                    onSelectDate(null);
                    setStartDateInput('');
                    setEndDateInput('');
                    setDateModalVisible(false);
                  }}
                >
                  <View style={styles.allDatesTextContainer}>
                    <Text
                      style={[
                        styles.allDatesTitle,
                        selectedDate === null && styles.modalItemTextSelected,
                      ]}
                    >
                      Todos os testes de todas as datas
                    </Text>
                    <Text style={styles.allDatesSubtext}>
                      Exibir histórico completo sem restrição
                    </Text>
                  </View>
                  {selectedDate === null && <Check size={18} color={Colors.primary} />}
                </TouchableOpacity>

                <View style={styles.modalDivider} />

                {/* Option 2: Período Personalizado (De ... Até ...) */}
                <Text style={styles.modalSubheading}>SELECIONAR PERÍODO</Text>

                <View style={styles.dateInputsContainer}>
                  <View style={styles.dateFieldWrapper}>
                    <Text style={styles.dateFieldLabel}>De (data inicial)</Text>
                    <View style={styles.dateInputWithIcon}>
                      <Calendar size={16} color="#64748B" style={styles.inputCalendarIcon} />
                      <TextInput
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor="#94A3B8"
                        value={startDateInput}
                        onChangeText={(t) => setStartDateInput(maskDateInput(t))}
                        style={styles.dateInputField}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                  </View>

                  <View style={styles.dateFieldWrapper}>
                    <Text style={styles.dateFieldLabel}>Até (data final)</Text>
                    <View style={styles.dateInputWithIcon}>
                      <Calendar size={16} color="#64748B" style={styles.inputCalendarIcon} />
                      <TextInput
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor="#94A3B8"
                        value={endDateInput}
                        onChangeText={(t) => setEndDateInput(maskDateInput(t))}
                        style={styles.dateInputField}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActionsRow}>
                  {selectedDate !== null && (
                    <TouchableOpacity
                      style={styles.clearDateButton}
                      onPress={() => {
                        onSelectDate(null);
                        setStartDateInput('');
                        setEndDateInput('');
                        setDateModalVisible(false);
                      }}
                    >
                      <Text style={styles.clearDateButtonText}>Limpar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.applyDateButton,
                      !(startDateInput.trim() || endDateInput.trim()) && styles.applyDateButtonDisabled,
                    ]}
                    disabled={!(startDateInput.trim() || endDateInput.trim())}
                    onPress={() => {
                      if (startDateInput.trim() || endDateInput.trim()) {
                        onSelectDate({
                          startDate: startDateInput.trim() || null,
                          endDate: endDateInput.trim() || null,
                        });
                        setDateModalVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.applyDateButtonText}>Aplicar período</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    marginTop: 4,
    marginBottom: 6,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemSelected: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  modalItemText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF6FF',
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  allDatesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  allDatesItemSelected: {
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  allDatesTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  allDatesTitle: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  allDatesSubtext: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  dateInputsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  dateFieldWrapper: {
    gap: 6,
  },
  dateFieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  dateInputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#F8FAFC',
  },
  inputCalendarIcon: {
    marginRight: 8,
  },
  dateInputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clearDateButton: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  clearDateButtonText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '600',
  },
  applyDateButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyDateButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  applyDateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalSubheading: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
});
