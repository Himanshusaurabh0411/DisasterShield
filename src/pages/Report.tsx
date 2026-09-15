import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Flame,
  Users,
  Shield,
  Send,
  FileCheck,
  Info,
  Phone,
  HelpCircle,
  Clock,
  Sparkles,
  WifiOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Camera,
  FileText
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useReports } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LocationCapture } from '@/components/emergency/LocationCapture';
import { MediaUpload } from '@/components/emergency/MediaUpload';
import { SubmissionSuccess } from '@/components/emergency/SubmissionSuccess';
import { AIScreeningPanel } from '@/components/emergency/AIScreeningPanel';
import { DisasterType, PriorityLevel, DisasterReport, Location, MediaFile, SOSAlert } from '@/types';
import { generateTrackingId, generateReportId, generateAIScore } from '@/services/mockReports';
import { disasterTypeLabels } from '@/data/incidents';

const DISASTER_OPTIONS: Array<{ type: DisasterType; label: string; icon: string }> = [
  { type: 'flood', label: 'Flood / Water Rise', icon: '🌊' },
  { type: 'fire', label: 'Building Fire / Wildfire', icon: '🔥' },
  { type: 'earthquake', label: 'Earthquake / Tremor', icon: '🌍' },
  { type: 'cyclone', label: 'Cyclone / High Winds', icon: '🌀' },
  { type: 'landslide', label: 'Landslide / Rockfall', icon: '⛰️' },
  { type: 'building_collapse', label: 'Building Collapse', icon: '🏚️' },
  { type: 'medical', label: 'Mass Medical Emergency', icon: '🏥' },
  { type: 'missing_person', label: 'Missing Person', icon: '🔍' },
  { type: 'rescue_required', label: 'Immediate Rescue Needed', icon: '🆘' },
  { type: 'food_water', label: 'Food & Drinking Water', icon: '💧' },
  { type: 'other', label: 'Other Disaster Event', icon: '⚠️' },
];

const STEPS = [
  { id: 1, label: 'Type & Urgency', title: '1. Disaster Classification & Casualties' },
  { id: 2, label: 'Geotag Location', title: '2. Exact Geographic Location & Landmark' },
  { id: 3, label: 'Field Evidence', title: '3. Attach Incident Photographs or Video' },
  { id: 4, label: 'Citizen Contact', title: '4. Informant Details & Phone Verification' },
  { id: 5, label: 'Audit & Submit', title: '5. Verification & Official Docket Submission' },
];

