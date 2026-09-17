import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  WifiOff,
  Cloud,
  CheckCircle2,
  Sparkles,
  Users,
  Database,
  ArrowRight,
  Radio,
  Layers,
  HeartHandshake,
  BookOpen,
  PhoneCall,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-slate-900 bg-white">
      {/* Header */}
      <div className="border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 sm:p-8 space-y-3 text-center sm:text-left shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#003366]">
          <Shield className="h-3.5 w-3.5" />
          <span>Open Humanitarian Architecture & Civic-Tech Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          About DisasterShield
        </h1>
        <p className="text-xs text-[#003366] font-bold uppercase tracking-wider">
          Open Crisis Response Network & Community Resilience Engine
        </p>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed pt-1">
          An independent, open-access disaster management platform engineered to connect impacted citizens,
          volunteer rescue squads, and humanitarian coordinators with real-time situational awareness, offline-first data preservation,
          and rapid resource dispatch.
        </p>
      </div>

      {/* Humanitarian Model */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-200/90 pb-3">
          <BookOpen className="h-5 w-5 text-[#003366]" />
          Three Pillars of Community Crisis Response
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Inspired by open humanitarian mapping initiatives and crowdsourced crisis platforms, DisasterShield operates
          across three coordinated response layers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-[#003366] block">1. Hyperlocal Ground Intel</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct citizen reporting with zero-loss offline caching, GPS coordinates, and media uploads during communication outages.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-amber-700 block">2. Triage & Verification Desk</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated duplicate filtering and volunteer duty coordinator verification to prevent cognitive overload and ensure urgent cases get prioritized.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-emerald-700 block">3. Squad & Resource Dispatch</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamic matchmaking between verified emergency dockets and specialized rescue battalions, medical units, and relief distribution hubs.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-200/90 pb-2">
          Core Resilience & Technological Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <WifiOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Zero-Loss Offline Caching</h3>
                <span className="text-[11px] text-slate-500 font-medium">Local Storage & PWA Resilience</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When cellular connectivity drops due to power grid failure or severed fiber backbones, citizen reports, GPS coordinates, and evidence are safely cached in browser memory with verifiable tracking codes.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#003366]">
                <Cloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Automated Background Sync</h3>
                <span className="text-[11px] text-slate-500 font-medium">Fault-Tolerant Network Relay</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As soon as any cellular signal or Wi-Fi beacon is restored, queued dossiers are automatically compressed, sequenced, and synced with the crisis coordination network without requiring citizen re-entry.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Automated Triage Screening</h3>
                <span className="text-[11px] text-slate-500 font-medium">Geospatial Clustering & Credibility Scoring</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spatial radius algorithms analyze incoming incident reports for duplicate clusters, casualty severity, and credibility weights to surface life-critical situations instantly.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Volunteer Dispatch Matching</h3>
                <span className="text-[11px] text-slate-500 font-medium">Multi-Squad Rapid Mobilization</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps validated incidents directly to available volunteer units: boat rescue teams, structural collapse squads, medical paramedics, and emergency potable water suppliers.
            </p>
          </div>
        </div>
      </div>

      {/* Production Integration Roadmap */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 space-y-3 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Open Architecture & Technology Ecosystem
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          DisasterShield is engineered with open, interoperable protocols designed for seamless integration with civic and humanitarian tooling:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-1">
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Interactive Leaflet & OpenStreetMap geospatial tiling</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Standardized CAP (Common Alerting Protocol) event feeds</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Encrypted local storage with automatic queue replay</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Local emergency services &amp; community hotlines fast-dial integration</span>
          </div>
        </div>
      </div>

      {/* Prominent Non-Governmental Platform Disclaimer */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm uppercase tracking-wide">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>Independent Platform Notice &amp; Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
          DisasterShield is an independent, non-governmental community platform and is not affiliated with any official government agency.
          The information provided across this platform is crowdsourced and coordinated by volunteers for mutual aid and situational awareness.
          In any life-threatening emergency, always contact your local official emergency responders (such as 112 / 911 / local police &amp; fire services) immediately.
        </p>
      </div>

      {/* Emergency Guidance & Community Helplines Directory */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-[#003366]" />
          General Emergency Guidance &amp; Community Contacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 block text-[11px] font-semibold">Local Emergency Services</span>
            <span className="text-base font-extrabold text-rose-700">112 / 911</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Dial directly for immediate police, fire, or ambulance dispatch</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 block text-[11px] font-semibold">Community Mutual Aid Line</span>
            <span className="text-base font-extrabold text-[#003366]">Volunteer Desk</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Crowdsourced humanitarian coordination &amp; volunteer teams</span>
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 block text-[11px] font-semibold">Local Municipal Helplines</span>
            <span className="text-base font-extrabold text-emerald-700">Area Helpline</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Contact district flood control or municipal helpline units</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button
          size="lg"
          onClick={() => navigate('/report')}
          className="gap-2 bg-[#FF9933] hover:bg-[#E65100] text-slate-900 font-bold rounded-xl cursor-pointer shadow-xs transition-all hover:shadow-md border border-amber-400/40"
        >
          Report Emergency Now <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/live')}
          className="border-slate-300 text-slate-800 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-all hover:border-[#003366]"
        >
          Explore Live Emergency Map
        </Button>
      </div>
    </div>
  );
}
