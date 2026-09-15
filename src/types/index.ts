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
  imageUrl?: string;
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

export interface ResponderProfile {
  id: string;
  name: string;
  role: string;
  agency: string;
  badgeNumber: string;
  clearanceLevel: 'LEVEL-1' | 'LEVEL-2' | 'LEVEL-3';
  sector: string;
  phone: string;
}

export interface NearestUnit {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  etaMinutes: number;
  capacity: number;
  assigned?: boolean;
}

export interface SOSAlert {
  id: string;
  trackingId: string;
  disasterType: DisasterType;
  title: string;
  locationArea: string;
  latitude: number;
  longitude: number;
  priority: PriorityLevel;
  peopleAffected: number;
  injured: number;
  trapped: number;
  timestamp: string;
  nearestUnits: NearestUnit[];
}

export interface AdminSession {
  isAuthenticated: boolean;
  coordinatorId: string;
  name: string;
  role: string;
  clearance: 'LEVEL-3_COORDINATOR' | 'SUPER_ADMIN';
  dutyStation: string;
  securityToken: string;
  phone: string;
}

export interface VolunteerSession {
  isAuthenticated: boolean;
  registeredId: string; // e.g. VOL-2026-IND-8841
  name: string;
  organization: string; // e.g. Indian Red Cross Society, Civil Defence, SEEDS
  specialization: string;
  sector: string;
  badgeNumber: string;
  phone: string;
  status: 'ACTIVE_FIELD' | 'STANDBY' | 'DEPLOYED';
}

export interface DisasterRecoveryIncident {
  id: string;
  title: string;
  hindiTitle: string;
  date: string;
  location: string;
  state: string;
  type: 'landslide' | 'flood' | 'cyclone' | 'glacial_lake' | 'cloudburst';
  imageUrl: string;
  imageCaption: string;
  secondaryImageUrl?: string;
  secondaryImageCaption?: string;
  fallbackImageUrl?: string;
  description: string;
  peopleAffected: number;
  peopleRescued: number;
  reliefEfficiency: number; // percentage
  fatalitiesPrevented: number;
  recoveryStage: 'Active Search & Evacuation' | 'Stabilization & Bailey Bridge' | 'Rehabilitation & Housing' | 'Infrastructure Restored';
  keyDeployments: string[];
  operationalSummary: string;
}


