import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Radio,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  Users,
  HardDrive,
  Package,
  ArrowUpRight,
  MapPin,
  Maximize2
} from 'lucide-react';
import { Incident } from '@/types';
import { mockIncidents, disasterTypeLabels, priorityConfig } from '@/data/incidents';
import { LiveEmergencyMap } from '@/components/map/LiveEmergencyMap';
import { Geospatial3DMap } from '@/components/map/Geospatial3DMap';
import { IncidentDrawer } from '@/components/reports/IncidentDrawer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { timeAgo, formatNumber } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const RECENT_ACTIVITIES = [
  { id: '1', time: '12s ago', text: 'Telemetry verified: Lower Lake Bhopal automated sensors nominal' },
  { id: '2', time: '1m ago', text: 'Volunteer squad Bravo-2 mobilized to Dharavi flood sector' },
  { id: '3', time: '3m ago', text: 'IMD cyclone weather radar tracking 85 km/h gusts on Odisha coast' },
  { id: '4', time: '5m ago', text: 'Offline citizen intimation synced successfully via local cache' },
  { id: '5', time: '8m ago', text: 'Structural safety clearance issued for Old Delhi building report' },
];

export function GlobalCommandCenter() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mapMode, setMapMode] = useState<'2d' | '3d'>('3d');
  const navigate = useNavigate();

  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setFocusedIncidentId(incident.id);
    setIsDrawerOpen(true);
  };

  const handleFocusOnMap = (incident: Incident) => {
    setSelectedIncident(incident);
    setFocusedIncidentId(incident.id);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 space-y-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#003366] to-[#0A2540] text-white flex items-center justify-center font-bold shadow-sm">
            <Activity className="h-6 w-6 text-[#FF9933]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                Emergency Operations Center
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                24/7 Active Monitoring
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">
              Live Crisis Situation Room
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 2D / 3D Geospatial View Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setMapMode('2d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === '2d'
                  ? 'bg-white text-[#003366] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D Live Map / 2D नक्शा
            </button>
            <button
              type="button"
              onClick={() => setMapMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === '3d'
                  ? 'bg-[#003366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>3D WebGL Terrain / 3D भू-स्थानिक</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/live')}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all hover:border-slate-300 cursor-pointer shadow-xs"
          >
            <span>Full Live Room</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#003366]" />
          </button>
        </div>
      </div>

      {/* 3-Column Command Center Grid with Interactive Map in the Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Live Incident Feed (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3 flex flex-col h-[540px]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-rose-600" />
              Active Field Reports
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
              {mockIncidents.length} Active
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {mockIncidents.map((incident) => {
              const isCritical = incident.priority === 'critical';
              const isSelected = focusedIncidentId === incident.id;

              return (
                <button
                  type="button"
                  key={incident.id}
                  onClick={() => handleFocusOnMap(incident)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-[#003366] bg-blue-50/60 shadow-sm ring-2 ring-[#003366]/20'
                      : isCritical
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {incident.priority}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {timeAgo(incident.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{incident.title}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                    <span className="truncate flex items-center gap-1 text-[11px]">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      {incident.location.area}
                    </span>
                    <span className="text-slate-800 font-bold text-[11px] shrink-0">
                      {incident.peopleAffected} Impacted
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Crucial Functional Interactive Map (2D or 3D WebGL) (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 overflow-hidden relative h-[540px] shadow-sm bg-[#06111f]">
          {mapMode === '3d' ? (
            <Geospatial3DMap
              incidents={mockIncidents}
              selectedIncidentId={focusedIncidentId}
              onIncidentClick={handleIncidentSelect}
              height="540px"
            />
          ) : (
            <LiveEmergencyMap
              incidents={mockIncidents}
              selectedIncidentId={focusedIncidentId}
              onIncidentClick={handleIncidentSelect}
              height="540px"
              showFilters={true}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Key Operational Metrics (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3 flex flex-col h-[540px] justify-between text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                Response Mobilization
              </span>
              <span className="text-slate-400 text-[11px] font-semibold uppercase">Real-Time</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Active Crises</span>
                  <span className="text-xl font-extrabold text-rose-600">
                    <AnimatedCounter value={124} allowSubtleFluctuation />
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Flame className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Citizens Assisted</span>
                  <span className="text-xl font-extrabold text-amber-600">
                    <AnimatedCounter value={28491} allowSubtleFluctuation />
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Responders Active</span>
                  <span className="text-xl font-extrabold text-[#003366]">
                    <AnimatedCounter value={1284} allowSubtleFluctuation />
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                  <Shield className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Offline Sync Buffer</span>
                  <span className="text-xl font-extrabold text-emerald-600">
                    <AnimatedCounter value={8742} allowSubtleFluctuation />
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/70 text-[11px] text-slate-700 leading-relaxed shadow-xs">
            <span className="text-[#003366] font-bold block mb-0.5">Civic Dispatch Mesh</span>
            <span>Emergency medical responders and community relief squads actively synchronized on live map.</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Footer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-800 font-bold">Recent Telemetry:</span>
        </div>

        <div className="flex-1 overflow-x-auto whitespace-nowrap space-x-6 text-slate-600 text-[11px]">
          {RECENT_ACTIVITIES.map((act) => (
            <span key={act.id} className="inline-flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">{act.time}</span>
              <span>{act.text}</span>
              <span className="text-slate-300 font-bold ml-2">&bull;</span>
            </span>
          ))}
        </div>

        <span className="text-[11px] text-emerald-700 shrink-0 font-bold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Network Nominal
        </span>
      </div>

      {/* Slide-over Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
