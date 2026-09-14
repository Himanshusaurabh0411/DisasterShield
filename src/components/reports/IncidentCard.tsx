import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { Incident } from '@/types';
import { PriorityBadge } from './PriorityBadge';
import { disasterTypeLabels, priorityConfig, statusConfig } from '@/data/incidents';
import { timeAgo, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const disasterEmoji: Record<string, string> = {
  flood: '🌊',
  earthquake: '🌍',
  cyclone: '🌀',
  fire: '🔥',
  landslide: '⛰️',
  building_collapse: '🏚️',
  medical: '🏥',
  missing_person: '🔍',
  rescue_required: '🆘',
  food_water: '💧',
  other: '⚠️',
};

interface Props {
  incident: Incident;
  onClick?: () => void;
}

export function IncidentCard({ incident, onClick }: Props) {
  const cfg = priorityConfig[incident.priority];
  const statusCfg = statusConfig[incident.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-md border border-slate-200 bg-white p-4 transition-all hover:border-[#003366] hover:shadow-md shadow-xs group cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{disasterEmoji[incident.disasterType] || '⚠️'}</span>
          <div>
            <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#003366] transition-colors">
              {incident.title}
            </p>
            <p className="text-xs text-slate-500 font-medium">{disasterTypeLabels[incident.disasterType]}</p>
          </div>
        </div>
        <PriorityBadge priority={incident.priority} />
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
        {incident.description}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-slate-50 p-2.5 rounded border border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{incident.location.area}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Users className="h-3 w-3 text-slate-400 shrink-0" />
          <span>{formatNumber(incident.peopleAffected)} affected</span>
        </div>
        {incident.trapped > 0 && (
          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
            <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
            <span>{incident.trapped} trapped</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{timeAgo(incident.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className={cn('text-xs font-bold', statusCfg?.color)}>
          ● {statusCfg?.label}
        </span>
        <span className="text-xs text-[#003366] font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {incident.trackingId}
        </span>
      </div>
    </motion.button>
  );
}
