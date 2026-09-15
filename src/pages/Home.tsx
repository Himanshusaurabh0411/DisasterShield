import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Search,
  Activity,
  Shield,
  WifiOff,
  Cloud,
  ArrowRight,
  Users,
  Flame,
  CheckCircle2,
  PhoneCall,
  Clock,
  HeartHandshake,
  FileText,
  MapPin,
  Building,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlobalCommandCenter } from '@/components/dashboard/GlobalCommandCenter';
import { ImpactRecoverySection } from '@/components/news/ImpactRecoverySection';
import { CrisisNetworkFlow } from '@/components/dashboard/CrisisNetworkFlow';
import { OfflineInteractiveDemo } from '@/components/dashboard/OfflineInteractiveDemo';
import { IncidentCard } from '@/components/reports/IncidentCard';
import { IncidentDrawer } from '@/components/reports/IncidentDrawer';
import { mockIncidents } from '@/data/incidents';
import { Incident } from '@/types';

export function Home() {
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-10 pb-20 text-slate-900 bg-white">
      {/* 1. Emergency Advisory Banner */}
      <section className="bg-amber-50/80 border-b border-amber-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
            <span className="font-bold text-rose-700 uppercase tracking-wide">EMERGENCY ADVISORY:</span>
            <span>Heavy rainfall & flood alerts active across coastal and riverine sectors. Immediate assistance available.</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-bold">
            <span className="text-slate-600">24x7 Emergency Helplines:</span>
            <a href="tel:112" className="inline-flex items-center gap-1.5 text-[#003366] hover:underline">
              <PhoneCall className="h-3.5 w-3.5" /> 112 (National Emergency)
            </a>
            <a href="tel:1078" className="inline-flex items-center gap-1.5 text-rose-700 hover:underline">
              <PhoneCall className="h-3.5 w-3.5" /> 1078 (Disaster Helpline)
            </a>
          </div>
        </div>
      </section>

      {/* 2. Authoritative National Portal Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border border-slate-200 rounded-xl bg-gradient-to-b from-slate-50 via-white to-slate-50/60 p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-6 text-left relative z-10">
            {/* Institutional Badge */}
            <div className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-bold text-[#003366]">राष्ट्रीय आपदा प्रबंधन एवं नागरिक सुरक्षा</span>
              <span className="text-slate-400 font-normal">|</span>
              <span>DisasterShield National Portal</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500">24x7 Emergency Response Network</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Disaster Management &<br />
                <span className="text-[#003366]">Citizen Emergency Response Portal</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed pt-1">
                A mission-critical emergency operations platform designed for rapid citizen incident reporting,
                resilient offline data preservation during telecom failure, interactive geospatial crisis tracking,
                and coordinated multi-agency first responder deployment.
              </p>
            </div>

            {/* Action CTAs with Bilingual Labels */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/report')}
                className="gap-2 text-sm font-bold px-6 h-12 rounded-lg shadow-xs bg-[#FF9933] hover:bg-[#E65100] text-slate-900 transition-all hover:shadow-md cursor-pointer border border-amber-400/40"
              >
                <AlertTriangle className="h-4 w-4" />
                Report Disaster / आपातकालीन रिपोर्ट
              </Button>

              <Button
                size="lg"
                onClick={() => navigate('/track')}
                className="gap-2 bg-[#003366] hover:bg-[#0A2540] text-white text-sm font-bold px-6 h-12 rounded-lg shadow-xs transition-all hover:shadow-md cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Track Report Docket / स्थिति जानें
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/live')}
                className="gap-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold h-12 rounded-lg cursor-pointer hover:border-[#003366] transition-all"
              >
                <Activity className="h-4 w-4 text-[#003366]" />
                Live Incident Map / लाइव स्थिति
              </Button>
            </div>

            {/* Reassuring Pillars Strip */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-8 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-slate-800">Zero-Loss Offline Caching</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-[#003366]" />
                <span className="font-semibold text-slate-800">Automated Background Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-700" />
                <span className="font-semibold text-slate-800">Verified Field Squad Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Citizen Quick Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span className="h-3 w-1 bg-[#FF9933] rounded-full inline-block" />
            Quick Citizen Services / नागरिक त्वरित सेवाएं
          </h2>
          <span className="text-xs text-slate-500 font-medium">Immediate Public Utilities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/report')}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-[#003366] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center mb-3 group-hover:bg-[#003366] group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#003366]">
              Report Incident <span className="block text-xs font-normal text-slate-500">आपदा दर्ज करें</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Submit sudden floods, collapses, landslides or fires with photos and GPS coordinates.
            </p>
          </div>

          <div
            onClick={() => navigate('/track')}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">
              Track Report Docket <span className="block text-xs font-normal text-slate-500">स्थिति ट्रैक करें</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify real-time audit progress from device storage to duty officer verification and squad arrival.
            </p>
          </div>

          <div
            onClick={() => navigate('/live')}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              Interactive Crisis Map <span className="block text-xs font-normal text-slate-500">लाइव संकट मानचित्र</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Examine live geospatial crisis layers, affected populations, and regional relief centers.
            </p>
          </div>

          <div
            onClick={() => navigate('/responder')}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-800 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800">
              Tactical Dispatch Desk <span className="block text-xs font-normal text-slate-500">राहत दल प्रेषण</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Incident response queue, volunteer battalion allocation, and emergency medical supplies inventory.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Global Command Center (Live Emergency Map & Feed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlobalCommandCenter />
      </section>

      {/* 4b. Real-World Incident Data Feed: Impact & Recovery News Section */}
      <ImpactRecoverySection />

      {/* 5. Crisis Response Telemetry Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/90 pb-4">
            <div>
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                Platform Telemetry
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Community Crisis Response Operational Metrics
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Synchronized from regional crisis nodes and volunteer teams
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 border-t-4 border-t-rose-600">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Active Incidents</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={124} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">8 critical flood & rescue zones</p>
            </div>

            <div className="space-y-1 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 border-t-4 border-t-[#FF9933]">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Citizens Assisted</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={28491} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">Evacuation & medical relief</p>
            </div>

            <div className="space-y-1 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 border-t-4 border-t-[#003366]">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Field Responders</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={1284} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">Volunteer squads & medical teams</p>
            </div>

            <div className="space-y-1 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 border-t-4 border-t-emerald-600">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Dossiers Synced</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={8742} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">Safely preserved offline</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Community Relief SOP Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CrisisNetworkFlow />
      </section>

      {/* 7. Offline Resilience Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OfflineInteractiveDemo />
      </section>

      {/* 8. Active Field Reports Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
              Field Intelligence Desk
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Verified Emergency Incidents Under Response
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/live')}
            className="gap-2 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
          >
            View All Live Situations <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockIncidents.slice(0, 3).map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => handleIncidentClick(incident)}
            />
          ))}
        </div>
      </section>

      {/* Slide-over Incident Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
