import { defaultAssessmentsRepository } from '../../history/services/AssessmentsRepository';
import { defaultParticipantsRepository } from '../../participants/services/ParticipantsRepository';

export type DashboardMetrics = {
  totalAssessments: number;
  totalParticipants: number;
  syncedAssessments: number;
  femaleCount: number;
  maleCount: number;
  sts30Count: number;
  mst2Count: number;
};

export class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    const [participants, assessments] = await Promise.all([
      defaultParticipantsRepository.getAll(),
      defaultAssessmentsRepository.getAll(),
    ]);

    const totalParticipants = participants.length;
    const totalAssessments = assessments.length;
    const syncedAssessments = assessments.filter((a) => a.syncStatus === 'synced').length;

    const femaleCount = participants.filter((p) => p.biologicalSex === 'female').length;
    const maleCount = participants.filter((p) => p.biologicalSex === 'male').length;

    const sts30Count = assessments.filter((a) => a.protocolId === '30sSTS').length;
    const mst2Count = assessments.filter((a) => a.protocolId === '2MST' || a.protocolId === 'TUG').length;

    return {
      totalAssessments,
      totalParticipants,
      syncedAssessments,
      femaleCount,
      maleCount,
      sts30Count,
      mst2Count,
    };
  }
}

export const defaultDashboardService = new DashboardService();
