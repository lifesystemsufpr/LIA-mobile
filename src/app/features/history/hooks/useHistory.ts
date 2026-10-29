import { useEffect, useMemo } from 'react';
import { formatDateBR } from '../../../shared';
import { useParticipantsStore } from '../../participants';
import { useHistoryStore } from '../store/historyStore';

function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const brMatch = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const day = parseInt(brMatch[1], 10);
    const month = parseInt(brMatch[2], 10) - 1;
    const year = parseInt(brMatch[3], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }
  const isoMatch = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function useHistory() {
  const {
    assessments,
    selectedAssessment,
    filters,
    loading,
    error,
    fetchAssessments,
    selectAssessment,
    setSearchQuery,
    setProtocolFilter,
    setSyncStatusFilter,
    setDateFilter,
    markAsSynced,
  } = useHistoryStore();

  const { participants } = useParticipantsStore();

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const participantsMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set('part_01', 'Manuela Silva');
    map.set('part_02', 'João Oliveira');
    map.set('part_03', 'Maria Santos');
    map.set('part_04', 'Carlos Pereira');
    participants.forEach((p) => map.set(p.id, p.fullName));
    return map;
  }, [participants]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      // Name filter
      if (filters.searchQuery.trim()) {
        const participantName = participantsMap.get(a.participantId)?.toLowerCase() ?? '';
        if (!participantName.includes(filters.searchQuery.toLowerCase().trim())) {
          return false;
        }
      }

      // Protocol filter
      if (filters.protocolFilter && a.protocolId !== filters.protocolFilter) {
        return false;
      }

      // Sync status filter
      if (filters.syncStatusFilter !== 'all' && a.syncStatus !== filters.syncStatusFilter) {
        return false;
      }

      // Date range filter (from startDate to endDate)
      if (filters.dateFilter) {
        const { startDate, endDate } = filters.dateFilter;
        if (startDate || endDate) {
          const itemDate = new Date(a.createdAt || a.startedAt);
          if (!isNaN(itemDate.getTime())) {
            if (startDate) {
              const start = parseDateString(startDate);
              if (start) {
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) return false;
              }
            }
            if (endDate) {
              const end = parseDateString(endDate);
              if (end) {
                end.setHours(23, 59, 59, 999);
                if (itemDate > end) return false;
              }
            }
          }
        }
      }

      return true;
    });
  }, [assessments, filters, participantsMap]);

  return {
    assessments: filteredAssessments,
    allAssessments: assessments,
    selectedAssessment,
    filters,
    loading,
    error,
    participantsMap,
    refresh: fetchAssessments,
    selectAssessment,
    setSearchQuery,
    setProtocolFilter,
    setSyncStatusFilter,
    setDateFilter,
    markAsSynced,
  };
}
