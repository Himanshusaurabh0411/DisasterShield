import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Flame,
  Truck,
  MapPin,
  Clock,
  Users,
  Volume2,
  VolumeX,
  CheckCircle2,
  ShieldAlert,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOSAlert } from '@/types';
import { sirenAudio } from '@/services/sirenAudio';

interface SOSDispatchModalProps {
  alert: SOSAlert;
  onClose: () => void;
  onDeployAll: () => void;
}

export function SOSDispatchModal({ alert, onClose, onDeployAll }: SOSDispatchModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      sirenAudio.startSiren(0.3);
    } else {
      setIsMuted(true);
      sirenAudio.stopSiren();
    }
  };

  const handleDeploy = () => {
    setDeployed(true);
    sirenAudio.stopSiren();
    setTimeout(() => {
      onDeployAll();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl rounded-2xl bg-white border-2 border-rose-600 shadow-2xl overflow-hidden text-slate-900"
      >
        {/* Urgent Header */}
        <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                त्वरित आपातकालीन राहत दल प्रेषण
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                CRITICAL SOS DISPATCH & BATTALION ASSIGNMENT
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Siren' : 'Silence Siren'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-amber-300" /> : <Volume2 className="h-4 w-4 text-white" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Incident Overview Card */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-800 px-2 py-0.5 rounded bg-rose-200">
                DOCKET: {alert.trackingId}
              </span>
              <span className="text-xs font-extrabold uppercase text-rose-700 flex items-center gap-1">
                <Flame className="h-4 w-4" /> {alert.priority} PRIORITY
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900">{alert.title}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-rose-200">
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span className="truncate">{alert.locationArea}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Users className="h-3.5 w-3.5 text-[#003366] shrink-0" />
                <span>{alert.peopleAffected} Affected ({alert.trapped} trapped)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Broadcast: {alert.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Automated Nearest Units Allocation Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Automated Nearest Response Units Computed
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GPS Radial Match
              </span>
            </div>

            <div className="space-y-2">
              {alert.nearestUnits.map((unit, idx) => (
                <div
                  key={unit.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{unit.name}</p>
                      <p className="text-[11px] text-slate-500">{unit.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-700 block">ETA: {unit.etaMinutes} min</span>
                    <span className="text-[10px] text-slate-400">{unit.distanceKm} km away</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={toggleMute}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isMuted ? 'Unmute Audio Siren' : 'Silence Audio Alarm'}</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-none border-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Dismiss / छोड़ें
              </Button>

              <Button
                type="button"
                disabled={deployed}
                onClick={handleDeploy}
                className="flex-1 sm:flex-none gap-2 bg-[#FF9933] hover:bg-[#E65100] text-slate-900 hover:text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                {deployed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-900" />
                    <span>Units Mobilized!</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    <span>Mobilize Nearest Units / त्वरित राहत दल भेजें</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
