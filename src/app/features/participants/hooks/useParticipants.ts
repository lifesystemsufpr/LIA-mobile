import { useEffect, useMemo } from 'react';
import { useParticipantsStore } from '../store/participantsStore';

export function useParticipants() {
  const {
    participants,
    selectedParticipant,
    searchQuery,
    loading,
    error,
    fetchParticipants,
    selectParticipant,
    setSearchQuery,
    saveParticipant,
    deleteParticipant,
  } = useParticipantsStore();

  useEffect(() => {
    if (participants.length === 0) {
      fetchParticipants();
    }
  }, [fetchParticipants, participants.length]);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const lower = searchQuery.toLowerCase().trim();
    const cleanCpfQuery = lower.replace(/\D/g, '');

    return participants.filter((p) => {
      const matchName = p.fullName.toLowerCase().includes(lower);
      const matchCpf = cleanCpfQuery && p.cpf.replace(/\D/g, '').includes(cleanCpfQuery);
      return matchName || matchCpf;
    });
  }, [participants, searchQuery]);

  return {
    participants: filteredParticipants,
    allParticipants: participants,
    selectedParticipant,
    searchQuery,
    loading,
    error,
    refresh: fetchParticipants,
    selectParticipant,
    setSearchQuery,
    saveParticipant,
    deleteParticipant,
  };
}
