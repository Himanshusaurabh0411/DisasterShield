import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Wifi,
  WifiOff,
  Bell,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useReports } from '@/hooks/useReports';
import { generateTrackingId, generateReportId } from '@/services/mockReports';
import { DisasterReport } from '@/types';

export function DemoControlBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isOnline, toggleOnline, addNotification } = useApp();
  const { addReport } = useReports();

  const handleInjectIncident = () => {
    const trackingId = generateTrackingId();
    const newReport: DisasterReport = {
      id: generateReportId(),
      trackingId,
      disasterType: 'fire',
      description: 'Disaster Simulation: Grid electrical fire reported in Industrial Zone. Fire Brigade & SDRF units dispatched.',
      peopleAffected: 320,
      injured: 2,
      trapped: 0,
      priority: 'critical',
      location: {
        latitude: 22.7196,
        longitude: 75.8577,
        accuracy: 10,
        area: 'Industrial Sector 7, Indore, Madhya Pradesh',
        landmark: 'Near Central Sub-Station',
        simulated: true,
      },
      mediaFiles: [],
      contactPhone: '+91-98765-DEMO1',
      alternateContact: '',
      additionalNotes: 'Generated via Official Demo Presenter Panel',
      status: isOnline ? 'submitted' : 'locally_stored',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: !isOnline,
      aiScore: {
        credibility: 95,
        urgency: 'critical',
        duplicateProbability: 4,
        recommendedPriority: 'critical',
        isDemo: true,
      },
    };

    addReport(newReport);
    addNotification({
      type: 'critical',
      title: 'Incident Simulation Injected',
      message: `Official tracking docket created: ${trackingId}`,
      reportId: trackingId,
    });
  };

  const handleTriggerNotif = () => {
    addNotification({
      type: 'warning',
      title: 'IMD River Level Alert',
      message: 'Central Water Commission reports water levels approaching danger mark (1.8m above normal threshold).',
    });
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 text-xs select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 p-3.5 rounded-md border border-slate-300 bg-white shadow-xl space-y-2.5 w-64 text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
              <span>DisasterShield Simulation Console</span>
              <span className="text-emerald-700 font-bold">Active</span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={toggleOnline}
                className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors text-slate-800"
              >
                <span className="font-medium">Network Link</span>
                <span className={`text-[11px] font-bold flex items-center gap-1.5 ${isOnline ? 'text-[#138808]' : 'text-[#E65100]'}`}>
                  {isOnline ? <><Wifi className="h-3.5 w-3.5" /> Online</> : <><WifiOff className="h-3.5 w-3.5" /> Offline Mode</>}
                </span>
              </button>

              <button
                type="button"
                onClick={handleInjectIncident}
                className="w-full text-left p-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-between transition-colors text-red-800 font-medium"
              >
                <span>+ Simulate New Incident</span>
                <Flame className="h-3.5 w-3.5 text-red-600" />
              </button>

              <button
                type="button"
                onClick={handleTriggerNotif}
                className="w-full text-left p-2 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-colors text-amber-900 font-medium"
              >
                <span>Trigger IMD Advisory</span>
                <Bell className="h-3.5 w-3.5 text-amber-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-md font-semibold transition-colors"
      >
        <Wrench className="h-3.5 w-3.5 text-[#003366]" />
        <span>Demonstration Tools</span>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronUp className="h-3.5 w-3.5 text-slate-500" />}
      </button>
    </div>
  );
}
