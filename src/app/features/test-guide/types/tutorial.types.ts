import React from 'react';

export type TutorialStep = {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  illustrationType: 'environment' | 'positioning' | 'smartphone' | 'movement';
};
