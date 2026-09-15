import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Phone,
  Flame,
  ArrowRight,
  Play,
  CheckCircle2
} from 'lucide-react';
import { Incident } from '@/types';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { disasterTypeLabels, priorityConfig, statusConfig } from '@/data/incidents';
import { formatNumber, timeAgo, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface IncidentDrawerProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignResponder?: (id: string) => void;
  onStartResponse?: (id: string) => void;
}

export function IncidentDrawer({
  incident,
  isOpen,
  onClose,
  onAssignResponder,
  onStartResponse,
}: IncidentDrawerProps) {
  const navigate = useNavigate();

  if (!incident) return null;

  const cfg = priorityConfig[incident.priority];
  const statusCfg = statusConfig[incident.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded bg-[#003366] text-white font-mono font-bold">
                      {incident.trackingId}
                    </span>
                    <PriorityBadge priority={incident.priority} />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {incident.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span className="font-semibold">{disasterTypeLabels[incident.disasterType]}</span>
                    <span>&bull;</span>
                    <span className={statusCfg?.color}>● {statusCfg?.label}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-900">
                {/* Authentic Incident Photo Evidence */}
                {incident.imageUrl && (
                  <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                    <img
                      src={incident.imageUrl}
                      alt={incident.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-[#FF9933]" />
                        <span>Verified Field Imagery</span>
                      </span>
                      <span className="text-amber-300 font-bold uppercase text-[10px]">
                        {disasterTypeLabels[incident.disasterType]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Situation summary */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Incident Description / घटना विवरण
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
                    {incident.description}
                  </p>
                </div>

                {/* Casualties and impact summary */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Impacted</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatNumber(incident.peopleAffected)}
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-800 block uppercase">Injured</span>
                    <span className="text-lg font-extrabold text-amber-900">
                      {incident.injured}
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[10px] font-bold text-rose-800 block uppercase">Trapped</span>
                    <span className="text-lg font-extrabold text-rose-900">
                      {incident.trapped}
                    </span>
                  </div>
                </div>

                {/* Location details */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Geospatial Location / भू-स्थान
                  </span>
                  <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{incident.location.area}</span>
                    </div>
                    {incident.location.landmark && (
                      <p className="text-slate-600 pl-6">
                        Landmark: {incident.location.landmark}
                      </p>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>GPS: {incident.location.latitude.toFixed(4)}°N, {incident.location.longitude.toFixed(4)}°E</span>
                      <span className="text-emerald-700 font-bold">Accuracy: ±{incident.location.accuracy || 10}m</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Info */}
                <div className="p-3.5 rounded-md bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#003366]">Initial Reporting:</span>
                    <span>{formatDateTime(incident.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#003366]">EOC Logging:</span>
                    <span>{timeAgo(incident.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-2.5">
                <Button
                  className="w-full bg-[#003366] hover:bg-[#0A2540] text-white font-bold h-11 rounded-md cursor-pointer"
                  onClick={() => {
                    onClose();
                    navigate(`/track?id=${incident.trackingId}`);
                  }}
                >
                  Inspect Full Public Dossier <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-200 rounded-md cursor-pointer"
                  onClick={onClose}
                >
                  Close Inspection
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
