import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Flame,
  Users,
  Shield,
  Activity,
  Search,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Globe2,
  ListFilter
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { IncidentCard } from '@/components/reports/IncidentCard';
import { IncidentDetailModal } from '@/components/reports/IncidentDetailModal';
import { LiveEmergencyMap } from '@/components/map/LiveEmergencyMap';
import { Geospatial3DMap } from '@/components/map/Geospatial3DMap';
import { mockIncidents, disasterTypeLabels } from '@/data/incidents';
import { Incident, DisasterType, PriorityLevel, IncidentStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Live() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'grid'>('3d');

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter((inc) => {
      const matchesSearch =
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.trackingId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = selectedSeverity === 'all' || inc.priority === selectedSeverity;
      const matchesType = selectedType === 'all' || inc.disasterType === selectedType;
      const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus;

      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedSeverity, selectedType, selectedStatus]);

  // Aggregate Metrics
  const activeCount = mockIncidents.filter((i) => i.status !== 'resolved').length;
  const criticalCount = mockIncidents.filter((i) => i.priority === 'critical').length;
  const totalAffected = mockIncidents.reduce((acc, curr) => acc + curr.peopleAffected, 0);
  const activeResponders = 18;
  const awaitingVerification = 4;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-rose-700 uppercase">
              Real-Time Crisis Intelligence Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Emergency Grid & Interactive Map
          </h1>
          <p className="text-xs text-slate-600">
            Real-time geospatial tracking of emergencies, priority triage, and deployed community response squads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setViewMode('3d')}
            className={`gap-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              viewMode === '3d'
                ? 'bg-[#003366] text-white hover:bg-[#0A2540] shadow-xs'
                : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
            }`}
          >
            <Layers className="h-4 w-4 text-amber-400" /> 3D WebGL Terrain
          </Button>
          <Button
            size="sm"
            onClick={() => setViewMode('2d')}
            className={`gap-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              viewMode === '2d'
                ? 'bg-[#003366] text-white hover:bg-[#0A2540] shadow-xs'
                : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
            }`}
          >
            <Globe2 className="h-4 w-4" /> 2D Map View
          </Button>
          <Button
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`gap-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              viewMode === 'grid'
                ? 'bg-[#003366] text-white hover:bg-[#0A2540] shadow-xs'
                : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
            }`}
          >
            <ListFilter className="h-4 w-4" /> Grid Only
          </Button>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Active Emergencies"
          value={activeCount}
          icon={Flame}
          color="red"
          trend="8 in primary triage"
          trendUp={true}
        />
        <StatCard
          label="Critical Priority"
          value={criticalCount}
          icon={AlertTriangle}
          color="orange"
          trend="Immediate rescue needed"
          trendUp={true}
        />
        <StatCard
          label="People Impacted"
          value={totalAffected.toLocaleString()}
          icon={Users}
          color="yellow"
          trend="Across 6 sectors"
          trendUp={false}
        />
        <StatCard
          label="Active Battalions"
          value={activeResponders}
          icon={Shield}
          color="blue"
          trend="Volunteer squads & medical"
          trendUp={false}
        />
        <StatCard
          label="Awaiting Verification"
          value={awaitingVerification}
          icon={Activity}
          color="purple"
          trend="Triage Desk"
          trendUp={false}
        />
      </div>

      {/* Interactive Map Section (3D WebGL or 2D CartoDB) */}
      {viewMode !== 'grid' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/90 pb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#003366]" />
              {viewMode === '3d'
                ? '3D WebGL Topographical Terrain & Volumetric Hotspots'
                : 'Interactive Emergency Hotspot Map'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {viewMode === '3d'
                ? 'Interactive 3D LiDAR Mesh & Glowing Severity Pillars'
                : 'Live 2D Pins (Click markers to inspect incident dossiers)'}
            </span>
          </div>
          <div className="h-[480px] rounded-xl overflow-hidden border border-slate-200/90 bg-[#06111f]">
            {viewMode === '3d' ? (
              <Geospatial3DMap
                incidents={filteredIncidents}
                onIncidentClick={(inc: Incident) => setSelectedIncident(inc)}
                selectedIncidentId={selectedIncident?.id}
                height="480px"
              />
            ) : (
              <LiveEmergencyMap
                incidents={filteredIncidents}
                onIncidentSelect={(inc: Incident) => setSelectedIncident(inc)}
                selectedIncidentId={selectedIncident?.id}
                height="480px"
              />
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (Bhopal, Indore, Delhi, Puri...), area, or Tracking Code..."
              className="pl-10 h-10 text-xs rounded-xl bg-white border-slate-300 text-slate-900"
            />
          </div>

          {/* Severity selector */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
          >
            <option value="all">Severity: All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Disaster type selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
          >
            <option value="all">Category: All Disasters</option>
            {Object.entries(disasterTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
          >
            <option value="all">Status: All Statuses</option>
            <option value="active">Active</option>
            <option value="responding">Responding</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Clear filters */}
          {(searchQuery ||
            selectedSeverity !== 'all' ||
            selectedType !== 'all' ||
            selectedStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('all');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="text-xs text-slate-700 border-slate-300 bg-white hover:bg-slate-100 rounded-xl h-10 px-3 cursor-pointer"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Displaying <strong className="text-slate-900">{filteredIncidents.length}</strong> of{' '}
            {mockIncidents.length} recorded emergency dossiers
          </span>
          <span className="text-[11px] font-semibold text-emerald-700">● Live Central Feed Synchronized</span>
        </div>
      </div>

      {/* Incident Cards Grid */}
      {filteredIncidents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            No Emergency Incidents Match The Specified Filter Parameters
          </p>
          <p className="text-xs text-slate-500">
            Reset search query, disaster category, or severity criteria to view all field reports.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => setSelectedIncident(incident)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
