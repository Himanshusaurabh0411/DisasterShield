import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2 } from 'lucide-react';

const BOOT_STEPS = [
  'Verifying communication channels...',
  'Preparing secure offline storage...',
  'Loading active incident reports...',
  'Connecting response teams...',
  'DisasterShield operational — ready.',
];

export function BootSequence() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('ds_booted');
    if (!hasBooted) {
      setIsVisible(true);
      sessionStorage.setItem('ds_booted', 'true');
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (currentStepIndex < BOOT_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
      }, 450);
      return () => clearTimeout(exitTimer);
    }
  }, [isVisible, currentStepIndex]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900 p-6 select-none"
      >
        <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-4">
          <div className="h-16 w-16 flex items-center justify-center">
            {/* Ashoka Emblem / Shield representation */}
            <Shield className="h-14 w-14 text-[#003366]" strokeWidth={1.75} />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              भारत सरकार | Government of India
            </p>
            <h1 className="text-lg font-bold text-[#003366]">
              राष्ट्रीय आपदा प्रबंधन प्राधिकरण
            </h1>
            <p className="text-xs text-slate-700 font-medium">
              National Disaster Management Authority (NDMA)
            </p>
          </div>

          {/* Tricolor line */}
          <div className="tricolor-bar rounded-full h-1 w-32" />

          {/* Progress Bar */}
          <div className="w-full space-y-2 pt-2">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div
                className="h-full bg-[#003366] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStepIndex + 1) / BOOT_STEPS.length) * 100}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
            <p className="text-xs text-slate-600 h-5 flex items-center justify-center font-medium">
              {BOOT_STEPS[currentStepIndex]}
            </p>
          </div>

          {/* Skip option */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs text-slate-500 hover:text-slate-800 underline pt-1"
          >
            Skip to portal &rarr;
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
