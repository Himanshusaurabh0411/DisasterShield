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
      {/* 1. National Emergency Advisory Banner */}
      <section className="bg-amber-50 border-b border-amber-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
            <span className="font-bold text-rose-700 uppercase tracking-wide">NATIONAL ADVISORY:</span>
            <span>Heavy rainfall & flash flood alerts issued for coastal and riverine sectors. Follow local SDRF guidance.</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-bold">
            <span className="text-slate-600">24x7 Control Room Helpline:</span>
            <a href="tel:1078" className="inline-flex items-center gap-1.5 text-rose-700 hover:underline">
              <PhoneCall className="h-3.5 w-3.5" /> 1078 (NDMA Toll-Free)
            </a>
            <a href="tel:112" className="inline-flex items-center gap-1.5 text-[#003366] hover:underline">
              <PhoneCall className="h-3.5 w-3.5" /> 112 (ERSS)
            </a>
          </div>
        </div>
      </section>

      {/* 2. Official Portal Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border border-slate-200 rounded-md bg-slate-50 p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-6 text-left relative z-10">
            {/* Official Badge */}
            <div className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span>राष्ट्रीय आपदा प्रबंधन प्राधिकरण | National Disaster Management Authority</span>
              <span className="text-slate-400 font-normal">| Integrated Public Utility</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Disaster Management &<br />
                <span className="text-[#003366]">
                  Citizen Emergency Response Portal
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed pt-1">
                A mission-critical emergency operations platform designed for rapid citizen incident reporting,
                resilient offline data preservation during telecom failure, and automated deployment of NDRF, SDRF
                and Medical Rapid Response Units.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                variant="emergency"
                onClick={() => navigate('/report')}
                className="gap-2 text-sm font-bold px-6 h-12 rounded-md shadow-xs bg-[#FF9933] hover:bg-[#E65100] text-slate-900 cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" />
                Report Disaster / आपातकालीन रिपोर्ट
              </Button>

              <Button
                size="lg"
                variant="default"
                onClick={() => navigate('/track')}
                className="gap-2 bg-[#003366] hover:bg-[#0A2540] text-white text-sm font-bold px-6 h-12 rounded-md shadow-xs cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Track Report Docket / स्थिति जानें
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/live')}
                className="gap-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-bold h-12 rounded-md cursor-pointer"
              >
                <Activity className="h-4 w-4 text-[#003366]" />
                Live Incident Grid / लाइव स्थिति
              </Button>
            </div>

            {/* Reassuring Pillars Strip */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-8 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-slate-800">NIC Offline-First Local Data Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-[#003366]" />
                <span className="font-semibold text-slate-800">Automated Background Synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-700" />
                <span className="font-semibold text-slate-800">Verified Dispatch with NDRF / SDRF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Citizen Quick Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <span className="h-3 w-1 bg-[#FF9933] inline-block" />
            Citizen Quick Services | नागरिक त्वरित सेवाएं
          </h2>
          <span className="text-xs text-slate-500">Official Public Services Directory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/report')}
            className="p-5 rounded-md border border-slate-200 bg-white hover:border-[#003366] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded bg-blue-50 text-[#003366] flex items-center justify-center mb-3 group-hover:bg-[#003366] group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#003366]">File Incident (FORM NDMA-01)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Intimate sudden floods, structural collapses, landslides or fires with photos and GPS.
            </p>
          </div>

          <div
            onClick={() => navigate('/track')}
            className="p-5 rounded-md border border-slate-200 bg-white hover:border-[#003366] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">Track Intimation Docket</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verify real-time audit progress from device storage to duty officer verification and squad arrival.
            </p>
          </div>

          <div
            onClick={() => navigate('/live')}
            className="p-5 rounded-md border border-slate-200 bg-white hover:border-[#003366] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">GIS Disaster Situation Room</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Examine live national geospatial crisis layers, affected populations and regional relief zones.
            </p>
          </div>

          <div
            onClick={() => navigate('/responder')}
            className="p-5 rounded-md border border-slate-200 bg-white hover:border-[#003366] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800">Tactical EOC Dispatch Desk</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Incident response queue, battalion allocation and emergency rescue resource inventory.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Global Command Center (NEOC Situation Room) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlobalCommandCenter />
      </section>

      {/* 5. National Crisis Response Telemetry Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                National Disaster Dashboard
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                National Crisis Response Telemetry & Operational Metrics
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Synchronized from regional Emergency Operations Centres (EOCs)
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1 p-4 rounded-md bg-slate-50 border border-slate-200 border-t-4 border-t-rose-600">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Active Incidents</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={124} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">8 critical flood/cyclone zones</p>
            </div>

            <div className="space-y-1 p-4 rounded-md bg-slate-50 border border-slate-200 border-t-4 border-t-amber-500">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Citizens Assisted</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={28491} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">Evacuation & medical relief</p>
            </div>

            <div className="space-y-1 p-4 rounded-md bg-slate-50 border border-slate-200 border-t-4 border-t-[#003366]">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Field Responders</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={1284} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">NDRF, SDRF & Medical teams</p>
            </div>

            <div className="space-y-1 p-4 rounded-md bg-slate-50 border border-slate-200 border-t-4 border-t-emerald-600">
              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider block">Dossiers Synced</span>
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter value={8742} allowSubtleFluctuation />
              </div>
              <p className="text-xs text-slate-500">Safely preserved offline</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NDMA 6-Stage SOP Framework */}
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
            className="gap-2 rounded-md border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
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
