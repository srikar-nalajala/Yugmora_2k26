// components/three/SceneWrapper.tsx — Client-only mounted wrapper for 3D Canvas
"use client";

import { useState, useEffect } from "react";
import { SceneRoot } from "./SceneRoot";

export function SceneWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <SceneRoot />;
}

export default SceneWrapper;
