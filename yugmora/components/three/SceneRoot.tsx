// components/three/SceneRoot.tsx — Single persistent WebGL 3D Canvas
"use client";

import { Canvas } from "@react-three/fiber";
import { useQualityTier } from "@/hooks/useQualityTier";
import { GridFloor } from "./GridFloor";
import { Starfield } from "./Starfield";
import { YEmblem } from "./YEmblem";
import { PillarObjects } from "./PillarObjects";
import { ScrollCameraRig } from "./ScrollCameraRig";
import { Effects } from "./Effects";

export function SceneRoot() {
  const tier = useQualityTier();

  if (tier === "off") {
    // Elegant CSS Grid fallback when WebGL or reduced-motion is requested
    return (
      <div
        className="fixed inset-0 z-0 grid-bg pointer-events-none opacity-30"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        gl={{
          antialias: tier === "high",
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={tier === "high" ? [1, 1.75] : 1}
        camera={{ position: [0, 0, 4.2], fov: 60 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 8, 6]} intensity={1.5} color="#ffffff" />
        <pointLight position={[5, 8, 5]} intensity={1.5} color="#007bf4" />
        <pointLight position={[-5, 5, -5]} intensity={1.5} color="#ff3ddb" />

        <Starfield count={tier === "high" ? 1200 : 500} />
        <GridFloor />
        <YEmblem />
        <PillarObjects />
        <ScrollCameraRig />
        <Effects tier={tier} />
      </Canvas>

      {/* Subtle perimeter vignette so 3D hovering Y Symbol shines through brightly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.35) 100%)",
        }}
      />
    </div>
  );
}

export default SceneRoot;
