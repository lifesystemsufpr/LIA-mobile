import { RootStackParamList } from './AppRouteTypes';

export type RouteMetadata = {
  title: string;
  isProtected: boolean;
};

export const AppNavigationRegistry: Record<keyof RootStackParamList, RouteMetadata> = {
  Login: { title: 'Entrar', isProtected: false },
  Onboarding: { title: 'Primeiros Passos', isProtected: false },
  MainTabs: { title: 'LIA Mobile', isProtected: true },
  AddParticipant: { title: 'Novo Participante', isProtected: true },
  ParticipantDetail: { title: 'Detalhes do Participante', isProtected: true },
  SelectProtocol: { title: 'Escolha do Teste', isProtected: true },
  SelectParticipant: { title: 'Selecionar Participante', isProtected: true },
  ParticipantSummaryModal: { title: 'Resumo do Participante', isProtected: true },
  TestGuide: { title: 'Instruções do Teste', isProtected: true },
  TestPositioning: { title: 'Posicionamento', isProtected: true },
  Countdown: { title: 'Prepare-se', isProtected: true },
  TestExecution: { title: 'Execução do Teste', isProtected: true },
  AssessmentSummary: { title: 'Resumo da Avaliação', isProtected: true },
  SyncSimulation: { title: 'Sincronização', isProtected: true },
  EvaluationDetail: { title: 'Detalhes da Avaliação', isProtected: true },
};
