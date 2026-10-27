import { defaultStorageService, Participant, StorageServiceContract } from '../../../shared';
import {
  calculateIVCFScore,
  IVCF_QUESTIONS,
  IVCFQuestion,
  IVCFResultData,
} from './ivcfData';

const STORAGE_KEY = '@lia_ivcf_submissions';

export type IVCFSubmission = {
  id: string;
  participantId?: string;
  participantName?: string;
  answers: Record<number, number>;
  totalScore: number;
  maxScore: number;
  classification: string;
  severity: 'normal' | 'warning' | 'alert';
  recommendation: string;
  completedAt: string;
};

export class QuestionnairesRepository {
  constructor(private storage: StorageServiceContract = defaultStorageService) {}

  getQuestions(): IVCFQuestion[] {
    return IVCF_QUESTIONS;
  }

  calculateResult(answers: Record<number, number>): IVCFResultData {
    return calculateIVCFScore(answers);
  }

  async getSubmissions(): Promise<IVCFSubmission[]> {
    const data = await this.storage.getItem<IVCFSubmission[]>(STORAGE_KEY);
    return data || [];
  }

  async saveSubmission(
    answers: Record<number, number>,
    participant?: Participant
  ): Promise<IVCFSubmission> {
    const result = this.calculateResult(answers);
    const submission: IVCFSubmission = {
      id: `ivcf_${Date.now()}`,
      participantId: participant?.id,
      participantName: participant?.fullName,
      answers,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      classification: result.classification,
      severity: result.severity,
      recommendation: result.recommendation,
      completedAt: new Date().toISOString(),
    };

    const existing = await this.getSubmissions();
    const updated = [submission, ...existing];
    await this.storage.setItem(STORAGE_KEY, updated);

    return submission;
  }
}

export const defaultQuestionnairesRepository = new QuestionnairesRepository();
