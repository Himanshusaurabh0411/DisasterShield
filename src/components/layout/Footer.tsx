import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  HeartHandshake,
  Github,
  Mail,
  PhoneCall,
  ExternalLink,
  MapPin,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CommunityLogo } from '@/components/ui/CommunityLogo';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#002244] text-slate-300 border-t-4 border-[#FF9933] text-xs select-none">
      {/* Upper Community Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Independent Platform Credentials & Community Logo */}
          <div className="lg:col-span-2 space-y-3.5 pr-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/90 p-2 rounded-lg shrink-0">
                <CommunityLogo size={44} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white tracking-wide uppercase">
                  DisasterShield Open Network
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Independent Community Platform
                </span>
                <span className="text-xs font-semibold text-[#FF9933] mt-0.5">
                  स्वतंत्र नागरिक आपदा प्रतिक्रिया एवं पारस्परिकता मंच
                </span>
                <span className="text-sm font-black text-white mt-1">
                  Community Crisis Response Network
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An independent, open-access disaster response and community mutual aid coordination platform.
              Engineered for zero-loss offline caching, rapid citizen incident mapping, and voluntary responder mobilization.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-white font-medium border border-white/15">
                <FileCheck className="h-3 w-3 text-[#FF9933]" />
                Open Source &amp; Civic-Tech
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-white font-medium border border-white/15">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                W3C WCAG 2.1 (Level AA)
              </span>
            </div>
          </div>

          {/* Column 2: Community Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-white/20 pb-1.5">
              नागरिक सेवाएं / Community Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/report')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Report Incident / आपदा दर्ज करें
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/track')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Track Incident Docket / स्थिति जानें
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/live')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Live Situation Map / संकट मानचित्र
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/responder')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Volunteer &amp; Community Squad Desk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/analytics')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Crisis Telemetry &amp; Field Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Community Guidelines & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-white/20 pb-1.5">
              दिशानिर्देश एवं नीतियां / Policies
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Community Guidelines (सामुदायिक दिशानिर्देश)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Open Humanitarian Protocols
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Data Privacy &amp; Security Policies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Independent Platform Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Contacts & Guidance */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-white/20 pb-1.5">
              आपातकालीन संपर्क / Emergency Guidance
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-white/10 border border-white/15">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Local Emergency Dispatch
                </span>
                <span className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="h-3.5 w-3.5 text-[#FF9933]" />
                  Dial <strong>112</strong> / <strong>911</strong> (Local EMS)
                </span>
              </div>
              <div className="p-2.5 rounded bg-white/10 border border-white/15">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Community Mutual Aid Desk
                </span>
                <span className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
                  24/7 Community Support Line
                </span>
              </div>
              <div className="p-2 rounded bg-amber-500/15 border border-amber-400/30 text-[10px] text-amber-200/90 leading-tight">
                <span className="font-bold block text-amber-300 mb-0.5">Informational Guidance:</span>
                Always contact local municipal emergency departments directly for life-critical rescues.
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Non-Governmental Disclaimer Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Disclaimer: DisasterShield is an independent, non-governmental community platform and is not affiliated with any official government agency.
            </p>
            <p className="text-slate-400">
              &copy; 2026 DisasterShield Open Community Network. Developed under Open-Access Humanitarian Protocols.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <span>Open Network Build: 2026.09</span>
            <span>|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Community Nodes Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

