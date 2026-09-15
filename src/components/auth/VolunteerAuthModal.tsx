import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  KeyRound,
  Lock,
  UserCheck,
  Building2,
  X,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { VolunteerSession } from '@/types';

interface VolunteerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

const PRESET_VOLUNTEERS: VolunteerSession[] = [
  {
    isAuthenticated: true,
    registeredId: 'VOL-2026-MED-8841',
    name: 'Dr. Sneha Nair',
    organization: 'Indian Red Cross Society (IRCS)',
    specialization: 'Emergency Trauma & Field Surgery',
    sector: 'Zone-3 Hospital Rapid Triage',
    badgeNumber: 'IRC-MED-2089',
    phone: '+91 98261 44108',
    status: 'ACTIVE_FIELD',
  },
  {
    isAuthenticated: true,
    registeredId: 'VOL-2026-SAR-3312',
    name: 'Vikramjit Singh',
    organization: 'Civil Defence & Community Rescue Brigade',
    specialization: 'Urban Search, Extraction & Rafting',
    sector: 'Sector 4 Lower Lake Evacuation',
    badgeNumber: 'CD-SAR-5120',
    phone: '+91 97130 88101',
    status: 'ACTIVE_FIELD',
  },
  {
    isAuthenticated: true,
    registeredId: 'VOL-2026-LOG-5590',
    name: 'Arun Kumar',
    organization: 'SEEDS Humanitarian Relief Network',
    specialization: 'Relief Logistics & Clean Water Supply',
    sector: 'Central Warehousing & Supply Hub',
    badgeNumber: 'SEEDS-LOG-904',
    phone: '+91 94250 88992',
    status: 'STANDBY',
  },
];

export function VolunteerAuthModal({ isOpen, onClose, redirectTo = '/restricted-responder' }: VolunteerAuthModalProps) {
  const { loginVolunteer, addNotification } = useApp();
  const navigate = useNavigate();

  const [selectedPreset, setSelectedPreset] = useState<VolunteerSession>(PRESET_VOLUNTEERS[0]);
  const [registeredId, setRegisteredId] = useState(PRESET_VOLUNTEERS[0].registeredId);
  const [organization, setOrganization] = useState(PRESET_VOLUNTEERS[0].organization);
  const [passcode, setPasscode] = useState('VOL-DUTY-2026');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (preset: VolunteerSession) => {
    setSelectedPreset(preset);
    setRegisteredId(preset.registeredId);
    setOrganization(preset.organization);
    setError(null);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredId.trim()) {
      setError('Please provide your official Registered Volunteer ID.');
      return;
    }
    if (!passcode.trim()) {
      setError('Please enter your volunteer duty passcode.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      loginVolunteer({
        ...selectedPreset,
        registeredId,
        organization,
        isAuthenticated: true,
      });
      addNotification({
        type: 'success',
        title: 'Volunteer Identity Verified',
        message: `Welcome, ${selectedPreset.name} (${selectedPreset.registeredId}). Volunteer squad operations desk authorized.`,
      });
      onClose();
      navigate(redirectTo);
    }, 550);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        className="relative w-full max-w-xl rounded-2xl bg-white border-2 border-[#FF9933] shadow-2xl overflow-hidden text-slate-900"
      >
        {/* Top Header Bar */}
        <div className="bg-[#FF9933] px-6 py-4 text-slate-950 flex items-center justify-between border-b-2 border-[#003366]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-xs">
              <HeartHandshake className="h-6 w-6 text-[#FF9933]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">
                पंजीकृत स्वयंसेवक एवं एनजीओ पोर्टल
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-950">
                Registered Volunteer & NGO Personnel Login
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-900/80 hover:text-slate-950 hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAuthenticate} className="p-6 space-y-5">
          {/* Quick Demo Credentials Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-[#FF9933]" />
                Registered NGO / Volunteer Profiles (Click to Load)
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                Civic Verification Mesh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_VOLUNTEERS.map((preset) => {
                const isSelected = selectedPreset.registeredId === preset.registeredId;
                return (
                  <button
                    key={preset.registeredId}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF9933] bg-amber-50/80 ring-2 ring-[#FF9933]/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                          VERIFIED
                        </span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />}
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.organization}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#003366] mt-2 block truncate">
                      {preset.registeredId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Registered Volunteer ID / पंजीकृत स्वयंसेवक आईडी
                </Label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={registeredId}
                    onChange={(e) => setRegisteredId(e.target.value)}
                    placeholder="e.g. VOL-2026-MED-8841"
                    className="pl-9 h-10 text-xs font-mono font-bold bg-white text-slate-900 border-slate-300"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Volunteer Passcode / सुरक्षा पासकोड
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter volunteer passcode"
                    className="pl-9 h-10 text-xs font-mono font-bold bg-white text-slate-900 border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-bold text-slate-700 block mb-1">
                Registered NGO / Community Agency / संबद्ध संस्था
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="pl-9 h-10 text-xs font-semibold bg-white text-slate-900 border-slate-300"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
            <Users className="h-4 w-4 text-[#003366] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Volunteer Operations Clearance:</strong> Connects registered
              humanitarian workers to live SOS distress intimation sirens, localized squad dispatch, and supplies allocation.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-bold border-slate-300 text-slate-700 h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel / रद्द करें
            </Button>

            <Button
              type="submit"
              disabled={isVerifying}
              className="text-xs font-bold bg-[#FF9933] hover:bg-[#E65100] text-slate-900 hover:text-white h-10 px-6 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  <span>Verifying Registered ID...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Verify ID & Enter / स्वयंसेवक सत्यापित करें</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
