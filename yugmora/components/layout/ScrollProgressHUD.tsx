// components/layout/ScrollProgressHUD.tsx — HOUR 00/40 progress bar
"use client";

import { useScrollStore } from "@/hooks/useScrollStore";

export function ScrollProgressHUD() {
  const currentHour = useScrollStore((s) => s.currentHour);
  const progress = useScrollStore((s) => s.progress);

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-2"
      aria-label={`Scroll progress: Hour ${currentHour} of 40`}
      role="progressbar"
      aria-valuenow={currentHour}
      aria-valuemin={0}
      aria-valuemax={40}
    >
      {/* Hour label */}
      <span className="mono-label text-[10px] tracking-widest">
        HOUR
      </span>

      {/* Progress track */}
      <div className="relative w-1 h-32 rounded-full overflow-hidden bg-surface-2 border border-line">
        <div
          className="absolute bottom-0 left-0 w-full rounded-full transition-all duration-300"
          style={{
            height: `${progress * 100}%`,
            background: "var(--grad-brand)",
            boxShadow: "0 0 8px var(--neon-blue)",
          }}
        />
      </div>

      {/* Hour number */}
      <span
        className="font-mono text-sm font-bold tabular-nums"
        style={{
          color: progress > 0.5 ? "var(--neon-pink)" : "var(--neon-cyan)",
          textShadow:
            progress > 0.5
              ? "0 0 8px var(--neon-pink)"
              : "0 0 8px var(--neon-cyan)",
        }}
      >
        {String(currentHour).padStart(2, "0")}
      </span>

      <span className="mono-label text-[10px] tracking-widest text-text-muted">
        / 40
      </span>
    </div>
  );
}
