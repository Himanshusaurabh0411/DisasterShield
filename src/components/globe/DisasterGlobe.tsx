import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Clock, X, AlertTriangle, Shield, Activity } from 'lucide-react';
import { priorityConfig, disasterTypeLabels } from '@/data/incidents';
import { Incident } from '@/types';
import { timeAgo, formatNumber } from '@/lib/utils';
import { GlobeFallback } from './GlobeFallback';
import { createEarthTexture } from './earthTexture';
import { ConnectionArcs } from './ConnectionArcs';

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// Earth Sphere with Natural Continents & Subtle Atmospheric Glow
function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthTexture = useMemo(() => createEarthTexture(), []);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group>
      {/* 1. Main Globe with Texture */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
          emissive="#003366"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* 2. Soft Atmospheric Halo */}
      <mesh>
        <sphereGeometry args={[2.08, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Incident pin marker
interface MarkerProps {
  incident: Incident;
  onHover: (incident: Incident | null) => void;
  onClick: (incident: Incident) => void;
}

function IncidentMarker({ incident, onHover, onClick }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const pos = latLngToVec3(incident.lat, incident.lng, 2.03);
  const cfg = priorityConfig[incident.priority];
  const color = cfg.color;

  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + incident.lat) * 0.35;
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 - scale * 0.2);
    }
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(hovered ? 1.5 : pulse);
    }
  });

  return (
    <group position={pos}>
      {/* Outward pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.035, 0.065, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Solid Marker Pin */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          onHover(incident);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(incident);
        }}
      >
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function Scene({
  incidents,
  onIncidentClick,
}: {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
}) {
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 4, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-6, -3, -5]} intensity={0.4} color="#38bdf8" />
      <pointLight position={[0, 6, 0]} intensity={0.3} color="#93c5fd" />

      {/* Globe */}
      <EarthMesh />

      {/* Telemetry connection arcs */}
      <ConnectionArcs />

      {/* Incident markers */}
      {incidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          onHover={setHoveredIncident}
          onClick={onIncidentClick}
        />
      ))}

      {/* Marker Tooltip */}
      {hoveredIncident && (
        <Html
          position={latLngToVec3(hoveredIncident.lat, hoveredIncident.lng, 2.2)}
          style={{ pointerEvents: 'none' }}
        >
          <div className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xl whitespace-nowrap flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: priorityConfig[hoveredIncident.priority].color }}
            />
            <span className="font-bold">{hoveredIncident.title}</span>
            <span className="text-slate-500 text-[11px]">({hoveredIncident.location.area})</span>
          </div>
        </Html>
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
        minDistance={3.2}
        maxDistance={6.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}

interface Props {
  incidents: Incident[];
  onIncidentClick?: (incident: Incident) => void;
  className?: string;
}

export function DisasterGlobe({ incidents, onIncidentClick, className = '' }: Props) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const handleMarkerClick = (incident: Incident) => {
    setSelectedIncident(incident);
    onIncidentClick?.(incident);
  };

  if (hasWebGLError) {
    return <GlobeFallback incidents={incidents} onIncidentClick={onIncidentClick} />;
  }

  return (
    <div className={`relative w-full h-full min-h-[380px] select-none ${className}`}>
      {/* Top Left Severity Legend */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 rounded-md border border-slate-300 bg-white/95 p-3 shadow-md">
        <span className="text-[11px] font-bold tracking-wider text-[#003366] uppercase">
          Triage Priority Legend
        </span>
        {[
          { label: 'Critical Incident', color: '#dc2626' },
          { label: 'High Priority', color: '#ea580c' },
          { label: 'Warning Advisory', color: '#ca8a04' },
          { label: 'Resolved Case', color: '#16a34a' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-slate-700 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Top Right Live Telemetry Badge */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
        <span className="rounded-md border border-slate-300 bg-white/95 px-3 py-1 text-xs font-bold text-[#003366] tracking-normal flex items-center gap-1.5 shadow-sm">
          <Activity className="h-3.5 w-3.5 text-[#003366]" />
          GIS Incident Projection
        </span>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
        onError={() => setHasWebGLError(true)}
      >
        <Suspense fallback={null}>
          <Scene incidents={incidents} onIncidentClick={handleMarkerClick} />
        </Suspense>
      </Canvas>

      {/* Selected Incident Card */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-20 rounded-md border border-slate-300 bg-white p-4 shadow-2xl space-y-3 text-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 uppercase">
                  {selectedIncident.priority}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {disasterTypeLabels[selectedIncident.disasterType]}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedIncident.title}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                {selectedIncident.location.area}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Affected</span>
                <span className="font-bold text-slate-900">{formatNumber(selectedIncident.peopleAffected)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Reported</span>
                <span className="text-slate-700 font-semibold">{timeAgo(selectedIncident.createdAt)}</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  onIncidentClick?.(selectedIncident);
                }}
                className="w-full py-2 rounded-md bg-[#003366] hover:bg-[#0A2540] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                Inspect Incident Dossier &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
