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
  Filter,
  Globe2,
  Key
} from 'lucide-react';
import { Incident } from '@/types';
import { priorityConfig, disasterTypeLabels } from '@/data/incidents';
import { formatNumber, timeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GoogleEmergencyMap } from '@/components/map/GoogleEmergencyMap';

interface LiveEmergencyMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onIncidentClick?: (incident: Incident) => void;
  onIncidentSelect?: (incident: Incident) => void;
  className?: string;
  height?: string;
  showFilters?: boolean;
  defaultEngine?: 'leaflet' | 'google';
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
  defaultEngine,
}: LiveEmergencyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const handleSelect = onIncidentClick || onIncidentSelect;
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [filterType, setFilterType] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<'carto' | 'osm'>('carto');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Check if Google Maps API key exists
  const hasGoogleKey = Boolean(
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim() ||
    localStorage.getItem('disastershield_google_maps_key')
  );

  const [engine, setEngine] = useState<'leaflet' | 'google'>(() => {
    if (defaultEngine) return defaultEngine;
    return hasGoogleKey ? 'google' : 'leaflet';
  });

  // Filtered list
  const filteredIncidents = incidents.filter((inc) => {
    if (filterType === 'all') return true;
    if (filterType === 'critical') return inc.priority === 'critical';
    return inc.disasterType === filterType;
  });

  // If engine is Google Maps, render GoogleEmergencyMap
  if (engine === 'google') {
    return (
      <div className={`relative ${className}`}>
        <GoogleEmergencyMap
          incidents={filteredIncidents}
          selectedIncidentId={selectedIncidentId}
          onIncidentClick={handleSelect}
          height={height}
          onSwitchToLeaflet={() => setEngine('leaflet')}
        />
      </div>
    );
  }

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
      const lat = incident.lat || incident.location.latitude;
      const lng = incident.lng || incident.location.longitude;
      const isSelected = selectedIncidentId === incident.id;
      const sev = severityColors[incident.priority] || severityColors.medium;
      const emoji = disasterEmoji[incident.disasterType] || '⚠️';

      // Custom Glowing Pulsing Marker HTML
      const iconHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
          <!-- Outer Ping Shockwave (for Critical & High priority) -->
          ${
            incident.priority === 'critical'
              ? `<div class="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-rose-500/40 animate-ping"></div>`
              : incident.priority === 'high'
              ? `<div class="absolute -top-0.5 -left-0.5 w-8 h-8 rounded-full bg-amber-500/30 animate-pulse"></div>`
              : ''
          }

          <!-- Pin Body -->
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full border-2 shadow-md transition-transform hover:scale-125 ${
            isSelected
              ? 'ring-4 ring-[#003366] border-white scale-110'
              : 'border-white'
          }" style="background-color: ${sev.pinBg};">
            <span class="text-xs select-none drop-shadow-xs">${emoji}</span>
          </div>

          <!-- Pin Pointer Tip -->
          <div class="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-5 border-transparent" style="border-t-color: ${sev.pinBg};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-emergency-marker',
        html: iconHtml,
        iconSize: [28, 34],
        iconAnchor: [14, 34],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Professional Situation Dossier Popup
      const popupHtml = `
        <div class="p-3 text-xs text-slate-800 min-w-[210px] font-sans">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span class="font-mono text-[10px] font-bold text-[#003366]">${incident.trackingId}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style="background-color: ${sev.bg}; color: ${sev.text}; border: 1px solid ${sev.border};">
              ${incident.priority}
            </span>
          </div>
          <h4 class="font-bold text-slate-900 mt-2 text-xs leading-snug">${incident.title}</h4>
          <p class="text-slate-500 text-[11px] mt-1 flex items-center gap-1">
            📍 ${incident.location.area}
          </p>
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span class="font-semibold text-slate-700">${incident.peopleAffected} Impacted</span>
            <span class="text-slate-400">${timeAgo(incident.createdAt)}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-leaflet-popup',
        closeButton: false,
      });

      marker.on('click', () => {
        if (handleSelect) handleSelect(incident);
      });

      markersRef.current[incident.id] = marker;
    });
  }, [filteredIncidents, selectedIncidentId, handleSelect]);

  // Center on Selected Incident
  useEffect(() => {
    if (!selectedIncidentId || !mapInstanceRef.current) return;
    const selected = incidents.find((i) => i.id === selectedIncidentId);
    if (selected) {
      const lat = selected.lat || selected.location.latitude;
      const lng = selected.lng || selected.location.longitude;
      mapInstanceRef.current.flyTo([lat, lng], 8, { duration: 1.2 });
      setTimeout(() => {
        markersRef.current[selected.id]?.openPopup();
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

          {/* Engine Switcher to Google Maps */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <Button
              size="sm"
              onClick={() => setEngine('google')}
              className="bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-md text-xs font-bold rounded-xl cursor-pointer gap-1.5 h-8 px-3"
            >
              <Key className="h-3.5 w-3.5 text-blue-600" />
              <span>Google Maps Mode</span>
            </Button>
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
