import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, Download, Home, Send } from 'lucide-react-native';
import {
  Button,
  Colors,
  ConfirmationDialog,
  exportAndShareCsv,
  formatSensorSamplesCsv,
  Participant,
  Protocol,
  SensorSample,
  TopAppBar,
} from '../../../shared';
import { useSensorCollectionStore } from '../../sensor-collection';

export type AssessmentSummaryScreenProps = {
  participant: Participant;
  protocol: Protocol;
  durationSeconds: number;
  repetitions: number;
  sampleCount: number;
  samples?: SensorSample[];
  onConfirmSend: () => void;
  onBackToHome: () => void;
};

export const AssessmentSummaryScreen: React.FC<AssessmentSummaryScreenProps> = ({
  participant,
  protocol,
  durationSeconds,
  repetitions,
  sampleCount,
  samples,
  onConfirmSend,
  onBackToHome,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [confirmSendVisible, setConfirmSendVisible] = useState(false);

  const handleExportAndShare = async () => {
    setIsExporting(true);
    try {
      const activeSamples =
        samples && samples.length > 0
          ? samples
          : useSensorCollectionStore.getState().samples;

      const csv = formatSensorSamplesCsv(activeSamples);
      const sanitizedName = (participant.fullName || 'participante')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_');
      const filename = `coleta_${protocol.shortName.toLowerCase()}_${sanitizedName}.csv`;

      await exportAndShareCsv(
        csv,
        filename,
        `Compartilhar dados da avaliação (${protocol.shortName}) via WhatsApp`
      );
    } catch {
      // Handled in exportAndShareCsv
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmSend = () => {
    setConfirmSendVisible(false);
    onConfirmSend();
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Resumo" onBack={onBackToHome} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.headerArea}>
          <View style={styles.successBadge}>
            <Check size={32} color={Colors.success} />
          </View>
          <Text style={styles.title}>Avaliação concluída</Text>
          <Text style={styles.subtitle}>Coleta finalizada com sucesso</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>RESUMO DA COLETA</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Participante</Text>
              <Text style={styles.valueBold}>{participant.fullName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Teste</Text>
              <Text style={styles.valueBold}>{protocol.shortName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Duração</Text>
              <Text style={styles.valueBold}>{durationSeconds} s</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Repetições</Text>
              <Text style={styles.repsHighlight}>{repetitions}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Sensores</Text>
              <View style={styles.sensorPill}>
                <Text style={styles.sensorPillText}>
                  Acel + Giro (60Hz) &bull; {sampleCount} amostras
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Enviar Dados"
            variant="primary"
            size="lg"
            icon={<Send size={18} color="#FFFFFF" />}
            onPress={() => setConfirmSendVisible(true)}
            style={styles.sendButton}
          />

          <Button
            title="Baixar CSV"
            variant="secondary"
            size="lg"
            loading={isExporting}
            icon={<Download size={18} color="#FFFFFF" />}
            onPress={handleExportAndShare}
            style={styles.downloadButton}
          />

          <Button
            title="Voltar ao Início"
            variant="outline"
            size="lg"
            icon={<Home size={18} color={Colors.primaryDark} />}
            onPress={onBackToHome}
            style={styles.homeButton}
          />
        </View>
      </ScrollView>

      {/* Send Confirmation Dialog */}
      <ConfirmationDialog
        visible={confirmSendVisible}
        title="Enviar Dados?"
        message="Deseja confirmar o envio dos dados desta avaliação para a nuvem?"
        confirmLabel="Sim, enviar"
        cancelLabel="Voltar"
        onConfirm={handleConfirmSend}
        onCancel={() => setConfirmSendVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerArea: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#091223',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  cardBody: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  valueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  repsHighlight: {
    fontSize: 28,
    fontWeight: '800',
    color: '#091223',
  },
  sensorPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sensorPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  actionsContainer: {
    gap: 12,
  },
  sendButton: {
    width: '100%',
    borderRadius: 14,
  },
  downloadButton: {
    width: '100%',
    borderRadius: 14,
  },
  homeButton: {
    width: '100%',
    borderRadius: 14,
  },
});
