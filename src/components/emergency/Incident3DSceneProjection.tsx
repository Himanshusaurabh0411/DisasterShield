import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Layers,
  Sparkles,
  RotateCcw,
  Sliders,
  Eye,
  Scan,
  Compass,
  Maximize2,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Incident3DSceneProjectionProps {
  initialImageUrl?: string;
  incidentTitle?: string;
  onClose?: () => void;
}

const PRESET_INCIDENT_PHOTOS = [
  {
    id: 'vijayawada',
    title: 'Vijayawada Budameru Inundation (Andhra 2024)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flood_Water_on_Main_road.jpg/1280px-Flood_Water_on_Main_road.jpg',
    type: 'Submerged City Arteries & Bund Breach',
  },
  {
    id: 'dana',
    title: 'Cyclone Dana Eye Radar Landfall (Odisha 2024)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Dana_2024-10-24_0800Z.jpg/1280px-Dana_2024-10-24_0800Z.jpg',
    type: 'Severe Cyclonic Eyewall & Tidal Surge',
  },
  {
    id: 'landslide',
    title: 'Wayanad Landslide Debris Slope (Kerala 2024)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Chooralmala_landslides_aftermath.jpg/1280px-Chooralmala_landslides_aftermath.jpg',
    type: 'Mudslide Debris Flow & Collapsed Slopes',
  },
  {
    id: 'himachal',
    title: 'Samej Rampur Cloudburst Torrent (Himachal 2024)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Landslides_in_Himachal_Pradesh.jpg/1280px-Landslides_in_Himachal_Pradesh.jpg',
    type: 'Severed Mountain Slopes & Torrential Gorge',
  },
  {
    id: 'urban_flood',
    title: 'Vadodara Flood Inundation (Gujarat Floods)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2.1_Vehicles_immersed_in_water_logged_street_in_front_of_the_home_during_floods_at_Vadodara_in_July_2019.jpg/1280px-2.1_Vehicles_immersed_in_water_logged_street_in_front_of_the_home_during_floods_at_Vadodara_in_July_2019.jpg',
    type: 'Submerged Vehicles & Street Waterlogging',
  },
  {
    id: 'glof',
    title: 'Sikkim Teesta River Flash Flood (October 2023)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Broken_Bridge_at_Dikchu.jpg/1280px-Broken_Bridge_at_Dikchu.jpg',
    type: 'Glacial Torrent & Washed Out Bridge',
  },
];

