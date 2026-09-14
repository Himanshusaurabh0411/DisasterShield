import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Convert lat/lng to 3D sphere coordinate
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

interface ArcData {
  start: [number, number]; // [lat, lng]
  end: [number, number];
  color: string;
}

const DEMO_ARCS: ArcData[] = [
  { start: [23.2599, 77.4126], end: [28.7041, 77.1025], color: '#38bdf8' }, // Bhopal -> Delhi HQ
  { start: [23.2599, 77.4126], end: [19.076, 72.8777], color: '#f97316' },  // Bhopal -> Mumbai Naval Air
  { start: [20.9517, 85.0985], end: [23.2599, 77.4126], color: '#ef4444' },  // Odisha -> Bhopal Command
  { start: [30.7352, 79.0669], end: [28.7041, 77.1025], color: '#eab308' },  // Uttarakhand -> Delhi
  { start: [22.7196, 75.8577], end: [23.2599, 77.4126], color: '#22c55e' },  // Indore -> Bhopal
];

function SingleArc({ arc, index }: { arc: ArcData; index: number }) {
  const particleRef = useRef<THREE.Mesh>(null);

  const { curve, points } = useMemo(() => {
    const vStart = latLngToVec3(arc.start[0], arc.start[1], 2.02);
    const vEnd = latLngToVec3(arc.end[0], arc.end[1], 2.02);

    // Compute midpoint extruded outward for arc height
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    const distance = vStart.distanceTo(vEnd);
    const altitude = 2.02 + Math.max(0.2, distance * 0.45);
    mid.normalize().multiplyScalar(altitude);

    const curve = new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
    const points = curve.getPoints(32);
    return { curve, points };
  }, [arc]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (particleRef.current) {
      // Speed with slight offset per arc
      const t = (state.clock.elapsedTime * 0.35 + index * 0.25) % 1;
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Curved Data Pipe */}
      <primitive object={new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({
          color: arc.color,
          transparent: true,
          opacity: 0.45,
          linewidth: 1.5,
        })
      )} />

      {/* Traveling Data Packet Photon */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function ConnectionArcs() {
  return (
    <group>
      {DEMO_ARCS.map((arc, i) => (
        <SingleArc key={`arc-${i}`} arc={arc} index={i} />
      ))}
    </group>
  );
}
