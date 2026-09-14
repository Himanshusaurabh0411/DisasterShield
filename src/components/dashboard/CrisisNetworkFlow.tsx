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
  labelHi: string;
  sub: string;
  icon: React.ElementType;
  badge: string;
}

const NODES: NodeData[] = [
  {
    id: 'citizen',
    step: '01',
    label: 'Citizen Intimation',
    labelHi: 'नागरिक सूचना',
    sub: 'Field emergency report submitted with GPS geotag',
    icon: Users,
    badge: '18 Active Reports',
  },
  {
    id: 'report',
    step: '02',
    label: 'Local Preservation',
    labelHi: 'स्थानीय डेटा संग्रहण',
    sub: 'Encrypted on-device caching during network failure',
    icon: FileText,
    badge: 'Zero Data Loss',
  },
  {
    id: 'verification',
    step: '03',
    label: 'Triage Assessment',
    labelHi: 'प्राथमिकता निर्धारण',
    sub: 'EOC automated validation and casualty triage',
    icon: ShieldCheck,
    badge: 'Verified Credibility',
  },
  {
    id: 'cloud',
    step: '04',
    label: 'NIC Cloud Sync',
    labelHi: 'क्लाउड सिंक',
    sub: 'Background replication as signal coverage resumes',
    icon: Cloud,
    badge: 'Central Telemetry',
  },
  {
    id: 'responders',
    step: '05',
    label: 'Tactical Dispatch',
    labelHi: 'राहत दल प्रेषण',
    sub: 'Nearest NDRF, SDRF & medical battalion assigned',
    icon: Truck,
    badge: '14 Units Mobilized',
  },
  {
    id: 'rescue',
    step: '06',
    label: 'Relief & Resolution',
    labelHi: 'राहत एवं समाधान',
    sub: 'Victim rescue, medical triage & incident closure',
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
    <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#003366]" />
            <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
              NDMA Standard Operating Procedure (SOP)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            6-Stage National Disaster Response Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            आपदा प्रतिक्रिया मानक संचालन प्रक्रिया — Citizen to Command Center Workflow
          </p>
        </div>
        <div className="text-xs text-slate-600 flex items-center gap-2 font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md self-start md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Active Pipeline: Stage {activeStep + 1} of 6</span>
        </div>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {NODES.map((node, index) => {
          const Icon = node.icon;
          const isActive = index === activeStep;

          return (
            <motion.div
              key={node.id}
              className={`relative rounded-md border p-4 flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'border-[#003366] bg-blue-50/50 shadow-sm ring-1 ring-[#003366]'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold ${isActive ? 'text-[#003366]' : 'text-slate-500'}`}>
                    STAGE {node.step}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#FF9933]" />
                  )}
                </div>

                <div
                  className={`h-10 w-10 rounded-md flex items-center justify-center border mb-2.5 ${
                    isActive
                      ? 'bg-[#003366] text-white border-[#003366]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {node.label}
                </h4>
                <p className="text-[11px] text-[#003366] font-medium mt-0.5">
                  {node.labelHi}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {node.sub}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/80">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded block text-center truncate ${
                    isActive
                      ? 'bg-blue-100 text-[#003366] border border-blue-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
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
            className="h-full bg-gradient-to-r from-[#003366] via-[#FF9933] to-[#138808] rounded-full"
            animate={{ width: `${((activeStep + 1) / NODES.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>01. Ground Incident Ingestion</span>
          <span>04. Automated Cloud Relay</span>
          <span>06. Rescue & Relief Concluded</span>
        </div>
      </div>
    </div>
  );
}
