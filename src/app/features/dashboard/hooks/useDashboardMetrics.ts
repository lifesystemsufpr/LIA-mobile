import { useCallback, useEffect, useState } from 'react';
import { defaultDashboardService, DashboardMetrics } from '../services/DashboardService';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAssessments: 12,
    totalParticipants: 5,
    syncedAssessments: 3,
    femaleCount: 3,
    maleCount: 2,
    sts30Count: 8,
    mst2Count: 4,
  });
  const [loading, setLoading] = useState(false);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await defaultDashboardService.getMetrics();
      setMetrics(data);
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    refresh: loadMetrics,
  };
}
