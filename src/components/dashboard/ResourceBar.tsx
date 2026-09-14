import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Resource } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  resource: Resource;
}

export function ResourceBar({ resource }: Props) {
  const pct = Math.round((resource.available / resource.total) * 100);
  const isCritical = resource.critical || pct < 30;
  const barColor = pct < 20 ? 'bg-rose-600' : pct < 40 ? 'bg-amber-500' : pct < 60 ? 'bg-yellow-500' : 'bg-emerald-600';

  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCritical && <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />}
          <span className="text-sm font-semibold text-slate-900">{resource.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-bold', isCritical ? 'text-rose-700' : 'text-slate-800')}>
            {resource.available} / {resource.total}
          </span>
          <span className="text-xs text-slate-500">{resource.unit}</span>
        </div>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
        <motion.div
          className={cn('h-full rounded-full', barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-slate-500">{resource.inUse} in field deployment</span>
        <span className={cn('text-xs font-bold', isCritical ? 'text-rose-700' : 'text-slate-600')}>
          {pct}% operational capacity
          {isCritical && ' (CRITICAL SHORTAGE)'}
        </span>
      </div>
    </div>
  );
}
