import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Siren, Shield, PhoneCall } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { generateTrackingId, generateReportId } from '@/services/mockReports';
import { saveReportLocally } from '@/services/offlineStorage';
import { DisasterReport } from '@/types';

export function SOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStage, setDispatchStage] = useState(0);
  const { isOnline, addNotification } = useApp();
  const navigate = useNavigate();

  const handleSOSConfirm = () => {
    setIsDispatching(true);
    setDispatchStage(1);

    const trackingId = generateTrackingId();
    const reportId = generateReportId();

    const sosReport: DisasterReport = {
      id: reportId,
      trackingId,
      disasterType: 'rescue_required',
      description: 'Urgent citizen requisition triggered via Central Emergency Assistance (SOS). Immediate disaster rescue dispatch requested at GPS coordinates.',
      peopleAffected: 1,
      injured: 0,
      trapped: 1,
      priority: 'critical',
      location: {
        latitude: 23.2599,
        longitude: 77.4126,
        accuracy: 8,
        area: 'Simulated User Location (Sector 4, Central Zone)',
        landmark: 'Near District Collectorate',
        simulated: true,
      },
      mediaFiles: [],
      contactPhone: '+91-98765-XXXXX',
      alternateContact: '',
      additionalNotes: 'Emergency requisition created from portal interface.',
      status: isOnline ? 'submitted' : 'locally_stored',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: !isOnline,
      aiScore: {
        credibility: 98,
        urgency: 'critical',
        duplicateProbability: 0,
        recommendedPriority: 'critical',
        isDemo: true,
      },
    };

    saveReportLocally(sosReport);

    setTimeout(() => setDispatchStage(2), 600);
    setTimeout(() => setDispatchStage(3), 1200);

    setTimeout(() => {
      addNotification({
        type: 'critical',
        title: 'Emergency SOS Requisition Logged',
        message: `Requisition registered with Incident Tracking ID: ${trackingId}`,
        reportId: trackingId,
      });

      setIsDispatching(false);
      setIsModalOpen(false);
      setDispatchStage(0);
      navigate(`/track?id=${trackingId}`);
    }, 1800);
  };

  return (
    <>
      {/* Floating Reassuring SOS Button (Civic Red/Saffron Alert Badge) */}
      <div className="fixed bottom-6 right-6 z-40 group select-none">
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-md">
          Emergency Distress Beacon (SOS)
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[#C62828] text-white shadow-lg hover:bg-[#B71C1C] transition-colors focus:outline-none focus:ring-4 focus:ring-red-200"
          aria-label="Emergency SOS Requisition"
        >
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25 pointer-events-none" />
          <Siren className="h-6 w-6 relative z-10" />
        </motion.button>
      </div>

      {/* SOS Formal Requisition Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => !isDispatching && setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md rounded-md border border-slate-300 bg-white p-6 shadow-2xl space-y-4 text-slate-900"
            >
              {!isDispatching ? (
                <>
                  <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          Emergency SOS Requisition
                        </h3>
                        <p className="text-xs text-slate-600">
                          Immediate Community Mutual Aid Requisition
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    This will transmit an emergency alert with your current location coordinates directly to nearby community volunteer networks and local relief coordinators.
                  </p>

                  <div className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Shield className="h-4 w-4 text-amber-700" />
                      Community Advisory &amp; Disclaimer
                    </p>
                    <p className="text-amber-800 leading-normal">
                      DisasterShield is an independent community platform. For life-threatening emergencies requiring municipal rescue services, always call <strong>112 / 911</strong> directly.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="emergency"
                      onClick={handleSOSConfirm}
                      className="flex-1 rounded font-bold"
                    >
                      Confirm SOS Requisition
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700">
                    <PhoneCall className="h-7 w-7 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {dispatchStage === 1 && 'Transmitting coordinates to community dispatch nodes...'}
                      {dispatchStage === 2 && 'Registering requisition in Community Priority Queue...'}
                      {dispatchStage === 3 && 'Requisition Broadcast to Nearby Volunteer Squads!'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Capturing GPS telemetry &bull; Generating community response ticket
                    </p>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <motion.div
                      className="h-full bg-[#003366] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(dispatchStage / 3) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
