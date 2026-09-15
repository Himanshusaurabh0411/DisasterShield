import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification, ResponderProfile, SOSAlert, AdminSession, VolunteerSession } from '../types';
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

  // 1. System Admin Portal Session (Dispatch Coordinators)
  adminSession: AdminSession | null;
  loginAdmin: (session: AdminSession) => void;
  logoutAdmin: () => void;

  // 2. Volunteer / NGO Portal Session (Registered Volunteers)
  volunteerSession: VolunteerSession | null;
  loginVolunteer: (session: VolunteerSession) => void;
  logoutVolunteer: () => void;

  // Backwards compatibility aliases
  isAuthenticatedResponder: boolean;
  responderProfile: ResponderProfile | null;
  loginResponder: (profile: ResponderProfile) => void;
  logoutResponder: () => void;

  // Targeted SOS Dispatch Alert State
  activeSOSAlert: SOSAlert | null;
  triggerSOSAlert: (alert: SOSAlert) => void;
  dismissSOSAlert: () => void;
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

  // 1. Dedicated System Admin Portal Session (Dispatch Coordinators)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('ds_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const loginAdmin = useCallback((session: AdminSession) => {
    setAdminSession(session);
    localStorage.setItem('ds_admin_session', JSON.stringify(session));
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminSession(null);
    localStorage.removeItem('ds_admin_session');
  }, []);

  // 2. Dedicated Volunteer / NGO Personnel Session (Registered Volunteers)
  const [volunteerSession, setVolunteerSession] = useState<VolunteerSession | null>(() => {
    const saved = localStorage.getItem('ds_volunteer_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const loginVolunteer = useCallback((session: VolunteerSession) => {
    setVolunteerSession(session);
    localStorage.setItem('ds_volunteer_session', JSON.stringify(session));
  }, []);

  const logoutVolunteer = useCallback(() => {
    setVolunteerSession(null);
    localStorage.removeItem('ds_volunteer_session');
  }, []);

  // Backwards compatibility aliases mapped to volunteerSession
  const isAuthenticatedResponder = volunteerSession?.isAuthenticated ?? false;
  const responderProfile: ResponderProfile | null = volunteerSession
    ? {
        id: volunteerSession.registeredId,
        name: volunteerSession.name,
        role: volunteerSession.specialization,
        agency: volunteerSession.organization,
        badgeNumber: volunteerSession.badgeNumber,
        clearanceLevel: 'LEVEL-2',
        sector: volunteerSession.sector,
        phone: volunteerSession.phone,
      }
    : null;

  const loginResponder = useCallback((profile: ResponderProfile) => {
    loginVolunteer({
      isAuthenticated: true,
      registeredId: profile.badgeNumber || profile.id,
      name: profile.name,
      organization: profile.agency,
      specialization: profile.role,
      sector: profile.sector,
      badgeNumber: profile.badgeNumber,
      phone: profile.phone,
      status: 'ACTIVE_FIELD',
    });
  }, [loginVolunteer]);

  const logoutResponder = useCallback(() => {
    logoutVolunteer();
  }, [logoutVolunteer]);

  // Targeted SOS Dispatch Alert State
  const [activeSOSAlert, setActiveSOSAlert] = useState<SOSAlert | null>(null);

  const triggerSOSAlert = useCallback((alert: SOSAlert) => {
    setActiveSOSAlert(alert);
  }, []);

  const dismissSOSAlert = useCallback(() => {
    setActiveSOSAlert(null);
  }, []);

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
    adminSession,
    loginAdmin,
    logoutAdmin,
    volunteerSession,
    loginVolunteer,
    logoutVolunteer,
    isAuthenticatedResponder,
    responderProfile,
    loginResponder,
    logoutResponder,
    activeSOSAlert,
    triggerSOSAlert,
    dismissSOSAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
