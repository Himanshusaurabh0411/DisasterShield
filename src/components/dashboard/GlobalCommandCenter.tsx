import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPin
} from 'lucide-react';
import { Incident } from '@/types';
import { mockIncidents, disasterTypeLabels, priorityConfig } from '@/data/incidents';
import { mockResources } from '@/data/resources';
import { DisasterGlobe } from '@/components/globe/DisasterGlobe';
import { IncidentDrawer } from '@/components/reports/IncidentDrawer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { timeAgo, formatNumber } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const RECENT_ACTIVITIES = [
  { id: '1', time: '12s ago', text: 'Telemetry confirmed: Lower Lake, Bhopal water sensors nominal' },
  { id: '2', time: '1m ago', text: 'NDRF 8th Battalion deployed to Dharavi Sector 4 flood area' },
  { id: '3', time: '3m ago', text: 'IMD cyclone alert advisory updated for Odisha coast' },
  { id: '4', time: '5m ago', text: 'Offline citizen intimation synced successfully via NIC relay' },
  { id: '5', time: '8m ago', text: 'Structural stability verified for Old Delhi building report' },
];

export function GlobalCommandCenter() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDrawerOpen(true);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 sm:p-7 space-y-6 shadow-xs">
      {/* Official Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-md bg-[#003366] text-white flex items-center justify-center font-bold shadow-xs">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                राष्ट्रीय आपातकालीन परिचालन केंद्र (NEOC)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                ● 24x7 LIVE DESK
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              National Emergency Situation Room
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/live')}
            className="px-4 py-2 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            Open Full GIS Situation Desk <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Column Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Live Incident Feed (4 cols) */}
        <div className="lg:col-span-4 rounded-md border border-slate-200 bg-slate-50/70 p-4 space-y-3 flex flex-col h-[490px]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-rose-600" />
              Active Incident Intimations
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              {mockIncidents.length} Reported
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {mockIncidents.map((incident) => {
              const isCritical = incident.priority === 'critical';

              return (
                <button
                  key={incident.id}
                  onClick={() => handleIncidentSelect(incident)}
                  className={`w-full text-left p-3 rounded-md border transition-all flex flex-col gap-1 cursor-pointer ${
                    isCritical
                      ? 'border-rose-300 bg-rose-50/70 hover:bg-rose-100/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-100/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tight ${
                        isCritical
                          ? 'bg-rose-200 text-rose-900 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {incident.priority}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {timeAgo(incident.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{incident.title}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                    <span className="truncate flex items-center gap-1 text-[11px]">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      {incident.location.area}
                    </span>
                    <span className="text-slate-800 font-bold text-[11px]">
                      {incident.peopleAffected} Impacted
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Interactive 3D Earth / Map (5 cols) */}
        <div className="lg:col-span-5 rounded-md border border-slate-300 bg-slate-100 overflow-hidden relative h-[490px] p-2 flex flex-col justify-between shadow-inner">
          <DisasterGlobe
            incidents={mockIncidents}
            onIncidentClick={handleIncidentSelect}
          />
        </div>

        {/* RIGHT COLUMN: Key Operational Metrics (3 cols) */}
        <div className="lg:col-span-3 rounded-md border border-slate-200 bg-slate-50/70 p-4 space-y-3.5 flex flex-col h-[490px] justify-between text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-700" />
                Response Mobilization
              </span>
              <span className="text-slate-500 text-[11px] font-medium">National Grid</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold uppercase">Active Emergencies</span>
                  <span className="text-xl font-extrabold text-rose-700">
                    <AnimatedCounter value={124} allowSubtleFluctuation />
                  </span>
                </div>
                <Flame className="h-5 w-5 text-rose-600" />
              </div>

              <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold uppercase">Citizens Assisted</span>
                  <span className="text-xl font-extrabold text-amber-700">
                    <AnimatedCounter value={28491} allowSubtleFluctuation />
                  </span>
                </div>
                <Users className="h-5 w-5 text-amber-600" />
              </div>

              <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold uppercase">Responders Deployed</span>
                  <span className="text-xl font-extrabold text-[#003366]">
                    <AnimatedCounter value={1284} allowSubtleFluctuation />
                  </span>
                </div>
                <Shield className="h-5 w-5 text-[#003366]" />
              </div>

              <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold uppercase">Offline Reports Synced</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    <AnimatedCounter value={8742} allowSubtleFluctuation />
                  </span>
                </div>
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-md border border-blue-200 bg-blue-50 text-[11px] text-slate-700 leading-relaxed">
            <span className="text-[#003366] font-bold block mb-0.5">Disaster Management Division</span>
            <span>NDRF battalions and medical rapid action teams placed on high operational alert nationwide.</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Footer */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-slate-800 font-bold">Recent Telemetry:</span>
        </div>

        <div className="flex-1 overflow-x-auto whitespace-nowrap space-x-6 text-slate-700 text-[11px]">
          {RECENT_ACTIVITIES.map((act) => (
            <span key={act.id} className="inline-flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">{act.time}</span>
              <span>{act.text}</span>
              <span className="text-slate-400 font-bold ml-2">&bull;</span>
            </span>
          ))}
        </div>

        <span className="text-[11px] text-emerald-800 shrink-0 font-bold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          All Services Nominal
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
