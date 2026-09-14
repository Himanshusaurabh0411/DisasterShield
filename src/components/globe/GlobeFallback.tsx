import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, AlertTriangle } from 'lucide-react';
import { Incident } from '@/types';
import { priorityConfig, disasterTypeLabels } from '@/data/incidents';
import { formatNumber } from '@/lib/utils';

interface Props {
  incidents: Incident[];
  onIncidentClick?: (incident: Incident) => void;
}

// Simple map fallback showing India map outline with positioned incident dots
function latLngToPercent(lat: number, lng: number) {
  // Rough bounding box for India: lat 6-38, lng 66-100
  const minLat = 6, maxLat = 38, minLng = 66, maxLng = 100;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

export function GlobeFallback({ incidents, onIncidentClick }: Props) {
  return (
    <div className="flex flex-col h-full text-slate-900">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <span className="text-xs text-slate-600 font-semibold">
          NIC GIS Map Projection — 2D Cartographic View
        </span>
      </div>

      {/* Map container */}
      <div className="relative flex-1 rounded-md border border-slate-300 bg-slate-100 overflow-hidden min-h-[280px]">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,51,102,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,51,102,0.1) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* India outline */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 20 5 L 30 8 L 45 5 L 60 10 L 75 15 L 80 25 L 75 35 L 80 45 L 70 60 L 65 75 L 55 90 L 50 95 L 45 90 L 40 75 L 30 65 L 20 55 L 15 40 L 10 25 Z"
            stroke="#003366"
            strokeWidth="0.8"
            fill="rgba(0,51,102,0.1)"
          />
        </svg>

        {/* Incident markers */}
        {incidents.map((incident, i) => {
          const { x, y } = latLngToPercent(incident.lat, incident.lng);
          const cfg = priorityConfig[incident.priority];

          return (
            <motion.button
              key={incident.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onIncidentClick?.(incident)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={incident.title}
            >
              {/* Pulse ring */}
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-60"
                style={{ backgroundColor: cfg.color, transform: 'scale(1.8)' }}
              />
              {/* Core dot */}
              <span
                className="relative flex h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs"
                style={{ backgroundColor: cfg.color }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 shadow-xl z-10">
                <p className="font-bold">{incident.title}</p>
                <p className="text-slate-500 text-[10px]">{incident.location.area}</p>
              </div>
            </motion.button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-md border border-slate-300 bg-white/95 p-2.5 shadow-xs">
          <p className="text-[9px] font-bold tracking-wider text-[#003366] uppercase mb-0.5">Priority</p>
          {[
            { label: 'Critical', color: '#dc2626' },
            { label: 'High', color: '#ea580c' },
            { label: 'Medium', color: '#ca8a04' },
            { label: 'Resolved', color: '#16a34a' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-slate-700 font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <div className="absolute top-3 right-3">
          <span className="rounded border border-blue-300 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003366]">
            ISRO / Bhuvan Projection
          </span>
        </div>
      </div>

      {/* Incident list below map */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {incidents.slice(0, 4).map(incident => {
          const cfg = priorityConfig[incident.priority];
          return (
            <button
              key={incident.id}
              onClick={() => onIncidentClick?.(incident)}
              className="rounded-md border border-slate-200 bg-white p-2.5 text-left hover:border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{incident.title}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span className="line-clamp-1">{incident.location.area}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5 font-semibold">
                <Users className="h-3 w-3 text-slate-400" />
                <span>{formatNumber(incident.peopleAffected)} impacted</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
