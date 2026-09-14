import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Notification } from '@/types';

const MAX_TOASTS = 4;

const typeConfig: Record<Notification['type'], { icon: React.ReactNode; border: string }> = {
  critical: { icon: <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />, border: 'border-l-rose-600' },
  warning: { icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />, border: 'border-l-amber-500' },
  info: { icon: <Info className="h-4 w-4 text-[#003366] shrink-0" />, border: 'border-l-[#003366]' },
  success: { icon: <CheckCircle className="h-4 w-4 text-emerald-700 shrink-0" />, border: 'border-l-emerald-600' },
};

export function ToastContainer() {
  const { notifications } = useApp();
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const shownIds = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const newNotifs = notifications.filter(n => !shownIds.current.has(n.id) && !n.read);
    newNotifs.forEach(n => {
      shownIds.current.add(n.id);
      setVisibleIds(prev => new Set([...prev, n.id]));
      setTimeout(() => {
        setVisibleIds(prev => { const s = new Set(prev); s.delete(n.id); return s; });
      }, 5000);
    });
  }, [notifications]);

  const toasts = notifications
    .filter(n => visibleIds.has(n.id))
    .slice(0, MAX_TOASTS);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-md border border-slate-200 border-l-4 ${typeConfig[toast.type].border} bg-white px-4 py-3 shadow-xl max-w-sm text-slate-900`}
          >
            {typeConfig[toast.type].icon}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => setVisibleIds(prev => { const s = new Set(prev); s.delete(toast.id); return s; })}
              className="text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
