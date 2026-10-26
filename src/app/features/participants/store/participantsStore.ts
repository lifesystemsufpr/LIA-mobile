import { create } from 'zustand';
import { Participant } from '../../../shared';
import { defaultParticipantsRepository, INITIAL_PARTICIPANTS } from '../services/ParticipantsRepository';

export type ParticipantsState = {
  participants: Participant[];
  selectedParticipant: Participant | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  fetchParticipants: () => Promise<void>;
  selectParticipant: (participant: Participant | null) => void;
  setSearchQuery: (query: string) => void;
  saveParticipant: (participant: Participant) => Promise<void>;
  deleteParticipant: (id: string) => Promise<void>;
};

export const useParticipantsStore = create<ParticipantsState>((set, get) => ({
  participants: INITIAL_PARTICIPANTS,
  selectedParticipant: null,
  searchQuery: '',
  loading: false,
  error: null,

  fetchParticipants: async () => {
    try {
      set({ loading: true, error: null });
      const data = await defaultParticipantsRepository.getAll();
      set({
        participants: data && data.length > 0 ? data : INITIAL_PARTICIPANTS,
        loading: false,
      });
    } catch (err) {
      set({
        participants: INITIAL_PARTICIPANTS,
        error: (err as Error).message,
        loading: false,
      });
    }
  },

  selectParticipant: (participant) => set({ selectedParticipant: participant }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  saveParticipant: async (participant) => {
    try {
      set({ loading: true, error: null });
      await defaultParticipantsRepository.save(participant);
      await get().fetchParticipants();
      set({ selectedParticipant: participant });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteParticipant: async (id) => {
    try {
      set({ loading: true, error: null });
      await defaultParticipantsRepository.delete(id);
      await get().fetchParticipants();
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
