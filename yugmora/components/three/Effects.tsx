// components/three/Effects.tsx — Bloom and postprocessing effects (subtle & non-blinding)
"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { QualityTier } from "@/hooks/useQualityTier";

interface EffectsProps {
  tier: QualityTier;
}

export function Effects({ tier }: EffectsProps) {
  if (tier === "low" || tier === "off") {
    return null;
  }

  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.3}
        intensity={tier === "high" ? 0.45 : 0.25}
      />
    </EffectComposer>
  );
}
