import { DisasterReport, ReportStatus } from '../types';

const STORAGE_KEY = 'disastershield_reports';
const SYNC_KEY = 'disastershield_sync_queue';

export function saveReportLocally(report: DisasterReport): void {
  const existing = getLocalReports();
  const updated = [
    ...existing.filter(r => r.id !== report.id),
    { ...report, isOffline: true },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (report.isOffline) {
    const queue = getSyncQueue();
    if (!queue.includes(report.id)) {
      localStorage.setItem(SYNC_KEY, JSON.stringify([...queue, report.id]));
    }
  }
}

export function getLocalReports(): DisasterReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DisasterReport[]) : [];
  } catch {
    return [];
  }
}

export function getLocalReportById(id: string): DisasterReport | undefined {
  return getLocalReports().find(r => r.id === id || r.trackingId === id);
}

export function updateLocalReport(id: string, updates: Partial<DisasterReport>): void {
  const reports = getLocalReports();
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
}

export function deleteLocalReport(id: string): void {
  const reports = getLocalReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  const queue = getSyncQueue().filter(q => q !== id);
  localStorage.setItem(SYNC_KEY, JSON.stringify(queue));
}

export function getSyncQueue(): string[] {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function syncReports(
  onProgress?: (reportId: string, stage: ReportStatus) => void
): Promise<void> {
  const queue = getSyncQueue();
  if (queue.length === 0) return;

  for (const reportId of queue) {
    updateLocalReport(reportId, { status: 'syncing' });
    onProgress?.(reportId, 'syncing');
    await delay(800);

    updateLocalReport(reportId, { status: 'synced', syncedAt: new Date().toISOString() });
    onProgress?.(reportId, 'synced');
    await delay(600);

    updateLocalReport(reportId, { status: 'verification' });
    onProgress?.(reportId, 'verification');
    await delay(400);
  }

  localStorage.setItem(SYNC_KEY, JSON.stringify([]));

  const reports = getLocalReports();
  reports.forEach(r => {
    if (queue.includes(r.id)) {
      r.isOffline = false;
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
