import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  WifiOff,
  Database,
  Cloud,
  Clock,
  MapPin,
  Printer
} from 'lucide-react';
import { DisasterReport } from '@/types';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/reports/PriorityBadge';
import { disasterTypeLabels } from '@/data/incidents';
import { formatDateTime } from '@/lib/utils';
import { AIScreeningPanel } from './AIScreeningPanel';

interface SubmissionSuccessProps {
  report: DisasterReport;
  onReset: () => void;
}

export function SubmissionSuccess({ report, onReset }: SubmissionSuccessProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOffline = report.isOffline;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-6 text-slate-900"
    >
      {/* Official Confirmation Banner */}
      <div
        className={`rounded-md border p-6 sm:p-8 text-center shadow-sm bg-white ${
          isOffline ? 'border-amber-300 ring-2 ring-amber-100' : 'border-emerald-300 ring-2 ring-emerald-100'
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
            isOffline
              ? 'border-amber-300 bg-amber-100 text-amber-800'
              : 'border-emerald-300 bg-emerald-100 text-emerald-800'
          }`}
        >
          {isOffline ? <WifiOff className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            भारत सरकार | Government of India — NDMA Citizen Portal
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isOffline
              ? 'Emergency Intimation Saved to Local Storage (Offline Mode)'
              : 'Official Emergency Intimation Acknowledged'}
          </h2>
          <p className="text-sm font-semibold text-[#003366]">
            {isOffline ? 'ऑफलाइन डेटा संग्रहण सफल' : 'आपातकालीन सूचना सफलतापूर्वक दर्ज की गई'}
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {isOffline
            ? 'Your emergency dossier is securely encrypted on this browser. When cellular or Wi-Fi connectivity resumes, it will automatically transmit to the National Emergency Operations Centre without any user intervention.'
            : 'Your emergency dossier has been logged into the National Incident Grid and prioritized for tactical response dispatch.'}
        </p>

        {/* Tracking ID Pill */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-50 border border-slate-300 px-6 py-3 rounded-md shadow-xs">
          <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Official Docket / Tracking ID:</span>
          <span className="text-2xl font-extrabold text-[#003366] font-mono tracking-wider">
            {report.trackingId}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="h-8 px-3 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
          >
            {copied ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Check className="h-3.5 w-3.5" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold">
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Incident Summary Card / Formal Docket */}
      <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Official Acknowledgment Receipt / पावती रसीद
            </h3>
            <p className="text-xs text-slate-500">FORM NDMA-01 Docket Details</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            className="text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" /> Print Receipt
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-semibold">Disaster Category</span>
            <span className="text-slate-900 font-bold text-sm capitalize">
              {disasterTypeLabels[report.disasterType] || report.disasterType}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-semibold">Transmission Status</span>
            <span
              className={`inline-block font-bold px-2.5 py-0.5 rounded text-xs mt-1 ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {isOffline ? 'Encrypted in Local Storage' : 'Logged at Regional Dispatch Desk'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-semibold">Priority Classification</span>
            <div className="pt-1">
              <PriorityBadge priority={report.priority} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-semibold">Logged Timestamp</span>
            <span className="text-slate-800 font-medium flex items-center gap-1.5 pt-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {formatDateTime(report.createdAt)}
            </span>
          </div>

          <div className="sm:col-span-2 p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px] font-semibold">Geospatial Target Area</span>
            <span className="text-slate-900 font-bold flex items-center gap-1.5 pt-1">
              <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
              {report.location.area}
              {report.location.landmark && ` — (${report.location.landmark})`}
            </span>
          </div>
        </div>

        {report.aiScore && (
          <div className="pt-2">
            <AIScreeningPanel aiScore={report.aiScore} isCompact />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          size="lg"
          onClick={() => navigate(`/track?id=${report.trackingId}`)}
          className="flex-1 gap-2 text-sm font-bold rounded-md bg-[#003366] hover:bg-[#0A2540] text-white shadow-xs cursor-pointer"
        >
          Track Incident Verification & Dispatch Status <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          className="rounded-md border-slate-300 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer"
        >
          File Another Emergency Report
        </Button>
      </div>
    </motion.div>
  );
}
