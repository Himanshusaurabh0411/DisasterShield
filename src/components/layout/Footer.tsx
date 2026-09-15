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
  Radio
} from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#0B192C] text-slate-300 border-t border-navy-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Organization & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9933] to-[#E65100] text-slate-900 shadow-sm">
                <Shield className="h-5 w-5 stroke-[2.2] text-slate-950" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Disaster<span className="text-[#FF9933]">Shield</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              DisasterShield is an independent, community-driven civic-tech humanitarian network.
              We engineer open-source, offline-first emergency coordination tools to ensure zero report
              loss when critical telecom and power infrastructure collapses.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <a
                href="https://github.com/Himanshusaurabh0411/DisasterShield"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <Github className="h-4 w-4" />
                <span>Open Source on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Citizen Emergency Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Emergency Services</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/report')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Report an Emergency
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/track')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Track My Report Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/live')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Live Crisis Map & Heatmap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/responder')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Volunteer & Dispatch Desk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/analytics')}
                  className="hover:text-[#FF9933] transition-colors text-left cursor-pointer"
                >
                  Response Analytics Bulletin
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Resilience */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Civic Technology</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="text-slate-300 font-semibold block">Offline-First Engine</span>
                <span className="text-[11px]">IndexedDB & Web Storage caching</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold block">Automated Queue Sync</span>
                <span className="text-[11px]">Background packet re-transmission</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold block">OpenStreetMap Integration</span>
                <span className="text-[11px]">CartoDB & OpenStreetMap telemetry</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold block">Triage Screening</span>
                <span className="text-[11px]">Geospatial deduplication heuristic</span>
              </li>
            </ul>
          </div>

          {/* Column 4: 24x7 Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Rapid Helplines</h4>
            <div className="space-y-2 text-slate-400">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">National Emergency</span>
                <a href="tel:112" className="text-white font-bold text-sm hover:text-[#FF9933] flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="h-3.5 w-3.5 text-[#FF9933]" /> 112 (ERSS)
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Disaster Assistance</span>
                <a href="tel:1078" className="text-white font-bold text-sm hover:text-[#FF9933] flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" /> 1078 (Toll Free)
                </a>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                For life-threatening crises, immediately call local first responders while filing your digital docket.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DisasterShield Initiative. Built as an open-source humanitarian public utility.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About Project
            </button>
            <a
              href="https://github.com/Himanshusaurabh0411/DisasterShield"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub Repository <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
