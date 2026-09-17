import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Radio,
  AlertTriangle,
  Users,
  Activity,
  PhoneCall,
  Volume2,
  VolumeX,
  Lock,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Truck,
  Flame,
  Zap,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { VolunteerAuthModal } from '@/components/auth/VolunteerAuthModal';
import { SOSDispatchModal } from '@/components/emergency/SOSDispatchModal';
import { sirenAudio } from '@/services/sirenAudio';
import { mockIncidents } from '@/data/incidents';
import { SOSAlert, NearestUnit } from '@/types';

const TACTICAL_UNITS: NearestUnit[] = [
  {
    id: 'unit-comm-08',
    name: '8th Community Urban Search & Rescue Squad',
    type: 'Heavy Urban Flood & Extrication Squad',
    distanceKm: 1.4,
    etaMinutes: 4,
    capacity: 45,
    assigned: false,
  },
  {
    id: 'unit-comm-03',
    name: 'Community Disaster Relief Unit Bravo',
    type: 'Inflatable Boat & Swift Water Team',
    distanceKm: 2.1,
    etaMinutes: 6,
    capacity: 20,
    assigned: false,
  },
  {
    id: 'unit-redcross-01',
    name: 'Red Cross Trauma & Mobile ICU #04',
    type: 'Critical Paramedic & Field Surgery Unit',
    distanceKm: 2.8,
    etaMinutes: 8,
    capacity: 12,
    assigned: false,
  },
];

