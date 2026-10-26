import { create } from 'zustand';
import { Assessment, SyncStatus } from '../../../shared';
import { defaultAssessmentsRepository, INITIAL_ASSESSMENTS } from '../services/AssessmentsRepository';

export type DateRangeFilter = {
  startDate: string | null;
  endDate: string | null;
};

export type HistoryFilter = {
  searchQuery: string;
  protocolFilter: string | null;
  syncStatusFilter: SyncStatus | 'all';
  dateFilter: DateRangeFilter | null;
};

export type HistoryState = {
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  filters: HistoryFilter;
  loading: boolean;
  error: string | null;
  fetchAssessments: () => Promise<void>;
  selectAssessment: (assessment: Assessment | null) => void;
  setSearchQuery: (query: string) => void;
  setProtocolFilter: (protocol: string | null) => void;
  setSyncStatusFilter: (status: SyncStatus | 'all') => void;
  setDateFilter: (dateFilter: DateRangeFilter | null) => void;
  markAsSynced: (id: string) => Promise<void>;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  assessments: INITIAL_ASSESSMENTS,
  selectedAssessment: null,
  filters: {
    searchQuery: '',
    protocolFilter: null,
    syncStatusFilter: 'all',
    dateFilter: null,
  },
  loading: false,
  error: null,

  fetchAssessments: async () => {
    try {
      set({ loading: true, error: null });
      const data = await defaultAssessmentsRepository.getAll();
      set({
        assessments: data && data.length > 0 ? data : INITIAL_ASSESSMENTS,
        loading: false,
      });
    } catch (err) {
      set({
        assessments: INITIAL_ASSESSMENTS,
        error: (err as Error).message,
        loading: false,
      });
    }
  },

  selectAssessment: (assessment) => set({ selectedAssessment: assessment }),

  setSearchQuery: (searchQuery) =>
    set((state) => ({ filters: { ...state.filters, searchQuery } })),

  setProtocolFilter: (protocolFilter) =>
    set((state) => ({ filters: { ...state.filters, protocolFilter } })),

  setSyncStatusFilter: (syncStatusFilter) =>
    set((state) => ({ filters: { ...state.filters, syncStatusFilter } })),

  setDateFilter: (dateFilter) =>
    set((state) => ({ filters: { ...state.filters, dateFilter } })),

  markAsSynced: async (id: string) => {
    await defaultAssessmentsRepository.updateSyncStatus(id, 'synced');
    await get().fetchAssessments();
  },
}));
