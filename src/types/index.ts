export type DisasterType =
  | 'flood'
  | 'earthquake'
  | 'cyclone'
  | 'fire'
  | 'landslide'
  | 'building_collapse'
  | 'medical'
  | 'missing_person'
  | 'rescue_required'
  | 'food_water'
  | 'other';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type ReportStatus =
  | 'locally_stored'
  | 'submitted'
  | 'syncing'
  | 'synced'
  | 'verification'
  | 'verified'
  | 'prioritized'
  | 'responder_assigned'
  | 'response_in_progress'
  | 'resolved'
  | 'rejected';

export type IncidentStatus = 'active' | 'monitoring' | 'responding' | 'resolved';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  area: string;
  landmark: string;
  simulated: boolean;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // object URL or data URL
  uploadProgress: number;
}

export interface DisasterReport {
  id: string;
  trackingId: string;
  disasterType: DisasterType;
  description: string;
  peopleAffected: number;
  injured: number;
  trapped: number;
  priority: PriorityLevel;
  location: Location;
  mediaFiles: MediaFile[];
  contactPhone: string;
  alternateContact: string;
  additionalNotes: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  isOffline: boolean;
  responderAssigned?: string;
  aiScore?: AIScore;
}

export interface AIScore {
  credibility: number;
  urgency: PriorityLevel;
  duplicateProbability: number;
  recommendedPriority: PriorityLevel;
  isDemo: true;
}

export interface Incident {
  id: string;
  trackingId: string;
  disasterType: DisasterType;
  title: string;
  description: string;
  location: Location;
  priority: PriorityLevel;
  status: IncidentStatus;
  peopleAffected: number;
  injured: number;
  trapped: number;
  respondersAssigned: string[];
  createdAt: string;
  updatedAt: string;
  lat: number;
  lng: number;
}

export interface Responder {
  id: string;
  name: string;
  type: 'medical' | 'rescue' | 'fire' | 'food' | 'volunteer' | 'ngo';
  specialization: string;
  availability: 'available' | 'deployed' | 'offline';
  distance: number; // km
  activeAssignments: number;
  maxCapacity: number;
  location: string;
  contact: string;
  rating: number;
  resolvedCases: number;
}

export interface Resource {
  id: string;
  name: string;
  category: 'medical' | 'food' | 'water' | 'shelter' | 'rescue' | 'transport';
  total: number;
  available: number;
  inUse: number;
  critical: boolean;
  unit: string;
  location: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  reportId?: string;
}

export interface TrackingStage {
  id: string;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface AdminReport extends DisasterReport {
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'escalated';
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
}
