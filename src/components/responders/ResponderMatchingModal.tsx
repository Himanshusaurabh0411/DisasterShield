import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, RefreshCw, Shield, MapPin, Users } from 'lucide-react';
import { Responder } from '@/types';
import { mockResponders } from '@/data/responders';
import { Button } from '@/components/ui/button';

interface ResponderMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatched?: (responder: Responder) => void;
  preferredType?: string;
}

export function ResponderMatchingModal({
  isOpen,
  onClose,
  onMatched,
  preferredType = 'medical',
}: ResponderMatchingModalProps) {
  const [matchingState, setMatchingState] = useState<'analyzing' | 'optimizing' | 'matched'>('analyzing');
  const [matchedResponder, setMatchedResponder] = useState<Responder | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMatchingState('analyzing');
      const timer1 = setTimeout(() => {
        setMatchingState('optimizing');
      }, 900);

      const timer2 = setTimeout(() => {
        // Pick available responder matching type or first available
        const candidate =
          mockResponders.find((r) => r.availability === 'available' && r.type === preferredType) ||
          mockResponders.find((r) => r.availability === 'available') ||
          mockResponders[0];
        setMatchedResponder(candidate);
        setMatchingState('matched');
      }, 1800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, preferredType]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md rounded-md border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-[#003366]">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-sm font-bold tracking-wide uppercase text-slate-900">
                Automated Dispatch & Unit Matching Engine
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          {matchingState !== 'matched' ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-[#003366]">
                <RefreshCw className="h-7 w-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {matchingState === 'analyzing'
                    ? 'Analyzing geospatial proximity & dispatch coordinates...'
                    : 'Optimizing squad capacity & logistical load balancing...'}
                </p>
                <p className="text-xs text-slate-500">
                  Screening nearest NDRF, SDRF and medical response units within 25km radius.
                </p>
              </div>
            </div>
          ) : matchedResponder ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold bg-emerald-50 p-2.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Optimal Tactical Response Unit Identified
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{matchedResponder.name}</h4>
                    <span className="text-xs text-[#003366] font-semibold">
                      {matchedResponder.specialization}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    98% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{matchedResponder.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Active Load: {matchedResponder.activeAssignments}/{matchedResponder.maxCapacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  className="flex-1 bg-[#003366] hover:bg-[#0A2540] text-white font-bold rounded-md cursor-pointer"
                  onClick={() => {
                    onMatched?.(matchedResponder);
                    onClose();
                  }}
                >
                  Confirm & Deploy Unit
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="rounded-md border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer">
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
