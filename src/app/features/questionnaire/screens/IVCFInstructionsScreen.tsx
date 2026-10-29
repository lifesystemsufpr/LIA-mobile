import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Clock, Ear, Hand, MessageSquare } from 'lucide-react-native';
import { Colors, Typography } from '../../../shared';

export type IVCFInstructionsScreenProps = {
  onStart: () => void;
  onBack?: () => void;
};

export const IVCFInstructionsScreen: React.FC<IVCFInstructionsScreenProps> = ({
  onStart,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header azul curvo do protótipo */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Voltar ao início"
          >
            <ArrowLeft size={22} color={Colors.surface} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>IVCF-20</Text>
        <Text style={styles.headerSubtitle}>Instruções</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Antes de iniciar a avaliação</Text>

          <Text style={styles.description}>
            O IVCF-20 é um instrumento de triagem para identificar vulnerabilidades clínico-funcionais do idoso. Leia as perguntas com clareza sem induzir respostas
          </Text>

          {/* Lista de Recomendações com ícones limpos conforme protótipo */}
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <View style={styles.iconWrap}>
                <MessageSquare size={22} color={Colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={styles.guidelineText}>
                Realize em local calmo e sem interrupções
              </Text>
            </View>

            <View style={styles.guidelineItem}>
              <View style={styles.iconWrap}>
                <Ear size={22} color={Colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={styles.guidelineText}>
                Leia cada pergunta de forma pausada
              </Text>
            </View>

            <View style={styles.guidelineItem}>
              <View style={styles.iconWrap}>
                <Hand size={22} color={Colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={styles.guidelineText}>
                Não tente explicar ou interpretar as perguntas para o paciente
              </Text>
            </View>

            <View style={styles.guidelineItem}>
              <View style={styles.iconWrap}>
                <Clock size={22} color={Colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={styles.guidelineText}>
                Tempo estimado: 5 a 10 minutos
              </Text>
            </View>
          </View>

          {/* Botão Iniciar centralizado conforme protótipo */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onStart}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #F7F9FC
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 48,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: Typography.weights.extrabold,
    color: Colors.surface, // #FFFFFF
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  contentCard: {
    backgroundColor: Colors.surface, // #FFFFFF
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border, // #E4E7EC
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: Colors.primaryDark, // #091223
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primary, // #2962FF
    marginBottom: 14,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted, // #667085
    lineHeight: 22,
    marginBottom: 26,
  },
  guidelinesList: {
    gap: 18,
    marginBottom: 32,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain, // #172033
    fontWeight: Typography.weights.medium,
    lineHeight: 20,
  },
  startButton: {
    alignSelf: 'center',
    width: 170,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary, // #2962FF
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary, // #2962FF
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.surface, // #FFFFFF
  },
});
