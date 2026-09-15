import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  LifeBuoy,
  TrendingUp,
  Activity,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { realWorldDisasters } from '@/data/realWorldDisasters';
import { DisasterRecoveryIncident } from '@/types';
import { Button } from '@/components/ui/button';

export function ImpactRecoverySection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeDossier, setActiveDossier] = useState<DisasterRecoveryIncident | null>(null);
  const [modalImageTab, setModalImageTab] = useState<'primary' | 'secondary'>('primary');

  const filteredDisasters = selectedFilter === 'all'
    ? realWorldDisasters
    : realWorldDisasters.filter((d) => d.type === selectedFilter);

  // Overall aggregate stats across real incidents
  const totalAffected = realWorldDisasters.reduce((acc, curr) => acc + curr.peopleAffected, 0);
  const totalRescued = realWorldDisasters.reduce((acc, curr) => acc + curr.peopleRescued, 0);
  const overallRescueRate = ((totalRescued / totalAffected) * 100).toFixed(1);

  const handleOpenDossier = (incident: DisasterRecoveryIncident) => {
    setActiveDossier(incident);
    setModalImageTab('primary');
  };

  return (
    <section className="w-full bg-slate-50 border-t border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#003366]/10 text-[#003366] text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="h-3.5 w-3.5 text-[#FF9933]" />
              <span>Real-World Incident Data Feed &amp; Impact Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003366] tracking-tight">
              Impact &amp; Recovery Feed
              <span className="ml-3 text-lg font-normal text-slate-500 font-serif">
                | वास्तविक आपदा एवं राहत निगरानी
              </span>
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
              Authentic multi-agency recovery dossiers from major recent crises across India. Real-time telemetry evaluates crisis magnitude against life-saving rescue outcomes.
            </p>
          </div>

          {/* Aggregate Quick Metric Pill */}
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 text-emerald-700">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">National Save Rate</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {overallRescueRate}%
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-800">
                {totalRescued.toLocaleString()}+ <span className="text-xs font-normal text-slate-500">of {totalAffected.toLocaleString()} Rescued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">Filter Disasters:</span>
          {[
            { id: 'all', label: 'All Incidents', count: realWorldDisasters.length },
            {
              id: 'cyclone',
              label: 'Cyclones (Dana & Remal 2024)',
              count: realWorldDisasters.filter((d) => d.type === 'cyclone').length,
            },
            {
              id: 'flood',
              label: 'Monsoon Floods (Vijayawada / Assam / Vadodara)',
              count: realWorldDisasters.filter((d) => d.type === 'flood').length,
            },
            {
              id: 'cloudburst',
              label: 'Cloudbursts (Himachal Samej 2024)',
              count: realWorldDisasters.filter((d) => d.type === 'cloudburst').length,
            },
            {
              id: 'landslide',
              label: 'Landslides (Wayanad 2024)',
              count: realWorldDisasters.filter((d) => d.type === 'landslide').length,
            },
            {
              id: 'glacial_lake',
              label: 'Glacial Outburst (Sikkim GLOF)',
              count: realWorldDisasters.filter((d) => d.type === 'glacial_lake').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#003366] text-white shadow-xs border border-[#003366]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedFilter === tab.id ? 'bg-[#FF9933] text-slate-900 font-extrabold' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Disaster Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredDisasters.map((incident) => {
            const rescuePercent = Math.min(100, Math.round((incident.peopleRescued / incident.peopleAffected) * 100));

            return (
              <motion.article
                key={incident.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Visual Header with Real Photography */}
                <div className="relative h-52 w-full bg-slate-800 overflow-hidden group">
                  <img
                    src={incident.imageUrl}
                    alt={incident.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (incident.fallbackImageUrl && target.src !== incident.fallbackImageUrl) {
                        target.src = incident.fallbackImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#003366] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm border border-white/20">
                      {incident.type.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1 shadow-sm">
                      <Calendar className="h-3 w-3 text-[#FF9933]" />
                      {incident.date}
                    </span>
                  </div>

                  {/* Recovery Stage Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded bg-emerald-950/80 backdrop-blur-xs text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                      {incident.recoveryStage}
                    </span>
                  </div>

                  {/* Location & Authentic Photo Caption Over Image Bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
                      <MapPin className="h-3.5 w-3.5 text-[#FF9933] shrink-0" />
                      <span>{incident.location}, {incident.state}</span>
                    </div>
                    <p className="text-[10px] text-amber-200/90 line-clamp-1 mt-0.5 font-normal flex items-center gap-1">
                      <span className="font-semibold text-white">Actual Evidence:</span> {incident.imageCaption}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Bilingual Titles */}
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-[#003366] leading-snug">
                        {incident.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {incident.hindiTitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {incident.description}
                    </p>

                    {/* LIVE IMPACT METRICS: Impact vs Rescue Success Comparison */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-[#003366]" />
                          Crisis Impact vs. Rescue Success
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {incident.reliefEfficiency}% Efficiency
                        </span>
                      </div>

                      {/* Visual Data Counters */}
                      <div className="grid grid-cols-2 gap-2 mb-2.5">
                        <div className="bg-rose-50 border border-rose-200/80 rounded p-2 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                            People Affected
                          </div>
                          <div className="text-base font-black text-rose-900 leading-tight mt-0.5">
                            {incident.peopleAffected.toLocaleString()}+
                          </div>
                          <div className="text-[9px] text-rose-600">संकटग्रस्त जनसंख्या</div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200/80 rounded p-2 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Evacuated / Rescued
                          </div>
                          <div className="text-base font-black text-emerald-900 leading-tight mt-0.5">
                            {incident.peopleRescued.toLocaleString()}+
                          </div>
                          <div className="text-[9px] text-emerald-600">सुरक्षित बचाए गए</div>
                        </div>
                      </div>

                      {/* Rescue Ratio Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                          <span>Rescue Coverage</span>
                          <span className="text-[#003366] font-bold">{rescuePercent}% secured</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                            style={{ width: `${rescuePercent}%` }}
                            title={`${rescuePercent}% Rescued`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Deployments Pill Preview */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <Layers className="h-3 w-3 text-slate-400" />
                        Key Response Forces
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {incident.keyDeployments.slice(0, 2).map((dep, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700 truncate max-w-[280px]"
                            title={dep}
                          >
                            {dep}
                          </span>
                        ))}
                        {incident.keyDeployments.length > 2 && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                            +{incident.keyDeployments.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDossier(incident)}
                      className="w-full text-xs font-bold text-[#003366] border-[#003366]/40 hover:bg-[#003366] hover:text-white transition-colors cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      View Operational Brief &amp; Authentic Evidence
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Operational Brief Dossier Modal */}
      <AnimatePresence>
        {activeDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b-2 border-[#FF9933]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#FF9933] text-slate-900 font-extrabold text-[10px] uppercase tracking-wider">
                      Official Incident Dossier
                    </span>
                    <span className="text-xs text-white/80 font-mono">{activeDossier.id}</span>
                  </div>
                  <h3 className="text-lg font-extrabold mt-1 text-white leading-tight">
                    {activeDossier.title}
                  </h3>
                  <div className="text-xs text-white/70 font-medium">
                    {activeDossier.hindiTitle} • {activeDossier.location}, {activeDossier.state}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDossier(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                {/* Hero Images with Dual Evidence Switcher */}
                <div className="space-y-2">
                  {activeDossier.secondaryImageUrl && (
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => setModalImageTab('primary')}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          modalImageTab === 'primary'
                            ? 'bg-[#003366] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        1. Ground Disaster Evidence
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalImageTab('secondary')}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          modalImageTab === 'secondary'
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        2. Tactical Response &amp; Deployment
                      </button>
                    </div>
                  )}

                  <div className="relative h-52 sm:h-60 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src={
                        modalImageTab === 'secondary' && activeDossier.secondaryImageUrl
                          ? activeDossier.secondaryImageUrl
                          : activeDossier.imageUrl
                      }
                      alt={activeDossier.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (activeDossier.fallbackImageUrl && target.src !== activeDossier.fallbackImageUrl) {
                          target.src = activeDossier.fallbackImageUrl;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/75 text-white text-xs font-semibold backdrop-blur-xs">
                      Stage: {activeDossier.recoveryStage}
                    </div>
                  </div>

                  {/* Factual Evidence Caption */}
                  <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200/90 text-xs text-slate-700 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF9933] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#003366]">
                        {modalImageTab === 'primary' ? 'Verified Incident Ground Evidence: ' : 'Official Operational Deployment: '}
                      </span>
                      <span>
                        {modalImageTab === 'primary'
                          ? activeDossier.imageCaption
                          : (activeDossier.secondaryImageCaption || activeDossier.imageCaption)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
                    <div className="text-xs font-bold text-rose-700 uppercase">Population Affected</div>
                    <div className="text-xl font-black text-rose-900 mt-0.5">
                      {activeDossier.peopleAffected.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                    <div className="text-xs font-bold text-emerald-700 uppercase">Evacuated & Rescued</div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5">
                      {activeDossier.peopleRescued.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center">
                    <div className="text-xs font-bold text-cyan-700 uppercase">Relief Efficiency</div>
                    <div className="text-xl font-black text-cyan-900 mt-0.5">
                      {activeDossier.reliefEfficiency}%
                    </div>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-[#003366]" />
                    Incident Context &amp; Dynamics
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {activeDossier.description}
                  </p>
                </div>

                {/* Response Deployments */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Key Response Deployments &amp; Engineering
                  </h4>
                  <ul className="space-y-1.5">
                    {activeDossier.keyDeployments.map((deployment, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-200"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{deployment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operational Summary */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#FF9933]" />
                    Operational EOC Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/80">
                    {activeDossier.operationalSummary}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
                <Button
                  onClick={() => setActiveDossier(null)}
                  className="bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold px-5 cursor-pointer"
                >
                  Close Dossier
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
