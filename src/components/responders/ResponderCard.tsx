import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Briefcase, Phone, Shield } from 'lucide-react';
import { Responder } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { responderTypeConfig } from '@/data/responders';
import { cn } from '@/lib/utils';

interface Props {
  responder: Responder;
  onMatch?: (id: string) => void;
}

const availabilityConfig = {
  available: { label: 'Available', class: 'text-emerald-800 bg-emerald-100 border-emerald-300' },
  deployed: { label: 'Deployed', class: 'text-amber-800 bg-amber-100 border-amber-300' },
  offline: { label: 'Standby / Off-Duty', class: 'text-slate-600 bg-slate-100 border-slate-300' },
};

export function ResponderCard({ responder, onMatch }: Props) {
  const typeConfig = responderTypeConfig[responder.type];
  const avail = availabilityConfig[responder.availability];
  const loadPct = Math.round((responder.activeAssignments / responder.maxCapacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{responder.name}</h3>
          <p className={cn('text-xs font-semibold mt-0.5', typeConfig.color)}>{typeConfig.label}</p>
        </div>
        <span className={cn('px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide', avail.class)}>
          {avail.label}
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-3">{responder.specialization}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{responder.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 fill-amber-400" />
          <span className="font-semibold">{responder.rating} rating</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{responder.resolvedCases} missions</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-[#003366]">
          <span>{responder.distance} km away</span>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="text-slate-500 font-medium">Battalion Capacity</span>
          <span className="text-slate-800 font-bold">{responder.activeAssignments}/{responder.maxCapacity} units</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              loadPct > 80 ? 'bg-rose-600' : loadPct > 50 ? 'bg-amber-500' : 'bg-emerald-600'
            )}
            style={{ width: `${loadPct}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-md font-semibold cursor-pointer"
          disabled={responder.availability === 'offline'}
        >
          <Phone className="h-3.5 w-3.5 mr-1 text-[#003366]" />
          Direct Dispatch
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-[#003366] hover:bg-[#0A2540] text-white text-xs h-9 rounded-md font-bold cursor-pointer"
          disabled={responder.availability !== 'available'}
          onClick={() => onMatch?.(responder.id)}
        >
          Deploy Unit
        </Button>
      </div>
    </motion.div>
  );
}
