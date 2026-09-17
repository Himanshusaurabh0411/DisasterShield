import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flame,
  Users,
  Settings,
  Database,
  Search,
  Check,
  X,
  ArrowUpRight,
  Sparkles,
  Activity,
  Layers,
  MapPin,
  Clock,
  Filter,
  Lock,
  LogOut,
  KeyRound
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { AIScreeningPanel } from '@/components/emergency/AIScreeningPanel';
import { mockIncidents, disasterTypeLabels } from '@/data/incidents';
import { mockResponders } from '@/data/responders';
import { mockResources } from '@/data/resources';
import { ResourceBar } from '@/components/dashboard/ResourceBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminAuthModal } from '@/components/auth/AdminAuthModal';
import { useApp } from '@/context/AppContext';
import { useReports } from '@/hooks/useReports';
import { DisasterReport } from '@/types';
import { timeAgo, formatDateTime } from '@/lib/utils';

interface AdminQueueItem extends DisasterReport {
  verificationState: 'pending' | 'verified' | 'rejected' | 'escalated';
}

export function Admin() {
  const { adminSession, logoutAdmin, addNotification } = useApp();
  const navigate = useNavigate();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState<'verification' | 'dashboard' | 'resources' | 'settings'>('verification');

  // Build admin verification queue by merging user submitted reports + mock incidents
  const [queueItems, setQueueItems] = useState<AdminQueueItem[]>(() => {
    // Convert mock incidents to queue items
    const fromIncidents: AdminQueueItem[] = mockIncidents.map((inc, i) => ({
      id: inc.id,
      trackingId: inc.trackingId,
      disasterType: inc.disasterType,
      description: inc.description,
      peopleAffected: inc.peopleAffected,
      injured: inc.injured,
      trapped: inc.trapped,
      priority: inc.priority,
      location: inc.location,
      mediaFiles: [],
      contactPhone: '+91-98765-XXXXX',
      alternateContact: '',
      additionalNotes: 'Field officer preliminary note',
      status: inc.status === 'resolved' ? 'resolved' : 'verification',
      createdAt: inc.createdAt,
      updatedAt: inc.updatedAt,
      isOffline: false,
      aiScore: {
        credibility: 85 + (i * 3) % 15,
        urgency: inc.priority,
        duplicateProbability: (i * 4) % 18,
        recommendedPriority: inc.priority,
        isDemo: true,
      },
      verificationState: i === 0 ? 'pending' : i === 1 ? 'pending' : 'verified',
    }));

    // Add reports from localStorage
    const fromUser: AdminQueueItem[] = reports.map((r) => ({
      ...r,
      verificationState: 'pending',
    }));

    return [...fromUser, ...fromIncidents];
  });

  // Action handlers
  const handleVerify = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, verificationState: 'verified', status: 'verified' } : item
      )
    );
    addNotification({
      type: 'success',
      title: 'Report Verified',
      message: `Dossier #${id} approved by Command Duty Officer. Pushed to Dispatch queue.`,
    });
  };

  const handleReject = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, verificationState: 'rejected', status: 'rejected' } : item
      )
    );
    addNotification({
      type: 'warning',
      title: 'Report Rejected',
      message: `Report #${id} marked as duplicate or unverified noise.`,
    });
  };

  const handleEscalate = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, verificationState: 'escalated', priority: 'critical', status: 'prioritized' }
          : item
      )
    );
    addNotification({
      type: 'critical',
      title: 'Incident Escalated',
      message: `Report #${id} elevated to CENTRAL DISASTER ESCALATION tier.`,
    });
  };

  // Metrics
  const pendingCount = queueItems.filter((i) => i.verificationState === 'pending').length;
  const verifiedCount = queueItems.filter((i) => i.verificationState === 'verified').length;
  const criticalCount = queueItems.filter((i) => i.priority === 'critical').length;
  const activeRespondersCount = mockResponders.filter((r) => r.availability !== 'offline').length;

  // STRICT AUTHENTICATION SEPARATION: Protect Dispatch Verification Desk
  if (!adminSession?.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 bg-white text-slate-900">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-cyan-950/20 border-2 border-cyan-500/60 flex items-center justify-center text-cyan-600 shadow-md">
          <Lock className="h-10 w-10 text-[#003366]" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider block">
            प्रतिबंधित व्यवस्थापक नियंत्रण कक्ष
          </span>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            System Admin Portal Required
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This verification and triage desk is restricted to authorized Community Dispatch Coordinators. Authorization requires a verified Coordinator ID and Security Token.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={() => setIsAdminModalOpen(true)}
            className="gap-2 bg-[#003366] hover:bg-[#002244] text-white font-bold px-8 h-12 rounded-xl shadow-xs cursor-pointer"
          >
            <Lock className="h-5 w-5 text-cyan-400" />
            <span>Authenticate as Dispatch Coordinator / समन्वयक प्रवेश</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 rounded-xl font-semibold cursor-pointer"
          >
            Back to Community Portal
          </Button>
        </div>

        {/* Informative credentials reminder */}
        <div className="mt-8 p-4 rounded-xl border border-slate-200 bg-slate-50 text-left max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase mb-1">
            <KeyRound className="h-4 w-4 text-[#FF9933]" />
            Coordinator Credentials Guidance
          </div>
          <p className="text-xs text-slate-600">
            Click <strong>Authenticate</strong> to open the Dispatch Coordinator portal. You can select the pre-authorized credentials for <strong>Chief Officer Devendra Sen</strong> or <strong>Meera Joshi</strong> for 1-click verification.
          </p>
        </div>

        <AdminAuthModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#003366] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[#003366] uppercase">
              DisasterShield Coordination Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Incident Verification & Triage Desk
          </h1>
          <p className="text-xs text-slate-600">
            Verify ground reports, filter duplicate alarms, and coordinate rapid volunteer response dispatch.
          </p>
        </div>

        {/* Authenticated Coordinator Profile & Signout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="rounded-xl border border-cyan-300 bg-cyan-50/90 px-3.5 py-2 text-xs text-left shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-cyan-950">{adminSession.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-200 text-cyan-900 text-[10px] font-bold">
                {adminSession.clearance}
              </span>
            </div>
            <div className="text-[11px] text-cyan-800 font-mono mt-0.5">
              {adminSession.coordinatorId} • {adminSession.dutyStation}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logoutAdmin}
            className="h-9 px-3 text-xs font-bold border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
            title="End Duty Shift"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            End Shift
          </Button>
        </div>
      </div>

      {/* Top 5 Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total Dossiers"
          value={queueItems.length}
          icon={Database}
          color="blue"
          trend="Central Registry"
          trendUp={false}
        />
        <StatCard
          label="Pending Clearance"
          value={pendingCount}
          icon={Clock}
          color="yellow"
          trend="Awaiting verification"
          trendUp={true}
        />
        <StatCard
          label="Critical Threat Tier"
          value={criticalCount}
          icon={AlertTriangle}
          color="red"
          trend="Severe risk"
          trendUp={true}
        />
        <StatCard
          label="Active Battalions"
          value={activeRespondersCount}
          icon={ShieldAlert}
          color="green"
          trend="Volunteer squads"
          trendUp={false}
        />
        <StatCard
          label="Verified Cleared"
          value={verifiedCount}
          icon={CheckCircle}
          color="purple"
          trend="Approved for dispatch"
          trendUp={false}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-2">
        {[
          { id: 'verification', label: `Verification Desk (${pendingCount} Pending)` },
          { id: 'dashboard', label: 'Crisis Telemetry' },
          { id: 'resources', label: 'Relief Inventory' },
          { id: 'settings', label: 'Architecture & Standards' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-slate-800">Incoming Incident Reports</span>
            <span>Verify authenticity, reject noise, or escalate priority</span>
          </div>

          <div className="space-y-4">
            {queueItems.map((item) => {
              const isPending = item.verificationState === 'pending';
              const isVerified = item.verificationState === 'verified';
              const isRejected = item.verificationState === 'rejected';
              const isEscalated = item.verificationState === 'escalated';

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                    isRejected
                      ? 'border-slate-200/90 bg-slate-50/80 opacity-60'
                      : isEscalated
                      ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200'
                      : isVerified
                      ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                          {item.trackingId}
                        </span>
                        <PriorityBadge priority={item.priority} />
                        <span className="text-sm font-bold text-slate-900">
                          {disasterTypeLabels[item.disasterType] || item.disasterType}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-lg capitalize ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isVerified
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isRejected
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}
                        >
                          {item.verificationState}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{item.location.area}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{item.peopleAffected} Affected</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>{item.trapped} Trapped</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{timeAgo(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Attached AI Screening Preview */}
                      {item.aiScore && (
                        <div className="pt-1">
                          <AIScreeningPanel aiScore={item.aiScore} isCompact />
                        </div>
                      )}
                    </div>

                    {/* Operational Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
                      <Button
                        size="sm"
                        disabled={!isPending && isVerified}
                        onClick={() => handleVerify(item.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-1.5 rounded-xl cursor-pointer transition-all hover:shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve & Dispatch
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!isPending && isRejected}
                        onClick={() => handleReject(item.id)}
                        className="border-slate-300 hover:border-rose-400 text-rose-700 text-xs font-semibold gap-1.5 rounded-xl cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Reject Duplicate
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleEscalate(item.id)}
                        className="text-xs font-bold gap-1.5 rounded-xl bg-[#FF9933] hover:bg-[#E65100] text-slate-900 cursor-pointer transition-all hover:shadow-xs border border-amber-400/40"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" /> Escalate Tier
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Command Overview */}
      {activeTab === 'dashboard' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4 text-slate-700 text-xs leading-relaxed shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Central Crisis Telemetry & Spatial Cluster Analysis
          </h3>
          <p>
            DisasterShield telemetry streams synthesize open satellite data, meteorological radar forecasts,
            and real-time ground reports to construct predictive risk surfaces.
          </p>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2 text-slate-800 font-medium">
            <div>&bull; Primary Geo-Cluster: Central Crisis Corridor (Bhopal, Indore, Jabalpur)</div>
            <div>&bull; Coastal Monitoring Perimeter: Cyclone & Storm Surge Alert Zones (Odisha, Andhra Coast)</div>
            <div>&bull; Seismic Sensor Array: Regional Tremor Fault Zones & High-Density Urban Corridors</div>
          </div>
        </div>
      )}

      {/* Tab 3: Resource Reserves */}
      {activeTab === 'resources' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Regional Relief Material & Buffer Inventory
          </h3>
          <div className="space-y-2">
            {mockResources.map((res) => (
              <ResourceBar key={res.id} resource={res} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            System Technical Architecture & Open Standards
          </h3>
          <p className="text-xs text-slate-600">
            Engineered with open-access humanitarian standards, end-to-end auditability, and offline-first browser resilience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Local Data Resilience Engine</span>
              <p className="text-slate-900 font-bold">HTML5 localStorage + IndexedDB (Offline-First)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Automated Triage Pipeline</span>
              <p className="text-slate-900 font-bold">Multi-factor Geospatial Credibility Scoring</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
