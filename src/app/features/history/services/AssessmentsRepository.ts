import { Assessment, defaultStorageService, StorageServiceContract, SyncStatus } from '../../../shared';

const STORAGE_KEY = '@lia_assessments';

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'eval_01',
    participantId: 'part_01',
    professionalId: 'prof_01',
    protocolId: '30sSTS',
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
    participantId: 'part_02',
    professionalId: 'prof_01',
    protocolId: 'TUG',
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
    participantId: 'part_03',
    professionalId: 'prof_01',
    protocolId: '5TSTS',
    startedAt: '2025-08-01T16:20:00.000Z',
    completedAt: '2025-08-01T16:20:15.200Z',
    durationSeconds: 15.2,
    repetitions: 5,
    resultValue: 15.2,
    resultUnit: 'segundos',
    syncStatus: 'pending', // Offline-first pending assessment
    sampleCount: 912,
    createdAt: '2025-08-01T16:20:15.200Z',
  },
];

export class AssessmentsRepository {
  constructor(private storage: StorageServiceContract = defaultStorageService) {}

  async getAll(): Promise<Assessment[]> {
    const data = await this.storage.getItem<Assessment[]>(STORAGE_KEY);
    if (!data || data.length === 0) {
      await this.storage.setItem(STORAGE_KEY, INITIAL_ASSESSMENTS);
      return INITIAL_ASSESSMENTS;
    }
    return data;
  }

  async getById(id: string): Promise<Assessment | null> {
    const list = await this.getAll();
    return list.find((a) => a.id === id) ?? null;
  }

  async getByParticipantId(participantId: string): Promise<Assessment[]> {
    const list = await this.getAll();
    return list.filter((a) => a.participantId === participantId);
  }

  async save(assessment: Assessment): Promise<void> {
    const list = await this.getAll();
    const index = list.findIndex((a) => a.id === assessment.id);
    if (index >= 0) {
      list[index] = assessment;
    } else {
      list.unshift(assessment);
    }
    await this.storage.setItem(STORAGE_KEY, list);
  }

  async updateSyncStatus(id: string, status: SyncStatus): Promise<void> {
    const list = await this.getAll();
    const item = list.find((a) => a.id === id);
    if (item) {
      item.syncStatus = status;
      await this.storage.setItem(STORAGE_KEY, list);
    }
  }
}

export const defaultAssessmentsRepository = new AssessmentsRepository();
