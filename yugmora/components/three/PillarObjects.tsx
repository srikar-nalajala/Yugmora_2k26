// components/three/PillarObjects.tsx — Geometric artifacts representing the Three Pillars
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/hooks/useScrollStore";

export function PillarObjects() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const prismRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  const progress = useScrollStore((s) => s.progress);

  // Pillar range is approximately 0.10 to 0.28
  const inRange = progress >= 0.08 && progress <= 0.32;

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.4;
      cubeRef.current.rotation.y += delta * 0.5;
    }
    if (prismRef.current) {
      prismRef.current.rotation.y += delta * 0.6;
      prismRef.current.rotation.z += delta * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.5;
      torusRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group
      position={[0, 0, -4]}
      visible={inRange}
    >
      {/* 1. Hackathon: Faceted Cube */}
      <mesh ref={cubeRef} position={[-3.5, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#007bf4"
          wireframe
          emissive="#007bf4"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 2. Workshops: Octahedron Prism */}
      <mesh ref={prismRef} position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#8312dc"
          wireframe
          emissive="#8312dc"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 3. Internship Mela: Torus Ring */}
      <mesh ref={torusRef} position={[3.5, 0.5, 0]}>
        <torusGeometry args={[0.7, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#ff3ddb"
          wireframe
          emissive="#ff3ddb"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
