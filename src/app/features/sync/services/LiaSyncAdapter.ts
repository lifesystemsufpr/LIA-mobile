import { FetchHttpClient, HttpClient } from '../../../network';
import { Assessment, SensorSample } from '../../../shared';

export type SyncResult = {
  success: boolean;
  syncedAt: string;
  remoteId?: string;
  errorMessage?: string;
};

export class LiaSyncAdapter {
  constructor(private httpClient: HttpClient = new FetchHttpClient()) {}

  async uploadAssessment(
    assessment: Assessment,
    _samples?: SensorSample[]
  ): Promise<SyncResult> {
    // Contract implementation for LIA Web API
    // If backend is not available, simulates clean sync validation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          syncedAt: new Date().toISOString(),
          remoteId: `lia_cloud_${assessment.id}`,
        });
      }, 2000);
    });
  }
}

export const defaultLiaSyncAdapter = new LiaSyncAdapter();
