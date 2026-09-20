// components/showcase/MissionCard.tsx — Mission card for Mission Select carousel
"use client";

import { Mission } from "@/content/types";
import { event } from "@/content/event";
import { trackEvent } from "@/lib/analytics";

interface MissionCardProps {
  mission: Mission;
  isActive: boolean;
  onOpenDetails: (mission: Mission) => void;
}

export function MissionCard({ mission, isActive, onOpenDetails }: MissionCardProps) {
  if (mission.locked) {
    return (
      <div
        className={`hud-card p-6 sm:p-8 border border-dashed border-line bg-surface-1/90 flex flex-col items-center justify-center text-center h-[460px] w-full transition-all duration-300 ${
          isActive ? "shadow-[0_0_30px_rgba(131,18,220,0.3)] border-neon-violet" : "opacity-75"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-surface-2 border border-line flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <span className="mono-label text-xs mb-2">[ CLASSIFIED MISSION ]</span>
        <h3 className="font-display font-bold text-xl text-text mb-2">
          {mission.title}
        </h3>
        <p className="text-text-muted text-xs font-mono max-w-xs mb-4">
          {mission.challenge}
        </p>
        <span className="px-3 py-1 rounded bg-neon-magenta/20 border border-neon-magenta/40 text-neon-pink font-mono text-xs">
          Unlocks on Event Day 1
        </span>
      </div>
    );
  }

  return (
    <div
      className={`hud-card p-6 sm:p-8 border bg-surface-1/95 flex flex-col justify-between h-[460px] w-full transition-all duration-300 ${
        isActive
          ? "border-neon-cyan/70 shadow-[0_0_30px_rgba(34,225,255,0.25)]"
          : "border-line opacity-80"
      }`}
    >
      <div>
        {/* Top bar: Mission ID & Domain Chip */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs font-bold text-neon-cyan tracking-wider">
            [ MISSION {mission.id} ]
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-neon-indigo/20 border border-neon-indigo/40 text-tagline">
            {mission.domain}
          </span>
        </div>

        {/* Company attribution */}
        <div className="text-xs font-mono text-text-muted mb-2 flex items-center gap-2">
          <span>By</span>
          <span className="text-text font-semibold">{mission.company.name}</span>
        </div>

        {/* Mission Title */}
        <h3 className="font-display font-bold text-lg sm:text-xl text-text leading-tight mb-3 line-clamp-2">
          {mission.title}
        </h3>

        {/* Challenge Summary */}
        <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          {mission.challenge}
        </p>

        {/* Difficulty Pips */}
        <div className="flex items-center gap-2 mb-4 font-mono text-xs">
          <span className="text-text-muted text-[11px]">DIFFICULTY:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((pip) => (
              <span
                key={pip}
                className={`w-2 h-2 rounded-sm ${
                  mission.difficulty && pip <= mission.difficulty
                    ? "bg-neon-pink shadow-[0_0_6px_#ff3ddb]"
                    : "bg-surface-2 border border-line"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Linked Workshop hint */}
        {mission.linkedWorkshopId && (
          <div className="text-[11px] font-mono text-tagline flex items-center gap-1.5 truncate">
            <span>⚡ Workshop:</span>
            <span className="text-text-muted truncate">
              {mission.linkedWorkshopId}
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-line/60 flex items-center gap-3">
        <button
          onClick={() => onOpenDetails(mission)}
          className="neon-btn neon-btn--secondary flex-1 text-xs py-2.5"
        >
          Details
        </button>
        <a
          href={event.registerUrl || "#top"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("register_click", { mission: mission.id })}
          className="neon-btn neon-btn--primary flex-1 text-xs py-2.5 text-center"
        >
          Register
        </a>
      </div>
    </div>
  );
}
