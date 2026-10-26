import { create } from 'zustand';
import { Professional } from '../types';

export type SessionState = {
  professional: Professional | null;
  isAuthenticated: boolean;
  login: (professional: Professional) => void;
  logout: () => void;
  updateProfessional: (partial: Partial<Professional>) => void;
};

// Default demonstration professional
export const DEFAULT_PROFESSIONAL: Professional = {
  id: 'prof_demo_01',
  name: 'Dr. Roberto Silva',
  email: 'dr.roberto@lia.com',
  professionalCategory: 'Fisioterapeuta',
  professionalRegistration: 'CREFITO 12345-F',
};

export const useSessionStore = create<SessionState>((set) => ({
  professional: DEFAULT_PROFESSIONAL,
  isAuthenticated: true, // Default to true or false for development
  login: (professional: Professional) => set({ professional, isAuthenticated: true }),
  logout: () => set({ professional: null, isAuthenticated: false }),
  updateProfessional: (partial) =>
    set((state) => ({
      professional: state.professional ? { ...state.professional, ...partial } : null,
    })),
}));
