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
import { GlobeFallback } from '@/components/globe/GlobeFallback';
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
  const [showMap, setShowMap] = useState(true);

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
      {/* Official Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 rounded-md bg-slate-50 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-rose-700 uppercase">
              24x7 Real-Time Situation Monitor (सक्रिय आपदा निगरानी)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            National Incident Grid & GIS Situation Desk
          </h1>
          <p className="text-xs text-slate-600">
            Real-time geospatial tracking of emergencies, priority triage, and deployed NDRF/SDRF response units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showMap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowMap(true)}
            className={`gap-2 rounded-md font-bold text-xs cursor-pointer ${
              showMap ? 'bg-[#003366] text-white hover:bg-[#0A2540]' : 'border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <Globe2 className="h-4 w-4" /> Tactical Map View
          </Button>
          <Button
            variant={!showMap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowMap(false)}
            className={`gap-2 rounded-md font-bold text-xs cursor-pointer ${
              !showMap ? 'bg-[#003366] text-white hover:bg-[#0A2540]' : 'border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <ListFilter className="h-4 w-4" /> Incident Grid Only
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
          trend="NDRF, SDRF & Medical"
          trendUp={false}
        />
        <StatCard
          label="Awaiting Verification"
          value={awaitingVerification}
          icon={Activity}
          color="purple"
          trend="Duty Officer desk"
          trendUp={false}
        />
      </div>

      {/* Map Visualization Preview Section */}
      {showMap && (
        <div className="rounded-md border border-slate-300 bg-white p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#003366]" />
              Geospatial Disaster Projection Map (भू-स्थानिक मानचित्र)
            </span>
            <span className="text-xs font-medium text-slate-500">
              Interactive Hotspots (Click marker to view incident dossier)
            </span>
          </div>
          <div className="h-[400px] rounded-md overflow-hidden border border-slate-200 bg-slate-100">
            <GlobeFallback
              incidents={filteredIncidents}
              onIncidentClick={(inc) => setSelectedIncident(inc)}
            />
          </div>
        </div>
      )}

      {/* Comprehensive Filter Toolbar */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (Bhopal, Indore, Delhi, Puri...), area, or Tracking Code..."
              className="pl-10 h-10 text-xs rounded-md bg-white border-slate-300 text-slate-900"
            />
          </div>

          {/* Severity selector */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
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
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
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
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#003366]"
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
              className="text-xs text-slate-700 border-slate-300 bg-white hover:bg-slate-100 rounded-md h-10 px-3 cursor-pointer"
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
        <div className="rounded-md border border-slate-200 bg-slate-50 p-12 text-center space-y-2">
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
