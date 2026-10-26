import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TestGuideAssets } from '../assets';
import { TutorialStep } from '../types/tutorial.types';

export type TutorialSlideItemProps = {
  step: TutorialStep;
  width: number;
};

const STEP_IMAGES: Record<TutorialStep['illustrationType'], ImageSourcePropType> = {
  environment: TestGuideAssets.step1Environment,
  positioning: TestGuideAssets.step2Positioning,
  smartphone: TestGuideAssets.step3Smartphone,
  movement: TestGuideAssets.step4Movement,
};

export const TutorialSlideItem: React.FC<TutorialSlideItemProps> = ({
  step,
  width,
}) => {
  const imageSource = STEP_IMAGES[step.illustrationType];
  const illustrationHeight = Math.min(270, Math.round(width * 0.72));

  return (
    <View style={[styles.slide, { width }]}>
      {/* Central Illustration Area with Official Asset Image */}
      <View style={[styles.illustrationContainer, { height: illustrationHeight }]}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={step.title}
        />
      </View>

      {/* Step Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#172033',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14.5,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
  },
});
