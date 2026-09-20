// components/three/HorizonY.tsx — Horizon wireframe Y symbol replacing the blinding sphere
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function HorizonY() {
  const groupRef = useRef<THREE.Group>(null);

  const { stemGeom, leftArmGeom, rightArmGeom } = useMemo(() => {
    // Large background monolith proportions
    const stem = new THREE.BoxGeometry(1.6, 5.5, 1.2);
    const leftArm = new THREE.BoxGeometry(1.5, 6.0, 1.2);
    const rightArm = new THREE.BoxGeometry(1.5, 6.0, 1.2);
    return { stemGeom: stem, leftArmGeom: leftArm, rightArmGeom: rightArm };
  }, []);

  const { stemEdges, leftEdges, rightEdges } = useMemo(() => {
    return {
      stemEdges: new THREE.EdgesGeometry(stemGeom),
      leftEdges: new THREE.EdgesGeometry(leftArmGeom),
      rightEdges: new THREE.EdgesGeometry(rightArmGeom),
    };
  }, [stemGeom, leftArmGeom, rightArmGeom]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Majestic slow rotation & breathing pulse
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.position.y = 2.0 + Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
  });

  return (
    <group ref={groupRef} position={[0, 2.0, -18]} scale={1.6}>
      {/* Stem */}
      <group position={[0, -2.5, 0]}>
        <mesh geometry={stemGeom}>
          <meshBasicMaterial
            color="#07050f"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={stemEdges}>
          <lineBasicMaterial color="#461bef" transparent opacity={0.65} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* Left Arm */}
      <group position={[-2.1, 2.0, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-35)]}>
        <mesh geometry={leftArmGeom}>
          <meshBasicMaterial
            color="#07050f"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={leftEdges}>
          <lineBasicMaterial color="#007bf4" transparent opacity={0.7} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* Right Arm */}
      <group position={[2.1, 2.0, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(35)]}>
        <mesh geometry={rightArmGeom}>
          <meshBasicMaterial
            color="#07050f"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={rightEdges}>
          <lineBasicMaterial color="#a701ce" transparent opacity={0.7} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* Subtle outer halo ring behind the Y */}
      <mesh position={[0, 0, -1]}>
        <ringGeometry args={[7.2, 7.3, 64]} />
        <meshBasicMaterial color="#22e1ff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <ringGeometry args={[8.8, 8.85, 64]} />
        <meshBasicMaterial color="#ff3ddb" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}
