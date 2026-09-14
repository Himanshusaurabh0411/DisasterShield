import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, UploadCloud, Cloud, ClipboardCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const stageConfig = {
  local: {
    icon: <UploadCloud className="h-4 w-4" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
  },
  syncing: {
    icon: (
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <RefreshCw className="h-4 w-4" />
      </motion.div>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  synced: {
    icon: <Cloud className="h-4 w-4" />,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
  },
  verification: {
    icon: <ClipboardCheck className="h-4 w-4" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  idle: null,
};

export function SyncBanner() {
  const { isSyncing, syncState } = useApp();
  const config = stageConfig[syncState.stage];

  return (
    <AnimatePresence>
      {isSyncing && config && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className={`flex items-center gap-3 px-6 py-2.5 border-b text-xs font-medium ${config.bg} ${config.color}`}>
            {config.icon}
            <span>{syncState.message}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1 w-24 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-current rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${syncState.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] font-mono">{syncState.progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
