import { useState, useCallback } from 'react';
import { DisasterReport } from '../types';
import { getLocalReports, saveReportLocally, updateLocalReport, deleteLocalReport } from '../services/offlineStorage';

export function useReports() {
  const [reports, setReports] = useState<DisasterReport[]>(() => getLocalReports());

  const refresh = useCallback(() => {
    setReports(getLocalReports());
  }, []);

  const addReport = useCallback((report: DisasterReport) => {
    saveReportLocally(report);
    setReports(getLocalReports());
  }, []);

  const updateReport = useCallback((id: string, updates: Partial<DisasterReport>) => {
    updateLocalReport(id, updates);
    setReports(getLocalReports());
  }, []);

  const removeReport = useCallback((id: string) => {
    deleteLocalReport(id);
    setReports(getLocalReports());
  }, []);

  const findByTracking = useCallback((trackingId: string) => {
    return getLocalReports().find(r => r.trackingId === trackingId || r.id === trackingId);
  }, []);

  return { reports, addReport, updateReport, removeReport, findByTracking, refresh };
}
