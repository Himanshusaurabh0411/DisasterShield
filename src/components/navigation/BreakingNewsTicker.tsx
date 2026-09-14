import React, { useState } from 'react';
import { Bell, Pause, Play, AlertCircle } from 'lucide-react';

const TICKER_ITEMS = [
  { id: '1', tag: 'NDRF DEPLOYMENT', text: '10th & 12th NDRF Battalions deployed for flood rescue in coastal districts. Emergency teams on 24x7 readiness.' },
  { id: '2', tag: 'TOLL-FREE HELPLINE', text: 'Dial 1078 (Toll-Free) or 112 for immediate disaster rescue and medical assistance across all States & UTs.' },
  { id: '3', tag: 'IMD WEATHER ADVISORY', text: 'Heavy rainfall and gale wind warning issued for Odisha, West Bengal, and Coastal Andhra Pradesh.' },
  { id: '4', tag: 'OFFLINE RESILIENCE', text: 'Citizen Reporting Facility: Citizen reports are cached securely in local browser storage during connectivity loss and sync automatically.' },
  { id: '5', tag: 'SEISMIC MONITOR', text: 'National Center for Seismology confirms normal background parameters across Himalayan Fault Zone.' },
  { id: '6', tag: 'RELIEF DISTRIBUTION', text: 'Central warehouse stockpiles activated: 50,000 trauma kits and potable water tanks dispatched to transit camps.' },
];

export function BreakingNewsTicker() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full bg-[#FFF8E7] border-b border-[#F0D59A] text-slate-900 text-xs select-none">
      <div className="max-w-7xl mx-auto flex items-stretch h-8.5 sm:h-9">
        {/* Left Official Saffron Badge */}
        <div className="flex items-center gap-2 px-3.5 bg-[#E65100] text-white font-bold shrink-0 z-10 text-[11px] uppercase tracking-wider">
          <Bell className="h-3.5 w-3.5" />
          <span>LATEST UPDATES</span>
          <span className="text-[9px] font-normal text-amber-200 hidden sm:inline">| नवीनतम अपडेट</span>
        </div>

        {/* Marquee Content */}
        <div className="relative flex-1 overflow-hidden flex items-center px-2">
          <div
            className={`flex whitespace-nowrap items-center gap-8 ${
              isPaused ? '' : 'animate-ticker'
            }`}
          >
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                  {item.tag}
                </span>
                <span className="text-slate-800 font-medium">{item.text}</span>
                <span className="text-slate-400 mx-2 font-bold">&bull;</span>
              </div>
            ))}
          </div>
        </div>

        {/* GIGW Accessibility Control: Pause / Play Button */}
        <div className="flex items-center px-2.5 border-l border-[#F0D59A] bg-[#FFF8E7] shrink-0">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 rounded text-slate-700 hover:text-[#003366] hover:bg-amber-100 transition-colors"
            title={isPaused ? 'Resume scrolling ticker' : 'Pause scrolling ticker'}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 text-[#E65100]" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
