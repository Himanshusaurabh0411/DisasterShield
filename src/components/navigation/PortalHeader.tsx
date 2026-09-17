import React from 'react';
import { PhoneCall, Shield, AlertTriangle, Radio, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CommunityLogo } from '@/components/ui/CommunityLogo';

export function PortalHeader() {
  return (
    <header className="w-full bg-white border-b-2 border-slate-200 py-3 sm:py-4 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: DisasterShield Independent Civic-Tech Logo & Community Platform Identity */}
        <Link to="/" className="flex items-center gap-3.5 sm:gap-4 text-left group">
          {/* Community Protective Logo */}
          <div className="flex flex-col items-center justify-center shrink-0 pr-1 sm:pr-2 border-r border-slate-200">
            <CommunityLogo size={50} className="hover:scale-105 transition-transform" />
          </div>

          {/* Independent Platform Hierarchy */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-[#003366] tracking-tight leading-tight uppercase">
                DisasterShield Open Network
              </span>
              <span className="text-[10px] text-slate-400 font-normal">|</span>
              <span className="text-[11px] font-bold text-slate-600">
                Independent Civic-Tech Platform
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#003366] uppercase leading-snug">
                Disaster<span className="text-[#FF9933]">Shield</span>
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">
                — Community Crisis Response &amp; Mutual Aid Platform
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-500 font-medium">
                सामुदायिक आपदा समन्वय, ग्राउंड ट्राइएज एवं नागरिक राहत तंत्र
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Community Network
              </span>
            </div>
          </div>
        </Link>

        {/* Right: Emergency Guidance & Independent Informational Service Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end md:items-center gap-2 sm:gap-3 shrink-0">
          {/* General Emergency Numbers Box */}
          <div className="flex items-center gap-3 border border-amber-300 bg-amber-50/90 px-3.5 py-2 rounded-lg shadow-xs text-left">
            <div className="h-9 w-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">
                Emergency Guidance
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">
                  Call Local Emergency: <a href="tel:112" className="text-rose-700 hover:underline">112</a> / <a href="tel:911" className="text-rose-700 hover:underline">911</a>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                Independent Informational Service • Dial local EMS directly for life threats
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
