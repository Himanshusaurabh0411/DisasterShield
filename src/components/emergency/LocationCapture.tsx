import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Crosshair, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationCaptureProps {
  location: Location;
  onChange: (location: Location) => void;
}

const PRESET_LOCATIONS: Array<{ area: string; landmark: string; lat: number; lng: number }> = [
  { area: 'Lower Lake Area, Bhopal', landmark: 'Near Lower Lake Bridge', lat: 23.2599, lng: 77.4126 },
  { area: 'Industrial Zone, Indore', landmark: 'Near Pigdamber Road', lat: 22.7196, lng: 75.8577 },
  { area: 'Central Delhi, Connaught Place', landmark: 'Block B, Inner Circle', lat: 28.7041, lng: 77.1025 },
  { area: 'Puri District, Odisha', landmark: 'Near Sea Beach Road', lat: 20.9517, lng: 85.0985 },
  { area: 'Rudraprayag, Uttarakhand', landmark: 'Kedarnath Route KM 18', lat: 30.7352, lng: 79.0669 },
  { area: 'Dharavi, Mumbai', landmark: '90 Feet Road, Near Station', lat: 19.0760, lng: 72.8777 },
];

export function LocationCapture({ location, onChange }: LocationCaptureProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    // Simulate GPS acquisition with realistic latency
    setTimeout(() => {
      const randomOffsetLat = (Math.random() - 0.5) * 0.005;
      const randomOffsetLng = (Math.random() - 0.5) * 0.005;
      onChange({
        latitude: +(23.2599 + randomOffsetLat).toFixed(4),
        longitude: +(77.4126 + randomOffsetLng).toFixed(4),
        accuracy: Math.floor(Math.random() * 8) + 8, // 8-15m accuracy
        area: 'Bhopal Central Disaster Zone (Auto-Detected GPS)',
        landmark: 'Sector 4, Near Water Reservoir',
        simulated: true,
      });
      setIsLocating(false);
      setIsManual(false);
    }, 800);
  };

  const handleSelectPreset = (idx: number) => {
    const preset = PRESET_LOCATIONS[idx];
    onChange({
      latitude: preset.lat,
      longitude: preset.lng,
      accuracy: 10,
      area: preset.area,
      landmark: preset.landmark,
      simulated: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={!isManual ? 'default' : 'outline'}
          size="sm"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="gap-2 cursor-pointer font-bold rounded-md bg-[#003366] text-white hover:bg-[#0A2540]"
        >
          {isLocating ? (
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Navigation className="h-4 w-4 text-emerald-300" />
          )}
          {isLocating ? 'Acquiring GPS Signal...' : 'USE MY AUTO GPS LOCATION'}
        </Button>
        <Button
          type="button"
          variant={isManual ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsManual(true)}
          className="gap-2 cursor-pointer font-bold rounded-md border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          <Crosshair className="h-4 w-4 text-amber-600" />
          ENTER GEOLOCATION MANUALLY
        </Button>
      </div>

      {/* Simulated Map Visualizer Grid */}
      <div className="relative rounded-md border border-slate-300 bg-slate-50 overflow-hidden p-4">
        <div className="relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Geotag Telemetry Active
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Accuracy: ±{location.accuracy || 10}m
              </span>
            </div>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-600" />
              {location.area}
            </p>
            {location.landmark && (
              <p className="text-xs text-slate-600">Landmark / Landmark: {location.landmark}</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-md p-3 text-xs font-mono space-y-1 shadow-xs min-w-[200px]">
            <div className="flex justify-between text-slate-500">
              <span>LATITUDE:</span>
              <span className="text-slate-900 font-bold">{location.latitude.toFixed(4)}° N</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>LONGITUDE:</span>
              <span className="text-slate-900 font-bold">{location.longitude.toFixed(4)}° E</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GEODETIC REF:</span>
              <span className="text-slate-900 font-bold">WGS 84 / ISRO IRNSS</span>
            </div>
          </div>
        </div>

        {isManual && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-700 font-semibold">Area / Sector Name *</Label>
              <Input
                value={location.area}
                onChange={(e) => onChange({ ...location, area: e.target.value })}
                placeholder="e.g. Ward 12, Rampur District"
                className="bg-white text-slate-900 border-slate-300 text-xs rounded-md"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-700 font-semibold">Prominent Landmark</Label>
              <Input
                value={location.landmark || ''}
                onChange={(e) => onChange({ ...location, landmark: e.target.value })}
                placeholder="e.g. Near Primary School / Water Tank"
                className="bg-white text-slate-900 border-slate-300 text-xs rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preset Region Quick Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Select Standard Demonstration Disaster Sectors:
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_LOCATIONS.map((preset, idx) => (
            <button
              key={preset.area}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`p-2.5 rounded-md border text-left transition-all text-xs cursor-pointer ${
                location.area === preset.area
                  ? 'border-[#003366] bg-blue-50 text-[#003366] font-bold shadow-xs ring-1 ring-[#003366]'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="font-semibold block truncate">{preset.area}</span>
              <span className="text-[10px] text-slate-500 block truncate">{preset.landmark}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