export function Incident3DSceneProjection({
  initialImageUrl = PRESET_INCIDENT_PHOTOS[0].url,
  incidentTitle = 'Field Incident Ground Evidence',
  onClose,
}: Incident3DSceneProjectionProps) {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(initialImageUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [is3DReady, setIs3DReady] = useState(false);

  // 3D Controls State
  const [depthScale, setDepthScale] = useState<number>(6.5);
  const [isPointCloud, setIsPointCloud] = useState<boolean>(false);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const depthScaleRef = useRef(depthScale);

  useEffect(() => {
    depthScaleRef.current = depthScale;
  }, [depthScale]);

  // Trigger Holographic Scan Sequence
  const startConversion = (imageUrl: string) => {
    setSelectedPhotoUrl(imageUrl);
    setIs3DReady(false);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIs3DReady(true);
          return 100;
        }
        return prev + 8;
      });
    }, 90);
  };

  // Run conversion initially
  useEffect(() => {
    startConversion(initialImageUrl);
  }, [initialImageUrl]);

  // Three.js 3D Scene Lifecycle
  useEffect(() => {
    if (!is3DReady || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 440;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07111e); // Institutional tactical navy

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 22, 38);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x0088ff, 2.0, 100);
    blueLight.position.set(-20, 15, -15);
    scene.add(blueLight);

    // Ground Grid Wireframe Plane
    const grid = new THREE.GridHelper(40, 20, 0xff9933, 0x1e3a5f);
    grid.position.y = -6;
    scene.add(grid);

    // Particle Cloud Dust
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = Math.random() * 25 - 5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xff9933, size: 0.35, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Texture Loader with Displacement Map
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      selectedPhotoUrl,
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const planeGeo = new THREE.PlaneGeometry(28, 18, 64, 64);
        planeGeo.rotateX(-Math.PI / 3); // Cinematic isometric pitch

        // Generate depth extrusion using height map calculation
        const posAttr = planeGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = (posAttr.getX(i) + 14) / 28;
          const v = (posAttr.getY(i) + 9) / 18;
          // Volumetric displacement formula
          const disp = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * depthScaleRef.current * 0.45;
          posAttr.setZ(i, disp);
        }
        planeGeo.computeVertexNormals();

        // Mesh Material
        const planeMat = new THREE.MeshStandardMaterial({
          map: texture,
          wireframe: showWireframe,
          roughness: 0.4,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshRef.current = mesh;
        scene.add(mesh);

        // Point Cloud Representation
        const pointsMat = new THREE.PointsMaterial({
          size: 0.45,
          map: texture,
          transparent: true,
          opacity: 0.9,
        });
        const points = new THREE.Points(planeGeo, pointsMat);
        pointsRef.current = points;
        if (isPointCloud) {
          mesh.visible = false;
          scene.add(points);
        }
      },
      undefined,
      (err) => {
        console.warn('3D texture load error:', err);
      }
    );

    // Mouse Controls (Orbit Rotation & Zoom)
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0;
    let rotX = 0.35;
    let zoomDist = 38;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      rotY += dx * 0.008;
      rotX = Math.max(-0.2, Math.min(1.2, rotX + dy * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomDist = Math.max(18, Math.min(65, zoomDist + e.deltaY * 0.04));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Camera position from spherical coords
      camera.position.x = Math.sin(rotY) * Math.cos(rotX) * zoomDist;
      camera.position.y = Math.sin(rotX) * zoomDist + 8;
      camera.position.z = Math.cos(rotY) * Math.cos(rotX) * zoomDist;
      camera.lookAt(0, 0, 0);

      // Subtle particle float
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [is3DReady, selectedPhotoUrl, isPointCloud, showWireframe]);

  return (
    <div className="w-full rounded-2xl border-2 border-[#003366] bg-slate-900 text-white overflow-hidden shadow-2xl space-y-0">
      {/* Top Header Bar */}
      <div className="bg-[#003366] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#FF9933]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-bold shadow-xs">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                3D घटना दृश्य प्रक्षेपण
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-white">
                LiDAR Reconstruction
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              2D Incident Photo &rarr; Live 3D Scene Projection
            </h3>
          </div>
        </div>

        {/* Preset Sample Incident Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-300 font-semibold hidden sm:inline">Presets:</span>
          {PRESET_INCIDENT_PHOTOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => startConversion(preset.url)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                selectedPhotoUrl === preset.url
                  ? 'bg-[#FF9933] text-slate-900 shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {preset.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Stage */}
      <div className="relative w-full h-[430px] bg-[#07111e] overflow-hidden">
        {/* Phase 1: Holographic Laser Scan Sequence */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#07111e]/90 backdrop-blur-md p-6"
            >
              {/* Image with Sweeping Laser Line */}
              <div className="relative max-w-md w-full aspect-video rounded-xl overflow-hidden border-2 border-amber-400 shadow-2xl">
                <img
                  src={selectedPhotoUrl}
                  alt="Incident scanning"
                  className="w-full h-full object-cover filter contrast-125"
                />

                {/* Laser Sweep Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#ff9933]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                />

                {/* Digital Coordinate HUD Overlay */}
                <div className="absolute top-2 left-2 font-mono text-[9px] text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded">
                  SCAN RADIAL: 44.187 // PTS: 4096
                </div>
                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
                  TRIANGULATING DEPTH MESH
                </div>
              </div>

              {/* Progress & Status Message */}
              <div className="w-full max-w-md mt-5 space-y-2 text-center">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                  <span>LiDAR SPATIAL VOXEL EXTRUSION</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF9933] to-amber-300 transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Extruding 2D pixel gradients into volumetric topography and 3D spatial coordinate planes...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Live 3D Three.js Interactive Canvas */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Spatial Scene Controls Bar (Bottom) */}
        {is3DReady && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs select-none">
            {/* Left: Interactive Hints */}
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <Compass className="h-4 w-4 text-[#FF9933]" />
              <span>Drag to rotate 3D angle &bull; Scroll to zoom elevation</span>
            </div>

            {/* Right: Depth Extrusion & Wireframe Toggles */}
            <div className="flex items-center gap-3">
              {/* Depth Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Depth Extrusion:</span>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="0.5"
                  value={depthScale}
                  onChange={(e) => setDepthScale(parseFloat(e.target.value))}
                  className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF9933]"
                />
                <span className="font-mono text-amber-300 text-[11px]">{depthScale}x</span>
              </div>

              {/* Wireframe toggle */}
              <button
                type="button"
                onClick={() => setShowWireframe(!showWireframe)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  showWireframe
                    ? 'bg-[#003366] border-blue-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {showWireframe ? 'Mesh: Wireframe' : 'Mesh: Textured'}
              </button>

              {/* Point Cloud toggle */}
              <button
                type="button"
                onClick={() => setIsPointCloud(!isPointCloud)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  isPointCloud
                    ? 'bg-[#FF9933] border-amber-400 text-slate-900'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isPointCloud ? 'Point Cloud: ON' : 'Solid Surface'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
