import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Search,
  Filter,
  LifeBuoy,
  Users,
  Activity,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  Radio,
  Clock,
  Compass,
  FileText,
  X,
  Server
} from 'lucide-react';
import { DisasterRecoveryIncident } from '@/types';
import { realWorldDisasters } from '@/data/realWorldDisasters';
import { newsApi, healthApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const BREAKING_TICKER = [
  '⚡ IMD Advisory: Bay of Bengal low-pressure system monitored by Doppler weather radar; maritime alerts active.',
  '🛡️ Wayanad Rehabilitation: Bailey bridge access reinforced; geohazard sensors deployed in Meppadi sector.',
  '🌊 Krishna River Basin: Budameru diversion bund repairs certified secure; floodwaters receding.',
  '🚁 Rapid Relief Flotillas: Over 35,000 emergency kits distributed across regional disaster corridors.',
  '🛰️ Space Applications Center: High-resolution multispectral satellite damage assessment feeds online.'
];

export function NewsPortal() {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<DisasterRecoveryIncident[]>(realWorldDisasters);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'impact' | 'rescue'>('date');
  const [activeDossier, setActiveDossier] = useState<DisasterRecoveryIncident | null>(null);
  const [modalImageTab, setModalImageTab] = useState<'primary' | 'secondary'>('primary');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTickerIdx, setActiveTickerIdx] = useState<number>(0);

  // Check backend server & fetch news
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const health = await healthApi.check();
        if (isMounted) setIsBackendConnected(!!health);

        const items = await newsApi.getAll();
        if (isMounted && items && items.length > 0) {
          setNewsItems(items);
        }
      } catch (err) {
        console.warn('Backend news sync fallback to local cache:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    // Rotate ticker every 5 seconds
    const interval = setInterval(() => {
      setActiveTickerIdx((prev) => (prev + 1) % BREAKING_TICKER.length);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return newsItems
      .filter((item) => {
        const matchesCategory = selectedFilter === 'all' || item.type === selectedFilter;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'impact') return b.peopleAffected - a.peopleAffected;
        if (sortBy === 'rescue') return b.peopleRescued - a.peopleRescued;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [newsItems, selectedFilter, searchQuery, sortBy]);

  // Telemetry Aggregates
  const totalMonitored = newsItems.length;
  const totalAffected = newsItems.reduce((acc, curr) => acc + (curr.peopleAffected || 0), 0);
  const totalRescued = newsItems.reduce((acc, curr) => acc + (curr.peopleRescued || 0), 0);
  const overallEfficiency = totalAffected > 0 ? ((totalRescued / totalAffected) * 100).toFixed(1) : '95.4';

  const handleOpenDossier = (incident: DisasterRecoveryIncident) => {
    setActiveDossier(incident);
    setModalImageTab('primary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white">
      {/* 1. Breaking News Advisory Ticker */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5 font-bold text-rose-800 shrink-0">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
          <Radio className="h-4 w-4 text-rose-700 animate-pulse" />
          <span>REAL-TIME DESK BULLETIN:</span>
        </div>
        <div className="flex-1 overflow-hidden font-medium text-slate-800">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTickerIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="line-clamp-1"
            >
              {BREAKING_TICKER[activeTickerIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">Updated every 5m</span>
        </div>
      </div>

      {/* 2. Page Header & Backend Connectivity Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#003366] text-white">
              Official Intelligence Feed
            </span>
            <span className="text-xs font-bold text-slate-500">|</span>
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider">
              राष्ट्रीय आपदा समाचार पोर्टल
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003366] tracking-tight">
            Disaster News &amp; Recovery Intelligence Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Live multi-agency disaster bulletins, verified ground rescue telemetry, satellite photographic dossiers, and tactical relief summaries from major crisis zones across India.
          </p>
        </div>

        {/* Backend & Live Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold shadow-xs">
            <Server className="h-4 w-4 text-[#003366]" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Backend Server</span>
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isBackendConnected ? 'Live API (Port 5001)' : 'Local Resilient Cache'}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/live')}
            className="bg-[#003366] hover:bg-[#0A2540] text-white font-bold text-xs gap-1.5 rounded-xl cursor-pointer shadow-xs"
          >
            <Compass className="h-4 w-4 text-[#FF9933]" />
            <span>View Live Map</span>
          </Button>
        </div>
      </div>

      {/* 3. Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Cataloged Crises</span>
            <FileText className="h-4 w-4 text-[#003366]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalMonitored}</div>
          <p className="text-[11px] text-slate-500">Verified major ground dossiers</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Population Impacted</span>
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {totalAffected.toLocaleString()}+
          </div>
          <p className="text-[11px] text-slate-500">Across monitored disaster sectors</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Citizens Rescued</span>
            <LifeBuoy className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {totalRescued.toLocaleString()}+
          </div>
          <p className="text-[11px] text-slate-500">Relocated to secure shelters</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Relief Success Rate</span>
            <Activity className="h-4 w-4 text-[#003366]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#003366]">{overallEfficiency}%</div>
          <p className="text-[11px] text-slate-500">Life-preservation triage efficacy</p>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search disaster bulletins by title, state, sector, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs bg-white h-10 border-slate-200 rounded-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-800 cursor-pointer shadow-xs focus:ring-1 focus:ring-[#003366]"
            >
              <option value="date">Most Recent First</option>
              <option value="impact">Highest People Impacted</option>
              <option value="rescue">Highest Citizens Rescued</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/70">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">Categories:</span>
          {[
            { id: 'all', label: 'All Disasters', count: newsItems.length },
            { id: 'cyclone', label: 'Cyclones (Dana & Remal)', count: newsItems.filter((i) => i.type === 'cyclone').length },
            { id: 'flood', label: 'Monsoon Floods (Vijayawada / Assam)', count: newsItems.filter((i) => i.type === 'flood').length },
            { id: 'landslide', label: 'Landslides (Wayanad)', count: newsItems.filter((i) => i.type === 'landslide').length },
            { id: 'cloudburst', label: 'Cloudbursts (Himachal Samej)', count: newsItems.filter((i) => i.type === 'cloudburst').length },
            { id: 'glacial_lake', label: 'Glacial Outburst (Sikkim GLOF)', count: newsItems.filter((i) => i.type === 'glacial_lake').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#003366] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedFilter === tab.id ? 'bg-[#FF9933] text-slate-900 font-extrabold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Disaster News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredItems.map((incident) => {
          const rescuePercent = Math.min(100, Math.round((incident.peopleRescued / incident.peopleAffected) * 100));

          return (
            <motion.article
              key={incident.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Photo & Satellite Banner */}
              <div className="relative h-56 w-full bg-slate-900 overflow-hidden group">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (incident.fallbackImageUrl && target.src !== incident.fallbackImageUrl) {
                      target.src = incident.fallbackImageUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Priority / Category badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#FF9933] text-slate-950 shadow-sm">
                    {incident.type.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white border border-white/20">
                    {incident.recoveryStage}
                  </span>
                </div>

                {/* Headline Overlay */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1">
                  <div className="flex items-center gap-3 text-xs text-white/90">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#FF9933]" />
                      {incident.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      {incident.state}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white line-clamp-1">{incident.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {incident.description}
                  </p>

                  {/* Impact vs Rescue Metric Bar */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-amber-600" />
                        Impact: {incident.peopleAffected.toLocaleString()}
                      </span>
                      <span className="text-emerald-700 flex items-center gap-1">
                        <LifeBuoy className="h-3.5 w-3.5 text-emerald-600" />
                        Rescued: {incident.peopleRescued.toLocaleString()} ({rescuePercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${rescuePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Deployments */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Tactical Relief Deployments:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {incident.keyDeployments.slice(0, 2).map((dep, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-[#003366] border border-blue-200 font-medium"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified Field Telemetry
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleOpenDossier(incident)}
                    className="bg-[#003366] hover:bg-[#0A2540] text-white text-xs font-bold gap-1 rounded-xl cursor-pointer"
                  >
                    <span>Inspect Full Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Disaster Dossiers Found</h3>
          <p className="text-xs text-slate-500">
            No incident reports matched your search criteria "{searchQuery}".
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="text-xs font-bold"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* 6. Detailed Incident Dossier Modal */}
      <AnimatePresence>
        {activeDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50 sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#003366] text-white">
                      {activeDossier.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{activeDossier.state}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#003366]">{activeDossier.title}</h3>
                  {activeDossier.hindiTitle && (
                    <p className="text-xs text-slate-500 font-serif">{activeDossier.hindiTitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDossier(null)}
                  className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Photo Viewer with Tab Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalImageTab('primary')}
                        className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                          modalImageTab === 'primary'
                            ? 'bg-[#003366] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Ground / Radar Photography
                      </button>
                      {activeDossier.secondaryImageUrl && (
                        <button
                          type="button"
                          onClick={() => setModalImageTab('secondary')}
                          className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                            modalImageTab === 'secondary'
                              ? 'bg-[#003366] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Satellite / Relief Logistics
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="h-72 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                    <img
                      src={modalImageTab === 'primary' ? activeDossier.imageUrl : activeDossier.secondaryImageUrl}
                      alt={activeDossier.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (activeDossier.fallbackImageUrl && target.src !== activeDossier.fallbackImageUrl) {
                          target.src = activeDossier.fallbackImageUrl;
                        }
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 p-2 text-white text-xs">
                      {modalImageTab === 'primary'
                        ? activeDossier.imageCaption
                        : activeDossier.secondaryImageCaption}
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">People Impacted</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {activeDossier.peopleAffected.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">People Rescued</span>
                    <span className="text-base font-extrabold text-emerald-700">
                      {activeDossier.peopleRescued.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Relief Efficiency</span>
                    <span className="text-base font-extrabold text-[#003366]">
                      {activeDossier.reliefEfficiency}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Fatalities Prevented</span>
                    <span className="text-base font-extrabold text-amber-700">
                      {activeDossier.fatalitiesPrevented.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Incident Narrative */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Incident Context &amp; Severity Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                    {activeDossier.description}
                  </p>
                </div>

                {/* Key Engineering & Response Deployments */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Key Response Deployments &amp; Engineering Actions
                  </h4>
                  <ul className="space-y-1.5">
                    {activeDossier.keyDeployments.map((dep, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{dep}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operational Field Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#FF9933]" />
                    Operational Field Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/80">
                    {activeDossier.operationalSummary}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/live')}
                  className="text-xs font-bold gap-1.5"
                >
                  <MapPin className="h-3.5 w-3.5 text-rose-600" />
                  <span>Inspect on Live Map</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setActiveDossier(null)}
                  className="bg-[#003366] hover:bg-[#0A2540] text-white text-xs font-bold px-5 cursor-pointer"
                >
                  Close Dossier
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
