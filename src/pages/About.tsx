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
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-slate-900 bg-white">
      {/* Official Header */}
      <div className="border border-slate-200 rounded-md bg-slate-50 p-6 sm:p-8 space-y-3 text-center sm:text-left shadow-xs">
        <div className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#003366]">
          <Shield className="h-3.5 w-3.5" />
          <span>Statutory Mandate & Technical Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          About DisasterShield National Portal
        </h1>
        <p className="text-xs text-[#003366] font-bold uppercase tracking-wider">
          राष्ट्रीय आपदा प्रबंधन प्राधिकरण | National Disaster Management Authority
        </p>
        <p className="text-sm text-slate-700 max-w-3xl leading-relaxed pt-1">
          A resilient, cloud-enabled disaster management platform built in strict conformance with the Disaster Management Act, 2005,
          and National Informatics Centre (NIC) guidelines, engineered to maintain operational integrity even when local communications collapse.
        </p>
      </div>

      {/* Statutory Mandate */}
      <div className="rounded-md border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-200 pb-3">
          <BookOpen className="h-5 w-5 text-[#003366]" />
          Statutory Framework — Disaster Management Act, 2005
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Enacted on 23 December 2005, the Disaster Management Act provides for the effective management of disasters and matters connected therewith.
          DisasterShield operates as an integrated technological interface binding the three tiers of disaster response:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-[#003366] block">1. National Level (NDMA)</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Headed by the Prime Minister of India. Formulates national policies, guidelines and superintends the National Disaster Response Force (NDRF).
            </p>
          </div>
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-amber-700 block">2. State Level (SDMA)</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Headed by respective Chief Ministers. Oversees State Disaster Response Forces (SDRF) and mobilizes inter-district rescue logistics.
            </p>
          </div>
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-700 block">3. District Level (DDMA)</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Headed by the District Magistrate / Collector. Operates as the frontline field execution arm deploying medical, shelter, and rescue units.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">
          Core Resilience & Technological Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-100 text-amber-800">
                <WifiOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Offline-First Ingestion</h3>
                <span className="text-[11px] text-slate-500 font-medium">Local Storage & PWA Service Workers</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When cellular connectivity drops due to power grid or tower collapse, citizen intimations, GPS coordinates, and media evidence are cached in browser memory with verified tracking codes.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-[#003366]">
                <Cloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">NIC Automated Re-Sync</h3>
                <span className="text-[11px] text-slate-500 font-medium">Fault-Tolerant Background Relay</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As soon as a cellular signal or community Wi-Fi beacon is restored, queued dossiers are sequenced, compressed, and synchronized with central emergency servers automatically.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 text-purple-800">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Automated Triage Screening</h3>
                <span className="text-[11px] text-slate-500 font-medium">Geospatial NLP & Credibility Weighting</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated computer vision and geospatial algorithms screen incoming citizen intimations for duplicate clusters and urgency weighting to prevent duty officer cognitive overload.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-md border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Battalion Dispatch Matching</h3>
                <span className="text-[11px] text-slate-500 font-medium">Multi-Agency Rapid Mobilization</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps validated incidents to the nearest specialized response units: NDRF flood rescue boats, SDRF structural collapse crews, paramedic ambulances, and emergency potable water tankers.
            </p>
          </div>
        </div>
      </div>

      {/* Production Integration Roadmap */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-6 space-y-3 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Phase 2 Integration & Government Infrastructure Roadmap
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          While Phase 1 provides the complete, production-grade frontend and offline synchronization architecture, the system is designed to plug directly into statutory national systems:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-1">
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>PostgreSQL + PostGIS for spatial polygon radius matching</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>C-DOT Common Alerting Protocol (CAP) national broadcast integration</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>ISRO Bhuvan Disaster GIS satellite overlay pipelines</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Emergency Response Support System (ERSS 112) direct telephony uplink</span>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Contacts Box */}
      <div className="rounded-md border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-rose-700" />
          National Emergency Helplines Directory (24x7)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">NDMA National Control Room</span>
            <span className="text-base font-extrabold text-rose-700">1078</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">National Emergency Number</span>
            <span className="text-base font-extrabold text-[#003366]">112</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">Fire Emergency Brigade</span>
            <span className="text-base font-extrabold text-amber-800">101</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-semibold">Ambulance & Trauma Relief</span>
            <span className="text-base font-extrabold text-emerald-700">108</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button
          size="lg"
          onClick={() => navigate('/report')}
          className="gap-2 bg-[#FF9933] hover:bg-[#E65100] text-slate-900 font-bold rounded-md cursor-pointer shadow-xs"
        >
          File Emergency Report (FORM NDMA-01) <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/live')}
          className="border-slate-300 text-slate-800 hover:bg-slate-100 rounded-md font-bold cursor-pointer"
        >
          Explore Live GIS Situations
        </Button>
      </div>
    </div>
  );
}
