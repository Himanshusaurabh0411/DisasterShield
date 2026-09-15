import React from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Cloud,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function OfflineInteractiveDemo() {
  const { isOnline, toggleOnline, isSyncing, syncState, pendingSyncCount } = useApp();

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header & Interactive Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-[#FF9933]" />
            Offline-First Data Architecture
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Offline Survival & Zero Data Loss Simulator
          </h3>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
            Cellular towers frequently collapse during floods, cyclones, or earthquakes. Test how DisasterShield
            preserves life-critical emergency reports on citizen devices without any internet connection, then automatically
            syncs when signal coverage returns.
          </p>
        </div>

        {/* Online/Offline Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl shrink-0 shadow-xs">
          <span className="text-xs text-slate-700 font-bold pl-1">Network Simulator:</span>
          <button
            type="button"
            onClick={toggleOnline}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#FF9933] hover:bg-[#E65100] text-slate-900'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4" />
                <span>ONLINE (CONNECTED)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span>OFFLINE (BLACKOUT)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Step Cards with Softly Rounded Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
        {[
          {
            step: '01',
            title: 'Report Filed',
            desc: 'Citizen submits incident details & coordinates',
            active: true,
            icon: Cpu,
          },
          {
            step: '02',
            title: 'Local Storage',
            desc: 'Encrypted into device browser storage',
            active: !isOnline || isSyncing,
            icon: Database,
          },
          {
            step: '03',
            title: 'Queue Safe',
            desc: 'Preserved during power & tower collapse',
            active: !isOnline,
            icon: WifiOff,
          },
          {
            step: '04',
            title: 'Signal Detected',
            desc: 'Cellular uplink or Wi-Fi beacon restored',
            active: isOnline,
            icon: Wifi,
          },
          {
            step: '05',
            title: 'Auto-Syncing',
            desc: 'Transmitting backlog data packets',
            active: isSyncing,
            icon: RefreshCw,
          },
          {
            step: '06',
            title: 'Delivered',
            desc: 'Received by volunteer dispatch center',
            active: isOnline && !isSyncing,
            icon: Cloud,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-4 rounded-2xl border transition-all ${
                item.active
                  ? 'border-[#003366] bg-blue-50/60 shadow-xs ring-2 ring-[#003366]/20'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <Icon
                  className={`h-4 w-4 ${item.active ? 'text-[#003366]' : 'text-slate-400'} ${
                    item.active && item.icon === RefreshCw ? 'animate-spin' : ''
                  }`}
                />
                {item.active && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
              </div>
              <span className="text-[10px] font-extrabold text-[#003366] block">STEP {item.step}</span>
              <p className="font-bold text-slate-900 text-xs leading-tight mt-0.5">{item.title}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Reassuring Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3.5">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 shadow-xs ${
              isOnline
                ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                : 'border-amber-200 bg-amber-100 text-amber-900'
            }`}
          >
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">
              Local Storage & Background Relay Buffer
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {isOnline
                ? isSyncing
                  ? `Active Synchronization: ${syncState.message}`
                  : 'Direct Cloud Relay Active — Emergency dossiers upload instantaneously.'
                : 'Offline Protection Active — Reports are securely cached in your device browser until connectivity returns.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-600 text-xs font-semibold">Local Queue:</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-extrabold text-xs shadow-xs">
            {pendingSyncCount} {pendingSyncCount === 1 ? 'Report' : 'Reports'} Pending
          </span>
        </div>
      </div>
    </div>
  );
}
