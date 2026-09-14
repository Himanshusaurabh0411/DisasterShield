import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Users,
  CheckCircle2,
  Package,
  Activity,
  Play,
  Check,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Phone
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { ResponderCard } from '@/components/responders/ResponderCard';
import { ResponderMatchingModal } from '@/components/responders/ResponderMatchingModal';
import { mockIncidents } from '@/data/incidents';
import { mockResponders } from '@/data/responders';
import { mockResources } from '@/data/resources';
import { ResourceBar } from '@/components/dashboard/ResourceBar';
import { Button } from '@/components/ui/button';
import { Incident, Responder as ResponderType } from '@/types';
import { timeAgo, formatNumber } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export function Responder() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'queue' | 'responders' | 'resources'>('queue');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [responders, setResponders] = useState<ResponderType[]>(mockResponders);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchingIncident, setMatchingIncident] = useState<Incident | null>(null);

  // Stats calculations
  const criticalCases = incidents.filter((i) => i.priority === 'critical' && i.status !== 'resolved').length;
  const activeAssignments = responders.reduce((acc, r) => acc + r.activeAssignments, 0);
  const availableResponders = responders.filter((r) => r.availability === 'available').length;
  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length;
  const totalResourcesAvailable = mockResources.reduce((acc, r) => acc + r.available, 0);

  // Queue Action Handlers (update state dynamically!)
  const handleAcceptCase = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, status: 'responding', respondersAssigned: ['resp-001', 'resp-002'] }
          : inc
      )
    );
    addNotification({
      type: 'info',
      title: 'Incident Accepted',
      message: `Squad assigned to incident #${incidentId}. Commencing tactical staging.`,
    });
  };

  const handleStartResponse = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, status: 'responding', updatedAt: new Date().toISOString() }
          : inc
      )
    );
    addNotification({
      type: 'warning',
      title: 'Response Underway',
      message: `Field operators have made entry at target sector #${incidentId}.`,
    });
  };

  const handleMarkResolved = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, status: 'resolved', trapped: 0, updatedAt: new Date().toISOString() }
          : inc
      )
    );
    addNotification({
      type: 'success',
      title: 'Incident Resolved',
      message: `Rescue completed for incident #${incidentId}. Target marked safe.`,
    });
  };

  const handleOpenAutoMatcher = (incident?: Incident) => {
    setMatchingIncident(incident || null);
    setIsMatchingModalOpen(true);
  };

  const handleResponderMatched = (matched: ResponderType) => {
    setResponders((prev) =>
      prev.map((r) =>
        r.id === matched.id
          ? { ...r, activeAssignments: r.activeAssignments + 1, availability: 'deployed' }
          : r
      )
    );
    addNotification({
      type: 'success',
      title: 'Unit Deployed',
      message: `${matched.name} deployed to front line operations.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white">
      {/* Official Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 rounded-md bg-slate-50 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#003366] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[#003366] uppercase">
              Emergency Operations Command (EOC) Dispatch Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tactical Deployment & Response Management Desk
          </h1>
          <p className="text-xs text-slate-600">
            आपदा प्रतिक्रिया एवं राहत बल प्रेषण केंद्र — NDRF, SDRF, Medical Teams and Volunteer Battalion Management.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => handleOpenAutoMatcher()}
          className="gap-2 bg-[#003366] hover:bg-[#0A2540] text-white font-bold rounded-md text-xs tracking-wide shadow-xs cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-300" /> Auto-Match Response Battalion
        </Button>
      </div>

      {/* Top Overview 5 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Active Deployments"
          value={activeAssignments}
          icon={Activity}
          color="blue"
          trend="Missions underway"
          trendUp={false}
        />
        <StatCard
          label="Critical Cases"
          value={criticalCases}
          icon={AlertTriangle}
          color="red"
          trend="Immediate rescue priority"
          trendUp={true}
        />
        <StatCard
          label="Available Battalions"
          value={availableResponders}
          icon={Shield}
          color="green"
          trend="Ready for rapid dispatch"
          trendUp={false}
        />
        <StatCard
          label="Missions Concluded"
          value={resolvedCount}
          icon={CheckCircle2}
          color="purple"
          trend="Target zones secured"
          trendUp={false}
        />
        <StatCard
          label="Relief Supplies Stock"
          value={totalResourcesAvailable.toLocaleString()}
          icon={Package}
          color="orange"
          trend="Stock in 4 regional hubs"
          trendUp={false}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'queue', label: `Emergency Action Queue (${incidents.filter((i) => i.status !== 'resolved').length})` },
          { id: 'responders', label: `Response Battalions (${responders.length})` },
          { id: 'resources', label: `Emergency Resource Inventory (${mockResources.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Emergency Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-slate-800">Dispatch Priority Queue / प्राथमिकता प्रेषण कतार</span>
            <span>Real-time tactical mutation active</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => {
              const isResolved = inc.status === 'resolved';
              const isResponding = inc.status === 'responding';

              return (
                <motion.div
                  key={inc.id}
                  layout
                  className={`rounded-md border p-5 transition-all shadow-xs ${
                    isResolved
                      ? 'border-slate-200 bg-slate-50 opacity-70'
                      : inc.priority === 'critical'
                      ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={inc.priority} />
                        <span className="text-sm font-bold text-slate-900">
                          {inc.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#003366] px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          {inc.trackingId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{inc.location.area}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{formatNumber(inc.peopleAffected)} affected</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>{inc.trapped} trapped</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{timeAgo(inc.createdAt)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 line-clamp-1">{inc.description}</p>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {isResolved ? (
                        <span className="text-xs px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Mission Concluded
                        </span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptCase(inc.id)}
                            className="text-xs border-slate-300 hover:border-[#003366] text-[#003366] font-bold rounded-md cursor-pointer"
                          >
                            Accept Case
                          </Button>

                          <Button
                            size="sm"
                            variant={isResponding ? 'default' : 'secondary'}
                            onClick={() => handleStartResponse(inc.id)}
                            className={`text-xs gap-1 rounded-md font-bold cursor-pointer ${
                              isResponding ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            <Play className="h-3 w-3" /> Commence Response
                          </Button>

                          <Button
                            size="sm"
                            variant="emergency"
                            onClick={() => handleMarkResolved(inc.id)}
                            className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md cursor-pointer"
                          >
                            <Check className="h-3 w-3" /> Mark Resolved
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Responder Squads */}
      {activeTab === 'responders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-slate-800">NDRF & SDRF Certified Battalion Roster</span>
            <Button
              size="sm"
              onClick={() => handleOpenAutoMatcher()}
              className="gap-1.5 text-xs bg-[#003366] hover:bg-[#0A2540] text-white rounded-md font-bold cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Auto-Match Nearest Unit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responders.map((resp) => (
              <ResponderCard
                key={resp.id}
                responder={resp}
                onMatch={() => handleOpenAutoMatcher()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Critical Resources */}
      {activeTab === 'resources' && (
        <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                National Relief Material & Supply Depot Telemetry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring buffer inventory across state logistics hubs: food packets, potable water, medical trauma packs, and rescue boats.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              4 Critical Inventories
            </span>
          </div>

          <div className="space-y-2">
            {mockResources.map((res) => (
              <ResourceBar key={res.id} resource={res} />
            ))}
          </div>
        </div>
      )}

      {/* Auto-Matcher Modal */}
      <ResponderMatchingModal
        isOpen={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        onMatched={handleResponderMatched}
        preferredType="medical"
      />
    </div>
  );
}
