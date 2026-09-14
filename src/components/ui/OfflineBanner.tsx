import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Database } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function OfflineBanner() {
  const { isOnline, pendingSyncCount } = useApp();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-3 px-6 py-2.5 border-b border-amber-300 bg-amber-50 text-xs font-medium text-amber-900">
            <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
            <span className="font-bold">OFFLINE MODE ACTIVE (ऑफलाइन मोड)</span>
            <span className="text-amber-800">
              Reports are saved securely in local storage and will sync to NDMA servers automatically when network returns.
            </span>
            {pendingSyncCount > 0 && (
              <span className="ml-auto flex items-center gap-1.5 font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                <Database className="h-3.5 w-3.5" />
                {pendingSyncCount} report{pendingSyncCount > 1 ? 's' : ''} queued locally
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
