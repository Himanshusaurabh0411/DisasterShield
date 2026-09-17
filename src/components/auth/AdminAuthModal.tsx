import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  KeyRound,
  Lock,
  UserCheck,
  Building,
  X,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Sparkles,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { AdminSession } from '@/types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

const PRESET_COORDINATORS: AdminSession[] = [
  {
    isAuthenticated: true,
    coordinatorId: 'COORD-EOC-7701',
    name: 'Chief Officer Devendra Sen',
    role: 'Central Dispatch & Triage Director',
    clearance: 'SUPER_ADMIN',
    dutyStation: 'Community Crisis Operations Hub (CCOH)',
    securityToken: 'DISPATCH-COORD-2026',
    phone: '+91 11 2436 3260',
  },
  {
    isAuthenticated: true,
    coordinatorId: 'COORD-EOC-4412',
    name: 'Meera Joshi',
    role: 'Ground Verification & AI Triage Controller',
    clearance: 'LEVEL-3_COORDINATOR',
    dutyStation: 'Regional Community Operations Node (Sector 4)',
    securityToken: 'DISPATCH-COORD-2026',
    phone: '+91 755 244 0108',
  },
];

export function AdminAuthModal({ isOpen, onClose, redirectTo = '/admin' }: AdminAuthModalProps) {
  const { loginAdmin, addNotification } = useApp();
  const navigate = useNavigate();

  const [selectedPreset, setSelectedPreset] = useState<AdminSession>(PRESET_COORDINATORS[0]);
  const [coordinatorId, setCoordinatorId] = useState(PRESET_COORDINATORS[0].coordinatorId);
  const [securityToken, setSecurityToken] = useState('DISPATCH-COORD-2026');
  const [dutyStation, setDutyStation] = useState(PRESET_COORDINATORS[0].dutyStation);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPreset = (preset: AdminSession) => {
    setSelectedPreset(preset);
    setCoordinatorId(preset.coordinatorId);
    setDutyStation(preset.dutyStation);
    setError(null);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinatorId.trim()) {
      setError('Please provide your Dispatch Coordinator ID.');
      return;
    }
    if (!securityToken.trim()) {
      setError('Please enter your Master Dispatch Security Token.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      loginAdmin({
        ...selectedPreset,
        coordinatorId,
        dutyStation,
        isAuthenticated: true,
      });
      addNotification({
        type: 'success',
        title: 'System Admin Authenticated',
        message: `Welcome, ${selectedPreset.name}. Master Dispatch & Verification Desk access authorized.`,
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
        className="relative w-full max-w-xl rounded-2xl bg-white border-2 border-[#003366] shadow-2xl overflow-hidden text-slate-900"
      >
        {/* Top Header Bar */}
        <div className="bg-[#002244] px-6 py-4 text-white flex items-center justify-between border-b-2 border-[#FF9933]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <ShieldAlert className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                सिस्टम व्यवस्थापक प्रवेश पोर्टल
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                System Admin & Dispatch Coordinator Portal
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAuthenticate} className="p-6 space-y-5">
          {/* Quick Demo Credentials Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-[#003366]" />
                Authorized Dispatch Coordinator Profiles (Click to Load)
              </span>
              <span className="text-[10px] font-semibold text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Encrypted Dispatch Node
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_COORDINATORS.map((preset) => {
                const isSelected = selectedPreset.coordinatorId === preset.coordinatorId;
                return (
                  <button
                    key={preset.coordinatorId}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#003366] bg-blue-50/90 ring-2 ring-[#003366]/30 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#003366] text-white">
                          {preset.clearance}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#003366]" />}
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.role}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2 block truncate">
                      {preset.coordinatorId}
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
                  Coordinator Dispatch ID / नियंत्रक आईडी
                </Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={coordinatorId}
                    onChange={(e) => setCoordinatorId(e.target.value)}
                    placeholder="e.g. COORD-EOC-7701"
                    className="pl-9 h-10 text-xs font-mono font-bold bg-white text-slate-900 border-slate-300"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Master Security Token / गुप्त सुरक्षा टोकन
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    value={securityToken}
                    onChange={(e) => setSecurityToken(e.target.value)}
                    placeholder="Enter security token"
                    className="pl-9 h-10 text-xs font-mono font-bold bg-white text-slate-900 border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-bold text-slate-700 block mb-1">
                Coordination Station / समन्वय केंद्र स्टेशन
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={dutyStation}
                  onChange={(e) => setDutyStation(e.target.value)}
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

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
            <Server className="h-4 w-4 text-[#003366] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Coordinator Clearance Check:</strong> Grants authoritative
              control over AI report verification, casualty triage overrides, resource reallocation, and system logs.
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
              className="text-xs font-bold bg-[#003366] hover:bg-[#0A2540] text-white h-10 px-6 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Authorizing Coordinator...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>Authorize & Enter Admin Portal / व्यवस्थापक प्रवेश</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
