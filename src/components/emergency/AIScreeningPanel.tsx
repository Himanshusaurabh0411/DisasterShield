import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertOctagon, Copy, Gauge, Sparkles, AlertTriangle } from 'lucide-react';
import { AIScore } from '@/types';
import { PriorityBadge } from '@/components/reports/PriorityBadge';

interface AIScreeningPanelProps {
  aiScore?: AIScore;
  className?: string;
  isCompact?: boolean;
}

export function AIScreeningPanel({ aiScore, className = '', isCompact = false }: AIScreeningPanelProps) {
  if (!aiScore) return null;

  return (
    <div
      className={`rounded-md border border-slate-200 bg-slate-50 p-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-[#003366] text-white flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Automated Triage & Validation Screening (स्वचालित पूर्व-जांच)
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Geospatial validation & duplicate detection algorithm
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#003366] border border-blue-200">
          NIC HEURISTIC v1.0
        </span>
      </div>

      <div className={`grid ${isCompact ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 sm:grid-cols-4 gap-3'}`}>
        {/* Credibility */}
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>CREDIBILITY</span>
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-emerald-700">
              {aiScore.credibility}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">High</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${aiScore.credibility}%` }}
            />
          </div>
        </div>

        {/* Urgency */}
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>URGENCY SCORE</span>
            <Gauge className="h-4 w-4 text-amber-600" />
          </div>
          <div className="pt-0.5">
            <PriorityBadge priority={aiScore.urgency} />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Multi-factor severity</span>
        </div>

        {/* Duplicate Probability */}
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>DUPLICATE RISK</span>
            <Copy className="h-4 w-4 text-[#003366]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#003366]">
              {aiScore.duplicateProbability}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Unique</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-[#003366] rounded-full"
              style={{ width: `${aiScore.duplicateProbability}%` }}
            />
          </div>
        </div>

        {/* Recommended Priority */}
        <div className="rounded-md border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>RECOMMENDED PRIORITY</span>
            <AlertOctagon className="h-4 w-4 text-rose-600" />
          </div>
          <div className="pt-0.5">
            <PriorityBadge priority={aiScore.recommendedPriority} />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Triage assessment</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-600 flex items-center gap-1.5 bg-white p-2.5 rounded-md border border-slate-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          Advisory: Automated computer vision and geospatial NLP screen incoming community reports before coordinator dispatch.
        </span>
      </div>
    </div>
  );
}