export function Report() {
  const { isOnline, addNotification, triggerSOSAlert } = useApp();
  const { addReport } = useReports();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [description, setDescription] = useState('');
  const [peopleAffected, setPeopleAffected] = useState<number>(1);
  const [injured, setInjured] = useState<number>(0);
  const [trapped, setTrapped] = useState<number>(0);
  const [priority, setPriority] = useState<PriorityLevel>('critical');

  const [location, setLocation] = useState<Location>({
    latitude: 23.2599,
    longitude: 77.4126,
    accuracy: 12,
    area: 'Lower Lake Area, Bhopal',
    landmark: 'Near Lower Lake Bridge',
    simulated: true,
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [alternateContact, setAlternateContact] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<DisasterReport | null>(null);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!isConfirmed) {
      alert('Please confirm that the information provided is authentic before submission.');
      return;
    }

    setIsSubmitting(true);

    const trackingId = generateTrackingId();
    const reportId = generateReportId();

    const partialReport = {
      disasterType,
      description,
      peopleAffected,
      injured,
      trapped,
      priority,
      mediaFiles,
    };

    const aiScore = generateAIScore(partialReport);

    const newReport: DisasterReport = {
      id: reportId,
      trackingId,
      disasterType,
      description: description || 'Emergency report filed via DisasterShield crisis response platform.',
      peopleAffected: Number(peopleAffected) || 1,
      injured: Number(injured) || 0,
      trapped: Number(trapped) || 0,
      priority,
      location,
      mediaFiles,
      contactPhone,
      alternateContact,
      additionalNotes,
      status: isOnline ? 'submitted' : 'locally_stored',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOffline: !isOnline,
      aiScore,
    };

    addReport(newReport);

    // Broadcast Targeted SOS Alert to Volunteer / Agency Portal
    triggerSOSAlert({
      id: `sos-${Date.now()}`,
      trackingId,
      disasterType,
      title: `${disasterType.toUpperCase()} Emergency: ${location.area}`,
      locationArea: location.area,
      latitude: location.latitude,
      longitude: location.longitude,
      priority,
      peopleAffected: Number(peopleAffected) || 1,
      injured: Number(injured) || 0,
      trapped: Number(trapped) || 0,
      timestamp: new Date().toLocaleTimeString(),
      nearestUnits: [
        {
          id: 'unit-1',
          name: 'NDRF Fast Incident Response Squad (Sector 4)',
          type: 'Heavy Search & Rescue',
          distanceKm: 1.2,
          etaMinutes: 4,
          capacity: 35,
        },
        {
          id: 'unit-2',
          name: 'State Disaster Response Boat Battalion',
          type: 'Inflatable Rafts & Evacuation',
          distanceKm: 2.3,
          etaMinutes: 7,
          capacity: 18,
        },
        {
          id: 'unit-3',
          name: 'Red Cross Mobile Trauma Ambulance',
          type: 'Advanced Life Support Paramedics',
          distanceKm: 2.9,
          etaMinutes: 9,
          capacity: 10,
        },
      ],
    });

    addNotification({
      type: isOnline ? 'info' : 'warning',
      title: isOnline ? 'Emergency Report Submitted' : 'Report Saved Locally (Offline)',
      message: `Tracking code generated: ${trackingId}`,
      reportId: trackingId,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedReport(newReport);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedReport(null);
    setCurrentStep(1);
    setDescription('');
    setPeopleAffected(1);
    setInjured(0);
    setTrapped(0);
    setMediaFiles([]);
  };

  if (submittedReport) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 bg-white">
        <SubmissionSuccess report={submittedReport} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-900 bg-white">
      {/* Emergency Form Header */}
      <div className="border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 sm:p-7 space-y-2.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#003366] text-white">
              DISASTERSHIELD INTAKE
            </span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Emergency Response Network | Immediate Public Triage
            </span>
          </div>
          {!isOnline && (
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 self-start sm:self-auto">
              <WifiOff className="h-3.5 w-3.5" /> Offline Storage Active (Zero Data Loss)
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Emergency Incident Report & Assistance Request
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed pt-1">
          Provide accurate ground information for immediate tactical prioritization. If cellular connectivity is severed,
          the report will automatically save in local device storage and synchronize when connection resumes.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`py-2 px-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#003366] bg-blue-50/80 text-[#003366] font-bold shadow-xs ring-1 ring-[#003366]'
                    : isCompleted
                    ? 'border-slate-300 bg-slate-50 text-slate-800'
                    : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] block text-slate-500 font-semibold">STEP 0{step.id}</span>
                <span className="text-xs font-bold block truncate mt-0.5">{step.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-2 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#003366] rounded-full"
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Dynamic Step Content Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-200/90 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {STEPS[currentStep - 1].title}
          </h2>
          <span className="text-xs font-semibold text-slate-500">Stage {currentStep} of 5</span>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Incident Type & Casualties */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Select Disaster / Emergency Category <span className="text-rose-600">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {DISASTER_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setDisasterType(opt.type)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        disasterType === opt.type
                          ? 'border-[#003366] bg-blue-50/80 text-[#003366] shadow-xs ring-1 ring-[#003366]'
                          : 'border-slate-200/90 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.icon}</span>
                      <span className="text-xs font-bold block leading-tight text-slate-900">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Reported Emergency Urgency Level <span className="text-rose-600">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setPriority(lvl)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                        priority === lvl
                          ? lvl === 'critical'
                            ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600 shadow-xs'
                            : lvl === 'high'
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600 shadow-xs'
                            : 'border-[#003366] bg-blue-50 text-[#003366] ring-1 ring-[#003366] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl} Priority
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Estimated Affected Persons</Label>
                  <Input
                    type="number"
                    min="0"
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 0)}
                    className="text-sm rounded-md border-slate-300 bg-white text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-amber-800">Confirmed Injured</Label>
                  <Input
                    type="number"
                    min="0"
                    value={injured}
                    onChange={(e) => setInjured(parseInt(e.target.value) || 0)}
                    className="text-sm rounded-md border-slate-300 bg-white text-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-rose-700">Trapped Under Debris / Water</Label>
                  <Input
                    type="number"
                    min="0"
                    value={trapped}
                    onChange={(e) => setTrapped(parseInt(e.target.value) || 0)}
                    className="text-sm rounded-md border-slate-300 bg-white text-rose-700 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Ground Situation Description *</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail visible hazards, water rise rate, building cracks, trapped individuals, and access impediments..."
                  className="text-sm rounded-md border-slate-300 bg-white text-slate-900"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <LocationCapture location={location} onChange={setLocation} />
            </motion.div>
          )}

          {/* STEP 3: Evidence */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <MediaUpload files={mediaFiles} onChange={setMediaFiles} />
            </motion.div>
          )}

          {/* STEP 4: Contact Information */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Informant Primary Mobile Number *</Label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="rounded-md border-slate-300 bg-white text-slate-900 font-mono"
                    required
                  />
                  <p className="text-[11px] text-slate-500">For dispatch coordinator callback</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Alternate Telephone (Family / Local Leader)</Label>
                  <Input
                    type="tel"
                    value={alternateContact}
                    onChange={(e) => setAlternateContact(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="rounded-md border-slate-300 bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Special Route & Safety Hazards Advisory</Label>
                <Input
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Broken culvert 200m ahead; heavy vehicles cannot enter; boat access only..."
                  className="rounded-md border-slate-300 bg-white text-slate-900"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 mt-4">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#003366] focus:ring-[#003366]"
                />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  I hereby confirm that this intimation represents an authentic emergency event to ensure immediate dispatch by emergency coordinators and field response units.
                </span>
              </label>
            </motion.div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-2.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Incident Summary Audit
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-[#003366] rounded-md border border-blue-200">
                    PENDING TRANSMISSION
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Disaster Type</span>
                    <span className="font-bold text-slate-900 capitalize">{disasterType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Urgency Classification</span>
                    <span className="font-bold text-rose-700 capitalize">{priority} Priority</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Affected Count</span>
                    <span className="font-bold text-slate-900">{peopleAffected} persons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Evidence Uploads</span>
                    <span className="font-bold text-slate-900">{mediaFiles.length} files attached</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/90 text-xs">
                  <span className="text-slate-500 block text-[11px] font-semibold">Target Geographic Coordinates & Area</span>
                  <p className="font-bold text-slate-900 mt-0.5">{location.area}</p>
                  <p className="text-[11px] text-slate-500 font-mono">LAT: {location.latitude} | LON: {location.longitude}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Clicking the button below generates a DisasterShield tracking docket and transmits all telemetry to
                the central crisis coordination desk and frontline rescue teams.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/90">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              className="gap-2 border-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Previous Step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 text-xs font-bold rounded-xl bg-[#003366] hover:bg-[#0A2540] text-white cursor-pointer shadow-xs transition-all hover:shadow-md"
            >
              Proceed to Step {currentStep + 1} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting || !isConfirmed}
              onClick={handleSubmit}
              className="gap-2 font-bold text-sm px-8 rounded-xl shadow-xs bg-[#FF9933] hover:bg-[#E65100] text-slate-900 cursor-pointer transition-all hover:shadow-md border border-amber-400/40"
            >
              {isSubmitting ? (
                'Submitting Emergency Report...'
              ) : isOnline ? (
                <>
                  <Send className="h-4 w-4" /> Submit Emergency Report
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" /> Save Report Locally (Offline Storage)
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
