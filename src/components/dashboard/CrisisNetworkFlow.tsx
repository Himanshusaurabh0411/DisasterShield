import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  ShieldCheck,
  Cloud,
  Truck,
  HeartHandshake
} from 'lucide-react';

interface NodeData {
  id: string;
  step: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  badge: string;
}

const NODES: NodeData[] = [
  {
    id: 'citizen',
    step: '01',
    label: 'Citizen Report',
    sub: 'Crisis intimation submitted with exact GPS coordinates & photo evidence',
    icon: Users,
    badge: '18 Active Reports',
  },
  {
    id: 'report',
    step: '02',
    label: 'Offline Preservation',
    sub: 'Encrypted local browser storage guarantees zero report loss during blackouts',
    icon: FileText,
    badge: 'Zero Data Loss',
  },
  {
    id: 'verification',
    step: '03',
    label: 'Triage Assessment',
    sub: 'Automated geospatial validation & casualty severity weighting',
    icon: ShieldCheck,
    badge: 'Verified Severity',
  },
  {
    id: 'cloud',
    step: '04',
    label: 'Cloud Relay Sync',
    sub: 'Instant background replication as soon as network coverage resumes',
    icon: Cloud,
    badge: 'Instant Sync',
  },
  {
    id: 'responders',
    step: '05',
    label: 'Tactical Dispatch',
    sub: 'Nearest specialized volunteer, medical, and rescue squads mobilized',
    icon: Truck,
    badge: '14 Units Active',
  },
  {
    id: 'rescue',
    step: '06',
    label: 'Relief & Resolution',
    sub: 'Community evacuation, first aid triage, food distribution & closure',
    icon: HeartHandshake,
    badge: 'Community Safe',
  },
];

export function CrisisNetworkFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % NODES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#003366]" />
            <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
              Humanitarian Response Architecture
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            6-Stage Community Emergency Response Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-End Coordination — From offline citizen distress intimation to field volunteer arrival
          </p>
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-2 font-semibold bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl self-start md:self-auto shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Pipeline: Stage {activeStep + 1} of 6</span>
        </div>
      </div>

      {/* 6 Steps Grid with Softly Rounded Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {NODES.map((node, index) => {
          const Icon = node.icon;
          const isActive = index === activeStep;

          return (
            <motion.div
              key={node.id}
              className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                isActive
                  ? 'border-[#003366] bg-blue-50/60 shadow-md ring-2 ring-[#003366]/20 -translate-y-1'
                  : 'border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-extrabold tracking-wider ${isActive ? 'text-[#003366]' : 'text-slate-400'}`}>
                    STAGE {node.step}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#FF9933] animate-ping" />
                  )}
                </div>

                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center border mb-3 transition-colors ${
                    isActive
                      ? 'bg-[#003366] text-white border-[#003366] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {node.label}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {node.sub}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/80">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg block text-center truncate ${
                    isActive
                      ? 'bg-blue-100 text-[#003366] border border-blue-200'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {node.badge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="space-y-1.5 pt-2">
        <div className="h-2 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#003366] via-[#FF9933] to-emerald-600 rounded-full"
            animate={{ width: `${((activeStep + 1) / NODES.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-semibold">
          <span>01. Ground Incident Ingestion</span>
          <span>04. Automated Cloud Relay</span>
          <span>06. Relief & Evacuation Concluded</span>
        </div>
      </div>
    </div>
  );
}
