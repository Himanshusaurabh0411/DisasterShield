import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export function SystemStatusBadge() {
  const { isOnline, isSyncing, toggleOnline, syncState, pendingSyncCount } = useApp();

  return (
    <button
      onClick={toggleOnline}
      title={isOnline ? 'Click to simulate offline mode' : 'Click to restore online network'}
      className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-md border text-left transition-all cursor-pointer select-none',
        isSyncing
          ? 'border-blue-300 bg-blue-50 text-blue-800'
          : isOnline
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
      )}
    >
      {isSyncing ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <RefreshCw className="h-3.5 w-3.5 shrink-0" />
        </motion.div>
      ) : isOnline ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
      ) : (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
      )}

      <div className="flex flex-col">
        <span className="text-xs font-semibold leading-none tracking-tight">
          {isSyncing
            ? 'Syncing Data'
            : isOnline
            ? 'System Online'
            : 'Offline Mode'}
        </span>
        <span className="text-[10px] text-slate-400 font-normal leading-tight hidden sm:inline">
          {isSyncing
            ? `${syncState.progress}% Synchronized`
            : isOnline
            ? 'Services Operational'
            : pendingSyncCount > 0
            ? `${pendingSyncCount} locally queued`
            : 'Local Storage Active'}
        </span>
      </div>
    </button>
  );
}
