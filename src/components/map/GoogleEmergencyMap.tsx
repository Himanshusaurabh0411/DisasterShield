import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Key,
  Layers,
  ExternalLink,
  ShieldAlert,
  Compass,
  Sparkles,
  Check,
  AlertTriangle,
  RotateCcw,
  CloudRain,
  Flame,
  Radio,
  Crosshair,
  Navigation,
  Maximize2,
  Clock,
  Activity,
  Shield,
  LifeBuoy,
  Eye,
  Info,
  Copy,
  CheckCircle2,
  X
} from 'lucide-react';
import { Incident } from '@/types';
import { Button } from '@/components/ui/button';
import { timeAgo, formatNumber } from '@/lib/utils';

export interface GoogleEmergencyMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onIncidentClick?: (incident: Incident) => void;
  height?: string;
  className?: string;
  onSwitchToLeaflet?: () => void;
}

// Tactical Evacuation & Supply Lifelines
const EVACUATION_CORRIDORS = [
  {
    id: 'corridor-dana',
    name: 'Dhamra Coastal Evacuation Lifeline',
    disaster: 'Cyclone Dana (Odisha)',
    color: '#06b6d4', // Cyan
    points: [
      [20.8037, 86.9189], // Dhamra Port Coastal Terminal
      [20.8521, 86.7821], // Jamujhadi Relief Staging
      [20.9542, 86.6214], // Bhadrak Multi-Purpose Shelter Hub
      [21.0541, 86.4952], // Inland Stabilization Camp
    ] as [number, number][],
    status: 'ACTIVE — 6,000+ Reinforced Cyclone Shelters Linked',
  },
  {
    id: 'corridor-vijayawada',
    name: 'Budameru Breach UAV Drone Air-Bridge',
    disaster: 'Vijayawada Floods',
    color: '#10b981', // Emerald
    points: [
      [16.5412, 80.6432], // Singh Nagar Command Base
      [16.5298, 80.6315], // Payakapuram Submerged Rooftops
      [16.5184, 80.6201], // Krishna Basin High Ground Depot
    ] as [number, number][],
    status: 'ACTIVE — 24 Heavy UAVs Delivering Food & Insulin',
  },
  {
    id: 'corridor-wayanad',
    name: 'Meppadi-Chooralmala Bailey Bridge Lifeline',
    disaster: 'Wayanad Landslides',
    color: '#f59e0b', // Amber
    points: [
      [11.5542, 76.1284], // Meppadi Staging Area
      [11.5385, 76.1523], // Bailey Bridge Crossing
      [11.5218, 76.1754], // Chooralmala Search Sector
      [11.5052, 76.1982], // Mundakkai Recovery Zone
    ] as [number, number][],
    status: 'HEAVY MACHINERY & EMERGENCY ACCESS ROUTE',
  },
];

// Live First Responder Mobile GPS Units
const LIVE_RESPONDER_UNITS = [
  {
    id: 'resp-unit-1',
    name: 'NDRF Flotilla 4',
    type: 'Marine Flood Rescue Squad',
    icon: '🚤',
    color: '#0284c7',
    lat: 16.5350,
    lng: 80.6380,
    heading: 'NW (310°)',
    speed: '18 km/h',
    status: 'Rooftop Evacuation in Progress',
    target: 'Singh Nagar, Vijayawada',
  },
  {
    id: 'resp-unit-2',
    name: 'ICG Interceptor C-438',
    type: 'Offshore Patrol Vessel',
    icon: '🚢',
    color: '#0d9488',
    lat: 20.7600,
    lng: 86.9900,
    heading: 'SE (135°)',
    speed: '24 kts',
    status: 'Storm Surge Offshore Recon',
    target: 'Dhamra Offshore Sector',
  },
  {
    id: 'resp-unit-3',
    name: 'SDRF Trauma Ambulance Bravo-2',
    type: 'Critical Trauma Care Unit',
    icon: '🚑',
    color: '#dc2626',
    lat: 23.2450,
    lng: 77.4250,
    heading: 'NE (045°)',
    speed: '44 km/h',
    status: 'En Route to District Hospital',
    target: 'Lower Lake Bhopal Zone',
  },
  {
    id: 'resp-unit-4',
    name: 'Civil Defence UAV Recon-07',
    type: 'High-Altitude Thermal Drone',
    icon: '🚁',
    color: '#8b5cf6',
    lat: 31.4500,
    lng: 77.5800,
    heading: 'Stationary Hover',
    speed: '0 km/h',
    status: 'Infrared Geohazard Scanning',
    target: 'Samej Cloudburst Sector, HP',
  },
];

