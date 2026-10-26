import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/auth';
import { OnboardingScreen } from '../features/onboarding';
import {
  AddParticipantScreen,
  ParticipantDetailScreen,
  ParticipantsListScreen,
} from '../features/participants';
import { ProtocolsCatalogScreen } from '../features/protocols';
import { TestGuideScreen, TestPositioningScreen } from '../features/test-guide';
import { ParticipantSummaryModalScreen } from '../features/assessment';
import { CountdownScreen, TestExecutionScreen } from '../features/sensor-collection';
import { AssessmentSummaryScreen } from '../features/assessment-summary';
import { SyncScreen } from '../features/sync';
import { defaultAssessmentsRepository, EvaluationDetailScreen } from '../features/history';
import {
  darkScreenOptions,
  defaultScreenOptions,
  modalScreenOptions,
} from '../navigation';
import {
  Assessment,
  createId,
  useSessionStore,
} from '../shared';
import { RootStackParamList } from './AppRouteTypes';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useSessionStore();

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {!isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding">
            {({ navigation }) => (
              <OnboardingScreen onComplete={() => navigation.navigate('Login')} />
            )}
          </Stack.Screen>
        </Stack.Group>
      ) : (
        <Stack.Group>
          {/* Main 5-tab application */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* Participant stack */}
          <Stack.Screen name="AddParticipant" options={modalScreenOptions}>
            {({ navigation }) => (
              <AddParticipantScreen
                onSuccess={() => navigation.goBack()}
                onCancel={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="ParticipantDetail">
            {({ route, navigation }) => (
              <ParticipantDetailScreen
                participant={route.params.participant}
                onBack={() => navigation.goBack()}
                onStartAssessment={(participant) =>
                  navigation.navigate('SelectProtocol', { participant })
                }
                onViewAssessmentDetail={(assessmentId) => {
                  // Navigate to evaluation detail
                }}
              />
            )}
          </Stack.Screen>

          {/* Assessment flow */}
          <Stack.Screen name="SelectProtocol">
            {({ route, navigation }) => (
              <ProtocolsCatalogScreen
                onBack={() => navigation.goBack()}
                onSelectProtocol={(protocol) => {
                  if (route.params?.participant) {
                    navigation.navigate('TestGuide', {
                      protocol,
                      participant: route.params.participant,
                    });
                  } else {
                    navigation.navigate('SelectParticipant', {
                      protocol,
                      selectMode: 'select',
                    });
                  }
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="SelectParticipant">
            {({ route, navigation }) => (
              <ParticipantsListScreen
                isSelectionMode
                onBack={() => navigation.goBack()}
                onAddNewParticipant={() => navigation.navigate('AddParticipant')}
                onSelectParticipant={(participant) => {
                  navigation.navigate('ParticipantSummaryModal', {
                    participant,
                    protocol: route.params?.protocol,
                  });
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="ParticipantSummaryModal"
            options={modalScreenOptions}
          >
            {({ route, navigation }) => (
              <ParticipantSummaryModalScreen
                participant={route.params.participant}
                onCancel={() => navigation.goBack()}
                onContinue={() => {
                  if (route.params.protocol) {
                    navigation.navigate('TestGuide', {
                      protocol: route.params.protocol,
                      participant: route.params.participant,
                    });
                  } else {
                    navigation.navigate('SelectProtocol', {
                      participant: route.params.participant,
                    });
                  }
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="TestGuide"
            options={{
              statusBarStyle: 'dark',
              statusBarBackgroundColor: '#F7F9FC',
            }}
          >
            {({ route, navigation }) => (
              <TestGuideScreen
                protocol={route.params.protocol}
                onBack={() => navigation.goBack()}
                onViewPositioning={() =>
                  navigation.navigate('TestPositioning', {
                    protocol: route.params.protocol,
                    participant: route.params.participant,
                  })
                }
                onProceedToCountdown={() =>
                  navigation.navigate('Countdown', {
                    protocol: route.params.protocol,
                    participant: route.params.participant,
                  })
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="TestPositioning">
            {({ route, navigation }) => (
              <TestPositioningScreen
                onBack={() => navigation.goBack()}
                onConfirm={() =>
                  navigation.navigate('Countdown', {
                    protocol: route.params.protocol,
                    participant: route.params.participant,
                  })
                }
              />
            )}
          </Stack.Screen>

          {/* Immersive full-screen dark mode execution */}
          <Stack.Screen name="Countdown" options={darkScreenOptions}>
            {({ route, navigation }) => (
              <CountdownScreen
                protocol={route.params.protocol}
                onFinishCountdown={() =>
                  navigation.navigate('TestExecution', {
                    protocol: route.params.protocol,
                    participant: route.params.participant,
                  })
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="TestExecution" options={darkScreenOptions}>
            {({ route, navigation }) => (
              <TestExecutionScreen
                protocol={route.params.protocol}
                onRestartTest={() =>
                  navigation.navigate('TestGuide', {
                    protocol: route.params.protocol,
                    participant: route.params.participant,
                  })
                }
                onCancelTest={() =>
                  navigation.navigate('MainTabs', { screen: 'DashboardTab' })
                }
                onFinishTest={async (repetitions, durationSeconds, samples) => {
                  const newAssessment: Assessment = {
                    id: createId('eval'),
                    participantId: route.params.participant.id,
                    professionalId: 'prof_01',
                    protocolId: route.params.protocol.id,
                    startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
                    completedAt: new Date().toISOString(),
                    durationSeconds,
                    repetitions,
                    resultValue: repetitions,
                    resultUnit: 'repetições',
                    syncStatus: 'pending',
                    sampleCount: samples.length,
                    createdAt: new Date().toISOString(),
                  };

                  await defaultAssessmentsRepository.save(newAssessment);

                  navigation.navigate('AssessmentSummary', {
                    participant: route.params.participant,
                    protocol: route.params.protocol,
                    durationSeconds,
                    repetitions,
                    sampleCount: samples.length,
                    samples,
                  });
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AssessmentSummary">
            {({ route, navigation }) => (
              <AssessmentSummaryScreen
                participant={route.params.participant}
                protocol={route.params.protocol}
                durationSeconds={route.params.durationSeconds}
                repetitions={route.params.repetitions}
                sampleCount={route.params.sampleCount}
                samples={route.params.samples}
                onBackToHome={() =>
                  navigation.navigate('MainTabs', { screen: 'DashboardTab' })
                }
                onConfirmSend={() => navigation.navigate('SyncSimulation', {})}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="SyncSimulation">
            {({ route, navigation }) => (
              <SyncScreen
                assessment={route.params.assessment}
                onFinishSync={() =>
                  navigation.navigate('MainTabs', { screen: 'DashboardTab' })
                }
                onNewTest={() =>
                  navigation.navigate('SelectProtocol', {})
                }
              />
            )}
          </Stack.Screen>

          {/* History details */}
          <Stack.Screen name="EvaluationDetail">
            {({ route, navigation }) => (
              <EvaluationDetailScreen
                assessment={route.params.assessment}
                onBack={() => navigation.goBack()}
                onSyncNow={(assessment) =>
                  navigation.navigate('SyncSimulation', { assessment })
                }
              />
            )}
          </Stack.Screen>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
