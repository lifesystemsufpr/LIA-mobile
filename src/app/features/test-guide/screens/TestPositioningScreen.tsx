import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Colors,
  Spacing,
  TopAppBar,
  Typography,
} from '../../../shared';
import { TestGuideAssets } from '../assets';

export type TestPositioningScreenProps = {
  onConfirm: () => void;
  onBack?: () => void;
};

export const TestPositioningScreen: React.FC<TestPositioningScreenProps> = ({
  onConfirm,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <TopAppBar title="Posicionamento" onBack={onBack} />

      <View style={styles.content}>
        {/* Official Positioning Illustration from assets */}
        <View style={styles.illustrationCard}>
          <Image
            source={TestGuideAssets.step3Smartphone}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Ilustração do posicionamento do smartphone contra o peito"
          />
        </View>

        <Text style={styles.instructionTitle}>Posicione o smartphone</Text>
        <Text style={styles.instructionDesc}>
          Segure o smartphone na <Text style={styles.boldText}>vertical</Text>, com a câmera frontal voltada para cima e a tela pressionada contra o peito.{'\n\n'}
          <Text style={styles.mutedAdvice}>
            Utilize as duas mãos para manter o aparelho firme contra o tórax durante a avaliação.
          </Text>
        </Text>

        <Button
          title="Confirmar posicionamento"
          variant="primary"
          size="lg"
          onPress={onConfirm}
          style={styles.confirmBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCard: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  instructionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  instructionDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    maxWidth: 320,
  },
  boldText: {
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  mutedAdvice: {
    fontSize: Typography.sizes.xs,
    color: '#9CA3AF',
  },
  confirmBtn: {
    width: '100%',
  },
});
