import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Flame,
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Filter
} from 'lucide-react';
import { Incident } from '@/types';
import { priorityConfig, disasterTypeLabels } from '@/data/incidents';
import { formatNumber, timeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LiveEmergencyMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onIncidentClick?: (incident: Incident) => void;
  onIncidentSelect?: (incident: Incident) => void;
  className?: string;
  height?: string;
  showFilters?: boolean;
}

const disasterEmoji: Record<string, string> = {
  flood: '🌊',
  earthquake: '🌍',
  cyclone: '🌀',
  fire: '🔥',
  landslide: '⛰️',
  building_collapse: '🏚️',
  medical: '🏥',
  missing_person: '🔍',
  rescue_required: '🆘',
  food_water: '💧',
  other: '⚠️',
};

const severityColors: Record<string, { bg: string; border: string; text: string; pinBg: string }> = {
  critical: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', pinBg: '#dc2626' },
  high: { bg: '#ffedd5', border: '#f97316', text: '#9a3412', pinBg: '#ea580c' },
  medium: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', pinBg: '#d97706' },
  low: { bg: '#dcfce7', border: '#22c55e', text: '#166534', pinBg: '#16a34a' },
};

export function LiveEmergencyMap({
  incidents,
  selectedIncidentId,
  onIncidentClick,
  onIncidentSelect,
  className = '',
  height = '520px',
  showFilters = true,
}: LiveEmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const handleSelect = onIncidentClick || onIncidentSelect;
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [filterType, setFilterType] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<'carto' | 'osm'>('carto');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filtered list
  const filteredIncidents = incidents.filter((inc) => {
    if (filterType === 'all') return true;
    if (filterType === 'critical') return inc.priority === 'critical';
    return inc.disasterType === filterType;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over India / central emergency corridor
    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569], // Central India
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Default: CartoDB Voyager tiles (clean, light, Google Maps-like styling)
    const cartoLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    tileLayerRef.current = cartoLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  const handleToggleLayer = () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (activeLayer === 'carto') {
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = osmLayer;
      setActiveLayer('osm');
    } else {
      const cartoLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(mapInstanceRef.current);
      tileLayerRef.current = cartoLayer;
      setActiveLayer('carto');
    }
  };

  // Render & Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredIncidents.forEach((incident) => {
      const sev = severityColors[incident.priority] || severityColors.medium;
      const emoji = disasterEmoji[incident.disasterType] || '⚠️';
      const isCritical = incident.priority === 'critical';

      // Custom pulsing Google Maps-style pin icon
      const customIcon = L.divIcon({
        className: 'custom-emergency-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
            ${
              isCritical
                ? `<div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${sev.pinBg};"></div>`
                : ''
            }
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white transition-transform duration-200 transform group-hover:scale-110" style="background-color: ${sev.pinBg};">
              <span class="text-sm select-none">${emoji}</span>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r-2 border-b-2 border-white shadow-xs" style="background-color: ${sev.pinBg};"></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([incident.lat, incident.lng], { icon: customIcon }).addTo(map);

      // Popup Content (Modern Google Maps-like card)
      const popupHtml = `
        <div class="p-4 space-y-3 font-sans max-w-xs text-slate-900">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style="background-color: ${sev.bg}; color: ${sev.text}; border: 1px solid ${sev.border};">
              ${incident.priority} PRIORITY
            </span>
            <span class="text-[11px] text-slate-500 font-semibold">${disasterTypeLabels[incident.disasterType]}</span>
          </div>

          <div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">${incident.title}</h4>
            <p class="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
              <svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>${incident.location.area}</span>
            </p>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
            ${incident.description}
          </p>

          <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">PEOPLE IMPACTED</span>
              <span class="font-bold text-slate-900">${formatNumber(incident.peopleAffected)}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">TRAPPED</span>
              <span class="font-bold ${incident.trapped > 0 ? 'text-rose-600' : 'text-slate-700'}">${incident.trapped}</span>
            </div>
          </div>

          <div class="pt-2">
            <button
              id="btn-inspect-${incident.id}"
              class="w-full py-2 px-3 rounded-lg bg-[#003366] hover:bg-[#0B192C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inspect Incident Dossier</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 320 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${incident.id}`);
        if (btn) {
          btn.onclick = () => {
            handleSelect?.(incident);
          };
        }
      });

      marker.on('click', () => {
        handleSelect?.(incident);
      });

      markersRef.current[incident.id] = marker;
    });
  }, [filteredIncidents, handleSelect]);

  // Handle programmatic selection / auto-pan
  useEffect(() => {
    if (!selectedIncidentId || !mapInstanceRef.current) return;
    const selected = incidents.find((i) => i.id === selectedIncidentId);
    if (!selected) return;

    mapInstanceRef.current.flyTo([selected.lat, selected.lng], 12, {
      duration: 1.2,
    });

    const marker = markersRef.current[selectedIncidentId];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  }, [selectedIncidentId, incidents]);

  // Map Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([22.9734, 78.6569], 5, { duration: 1 });
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm ${className}`}>
      {/* Top Filter Bar (Civic-Tech Emergency Categories) */}
      {showFilters && (
        <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/90 shadow-md pointer-events-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Incidents', count: incidents.length },
              { id: 'critical', label: 'Critical Only', count: incidents.filter((i) => i.priority === 'critical').length },
              { id: 'flood', label: 'Floods 🌊', count: incidents.filter((i) => i.disasterType === 'flood').length },
              { id: 'fire', label: 'Fires 🔥', count: incidents.filter((i) => i.disasterType === 'fire').length },
              { id: 'earthquake', label: 'Quakes 🌍', count: incidents.filter((i) => i.disasterType === 'earthquake').length },
              { id: 'cyclone', label: 'Cyclones 🌀', count: incidents.filter((i) => i.disasterType === 'cyclone').length },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === chip.id
                    ? 'bg-[#003366] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{chip.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${filterType === chip.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>

          {/* Live Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-md pointer-events-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Live Crisis Map
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredIncidents.length} Active Hotspots
            </span>
          </div>
        </div>
      )}

      {/* Actual Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Floating Google Maps-Style Action Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
        {/* Layer Switcher */}
        <button
          onClick={handleToggleLayer}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md transition-all hover:scale-105 cursor-pointer"
          title={`Switch Map View (Current: ${activeLayer === 'carto' ? 'Street Clean' : 'Standard OSM'})`}
        >
          <Layers className="h-4 w-4 text-[#003366]" />
        </button>

        {/* Reset View */}
        <button
          onClick={handleResetView}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md transition-all hover:scale-105 cursor-pointer"
          title="Center All Incidents"
        >
          <Navigation className="h-4 w-4 text-[#FF9933]" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-50 text-slate-800 border-b border-slate-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-md pointer-events-auto text-xs font-semibold text-slate-700">
        <span className="text-[11px] font-bold text-[#003366] uppercase tracking-wider">Severity:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}