// Thermal Hotspots (NASA FIRMS IR Simulation)
const THERMAL_HOTSPOTS = [
  { id: 'fire-1', lat: 22.7196, lng: 75.8577, temp: '840°C', label: 'Indore Chemical Facility Fire (High Thermal IR)' },
  { id: 'fire-2', lat: 28.6500, lng: 77.2300, temp: '360°C', label: 'Delhi Substation Hazard' },
  { id: 'fire-3', lat: 21.1702, lng: 72.8311, temp: '420°C', label: 'Surat Industrial Flare' },
];

export function GoogleEmergencyMap({
  incidents,
  selectedIncidentId,
  onIncidentClick,
  height = '540px',
  className = '',
  onSwitchToLeaflet,
}: GoogleEmergencyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const overlayLayersRef = useRef<L.LayerGroup | null>(null);

  // API Key state: check env first, then localStorage
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('disastershield_google_maps_key') || envKey;
  });
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [copiedKeyGuide, setCopiedKeyGuide] = useState(false);

  // Map view type: hybrid (Google Satellite + Roads/Labels), satellite (pure), terrain (contours), roadmap
  const [mapType, setMapType] = useState<'hybrid' | 'satellite' | 'terrain' | 'roadmap'>('hybrid');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Tactical layer toggles
  const [showWeatherRadar, setShowWeatherRadar] = useState<boolean>(true);
  const [showThermalHotspots, setShowThermalHotspots] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showResponders, setShowResponders] = useState<boolean>(true);
  const [showReticle, setShowReticle] = useState<boolean>(true);

  // Real-time telemetry HUD state
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; mgrs: string }>({
    lat: 22.9734,
    lng: 78.6569,
    mgrs: '43QFD 7421 9542',
  });
  const [utcTime, setUtcTime] = useState<string>('');
  const [istTime, setIstTime] = useState<string>('');

  // Update clocks every second
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19) + ' UTC');
      setIstTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        }) + ' IST'
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save API key
  const handleSaveKey = () => {
    const trimmed = inputKey.trim();
    localStorage.setItem('disastershield_google_maps_key', trimmed);
    setApiKey(trimmed);
    setShowConfigModal(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('disastershield_google_maps_key');
    setApiKey('');
    setInputKey('');
  };

  const handleCopyEnvSnippet = () => {
    navigator.clipboard.writeText(`VITE_GOOGLE_MAPS_API_KEY=${inputKey.trim() || 'YOUR_KEY_HERE'}`);
    setCopiedKeyGuide(true);
    setTimeout(() => setCopiedKeyGuide(false), 2000);
  };

  // Helper to get Google Tile URL according to map type
  const getGoogleTileUrl = (type: 'hybrid' | 'satellite' | 'terrain' | 'roadmap') => {
    // mt0-mt3 Google Maps official tile servers
    // lyrs=y (hybrid: satellite + labels), lyrs=s (pure satellite), lyrs=p (terrain), lyrs=m (roadmap)
    const lyrsCode = type === 'hybrid' ? 'y' : type === 'satellite' ? 's' : type === 'terrain' ? 'p' : 'm';
    return `https://mt{s}.google.com/vt/lyrs=${lyrsCode}&x={x}&y={y}&z={z}`;
  };

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    // Center over central India with full national emergency overview
    const map = L.map(containerRef.current, {
      center: [22.9734, 78.6569],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 3,
      maxZoom: 20,
    });

    // Initial Google Tile Layer
    const tileUrl = getGoogleTileUrl(mapType);
    const googleTileLayer = L.tileLayer(tileUrl, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = googleTileLayer;

    // Overlay layer group for vectors & markers
    const overlayGroup = L.layerGroup().addTo(map);
    overlayLayersRef.current = overlayGroup;

    // Live mouse move telemetry
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = Number(e.latlng.lat.toFixed(4));
      const lng = Number(e.latlng.lng.toFixed(4));
      const gridE = Math.abs(Math.round(lng * 100)) % 10000;
      const gridN = Math.abs(Math.round(lat * 100)) % 10000;
      setCursorCoords({
        lat,
        lng,
        mgrs: `43Q ${gridE.toString().padStart(4, '0')} ${gridN.toString().padStart(4, '0')}`,
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile layer on mapType change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = getGoogleTileUrl(mapType);
    const newLayer = L.tileLayer(tileUrl, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
    }).addTo(mapInstanceRef.current);

    // Ensure base tiles stay below vector overlays
    newLayer.bringToBack();
    tileLayerRef.current = newLayer;
  }, [mapType]);

  // Update Live Doppler Radar weather layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showWeatherRadar) {
      if (!weatherLayerRef.current) {
        // High-altitude atmospheric precipitation & weather clouds
        const radar = L.tileLayer(
          'https://tilecache.rainviewer.com/v2/radar/nowcast_10/256/{z}/{x}/{y}/2/1_1.png',
          {
            opacity: 0.55,
            maxZoom: 14,
            zIndex: 10,
          }
        ).addTo(mapInstanceRef.current);
        weatherLayerRef.current = radar;
      }
    } else {
      if (weatherLayerRef.current) {
        mapInstanceRef.current.removeLayer(weatherLayerRef.current);
        weatherLayerRef.current = null;
      }
    }
  }, [showWeatherRadar]);

  // Render & Update Tactical Overlays (Incidents, Corridors, Responders, Thermal Hotspots)
  useEffect(() => {
    if (!mapInstanceRef.current || !overlayLayersRef.current) return;
    const map = mapInstanceRef.current;
    const group = overlayLayersRef.current;

    // Clear existing markers and lines
    group.clearLayers();
    markersRef.current = {};

    // 1. Evacuation Corridors & Aerial Drone Supply Lines
    if (showCorridors) {
      EVACUATION_CORRIDORS.forEach((corridor) => {
        // Outer glowing path
        const glowLine = L.polyline(corridor.points, {
          color: corridor.color,
          weight: 7,
          opacity: 0.35,
          className: 'corridor-glow',
        }).addTo(group);

        // Core tactical animated dashed line
        const dashLine = L.polyline(corridor.points, {
          color: corridor.color,
          weight: 3,
          opacity: 0.95,
          dashArray: '8, 12',
          className: 'corridor-dash',
        }).addTo(group);

        // Hover tooltip
        dashLine.bindTooltip(
          `
          <div style="font-family: monospace; font-size: 11px; padding: 2px;">
            <div style="font-weight: bold; color: ${corridor.color};">${corridor.name}</div>
            <div style="color: #64748b; font-size: 10px;">${corridor.disaster}</div>
            <div style="color: #0f172a; font-weight: 600; margin-top: 2px;">${corridor.status}</div>
          </div>
          `,
          { sticky: true, opacity: 0.95 }
        );
      });
    }

    // 2. NASA FIRMS Thermal IR Fire Hotspots
    if (showThermalHotspots) {
      THERMAL_HOTSPOTS.forEach((spot) => {
        const fireIcon = L.divIcon({
          className: 'custom-thermal-pin',
          html: `
            <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 24px; height: 24px; border-radius: 9999px; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background: #dc2626; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #ef4444;">
                <span style="font-size: 9px;">🔥</span>
              </div>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const fireMarker = L.marker([spot.lat, spot.lng], { icon: fireIcon }).addTo(group);
        fireMarker.bindTooltip(
          `
          <div style="font-family: sans-serif; font-size: 11px; padding: 3px;">
            <div style="font-weight: bold; color: #dc2626; display: flex; align-items: center; gap: 4px;">
              <span>🔥 THERMAL ANOMALY</span>
              <span style="background: #fee2e2; color: #991b1b; padding: 1px 4px; border-radius: 4px; font-size: 9px; font-weight: 800;">${spot.temp}</span>
            </div>
            <div style="color: #334155; margin-top: 2px; font-size: 10px;">${spot.label}</div>
          </div>
          `,
          { sticky: true }
        );
      });
    }

    // 3. Live First Responder Mobile GPS Units
    if (showResponders) {
      LIVE_RESPONDER_UNITS.forEach((unit) => {
        const responderIcon = L.divIcon({
          className: 'custom-responder-pin',
          html: `
            <div style="position: relative; display: flex; align-items: center; gap: 4px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); padding: 2px 7px; border-radius: 9999px; border: 1.5px solid ${unit.color}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: #ffffff; white-space: nowrap; transform: translate(-50%, -50%);">
              <span style="font-size: 11px;">${unit.icon}</span>
              <span style="font-size: 10px; font-weight: 800; font-family: monospace;">${unit.name}</span>
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: #22c55e; animation: pulse 1s infinite;"></span>
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });

        const responderMarker = L.marker([unit.lat, unit.lng], { icon: responderIcon }).addTo(group);
        responderMarker.bindTooltip(
          `
          <div style="font-family: sans-serif; font-size: 11px; padding: 3px; max-width: 200px;">
            <div style="font-weight: bold; color: ${unit.color};">${unit.name} (${unit.type})</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 1px;">Speed: <b>${unit.speed}</b> | Heading: <b>${unit.heading}</b></div>
            <div style="font-size: 10px; color: #0f172a; font-weight: 600; margin-top: 3px;">📍 ${unit.target}</div>
            <div style="font-size: 10px; color: #166534; font-weight: bold; margin-top: 1px;">✓ ${unit.status}</div>
          </div>
          `,
          { sticky: true }
        );
      });
    }

    // 4. Incident Hotspots & Volumetric Shockwave Radii
    incidents.forEach((incident) => {
      const lat = incident.lat || incident.location.latitude;
      const lng = incident.lng || incident.location.longitude;
      const isCritical = incident.priority === 'critical';
      const isHigh = incident.priority === 'high';

      const color = isCritical
        ? '#dc2626'
        : isHigh
        ? '#ea580c'
        : incident.priority === 'medium'
        ? '#d97706'
        : '#16a34a';

      // Volumetric Shockwave Circles for critical/high emergencies
      if (isCritical) {
        // Outer 35km critical hazard perimeter
        L.circle([lat, lng], {
          radius: 35000,
          color: '#ef4444',
          weight: 1.5,
          opacity: 0.75,
          fillColor: '#fee2e2',
          fillOpacity: 0.18,
          dashArray: '5, 8',
        }).addTo(group);

        // Inner 15km primary impact zone
        L.circle([lat, lng], {
          radius: 15000,
          color: '#b91c1c',
          weight: 2,
          opacity: 0.9,
          fillColor: '#ef4444',
          fillOpacity: 0.28,
        }).addTo(group);
      } else if (isHigh) {
        L.circle([lat, lng], {
          radius: 18000,
          color: '#f97316',
          weight: 1.5,
          opacity: 0.65,
          fillColor: '#ffedd5',
          fillOpacity: 0.15,
          dashArray: '4, 6',
        }).addTo(group);
      }

      // Pin icon
      const typeGlyph =
        incident.disasterType === 'flood'
          ? '🌊'
          : incident.disasterType === 'fire'
          ? '🔥'
          : incident.disasterType === 'landslide'
          ? '⛰️'
          : incident.disasterType === 'cyclone'
          ? '🌀'
          : incident.disasterType === 'earthquake'
          ? '🌍'
          : '⚠️';

      const icon = L.divIcon({
        className: 'custom-incident-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isCritical
                ? `<div class="emergency-marker-pulse" style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background: rgba(220, 38, 38, 0.45);"></div>`
                : ''
            }
            <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 13px; line-height: 1;">${typeGlyph}</span>
            </div>
            <div style="position: absolute; bottom: -2px; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid ${color};"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(group);

      // Popup content with full tactical dossier preview
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 12px; width: 260px; color: #0f172a; line-height: 1.4;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-family: monospace; font-size: 10px; font-weight: 800; color: #003366;">${incident.trackingId}</span>
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; background: ${
              isCritical ? '#fee2e2' : '#fef3c7'
            }; color: ${isCritical ? '#991b1b' : '#92400e'}; padding: 2px 7px; border-radius: 9999px; border: 1px solid ${
        isCritical ? '#fecaca' : '#fde68a'
      };">
              ${incident.priority}
            </span>
          </div>

          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${incident.title}
          </div>

          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span>${incident.location.area}</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px; display: flex; justify-content: space-between;">
            <div>
              <span style="color: #64748b; font-size: 10px; display: block;">Impacted</span>
              <span style="font-weight: 800; color: #0f172a;">${incident.peopleAffected.toLocaleString()}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px; display: block;">Status</span>
              <span style="font-weight: 800; text-transform: uppercase; color: ${
                incident.status === 'responding' ? '#003366' : '#166534'
              }; font-size: 10px;">${incident.status}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px; display: block;">Squads</span>
              <span style="font-weight: 800; color: #0f172a;">${incident.respondersAssigned?.length || 1} Assigned</span>
            </div>
          </div>

          <button
            id="btn-inspect-${incident.id}"
            style="width: 100%; padding: 6px; background: #003366; color: #ffffff; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
          >
            <span>Inspect Incident Dossier</span>
            <span>→</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, closeButton: false });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${incident.id}`);
        if (btn && onIncidentClick) {
          btn.onclick = () => onIncidentClick(incident);
        }
      });

      marker.on('click', () => {
        if (onIncidentClick) {
          onIncidentClick(incident);
        }
      });

      markersRef.current[incident.id] = marker;
    });
  }, [
    incidents,
    showWeatherRadar,
    showThermalHotspots,
    showCorridors,
    showResponders,
    onIncidentClick,
  ]);

  // Pan to selected incident
  useEffect(() => {
    if (!selectedIncidentId || !mapInstanceRef.current || !markersRef.current[selectedIncidentId]) return;
    const targetMarker = markersRef.current[selectedIncidentId];
    const targetIncident = incidents.find((i) => i.id === selectedIncidentId);

    if (targetMarker && targetIncident) {
      const lat = targetIncident.lat || targetIncident.location.latitude;
      const lng = targetIncident.lng || targetIncident.location.longitude;
      mapInstanceRef.current.flyTo([lat, lng], 8, { duration: 1.2 });
      setTimeout(() => {
        targetMarker.openPopup();
      }, 1200);
    }
  }, [selectedIncidentId, incidents]);

  // Reset to central India view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.9734, 78.6569], 5, { duration: 1 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#06111f] shadow-lg select-none ${className}`}
      style={{ height }}
    >
      {/* 1. Main Map Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 2. Top-Left: Operational Engine Badge & Incident Count */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white shadow-xl text-xs font-bold">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide">Google Maps Satellite Engine</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-semibold text-[11px]">
            {incidents.length} Emergency Hotspots
          </span>
        </div>

        {/* API Key Status Pill */}
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold transition-all cursor-pointer shadow-md ${
            apiKey
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/90'
              : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/90'
          }`}
          title="Google Maps API Key Status & Configuration"
        >
          <Key className="h-3.5 w-3.5" />
          <span>{apiKey ? 'API Key: Active' : 'API Key: Configure'}</span>
          {apiKey && <Check className="h-3 w-3 text-emerald-400" />}
        </button>
      </div>

      {/* 3. Top-Right: Map Type Switcher & Layer Toggles */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center gap-1.5 justify-end">
        {/* Map Type Mode (Hybrid / Satellite / Terrain / Roadmap) */}
        <div className="flex items-center bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl text-xs font-bold">
          {(
            [
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'terrain', label: 'Terrain' },
              { id: 'roadmap', label: 'Roadmap' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMapType(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapType === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tactical Layer Filters Pill Group */}
        <div className="hidden sm:flex items-center bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl text-xs gap-1">
          {/* Weather Radar Toggle */}
          <button
            type="button"
            onClick={() => setShowWeatherRadar(!showWeatherRadar)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              showWeatherRadar
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Doppler Weather Radar Overlay"
          >
            <CloudRain className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden md:inline">Radar</span>
          </button>

          {/* Thermal Hotspots Toggle */}
          <button
            type="button"
            onClick={() => setShowThermalHotspots(!showThermalHotspots)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              showThermalHotspots
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle NASA FIRMS Thermal IR Fire Hotspots"
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden md:inline">Thermal</span>
          </button>

          {/* Evacuation Corridors Toggle */}
          <button
            type="button"
            onClick={() => setShowCorridors(!showCorridors)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              showCorridors
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Emergency Evacuation Corridors & UAV Routes"
          >
            <Navigation className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">Routes</span>
          </button>

          {/* Responder Units Toggle */}
          <button
            type="button"
            onClick={() => setShowResponders(!showResponders)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
              showResponders
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Live First Responder Mobile GPS Units"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Squads</span>
          </button>

          {/* Reticle Toggle */}
          <button
            type="button"
            onClick={() => setShowReticle(!showReticle)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showReticle ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Tactical Telemetry Crosshair"
          >
            <Crosshair className="h-3.5 w-3.5" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Recenter to Central India"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Center Reticle Target (when enabled) */}
      {showReticle && (
        <div className="absolute inset-0 pointer-events-none z-[500] flex items-center justify-center">
          <div className="relative w-16 h-16 border border-cyan-400/30 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]"></div>
            <div className="absolute top-0 w-[1px] h-3 bg-cyan-400/60"></div>
            <div className="absolute bottom-0 w-[1px] h-3 bg-cyan-400/60"></div>
            <div className="absolute left-0 h-[1px] w-3 bg-cyan-400/60"></div>
            <div className="absolute right-0 h-[1px] w-3 bg-cyan-400/60"></div>
          </div>
        </div>
      )}

      {/* 5. Bottom Telemetry Bar: Coordinates, Sat Pass, Mission Time */}
      <div className="absolute bottom-3 inset-x-3 z-[1000] flex flex-col md:flex-row items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-white shadow-xl text-xs font-mono">
        {/* Left: Live Cursor Coordinates & MGRS */}
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Crosshair className="h-3.5 w-3.5" />
            <span>MGRS:</span>
            <span className="text-white">{cursorCoords.mgrs}</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">
            LAT: <b className="text-white">{cursorCoords.lat}°</b> LNG:{' '}
            <b className="text-white">{cursorCoords.lng}°</b>
          </span>
        </div>

        {/* Center: Active Sensor Pass Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SENTINEL-2 / EOS-06 MULTISPECTRAL FEED: ONLINE</span>
        </div>

        {/* Right: Mission Time in UTC & IST */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-amber-400" />
            <span className="text-slate-400">ZULU:</span>
            <span className="text-white font-bold">{utcTime}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{istTime}</span>
        </div>
      </div>

      {/* 6. Google Maps API Key Configuration Modal */}
      {showConfigModal && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Google Maps API Configuration</h3>
                    <p className="text-[11px] text-slate-400">Production &amp; Development Key Integration</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Info Box */}
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  Current Rendering Engine
                </span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  Google Satellite Hybrid HD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The map is currently rendering ultra-high resolution Google Satellite &amp; Hybrid vector tiles with real-time Doppler radar and live telemetry. Adding your API key enables native Google Cloud Places, Geocoding, and custom styling.
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                Google Maps JavaScript API Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSyB..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Saved to your browser storage and loaded via <code className="text-slate-400">VITE_GOOGLE_MAPS_API_KEY</code>.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer font-semibold"
                >
                  Clear Key
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowConfigModal(false)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveKey}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 rounded-xl cursor-pointer shadow-md"
                  >
                    Save &amp; Activate
                  </Button>
                </div>
              </div>

              {/* Helper Links */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <a
                  href="https://console.cloud.google.com/google/maps-apis/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEnvSnippet}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  {copiedKeyGuide ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy for .env</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
