import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { Button, Protocol } from '../../../shared';
import { StepPaginationDots } from '../components/StepPaginationDots';
import { TutorialSlideItem } from '../components/TutorialSlideItem';
import { TutorialStep } from '../types/tutorial.types';

export type TestGuideScreenProps = {
  protocol: Protocol;
  onBack?: () => void;
  onProceedToCountdown: () => void;
  onViewPositioning?: () => void;
};

export const TestGuideScreen: React.FC<TestGuideScreenProps> = ({
  protocol,
  onBack,
  onProceedToCountdown,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList<TutorialStep>>(null);

  // Status Bar synchronization with screen and header color (#F7F9FC)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#F7F9FC');
      }
      return () => {
        StatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('#FFFFFF');
        }
      };
    }, [])
  );

  // 4-step tutorial data tailored to 30sSTS protocol
  const steps: TutorialStep[] = useMemo(() => {
    const is1Minute = protocol.durationSeconds === 60;
    const durationText = is1Minute ? 'durante 1 minuto' : 'durante 30 segundos';

    return [
      {
        id: 1,
        stepNumber: 1,
        title: 'Prepare o ambiente',
        description:
          'Posicione uma cadeira firme, sem braços, sobre uma superfície estável. Verifique se há espaço livre ao redor para realizar os movimentos com segurança.',
        illustrationType: 'environment',
      },
      {
        id: 2,
        stepNumber: 2,
        title: 'Posicione o participante',
        description:
          'Oriente o participante a sentar-se no centro da cadeira, manter a postura ereta e apoiar os pés firmemente no chão.',
        illustrationType: 'positioning',
      },
      {
        id: 3,
        stepNumber: 3,
        title: 'Posicione o smartphone',
        description:
          'Segure o smartphone na vertical, com a câmera frontal voltada para cima e a tela pressionada contra o peito. Utilize as duas mãos para manter o aparelho firme contra o tórax durante a avaliação.',
        illustrationType: 'smartphone',
      },
      {
        id: 4,
        stepNumber: 4,
        title: 'Pronto para começar?',
        description: `Ao iniciar, o participante deverá levantar-se completamente e voltar a sentar-se repetidamente ${durationText}, mantendo o aparelho firme contra o peito. O profissional deve acompanhar a execução e interromper o teste se houver necessidade de preservar a segurança.`,
        illustrationType: 'movement',
      },
    ];
  }, [protocol.durationSeconds]);

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Navigate to step programmatically
  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onProceedToCountdown();
    } else {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleHeaderBack = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    } else {
      onBack?.();
    }
  };

  // Sync index on swipe gesture
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex >= 0 && newIndex < totalSteps && newIndex !== currentStep) {
      setCurrentStep(newIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" animated />

      {/* Compact Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top > 0 ? insets.top + 8 : 14,
            paddingBottom: 10,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleHeaderBack}
          style={styles.backButton}
          accessibilityLabel={currentStep > 0 ? 'Etapa anterior' : 'Voltar'}
        >
          <ChevronLeft size={24} color="#172033" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Instruções</Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Horizontal Paging Slider for Steps */}
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={steps}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TutorialSlideItem step={item} width={width} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          bounces={false}
          style={styles.flatList}
        />
      </View>

      {/* Bottom Area: Pagination Dots & Primary / Secondary Actions */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 20 },
        ]}
      >
        {/* Pagination Indicators */}
        <StepPaginationDots
          totalSteps={totalSteps}
          currentStep={currentStep}
          onSelectStep={goToStep}
        />

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            title={isLastStep ? 'Iniciar avaliação' : 'Próximo'}
            variant="primary"
            size="lg"
            fullWidth
            icon={
              isLastStep ? (
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <ChevronRight size={20} color="#FFFFFF" />
              )
            }
            iconPosition="right"
            onPress={handleNext}
            style={styles.primaryBtn}
          />

          {currentStep > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePrev}
              style={styles.secondaryBtn}
              accessibilityLabel="Voltar à etapa anterior"
            >
              <Text style={styles.secondaryBtnText}>Voltar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.secondaryBtnSpacer} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#F7F9FC',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  flatList: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: '#F7F9FC',
  },
  buttonGroup: {
    gap: 8,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#2962FF',
    height: 52,
    borderRadius: 14,
  },
  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667085',
  },
  secondaryBtnSpacer: {
    height: 38,
  },
});
