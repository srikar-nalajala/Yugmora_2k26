// components/three/YEmblem.tsx — Authentic 3D Extruded & Faceted Yugmora "Y" Logo
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function YEmblem() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Responsive position: On desktop, frame the right side of the Hero; on mobile, push back with depth
  const isMobile = viewport.width < 7.5;
  const isTablet = viewport.width >= 7.5 && viewport.width < 11;
  const targetX = isMobile ? 0 : isTablet ? 2.0 : Math.max(2.6, Math.min(viewport.width * 0.25, 3.4));
  const targetY = isMobile ? 0.35 : 0.1;
  const targetZ = isMobile ? -2.6 : -1.5;
  const targetScale = isMobile ? 0.9 : 1.2;

  // 1. Create the unified geometric "Y" Shape matching the official logo
  const { geometry, edges } = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at bottom-left of stem
    shape.moveTo(-0.3, -1.5);
    shape.lineTo(0.3, -1.5);
    shape.lineTo(0.3, -0.2);
    // Right arm extending up and outward
    shape.lineTo(1.6, 1.4);
    shape.lineTo(1.05, 1.4);
    // Valley / crotch of the Y
    shape.lineTo(0, 0.1);
    // Left arm extending up and outward
    shape.lineTo(-1.05, 1.4);
    shape.lineTo(-1.6, 1.4);
    shape.lineTo(-0.3, -0.2);
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center(); // Center pivot perfectly

    // Crisp wireframe edges with 25-degree angle threshold
    const edgeGeom = new THREE.EdgesGeometry(geom, 25);

    return { geometry: geom, edges: edgeGeom };
  }, []);

  // 2. Custom Brand Gradient Shader (Blue -> Indigo -> Magenta)
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColorLeft: { value: new THREE.Color("#007bf4") }, // Neon Blue
        uColorCenter: { value: new THREE.Color("#461bef") }, // Deep Indigo
        uColorRight: { value: new THREE.Color("#ff3ddb") }, // Hot Pink / Magenta
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorLeft;
        uniform vec3 uColorCenter;
        uniform vec3 uColorRight;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          // Normalize X across the width (-1.6 to +1.6)
          float t = clamp((vPosition.x + 1.6) / 3.2, 0.0, 1.0);
          
          vec3 baseColor;
          if (t < 0.5) {
            baseColor = mix(uColorLeft, uColorCenter, t * 2.0);
          } else {
            baseColor = mix(uColorCenter, uColorRight, (t - 0.5) * 2.0);
          }

          // Simple directional lighting + ambient
          vec3 lightDir = normalize(vec3(0.5, 1.0, 1.5));
          float diff = max(dot(vNormal, lightDir), 0.2);
          
          // Subtle specular shine
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          vec3 reflectDir = reflect(-lightDir, vNormal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0) * 0.4;

          vec3 finalColor = baseColor * (diff + 0.45) + vec3(spec);
          gl_FragColor = vec4(finalColor, 0.95);
        }
      `,
      transparent: true,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth floating levitation
    const hoverOffset = Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
    groupRef.current.position.set(
      targetX,
      targetY + hoverOffset,
      targetZ
    );

    // Subtle oscillation so it displays rich 3D bevels without swinging into the left text column
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.25 - 0.1;

    // Interactive mouse parallax tilt
    const pointer = state.pointer;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.1 - pointer.y * 0.25,
      0.06
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      pointer.x * 0.15,
      0.06
    );
  });

  return (
    <group
      ref={groupRef}
      position={[targetX, targetY, targetZ]}
      scale={targetScale}
    >
      {/* 3D Extruded Logo Body */}
      <mesh geometry={geometry} material={shaderMaterial} />

      {/* Crisp Wireframe Edge Lines */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.85} linewidth={2} />
      </lineSegments>

      {/* Subtle core accent lights */}
      <pointLight color="#22e1ff" intensity={2} distance={4} position={[-1, 1, 0.8]} />
      <pointLight color="#ff3ddb" intensity={2} distance={4} position={[1, 1, 0.8]} />
    </group>
  );
}

export default YEmblem;
