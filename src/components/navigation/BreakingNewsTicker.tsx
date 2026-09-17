import React, { useState } from 'react';
import { Play, Pause, Radio, AlertCircle } from 'lucide-react';

const EMERGENCY_BULLETINS = [
  { id: '1', time: 'JUST IN', text: 'Cyclone monitoring: Wind velocity steady at 85 km/h across eastern coastal belt. Emergency shelters active.' },
  { id: '2', time: '1m ago', text: 'Lower Lake Bhopal: Automated sensors reporting stable reservoir discharge. Drainage units on standby.' },
  { id: '3', time: '4m ago', text: 'Volunteer squad Bravo-2 mobilized with water purification equipment and 500 family ration kits.' },
  { id: '4', time: '7m ago', text: 'Offline reporting pipeline: 12 local crisis dossiers successfully synced to central dispatch queue.' },
  { id: '5', time: '11m ago', text: 'Medical dispatch team en route to Sector 4 temporary triage clinic. Blood donation drives underway.' },
];

export function BreakingNewsTicker() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      className="w-full bg-slate-100 border-b border-slate-200 text-slate-800 text-xs overflow-hidden select-none"
      role="region"
      aria-label="Live Emergency Broadcast"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10">
        {/* Community Emergency Alert Badge */}
        <div className="flex items-center gap-2 bg-[#003366] text-white px-3 py-1 rounded font-extrabold text-[11px] shrink-0 uppercase tracking-wider shadow-xs mr-3 border-l-4 border-[#FF9933]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="hidden sm:inline">सामुदायिक अलर्ट | COMMUNITY ALERT</span>
          <span className="sm:hidden">अलर्ट</span>
        </div>

        {/* Scrolling Ticker Text */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="whitespace-nowrap animate-ticker flex items-center gap-8"
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            {EMERGENCY_BULLETINS.concat(EMERGENCY_BULLETINS).map((item, index) => (
              <span key={`${item.id}-${index}`} className="inline-flex items-center gap-2 text-slate-700">
                <span className="font-bold text-[#003366] text-[11px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {item.time}
                </span>
                <span className="font-medium">{item.text}</span>
                <span className="text-slate-400 font-bold ml-3">&bull;</span>
              </span>
            ))}
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="pl-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause live feed' : 'Resume live feed'}
            title={isPlaying ? 'Pause ticker' : 'Play ticker'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
