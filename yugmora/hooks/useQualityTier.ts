// hooks/useQualityTier.ts — Quality tier detection
"use client";

import { useState, useEffect } from "react";

export type QualityTier = "high" | "medium" | "low" | "off";

export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>("high");

  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setTier("off");
        return;
      }
    } catch {
      setTier("off");
      return;
    }

    // Check Save-Data header hint
    const connection = (navigator as unknown as Record<string, unknown>).connection as
      | { saveData?: boolean }
      | undefined;
    if (connection?.saveData) {
      setTier("low");
      return;
    }

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    if (!isMobile && cores >= 6) {
      setTier("high");
    } else {
      setTier("medium");
    }
  }, []);

  return tier;
}
