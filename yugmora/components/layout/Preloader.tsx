// components/layout/Preloader.tsx — Boot sequence preloader (Phase 1: simple, Phase 5: animated)
"use client";

import { useState, useEffect } from "react";
import { YugmoraLogo } from "@/components/ui/YugmoraLogo";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("yugmora-loaded")) {
      setVisible(false);
      return;
    }

    const steps = [
      { delay: 100, value: 15 },
      { delay: 300, value: 35 },
      { delay: 500, value: 55 },
      { delay: 700, value: 75 },
      { delay: 900, value: 90 },
      { delay: 1100, value: 100 },
    ];

    const timers = steps.map(({ delay, value }) =>
      setTimeout(() => setProgress(value), delay)
    );

    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("yugmora-loaded", "1");
    }, 1400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-6 transition-opacity duration-300"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
      role="status"
      aria-label="Loading"
    >
      {/* Logo */}
      <YugmoraLogo size={72} className="animate-pulse" />

      {/* Boot text */}
      <div className="font-mono text-xs text-text-muted text-center space-y-1">
        <p className="text-neon-cyan">INITIALIZING YUGMORA...</p>
        <p>
          SYSTEM BOOT{" "}
          <span className="text-neon-pink">{progress}%</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: "var(--grad-brand)",
            boxShadow: "0 0 8px var(--neon-blue)",
          }}
        />
      </div>

      {/* Skip button */}
      <button
        className="text-xs text-text-muted hover:text-white font-mono mt-2 transition-colors"
        onClick={() => {
          setVisible(false);
          sessionStorage.setItem("yugmora-loaded", "1");
        }}
      >
        [ SKIP ]
      </button>
    </div>
  );
}
