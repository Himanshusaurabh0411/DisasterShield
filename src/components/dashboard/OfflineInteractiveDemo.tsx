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
    <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header & Interactive Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            NIC Disaster Telecommunication Protocol
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Offline Survival & Local Storage Resilience Simulator
          </h3>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
            Telecom towers often collapse during cyclonic storms or earthquakes. Test how DisasterShield
            preserves life-critical emergency intimations on citizen devices without any internet connection,
            then auto-syncs when signal restores.
          </p>
        </div>

        {/* Reassuring Online/Offline Switch */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-md shrink-0">
          <span className="text-xs text-slate-700 font-semibold pl-1">Network Simulation:</span>
          <button
            type="button"
            onClick={toggleOnline}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-amber-600 text-white hover:bg-amber-700'
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
                <span>OFFLINE (DISCONNECTED)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lifecycle Step Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {[
          {
            step: '01',
            title: 'Report Created',
            titleHi: 'सूचना प्रविष्टि',
            desc: 'Citizen files incident details',
            active: true,
            icon: Cpu,
          },
          {
            step: '02',
            title: 'Local Storage',
            titleHi: 'स्थानीय संग्रहण',
            desc: 'Encrypted in browser storage',
            active: !isOnline || isSyncing,
            icon: Database,
          },
          {
            step: '03',
            title: 'Queue Pending',
            titleHi: 'प्रतीक्षारत कतार',
            desc: 'Safe during tower blackout',
            active: !isOnline,
            icon: WifiOff,
          },
          {
            step: '04',
            title: 'Coverage Returns',
            titleHi: 'सिग्नल पुनर्प्राप्ति',
            desc: 'Cellular network detected',
            active: isOnline,
            icon: Wifi,
          },
          {
            step: '05',
            title: 'Auto-Syncing',
            titleHi: 'स्वतः तुल्यकालन',
            desc: 'Transmitting backlog packets',
            active: isSyncing,
            icon: RefreshCw,
          },
          {
            step: '06',
            title: 'EOC Delivered',
            titleHi: 'कंट्रोल रूम प्राप्त',
            desc: 'Received by NDRF dispatch',
            active: isOnline && !isSyncing,
            icon: Cloud,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-4 rounded-md border transition-all ${
                item.active
                  ? 'border-[#003366] bg-blue-50/50 shadow-xs ring-1 ring-[#003366]'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <Icon className={`h-4 w-4 ${item.active ? 'text-[#003366]' : 'text-slate-400'} ${item.active && item.icon === RefreshCw ? 'animate-spin' : ''}`} />
                {item.active && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
              </div>
              <span className="text-[10px] font-bold text-[#003366] block">STEP {item.step}</span>
              <p className="font-bold text-slate-900 text-xs leading-tight mt-0.5">{item.title}</p>
              <p className="text-[10px] text-slate-500 font-medium">{item.titleHi}</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Reassuring Status Banner */}
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-md flex items-center justify-center border shrink-0 ${
              isOnline
                ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                : 'border-amber-300 bg-amber-100 text-amber-800'
            }`}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold uppercase tracking-wider">NIC Local Cache & Relay Buffer</span>
            <p className="font-bold text-slate-900 text-sm">
              {isOnline
                ? isSyncing
                  ? `Active Synchronization: ${syncState.message}`
                  : 'Direct Central Cloud Uplink Active — All reports transmit instantaneously.'
                : 'Offline Data Preservation Active — Reports are securely cached in local storage until signal restoration.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-600 text-xs font-medium">Pending Local Queue:</span>
          <span className="px-3 py-1 rounded-md bg-white border border-slate-300 text-slate-900 font-bold text-xs">
            {pendingSyncCount} {pendingSyncCount === 1 ? 'Report' : 'Reports'} Pending
          </span>
        </div>
      </div>
    </div>
  );
}
