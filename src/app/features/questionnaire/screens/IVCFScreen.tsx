import React, { useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../composition/AppRouteTypes';
import { ParticipantsListScreen } from '../../participants';
import { SyncScreen } from '../../sync';
import { Participant } from '../../../shared';
import { IVCFInstructionsScreen } from './IVCFInstructionsScreen';
import { IVCFQuestionsScreen } from './IVCFQuestionsScreen';
import { IVCFResultScreen } from './IVCFResultScreen';
import { calculateIVCFScore, IVCFResultData } from '../services/ivcfData';

export const IVCFScreen: React.FC = () => {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'IVCFQuestionnaire'>>();
  const preselectedParticipant = route.params?.participant ?? null;

  const [step, setStep] = useState<
    'instructions' | 'select_participant' | 'questions' | 'result' | 'sync'
  >('instructions');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(
    preselectedParticipant
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<IVCFResultData | null>(null);

  const handleStartFromInstructions = () => {
    if (preselectedParticipant) {
      setSelectedParticipant(preselectedParticipant);
      setAnswers({});
      setResult(null);
      setStep('questions');
      return;
    }
    setStep('select_participant');
  };

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setAnswers({});
    setResult(null);
    setStep('questions');
  };

  const handleBackToInstructions = () => {
    setStep('instructions');
  };

  const handleBackToSelection = () => {
    if (preselectedParticipant) {
      setStep('instructions');
      return;
    }
    setStep('select_participant');
  };

  const handleFinishQuestions = (completedAnswers: Record<number, number>) => {
    setAnswers(completedAnswers);
    const computed = calculateIVCFScore(completedAnswers);
    setResult(computed);
    setStep('result');
  };

  const handleBackToQuestions = () => {
    setStep('questions');
  };

  const handleExitToDashboard = () => {
    setSelectedParticipant(null);
    setAnswers({});
    setResult(null);
    setStep('instructions');
    if (rootNav.canGoBack()) {
      rootNav.goBack();
    } else {
      rootNav.navigate('MainTabs', { screen: 'DashboardTab' });
    }
  };

  const handleConfirmSend = () => {
    setStep('sync');
  };

  const handleStartNewQuestionnaire = () => {
    setSelectedParticipant(null);
    setAnswers({});
    setResult(null);
    setStep('select_participant');
  };

  const handleFinishAll = () => {
    setSelectedParticipant(null);
    setAnswers({});
    setResult(null);
    setStep('instructions');
    rootNav.navigate('MainTabs', { screen: 'DashboardTab' });
  };

  if (step === 'instructions') {
    return (
      <IVCFInstructionsScreen
        onStart={handleStartFromInstructions}
        onBack={handleExitToDashboard}
      />
    );
  }

  if (step === 'select_participant') {
    return (
      <ParticipantsListScreen
        isSelectionMode
        onBack={handleBackToInstructions}
        onAddNewParticipant={() => rootNav.navigate('AddParticipant')}
        onSelectParticipant={handleSelectParticipant}
      />
    );
  }

  if (step === 'questions') {
    return (
      <IVCFQuestionsScreen
        participant={selectedParticipant}
        onBackToSelection={handleBackToSelection}
        onFinish={handleFinishQuestions}
      />
    );
  }

  if (step === 'result' && result) {
    return (
      <IVCFResultScreen
        result={result}
        answers={answers}
        participant={selectedParticipant}
        onBackToQuestions={handleBackToQuestions}
        onFinish={handleConfirmSend}
      />
    );
  }

  if (step === 'sync') {
    return (
      <SyncScreen
        onFinishSync={handleFinishAll}
        onNewTest={handleStartNewQuestionnaire}
      />
    );
  }

  return (
    <IVCFInstructionsScreen
      onStart={handleStartFromInstructions}
      onBack={handleExitToDashboard}
    />
  );
};
