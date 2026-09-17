import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Shield,
  AlertTriangle,
  ArrowRight,
  Database,
  Share2,
  Copy,
  Check,
  Phone,
  Printer,
  FileCheck
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { mockIncidents, disasterTypeLabels } from '@/data/incidents';
import { ReportTimeline } from '@/components/reports/ReportTimeline';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { AIScreeningPanel } from '@/components/emergency/AIScreeningPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DisasterReport } from '@/types';
import { formatDateTime, timeAgo } from '@/lib/utils';

export function Track() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { reports } = useReports();

  const queryId = searchParams.get('id') || '';
  const [trackingInput, setTrackingInput] = useState(queryId);
  const [activeReport, setActiveReport] = useState<DisasterReport | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const performSearch = (idToSearch: string) => {
    const cleanId = idToSearch.trim();
    if (!cleanId) return;

    setSearched(true);

    const foundUserReport = reports.find(
      (r) => r.trackingId.toLowerCase() === cleanId.toLowerCase() || r.id === cleanId
    );

    if (foundUserReport) {
      setActiveReport(foundUserReport);
      return;
    }

    const foundIncident = mockIncidents.find(
      (i) => i.trackingId.toLowerCase() === cleanId.toLowerCase() || i.id === cleanId
    );

    if (foundIncident) {
      const mappedReport: DisasterReport = {
        id: foundIncident.id,
        trackingId: foundIncident.trackingId,
        disasterType: foundIncident.disasterType,
        description: foundIncident.description,
        peopleAffected: foundIncident.peopleAffected,
        injured: foundIncident.injured,
        trapped: foundIncident.trapped,
        priority: foundIncident.priority,
        location: foundIncident.location,
        mediaFiles: [],
        contactPhone: '+91-755-CRISIS-HQ',
        alternateContact: '',
        additionalNotes: 'Assigned to Regional Relief Battalion',
        status:
          foundIncident.status === 'resolved'
            ? 'resolved'
            : foundIncident.status === 'responding'
            ? 'response_in_progress'
            : 'prioritized',
        createdAt: foundIncident.createdAt,
        updatedAt: foundIncident.updatedAt,
        isOffline: false,
        responderAssigned: 'Alpha Medical Response Team (Community Volunteer Squad)',
        aiScore: {
          credibility: 94,
          urgency: foundIncident.priority,
          duplicateProbability: 6,
          recommendedPriority: foundIncident.priority,
          isDemo: true,
        },
      };
      setActiveReport(mappedReport);
      return;
    }

    setActiveReport(null);
  };

  useEffect(() => {
    if (queryId) {
      setTrackingInput(queryId);
      performSearch(queryId);
    } else if (reports.length > 0) {
      setTrackingInput(reports[0].trackingId);
      performSearch(reports[0].trackingId);
    } else {
      setTrackingInput('DS-2026-84A72');
      performSearch('DS-2026-84A72');
    }
  }, [queryId, reports]);

  const handleCopyId = () => {
    if (!activeReport) return;
    navigator.clipboard.writeText(activeReport.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-900 bg-white">
      {/* Header */}
      <div className="border border-slate-200/90 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white p-6 sm:p-7 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#003366] text-white">
            PUBLIC STATUS TRACKER
          </span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Crisis Response Audit Registry
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Emergency Incident Docket
        </h1>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          Monitor your incident report through each stage: local storage caching, network synchronization,
          coordination verification, volunteer squad dispatch, and final rescue resolution.
        </p>
      </div>

      {/* Docket Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            performSearch(trackingInput);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter Incident Tracking Code (e.g. DS-2026-84A72)"
              className="pl-10 h-11 text-sm rounded-xl border-slate-300 bg-white text-slate-900 font-mono font-semibold"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 px-6 font-bold rounded-xl bg-[#003366] hover:bg-[#0A2540] text-white shadow-xs cursor-pointer transition-all hover:shadow-md"
          >
            Track Status
          </Button>
        </form>

        {/* Quick Demo Docket Picker */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold">Sample Tracking Codes:</span>
          {['DS-2026-84A72', 'DS-2026-31C45', 'DS-2026-55F91', 'DS-2026-72B38'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTrackingInput(id);
                performSearch(id);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {searched && !activeReport ? (
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-10 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-800">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Docket Record Found for "{trackingInput}"
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Please verify your tracking code. If submitted in offline mode, ensure this browser session
            has not been cleared before background synchronization completed.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/report')}
            className="rounded-xl border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            Submit a New Report
          </Button>
        </div>
      ) : activeReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Details & AI Screening */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
                <div>
                  <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">
                    Incident Response Docket
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold tracking-tight text-[#003366] font-mono">
                      {activeReport.trackingId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Copy code"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-700 font-bold" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority={activeReport.priority} />
                  <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 capitalize">
                    {activeReport.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Disaster Category</span>
                  <span className="text-slate-900 font-bold capitalize">
                    {disasterTypeLabels[activeReport.disasterType] || activeReport.disasterType}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Reported At</span>
                  <span className="text-slate-800 font-medium">{timeAgo(activeReport.createdAt)}</span>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Transmission Mode</span>
                  <span className={activeReport.isOffline ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>
                    {activeReport.isOffline ? 'Offline Local Storage' : 'Cloud Direct'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">People Impacted</span>
                  <span className="text-slate-900 font-bold">{activeReport.peopleAffected}</span>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Reported Injured</span>
                  <span className="text-amber-800 font-bold">{activeReport.injured}</span>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Reported Trapped</span>
                  <span className="text-rose-700 font-bold">{activeReport.trapped}</span>
                </div>
              </div>

              {/* Location and notes */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[11px] font-semibold">Geospatial Sector</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    {activeReport.location.area}
                  </p>
                  {activeReport.location.landmark && (
                    <p className="text-slate-600 pl-5">Landmark: {activeReport.location.landmark}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Ground Report Notes</span>
                  <p className="text-slate-700 mt-1 leading-relaxed">{activeReport.description}</p>
                </div>
              </div>

              {/* Assigned Battalion */}
              {activeReport.responderAssigned && (
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-[#003366] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#003366]" />
                    <div>
                      <span className="font-bold block">Assigned Response Unit</span>
                      <span>{activeReport.responderAssigned}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 rounded-lg text-[11px] font-bold">MOBILIZED</span>
                </div>
              )}

              {/* AI Screening Box */}
              {activeReport.aiScore && (
                <div className="pt-2">
                  <AIScreeningPanel aiScore={activeReport.aiScore} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 8-Stage Audit Timeline */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-200/90 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Incident Audit Timeline
                </h3>
                <p className="text-xs text-slate-500">6-Stage Response Pipeline</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                LIVE AUDIT
              </span>
            </div>

            <ReportTimeline currentStatus={activeReport.status} />

            <div className="pt-4 border-t border-slate-200/90 text-xs text-slate-500 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">Community Response Assurance:</span>
              Once dispatched, volunteer rescue squads and emergency teams maintain direct coordination with regional dispatch desks and reporting contacts.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
