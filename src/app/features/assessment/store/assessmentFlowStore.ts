import { create } from 'zustand';
import { Participant, Protocol } from '../../../shared';

export type AssessmentFlowState = {
  currentParticipant: Participant | null;
  currentProtocol: Protocol | null;
  setParticipant: (participant: Participant | null) => void;
  setProtocol: (protocol: Protocol | null) => void;
  resetFlow: () => void;
};

export const useAssessmentFlowStore = create<AssessmentFlowState>((set) => ({
  currentParticipant: null,
  currentProtocol: null,

  setParticipant: (currentParticipant) => set({ currentParticipant }),
  setProtocol: (currentProtocol) => set({ currentProtocol }),
  resetFlow: () => set({ currentParticipant: null, currentProtocol: null }),
}));
