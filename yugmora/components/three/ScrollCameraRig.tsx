// components/three/ScrollCameraRig.tsx — Maps scroll progress (0-1) to camera keyframes
"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/hooks/useScrollStore";

export function ScrollCameraRig() {
  const progress = useScrollStore((s) => s.progress);

  useFrame((state) => {
    const p = progress;
    let targetX = 0;
    let targetY = 0;
    let targetZ = 4.2;

    let lookX = 0;
    let lookY = 0;
    let lookZ = -2;

    if (p < 0.1) {
      // 0.00–0.10: Hero
      targetX = 0;
      targetY = 0;
      targetZ = 4.2;
      lookX = 0.5;
    } else if (p < 0.28) {
      // 0.10–0.25: About / Pillars
      const t = (p - 0.1) / 0.18;
      targetX = THREE.MathUtils.lerp(0, -0.6, t);
      targetY = THREE.MathUtils.lerp(0, 0.4, t);
      targetZ = THREE.MathUtils.lerp(4.2, 5.0, t);
      lookX = THREE.MathUtils.lerp(0.5, 0, t);
    } else if (p < 0.58) {
      // 0.25–0.55: Missions / How / Workshops
      const t = (p - 0.28) / 0.3;
      targetX = THREE.MathUtils.lerp(-0.6, 0.4, t);
      targetY = THREE.MathUtils.lerp(0.4, -0.4, t);
      targetZ = THREE.MathUtils.lerp(5.0, 4.4, t);
      lookX = 0;
      lookZ = -4;
    } else if (p < 0.85) {
      // 0.55–0.85: Mela / Schedule / Prizes
      const t = (p - 0.58) / 0.27;
      targetX = THREE.MathUtils.lerp(0.4, -0.5, t);
      targetY = THREE.MathUtils.lerp(-0.4, 0.2, t);
      targetZ = THREE.MathUtils.lerp(4.4, 4.2, t);
      lookX = -0.2;
    } else {
      // 0.85–1.00: Community → Download
      const t = (p - 0.85) / 0.15;
      targetX = THREE.MathUtils.lerp(-0.5, 0, t);
      targetY = THREE.MathUtils.lerp(0.2, 0, t);
      targetZ = THREE.MathUtils.lerp(4.2, 3.8, t);
      lookX = 0.3;
      lookZ = -2;
    }

    // Add gentle pointer parallax to camera
    const pointer = state.pointer;
    const px = pointer.x * 0.3;
    const py = pointer.y * 0.2;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX + px,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY + py,
      0.04
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.04
    );

    const lookTarget = new THREE.Vector3(lookX, lookY, lookZ);
    state.camera.lookAt(lookTarget);
  });

  return null;
}
