import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { getSyncQueue, syncReports } from '../services/offlineStorage';
import { runSyncAnimation, SyncState } from '../services/mockSync';

interface AppContextValue {
  isOnline: boolean;
  toggleOnline: () => void;
  syncState: SyncState;
  isSyncing: boolean;
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pendingSyncCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>({
    stage: 'idle',
    progress: 0,
    message: '',
  });
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const { notifications, addNotification, markRead, markAllRead, unreadCount } = useNotifications();

  useEffect(() => {
    setPendingSyncCount(getSyncQueue().length);
  }, [isOnline]);

  const toggleOnline = useCallback(async () => {
    if (!isOnline) {
      setIsOnline(true);
      const queue = getSyncQueue();
      const count = queue.length;

      if (count > 0) {
        setIsSyncing(true);
        addNotification({
          type: 'info',
          title: 'Connection Restored',
          message: `Synchronizing ${count} local report${count > 1 ? 's' : ''}...`,
        });

        await runSyncAnimation((state) => {
          setSyncState(state);
        }, count);

        await syncReports();
        setPendingSyncCount(0);

        addNotification({
          type: 'success',
          title: 'Sync Complete',
          message: `${count} report${count > 1 ? 's' : ''} synchronized successfully.`,
        });
        setIsSyncing(false);
        setSyncState({ stage: 'idle', progress: 0, message: '' });
      } else {
        addNotification({
          type: 'success',
          title: 'Connection Restored',
          message: 'You are now online.',
        });
      }
    } else {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        title: 'Offline Mode Active',
        message: 'Reports will be stored locally and synchronized when connectivity returns.',
      });
    }
  }, [isOnline, addNotification]);

  const value: AppContextValue = {
    isOnline,
    toggleOnline,
    syncState,
    isSyncing,
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
    pendingSyncCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
