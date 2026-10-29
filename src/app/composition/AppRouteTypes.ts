import { Assessment, Participant, Protocol, SensorSample } from '../shared';

export type MainTabParamList = {
  DashboardTab: undefined;
  ProtocolsTab: undefined;
  HistoryTab: undefined;
  ParticipantsTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  // Auth flow
  Login: undefined;
  Onboarding: undefined;

  // Main Tabs flow
  MainTabs: { screen?: keyof MainTabParamList };

  // Participants flow
  AddParticipant: undefined;
  ParticipantDetail: { participant: Participant };

  // Assessment flow
  SelectProtocol: { participant?: Participant };
  IVCFQuestionnaire: { participant?: Participant };
  SelectParticipant: { protocol?: Protocol; selectMode?: 'new-test' | 'select' };
  ParticipantSummaryModal: { participant: Participant; protocol?: Protocol };
  TestGuide: { protocol: Protocol; participant: Participant };
  TestPositioning: { protocol: Protocol; participant: Participant };
  Countdown: { protocol: Protocol; participant: Participant };
  TestExecution: { protocol: Protocol; participant: Participant };
  AssessmentSummary: {
    participant: Participant;
    protocol: Protocol;
    durationSeconds: number;
    repetitions: number;
    sampleCount: number;
    samples?: SensorSample[];
  };
  SyncSimulation: { assessment?: Assessment | null };

  // History flow
  EvaluationDetail: { assessment: Assessment };
};
