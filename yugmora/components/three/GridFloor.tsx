// components/three/GridFloor.tsx — Synthwave perspective grid floor
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GridFloor() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#007bf4") }, // neon-blue
      uColor2: { value: new THREE.Color("#8312dc") }, // neon-violet
      uLineColor: { value: new THREE.Color("#22e1ff") }, // neon-cyan
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uLineColor;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      // Perspective grid based on world coordinates
      vec2 coord = vWorldPosition.xz * 0.4;
      coord.y += uTime * 0.4; // UV scroll forward

      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      float line = min(grid.x, grid.y);
      float lineIntensity = 1.0 - min(line, 1.0);

      // Distance fog to horizon
      float dist = length(vWorldPosition.xz);
      float fog = smoothstep(12.0, 4.0, dist);

      // Gradient color blend
      vec3 baseColor = mix(uColor2, uColor1, smoothstep(-5.0, 5.0, vWorldPosition.x));
      vec3 finalColor = mix(vec3(0.0), uLineColor, lineIntensity * 0.85);
      finalColor += baseColor * 0.15;

      gl_FragColor = vec4(finalColor, fog * 0.9);
    }
  `;

  useFrame((_, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.5, -5]}
    >
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
