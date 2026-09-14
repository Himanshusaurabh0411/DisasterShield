import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Notification } from '@/types';
import { timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

const notifIcons: Record<Notification['type'], React.ReactNode> = {
  critical: <AlertTriangle className="h-4 w-4 text-rose-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  info: <Info className="h-4 w-4 text-[#003366]" />,
  success: <CheckCircle className="h-4 w-4 text-emerald-700" />,
};

const notifBorder: Record<Notification['type'], string> = {
  critical: 'border-l-rose-600',
  warning: 'border-l-amber-500',
  info: 'border-l-[#003366]',
  success: 'border-l-emerald-600',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: Props) {
  const { notifications, markRead, markAllRead } = useApp();

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-md border border-slate-200 bg-white shadow-xl z-50 overflow-hidden text-slate-900"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#003366]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Official Notifications</span>
              </div>
              <button
                onClick={markAllRead}
                className="text-xs font-bold text-[#003366] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">No pending notifications</div>
              ) : (
                notifications.map(notif => (
                  <motion.button
                    key={notif.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 border-l-4 transition-colors hover:bg-slate-50 cursor-pointer',
                      notifBorder[notif.type],
                      !notif.read ? 'bg-blue-50/40' : 'bg-white'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">{notifIcons[notif.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs font-bold', notif.read ? 'text-slate-700 font-semibold' : 'text-slate-900 font-extrabold')}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{timeAgo(notif.timestamp)}</p>
                      </div>
                      {!notif.read && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#003366] mt-1 shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
