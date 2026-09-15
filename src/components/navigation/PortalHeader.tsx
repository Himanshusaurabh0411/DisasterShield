import React from 'react';
import { PhoneCall, Shield, AlertTriangle, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PortalHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-3 sm:py-4 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: DisasterShield Institutional Emblem & Bilingual Titles */}
        <Link to="/" className="flex items-center gap-3.5 sm:gap-4 text-left group">
          {/* Institutional Crest / Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-b from-[#003366] to-[#002244] border-2 border-amber-500/80 flex items-center justify-center shadow-md text-white relative overflow-hidden group-hover:border-amber-400 transition-colors">
              <Shield className="h-8 w-8 sm:h-9 sm:w-9 text-amber-400 drop-shadow" />
              <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent pointer-events-none" />
              <span className="absolute bottom-1 text-[8px] font-black tracking-widest text-amber-300 uppercase">
                CRISIS HQ
              </span>
            </div>
          </div>

          {/* Bilingual Institutional Text */}
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              राष्ट्रीय आपदा प्रबंधन एवं नागरिक आपातकालीन सेवा
            </span>
            <span className="text-base sm:text-xl font-black tracking-tight text-[#003366] uppercase leading-snug">
              DisasterShield National Portal
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">
              Integrated Crisis Coordination, Ground Triage & Multi-Agency Dispatch System
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] sm:text-[11px] text-[#E65100] font-bold tracking-wide">
                24x7 Open Emergency Response & Field Telemetry Network
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Operational
              </span>
            </div>
          </div>
        </Link>

        {/* Right: 24x7 Emergency Helplines Directory */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Toll-Free Emergency Helpline Box */}
          <div className="flex items-center gap-3 border-2 border-rose-600 bg-rose-50/80 px-4 py-2 rounded-md shadow-xs">
            <div className="h-10 w-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                24x7 Disaster Helpline (Toll-Free)
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="tel:1078"
                  className="text-xl font-black text-rose-700 hover:underline leading-none tracking-tight"
                >
                  1078
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href="tel:112"
                  className="text-sm font-black text-slate-800 hover:text-rose-700 hover:underline leading-none"
                >
                  ERSS 112
                </a>
              </div>
            </div>
          </div>

          {/* Quick Helplines Box */}
          <div className="hidden xl:flex flex-col border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-md text-xs text-slate-700 font-semibold space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Rapid Helplines:</span>
            <div className="flex items-center gap-2 text-xs">
              <a href="tel:101" className="hover:text-[#003366] hover:underline">
                Fire: <strong className="text-amber-800">101</strong>
              </a>
              <span className="text-slate-300">|</span>
              <a href="tel:108" className="hover:text-[#003366] hover:underline">
                Medical: <strong className="text-emerald-800">108</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