export function RestrictedResponder() {
  const {
    isAuthenticatedResponder,
    responderProfile,
    logoutResponder,
    activeSOSAlert,
    triggerSOSAlert,
    dismissSOSAlert,
  } = useApp();

  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [units, setUnits] = useState<NearestUnit[]>(TACTICAL_UNITS);
  const [radioActive, setRadioActive] = useState(true);
  const [isSirenMuted, setIsSirenMuted] = useState(false);

  // If unauthenticated, show access gate
  if (!isAuthenticatedResponder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 bg-white text-slate-900">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-md">
          <Lock className="h-10 w-10 text-[#003366]" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider block">
            प्रतिबंधित राहत दल एवं एजेंसी कक्ष
          </span>
          <h1 className="text-3xl font-black text-slate-900 uppercase">
            Restricted Operations Center
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This operations desk is restricted to verified community responders, volunteer team leads, and
            affiliated NGO coordinators. Please authenticate to view live tactical channels and SOS sirens.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
            className="gap-2 bg-[#003366] hover:bg-[#0A2540] text-white font-bold px-8 h-12 rounded-xl shadow-xs cursor-pointer"
          >
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span>Personnel & Agency Login / अधिकृत प्रवेश</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 rounded-xl font-semibold cursor-pointer"
          >
            Back to Public Portal
          </Button>
        </div>

        <VolunteerAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          redirectTo="/restricted-responder"
        />
      </div>
    );
  }

  // Trigger demo SOS emergency for testing
  const handleTriggerDemoSOS = () => {
    const demoIncident = mockIncidents[0];
    const alert: SOSAlert = {
      id: `sos-${Date.now()}`,
      trackingId: demoIncident.trackingId,
      disasterType: demoIncident.disasterType,
      title: demoIncident.title,
      locationArea: demoIncident.location.area,
      latitude: demoIncident.location.latitude,
      longitude: demoIncident.location.longitude,
      priority: 'critical',
      peopleAffected: demoIncident.peopleAffected,
      injured: demoIncident.injured,
      trapped: demoIncident.trapped,
      timestamp: new Date().toLocaleTimeString(),
      nearestUnits: TACTICAL_UNITS,
    };
    triggerSOSAlert(alert);
    if (!isSirenMuted) {
      sirenAudio.startSiren(0.3);
    }
  };

  const handleToggleSirenMute = () => {
    if (isSirenMuted) {
      setIsSirenMuted(false);
      if (activeSOSAlert) sirenAudio.startSiren(0.3);
    } else {
      setIsSirenMuted(true);
      sirenAudio.stopSiren();
    }
  };

  const handleDeployUnit = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, assigned: true } : u))
    );
  };

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white transition-all ${
        activeSOSAlert ? 'ring-4 ring-rose-500/40' : ''
      }`}
    >
      {/* Visual SOS Alarm Pulse Banner (Only appears when public SOS is active) */}
      {activeSOSAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-rose-300 animate-pulse"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="h-12 w-12 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shrink-0 shadow-sm">
              <AlertTriangle className="h-7 w-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
                  PRIORITY-1 TACTICAL SOS ALARM
                </span>
                <span className="text-xs font-bold text-amber-200">
                  {activeSOSAlert.timestamp}
                </span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight mt-0.5">
                {activeSOSAlert.title} &mdash; {activeSOSAlert.locationArea}
              </h3>
              <p className="text-xs text-rose-100">
                {activeSOSAlert.peopleAffected} citizens impacted &bull; {activeSOSAlert.trapped} trapped &bull; Immediate dispatch requested.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              onClick={handleToggleSirenMute}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold rounded-xl cursor-pointer"
            >
              {isSirenMuted ? (
                <>
                  <VolumeX className="h-4 w-4 mr-1.5 text-amber-300" /> Unmute Audio Siren
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-1.5 text-amber-300" /> Silence Audio Siren
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={() => {
                sirenAudio.stopSiren();
                dismissSOSAlert();
              }}
              className="bg-white hover:bg-slate-100 text-rose-700 text-xs font-extrabold rounded-xl shadow-sm cursor-pointer"
            >
              Acknowledge & Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* Restricted Operations Header */}
      <div className="border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-[#003366] text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                RESTRICTED EOC ACCESS
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                {responderProfile?.clearanceLevel || 'LEVEL-3'} CLEARANCE
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                ID: {responderProfile?.badgeNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tactical Operations & Dispatch Control Room
            </h1>
            <p className="text-xs text-slate-600">
              Authenticated Personnel: <strong className="text-slate-900">{responderProfile?.name}</strong> &bull;{' '}
              {responderProfile?.role} ({responderProfile?.agency})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTriggerDemoSOS}
              className="gap-2 border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
            >
              <Zap className="h-4 w-4 text-rose-600" />
              Simulate Public SOS Distress
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                sirenAudio.stopSiren();
                logoutResponder();
                navigate('/');
              }}
              className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              Logout / निकास
            </Button>
          </div>
        </div>
      </div>

      {/* 3 Operational Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Encrypted Comms & Channel Status (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#003366]" />
              Encrypted Multi-Agency Comms
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ONLINE
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">TACTICAL DISPATCH FREQ</span>
                <span className="font-mono text-[#003366] font-bold">154.600 MHz</span>
              </div>
              <p className="text-[11px] text-slate-500">Continuous voice relay with Bhopal Central Control.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">MULTI-AGENCY CRYPTO</span>
                <span className="text-emerald-700 font-bold">AES-256 GCM</span>
              </div>
              <p className="text-[11px] text-slate-500">Restricted telemetry & medical payload protection.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">AUTOMATED SIREN HOOK</span>
                <span className={`font-bold ${isSirenMuted ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {isSirenMuted ? 'MUTED' : 'ARMED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Localized audio siren sweeps upon verified citizen intimation.
              </p>
            </div>
          </div>

          {/* Quick Dispatch Directory */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Community Dispatch Lines
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">Community Dispatch Desk:</span>
                <a href="tel:112" className="font-bold text-rose-700 hover:underline">
                  112 (Local EMS)
                </a>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">Medical Airwing Support:</span>
                <span className="font-bold text-[#003366]">+91-755-244-0108</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Community Volunteer Desk:</span>
                <span className="font-bold text-slate-800">+91-755-255-0101</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Col: Nearest Unit Allocation Queue (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                Automated Dispatch Desk
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Nearest Specialized Rescue Units & Battalions
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              GPS Geospatial Proximity Matrix
            </span>
          </div>

          <div className="space-y-3">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  unit.assigned
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{unit.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      ETA: {unit.etaMinutes} min ({unit.distanceKm} km away)
                    </span>
                    {unit.assigned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> MOBILIZED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{unit.type}</p>
                  <p className="text-[11px] text-slate-500">
                    Personnel & Relief Capacity: <strong className="text-slate-800">{unit.capacity}</strong> specialists
                  </p>
                </div>

                <div className="shrink-0">
                  <Button
                    size="sm"
                    disabled={unit.assigned}
                    onClick={() => handleDeployUnit(unit.id)}
                    className={`gap-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                      unit.assigned
                        ? 'bg-emerald-600 text-white hover:bg-emerald-600 cursor-default'
                        : 'bg-[#FF9933] hover:bg-[#E65100] text-slate-900'
                    }`}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    {unit.assigned ? 'Unit Dispatched' : 'Deploy Unit Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Tactical Requisition Banner */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#003366]">
              <Zap className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-bold block">Need Additional Air or Heavy Equipment Support?</span>
                <span className="text-slate-600">Requisition regional motorized rescue rafts or heavy payload drone units.</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert('Requisition requisition payload dispatched to Central Logistics.')}
              className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
            >
              Requisition Heavy Gear
            </Button>
          </div>
        </div>
      </div>

      {/* SOS Dispatch Modal if alert is triggered */}
      {activeSOSAlert && (
        <SOSDispatchModal
          alert={activeSOSAlert}
          onClose={() => {
            sirenAudio.stopSiren();
            dismissSOSAlert();
          }}
          onDeployAll={() => {
            setUnits((prev) => prev.map((u) => ({ ...u, assigned: true })));
            sirenAudio.stopSiren();
            dismissSOSAlert();
          }}
        />
      )}
    </div>
  );
}
