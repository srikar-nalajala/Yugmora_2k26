// components/three/RetroSun.tsx — Synthwave striped sun on the horizon
"use client";

import { useMemo } from "react";
import * as THREE from "three";

export function RetroSun() {
  const uniforms = useMemo(
    () => ({
      uColorTop: { value: new THREE.Color("#ff3ddb") }, // neon-pink
      uColorBottom: { value: new THREE.Color("#a701ce") }, // neon-magenta
      uGlowColor: { value: new THREE.Color("#007bf4") }, // neon-blue
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorTop;
    uniform vec3 uColorBottom;
    uniform vec3 uGlowColor;
    varying vec2 vUv;

    void main() {
      // Circle mask
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      if (dist > 0.5) discard;

      // Color gradient top to bottom
      vec3 col = mix(uColorBottom, uColorTop, vUv.y);

      // Horizontal synthwave stripes cutting through the bottom half
      if (vUv.y < 0.5) {
        float stripe = sin(vUv.y * 55.0);
        // Cut width increases as it goes lower
        float threshold = mix(0.4, -0.6, (0.5 - vUv.y) * 2.0);
        if (stripe < threshold) {
          discard;
        }
      }

      // Soft rim glow
      float rim = smoothstep(0.48, 0.5, dist);
      col = mix(col, uGlowColor, rim * 0.4);

      gl_FragColor = vec4(col, 0.85);
    }
  `;

  return (
    <mesh position={[0, 1.5, -20]}>
      <circleGeometry args={[7, 64]} />
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
