import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/app/shared';

export type StepPaginationDotsProps = {
  totalSteps: number;
  currentStep: number;
  onSelectStep?: (index: number) => void;
};

export const StepPaginationDots: React.FC<StepPaginationDotsProps> = ({
  totalSteps,
  currentStep,
  onSelectStep,
}) => {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            disabled={!onSelectStep}
            onPress={() => onSelectStep?.(index)}
            accessibilityLabel={`Etapa ${index + 1} de ${totalSteps}`}
            accessibilityState={{ selected: isActive }}
            style={[styles.touchTarget]}
          >
            <View
              style={[
                styles.dot,
                isActive ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  touchTarget: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#E4E7EC',
  },
});
