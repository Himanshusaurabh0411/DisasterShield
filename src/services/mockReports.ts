import { DisasterReport, DisasterType, PriorityLevel, AIScore } from '../types';

export function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random = Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `DS-${year}-${random}`;
}

export function generateReportId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateAIScore(report: Partial<DisasterReport>): AIScore {
  const baseCredibility = 70 + Math.floor(Math.random() * 25);
  const urgencyMap: Record<PriorityLevel, PriorityLevel> = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
  };

  const priority = report.priority || 'medium';
  const credibility = report.mediaFiles && report.mediaFiles.length > 0
    ? Math.min(baseCredibility + 10, 99)
    : baseCredibility;

  return {
    credibility,
    urgency: urgencyMap[priority],
    duplicateProbability: Math.floor(Math.random() * 20),
    recommendedPriority: urgencyMap[priority],
    isDemo: true,
  };
}

export function getPriorityFromType(type: DisasterType): PriorityLevel {
  const criticalTypes: DisasterType[] = ['earthquake', 'cyclone', 'building_collapse'];
  const highTypes: DisasterType[] = ['flood', 'fire', 'landslide', 'rescue_required'];
  if (criticalTypes.includes(type)) return 'critical';
  if (highTypes.includes(type)) return 'high';
  return 'medium';
}

export const trackingStages = [
  { id: 'submitted', label: 'Report Submitted', description: 'Emergency report received.' },
  { id: 'locally_stored', label: 'Local Storage', description: 'Saved securely on device.' },
  { id: 'synced', label: 'Synchronized', description: 'Report uploaded to cloud server.' },
  { id: 'verification', label: 'Verification', description: 'Under review by the operations team.' },
  { id: 'prioritized', label: 'Prioritized', description: 'Assigned priority level based on severity.' },
  { id: 'responder_assigned', label: 'Responder Assigned', description: 'Response team assigned to your report.' },
  { id: 'response_in_progress', label: 'Response In Progress', description: 'Active emergency response underway.' },
  { id: 'resolved', label: 'Resolved', description: 'Incident has been resolved.' },
];

export function getStageIndex(status: string): number {
  const statusToStage: Record<string, number> = {
    submitted: 0,
    locally_stored: 1,
    syncing: 1,
    synced: 2,
    verification: 3,
    verified: 3,
    prioritized: 4,
    responder_assigned: 5,
    response_in_progress: 6,
    resolved: 7,
  };
  return statusToStage[status] ?? 0;
}
