import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Flame,
  AlertTriangle,
  Users,
  MapPin,
  Compass,
  Sparkles
} from 'lucide-react';
import { Incident } from '@/types';
import { priorityConfig, disasterTypeLabels } from '@/data/incidents';

interface Geospatial3DMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onIncidentClick?: (incident: Incident) => void;
  height?: string;
}

export function Geospatial3DMap({
  incidents,
  selectedIncidentId,
  onIncidentClick,
  height = '540px',
}: Geospatial3DMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // References for animation & cleanup
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const pillarsRef = useRef<{ mesh: THREE.Mesh; beacon: THREE.Mesh; incident: Incident }[]>([]);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Coordinate mapping helper: Lat/Lng -> 3D X/Z on terrain
  // Centered around India coordinates roughly: Lat 21.0, Lng 78.0
  const latLngTo3D = (lat: number, lng: number): { x: number; z: number } => {
    const centerLat = 22.0;
    const centerLng = 78.5;
    const scale = 5.2;
    const x = (lng - centerLng) * scale;
    const z = -(lat - centerLat) * scale;
    return { x, z };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06111f); // Deep institutional command navy
    scene.fog = new THREE.FogExp2(0x06111f, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.5, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 48, 62);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(30, 60, 40);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.PointLight(0x0066cc, 2.5, 150);
    blueRimLight.position.set(-40, 30, -30);
    scene.add(blueRimLight);

    // 5. Topographical 3D Terrain
    const terrainSize = 100;
    const terrainSegments = 45;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    // Generate gentle elevation noise on vertices
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      // Dual-frequency elevation calculation
      const dist = Math.sqrt(vx * vx + vz * vz);
      const elev =
        Math.sin(vx * 0.12) * Math.cos(vz * 0.12) * 2.2 +
        Math.sin(vx * 0.28 + vz * 0.15) * 1.1 -
        Math.max(0, (dist - 35) * 0.08);
      posAttr.setY(i, elev);
    }
    terrainGeo.computeVertexNormals();

    // Solid base terrain material
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x002244,
      roughness: 0.7,
      metalness: 0.2,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Wireframe grid lines on top of terrain
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x004488,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
    wireframeMesh.position.y = 0.08;
    scene.add(wireframeMesh);

    // Coordinate Ring Base
    const ringBaseGeo = new THREE.RingGeometry(48, 48.4, 64);
    ringBaseGeo.rotateX(-Math.PI / 2);
    const ringBaseMat = new THREE.MeshBasicMaterial({ color: 0xff9933, side: THREE.DoubleSide, opacity: 0.4, transparent: true });
    const ringBase = new THREE.Mesh(ringBaseGeo, ringBaseMat);
    ringBase.position.y = -0.5;
    scene.add(ringBase);

    // 6. Volumetric Glowing Markers Group
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    scene.add(markersGroup);

    const pillars: { mesh: THREE.Mesh; beacon: THREE.Mesh; incident: Incident }[] = [];
    const rings: THREE.Mesh[] = [];

    incidents.forEach((inc) => {
      const { x, z } = latLngTo3D(inc.lat || inc.location.latitude, inc.lng || inc.location.longitude);

      // Color mapping
      let colorHex = 0xff9933; // orange default
      if (inc.priority === 'critical') colorHex = 0xef4444;
      else if (inc.priority === 'high') colorHex = 0xf97316;
      else if (inc.priority === 'medium') colorHex = 0xf59e0b;
      else if (inc.priority === 'low') colorHex = 0x10b981;

      const heightVol = inc.priority === 'critical' ? 14 : inc.priority === 'high' ? 10 : 7;
      const radiusVol = inc.priority === 'critical' ? 1.0 : 0.7;

      // Volumetric Glowing Cylinder
      const cylGeo = new THREE.CylinderGeometry(radiusVol * 0.4, radiusVol, heightVol, 16);
      const cylMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      cylMesh.position.set(x, heightVol / 2, z);
      cylMesh.userData = { incident: inc };
      markersGroup.add(cylMesh);

      // Sky Laser Beam (thin high-altitude laser)
      const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 40, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.5,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(x, heightVol + 20, z);
      markersGroup.add(beamMesh);

      // Summit Floating Beacon Diamond
      const beaconGeo = new THREE.OctahedronGeometry(radiusVol * 1.2, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: colorHex,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(x, heightVol + 1.2, z);
      markersGroup.add(beaconMesh);

      pillars.push({ mesh: cylMesh, beacon: beaconMesh, incident: inc });

      // Ground Pulsing Shockwave Ring
      const ringGeo = new THREE.RingGeometry(0.8, radiusVol * 3.5, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, 0.15, z);
      markersGroup.add(ringMesh);
      rings.push(ringMesh);
    });

    pillarsRef.current = pillars;
    ringsRef.current = rings;

    // 7. Interactive Mouse Controls & Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngle = 0;
    let cameraPitch = 0.65;
    let cameraRadius = 80;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / heightPx) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        cameraAngle -= deltaX * 0.008;
        cameraPitch = Math.max(0.2, Math.min(1.4, cameraPitch + deltaY * 0.008));
        return;
      }

      // Raycasting for Tooltip Hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(pillars.map((p) => p.mesh));

      if (intersects.length > 0) {
        const found = intersects[0].object.userData.incident as Incident;
        setHoveredIncident(found);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setHoveredIncident(null);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRadius = Math.max(35, Math.min(130, cameraRadius + e.deltaY * 0.05));
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / heightPx) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(pillars.map((p) => p.mesh));

      if (intersects.length > 0 && onIncidentClick) {
        const target = intersects[0].object.userData.incident as Incident;
        onIncidentClick(target);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cinematic auto-rotation
      if (autoRotateRef.current && !isDragging) {
        cameraAngle += 0.003;
      }

      // Update camera position from spherical coords
      camera.position.x = Math.sin(cameraAngle) * Math.cos(cameraPitch) * cameraRadius;
      camera.position.y = Math.sin(cameraPitch) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * Math.cos(cameraPitch) * cameraRadius;
      camera.lookAt(0, 2, 0);

      // Animate shockwave rings (pulsing scale and opacity)
      rings.forEach((ring, idx) => {
        const pulse = (elapsedTime * 1.5 + idx * 0.4) % 1;
        const scale = 1 + pulse * 1.8;
        ring.scale.set(scale, scale, 1);
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = Math.max(0, 0.8 * (1 - pulse));
        }
      });

      // Spin top beacon diamonds
      pillars.forEach(({ beacon }) => {
        beacon.rotation.y += 0.025;
        beacon.rotation.z += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
    };
  }, [incidents, onIncidentClick]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#06111f] border border-slate-700 shadow-md select-none" style={{ height }}>
      {/* 3D Canvas Mounting Node */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white pointer-events-auto shadow-sm">
          <Layers className="h-4 w-4 text-[#FF9933]" />
          <span className="text-xs font-bold tracking-wide uppercase">3D WebGL Geospatial Terrain</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
            LiDAR Mesh
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer shadow-sm ${
              autoRotate
                ? 'bg-[#003366] text-white border-blue-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Coordinates & Legend Strip */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none text-[11px] text-slate-300">
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-xs" /> Critical Pillar
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High Urgency
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Low / Monitored
          </span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 pointer-events-auto text-slate-400">
          <span>Drag to rotate 3D angle &bull; Scroll to zoom altitude &bull; Click pillar to inspect</span>
        </div>
      </div>

      {/* Interactive Raycasting Hover Tooltip */}
      {hoveredIncident && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/80 text-white shadow-2xl space-y-1 w-64 -translate-x-1/2 -translate-y-full -mt-3"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-300">
              {hoveredIncident.trackingId}
            </span>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                hoveredIncident.priority === 'critical'
                  ? 'bg-rose-900 text-rose-200'
                  : 'bg-amber-900 text-amber-200'
              }`}
            >
              {hoveredIncident.priority}
            </span>
          </div>

          <p className="text-xs font-bold text-white line-clamp-1">{hoveredIncident.title}</p>

          <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sector:</span>
              <span className="font-semibold text-slate-200">{hoveredIncident.location.area}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Casualties / Impact:</span>
              <span className="font-bold text-amber-300">{hoveredIncident.peopleAffected} citizens</span>
            </div>
          </div>
          <p className="text-[9px] text-amber-400 font-semibold pt-0.5 text-center">
            Click marker to inspect incident dossier &rarr;
          </p>
        </div>
      )}
    </div>
  );
}
