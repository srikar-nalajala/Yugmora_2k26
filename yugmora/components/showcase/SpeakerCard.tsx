// components/showcase/SpeakerCard.tsx — Speaker card for Player Select carousel (§6, §7)
"use client";

import { Speaker } from "@/content/types";

interface SpeakerCardProps {
  speaker: Speaker;
  isActive: boolean;
}

export function SpeakerCard({ speaker, isActive }: SpeakerCardProps) {
  return (
    <div
      className={`hud-card p-6 sm:p-8 border bg-surface-1/95 flex flex-col justify-between h-[480px] w-full transition-all duration-300 ${
        isActive
          ? "border-neon-pink/70 shadow-[0_0_30px_rgba(255,61,219,0.25)]"
          : "border-line opacity-80"
      }`}
    >
      <div>
        {/* Top bar: Roles badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {speaker.roles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
              >
                {role}
              </span>
            ))}
          </div>
          <span className="font-mono text-xs text-text-muted">PLAYER</span>
        </div>

        {/* Avatar / Portrait with duotone styling */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-xl overflow-hidden border-2 border-line group-hover:border-neon-pink transition-colors bg-surface-2 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/40 via-neon-indigo/30 to-neon-pink/40 mix-blend-screen" />
          <span className="font-mono text-3xl font-bold text-neon-pink select-none">
            {speaker.name[0]}
          </span>
        </div>

        {/* Name & Designation */}
        <div className="text-center mb-4">
          <h3 className="font-display font-bold text-lg sm:text-xl text-text">
            {speaker.name}
          </h3>
          <p className="font-mono text-xs text-neon-cyan mt-0.5">
            {speaker.designation}
          </p>
          <p className="font-mono text-[11px] text-text-muted">
            {speaker.company.name}
          </p>
        </div>

        {/* Bio */}
        <p className="text-text-muted text-xs leading-relaxed line-clamp-3 text-center mb-4">
          {speaker.bio}
        </p>
      </div>

      {/* Session & Social */}
      <div className="pt-4 border-t border-line/60">
        <div className="p-2.5 rounded bg-surface-2/60 border border-line mb-3 text-left">
          <span className="text-[10px] font-mono text-tagline uppercase block">
            SESSION:
          </span>
          <span className="font-mono text-xs text-text font-medium truncate block">
            {speaker.session}
          </span>
        </div>

        {speaker.linkedin ? (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn neon-btn--ghost w-full text-xs py-2 text-center"
          >
            LinkedIn Profile ↗
          </a>
        ) : (
          <div className="text-center font-mono text-[10px] text-text-muted py-2">
            [ Speaker Profile Verified ]
          </div>
        )}
      </div>
    </div>
  );
}
