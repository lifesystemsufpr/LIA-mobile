import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, ArrowRight, ShieldCheck, Smartphone, Users } from 'lucide-react-native';
import { BorderRadius, Button, Colors, Spacing, Typography } from '../../../shared';

export type OnboardingScreenProps = {
  onComplete: () => void;
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>LIA</Text>
          </View>
          <Text style={styles.title}>Bem-vindo ao LIA Mobile</Text>
          <Text style={styles.subtitle}>
            Plataforma digital para avaliações funcionais geriátricas com sensores inerciais.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Users size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>1. Gestão de Participantes</Text>
              <Text style={styles.featureDesc}>
                Cadastre e acompanhe idosos com histórico completo e cálculo automático de idade.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Activity size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>2. Protocolos Validados</Text>
              <Text style={styles.featureDesc}>
                Aplique testes como 30sSTS, 5TSTS, 2MST e TUG com guias passo a passo.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Smartphone size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>3. Coleta Inercial a 60 Hz</Text>
              <Text style={styles.featureDesc}>
                Grave acelerômetro e giroscópio com contagem regressiva assistida por voz.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <ShieldCheck size={22} color={Colors.success} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>4. Operação Offline-First</Text>
              <Text style={styles.featureDesc}>
                Realize avaliações sem internet e sincronize com a LIA Web quando estiver conectado.
              </Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <Button
          title="Começar a Utilizar"
          variant="primary"
          size="lg"
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          iconPosition="right"
          onPress={onComplete}
          style={styles.startBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  featuresList: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  startBtn: {
    marginTop: Spacing.md,
  },
});
