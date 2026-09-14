import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, AlertTriangle, Clock, Shield, Phone, Navigation } from 'lucide-react';
import { Incident } from '@/types';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { disasterTypeLabels, priorityConfig, statusConfig } from '@/data/incidents';
import { formatNumber, timeAgo, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onAssignResponder?: (incidentId: string) => void;
}

export function IncidentDetailModal({ incident, onClose, onAssignResponder }: IncidentDetailModalProps) {
  if (!incident) return null;

  const cfg = priorityConfig[incident.priority];
  const statusCfg = statusConfig[incident.status];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PriorityBadge priority={incident.priority} />
                <span className={`text-xs font-bold ${statusCfg?.color}`}>
                  &bull; {statusCfg?.label}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003366] border border-blue-200">
                  {incident.trackingId}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{incident.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {disasterTypeLabels[incident.disasterType]} &bull; Reported {timeAgo(incident.createdAt)}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Situation Report</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {incident.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">PEOPLE AFFECTED</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatNumber(incident.peopleAffected)}
              </span>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3.5 text-center">
              <span className="text-[10px] font-bold text-amber-800 block uppercase">CONFIRMED INJURED</span>
              <span className="text-xl font-extrabold text-amber-900">
                {incident.injured}
              </span>
            </div>
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3.5 text-center">
              <span className="text-[10px] font-bold text-rose-800 block uppercase">TRAPPED VICTIMS</span>
              <span className="text-xl font-extrabold text-rose-900">
                {incident.trapped}
              </span>
            </div>
          </div>

          {/* Location & GPS HUD */}
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Geographic Area
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                GEOTAG ACCURACY ±10M
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800">{incident.location.area}</p>
            {incident.location.landmark && (
              <p className="text-xs text-slate-600">Landmark: {incident.location.landmark}</p>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>LAT: {incident.location.latitude} | LON: {incident.location.longitude}</span>
              <span>Logged: {formatDateTime(incident.createdAt)}</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-200">
            {onAssignResponder && incident.status !== 'resolved' && (
              <Button
                variant="default"
                onClick={() => {
                  onAssignResponder(incident.id);
                  onClose();
                }}
                className="flex-1 bg-[#003366] hover:bg-[#0A2540] text-white font-bold rounded-md"
              >
                Deploy Specialized Response Unit
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md"
            >
              Close Dossier
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
