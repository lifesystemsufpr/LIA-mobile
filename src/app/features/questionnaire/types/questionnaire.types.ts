export type QuestionnaireCategory =
  | 'sarcopenia'
  | 'funcionalidade'
  | 'fragilidade'
  | 'humor';

export type QuestionOption = {
  id: string;
  label: string;
  score: number;
};

export type QuestionnaireQuestion = {
  id: string;
  number: number;
  title: string;
  description?: string;
  options: QuestionOption[];
};

export type QuestionnaireScoreRange = {
  minScore: number;
  maxScore: number;
  classification: string;
  severity: 'normal' | 'attention' | 'warning' | 'alert';
  recommendation: string;
};

export type Questionnaire = {
  id: string;
  code: string;
  title: string;
  category: QuestionnaireCategory;
  categoryLabel: string;
  description: string;
  targetAudience: string;
  estimatedMinutes: number;
  instructions: string;
  questions: QuestionnaireQuestion[];
  scoreRanges: QuestionnaireScoreRange[];
};

export type QuestionnaireAnswer = {
  questionId: string;
  selectedOptionId: string;
  score: number;
  label: string;
};

export type QuestionnaireResult = {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  questionnaireCode: string;
  participantId: string;
  participantName: string;
  totalScore: number;
  maxScore: number;
  classification: string;
  severity: 'normal' | 'attention' | 'warning' | 'alert';
  recommendation: string;
  answers: QuestionnaireAnswer[];
  completedAt: string;
};
