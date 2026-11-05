import {
  Assessment,
  defaultAccessControlService,
  defaultStorageService,
  StorageServiceContract,
  SyncStatus,
  useSessionStore,
} from '../../../shared';

const STORAGE_KEY = '@lia_assessments';

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'eval_01',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_01',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: '30sSTS',
    protocolVersionId: '30sSTS-v1.0',
    startedAt: '2025-08-12T14:30:00.000Z',
    completedAt: '2025-08-12T14:30:30.000Z',
    durationSeconds: 30,
    repetitions: 12,
    resultValue: 12,
    resultUnit: 'repetições',
    syncStatus: 'synced',
    sampleCount: 1800,
    createdAt: '2025-08-12T14:30:30.000Z',
  },
  {
    id: 'eval_02',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_02',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: 'TUG',
    protocolVersionId: 'TUG-v1.0',
    startedAt: '2025-08-10T09:15:00.000Z',
    completedAt: '2025-08-10T09:15:11.400Z',
    durationSeconds: 11.4,
    resultValue: 11.4,
    resultUnit: 'segundos',
    syncStatus: 'synced',
    sampleCount: 684,
    createdAt: '2025-08-10T09:15:11.400Z',
  },
  {
    id: 'eval_03',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_03',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: '5TSTS',
    protocolVersionId: '5TSTS-v1.0',
    startedAt: '2025-08-01T16:20:00.000Z',
    completedAt: '2025-08-01T16:20:15.200Z',
    durationSeconds: 15.2,
    repetitions: 5,
    resultValue: 15.2,
    resultUnit: 'segundos',
    syncStatus: 'pending',
    sampleCount: 912,
    createdAt: '2025-08-01T16:20:15.200Z',
  },
  {
    id: 'eval_04',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_01',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: 'IVCF-20',
    protocolVersionId: 'IVCF-20-v1.0',
    startedAt: '2025-08-14T10:15:00.000Z',
    completedAt: '2025-08-14T10:20:00.000Z',
    resultValue: 4,
    resultUnit: 'pontos',
    notes: 'Robusto',
    syncStatus: 'synced',
    createdAt: '2025-08-14T10:20:00.000Z',
  },
  {
    id: 'eval_05',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_02',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: 'IVCF-20',
    protocolVersionId: 'IVCF-20-v1.0',
    startedAt: '2025-08-11T15:32:00.000Z',
    completedAt: '2025-08-11T15:40:00.000Z',
    resultValue: 11,
    resultUnit: 'pontos',
    notes: 'Risco de Fragilização',
    syncStatus: 'synced',
    createdAt: '2025-08-11T15:40:00.000Z',
  },
  {
    id: 'eval_06',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_04',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: 'IVCF-20',
    protocolVersionId: 'IVCF-20-v1.0',
    startedAt: '2025-08-05T11:02:00.000Z',
    completedAt: '2025-08-05T11:10:00.000Z',
    resultValue: 19,
    resultUnit: 'pontos',
    notes: 'Frágil',
    syncStatus: 'pending',
    createdAt: '2025-08-05T11:10:00.000Z',
  },
];

export class AssessmentsRepository {
  constructor(private storage: StorageServiceContract = defaultStorageService) {}

  private async getRawList(): Promise<Assessment[]> {
    const data = await this.storage.getItem<Assessment[]>(STORAGE_KEY);
    if (!data || data.length === 0) {
      await this.storage.setItem(STORAGE_KEY, INITIAL_ASSESSMENTS);
      return INITIAL_ASSESSMENTS;
    }

    const existingIds = new Set(data.map((item) => item.id));
    const missingInitials = INITIAL_ASSESSMENTS.filter((item) => !existingIds.has(item.id));
    const combined = missingInitials.length > 0 ? [...data, ...missingInitials] : data;

    const enriched = combined.map((a) => {
      const initialMatch = INITIAL_ASSESSMENTS.find((item) => item.id === a.id);
      return {
        ...a,
        institutionId: a.institutionId ?? initialMatch?.institutionId ?? 'inst_ufpr',
        applicationSiteId:
          a.applicationSiteId ?? initialMatch?.applicationSiteId ?? 'site_ufpr_lab_a',
        evaluatorUserId:
          a.evaluatorUserId ?? initialMatch?.evaluatorUserId ?? a.professionalId ?? 'prof_demo_01',
        protocolVersionId:
          a.protocolVersionId ?? initialMatch?.protocolVersionId ?? `${a.protocolId}-v1.0`,
      };
    });

    if (missingInitials.length > 0) {
      await this.storage.setItem(STORAGE_KEY, enriched);
    }

    return enriched;
  }

  async getAll(): Promise<Assessment[]> {
    const rawList = await this.getRawList();
    const { professional, activeInstitutionId, activeApplicationSiteId } =
      useSessionStore.getState();

    if (!professional || !activeInstitutionId) {
      return rawList;
    }

    try {
      return defaultAccessControlService.filterAssessmentsByScope(
        {
          authenticatedUserId: professional.id,
          activeInstitutionId,
          activeApplicationSiteId: activeApplicationSiteId || undefined,
        },
        rawList,
      );
    } catch {
      return rawList;
    }
  }

  async getById(id: string): Promise<Assessment | null> {
    const list = await this.getRawList();
    return list.find((a) => a.id === id) ?? null;
  }

  async getByParticipantId(participantId: string): Promise<Assessment[]> {
    const list = await this.getAll();
    return list.filter((a) => a.participantId === participantId);
  }

  async save(assessment: Assessment): Promise<void> {
    const list = await this.getRawList();
    const { professional, activeInstitutionId, activeApplicationSiteId } =
      useSessionStore.getState();

    const authenticatedUserId = professional?.id ?? assessment.professionalId ?? 'prof_demo_01';
    const enrichedAssessment: Assessment = {
      ...assessment,
      institutionId: assessment.institutionId ?? activeInstitutionId ?? 'inst_ufpr',
      applicationSiteId:
        assessment.applicationSiteId ?? activeApplicationSiteId ?? 'site_ufpr_lab_a',
      professionalId: authenticatedUserId,
      evaluatorUserId: authenticatedUserId,
      protocolVersionId: assessment.protocolVersionId ?? `${assessment.protocolId}-v1.0`,
    };

    const index = list.findIndex((a) => a.id === enrichedAssessment.id);
    if (index >= 0) {
      list[index] = enrichedAssessment;
    } else {
      list.unshift(enrichedAssessment);
    }
    await this.storage.setItem(STORAGE_KEY, list);
  }

  async updateSyncStatus(id: string, status: SyncStatus): Promise<void> {
    const list = await this.getRawList();
    const item = list.find((a) => a.id === id);
    if (item) {
      item.syncStatus = status;
      await this.storage.setItem(STORAGE_KEY, list);
    }
  }
}

export const defaultAssessmentsRepository = new AssessmentsRepository();
