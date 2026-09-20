// components/showcase/MissionModal.tsx — Detailed mission modal for Mission Select
"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mission } from "@/content/types";
import { event } from "@/content/event";
import { trackEvent } from "@/lib/analytics";

interface MissionModalProps {
  mission: Mission | null;
  onClose: () => void;
}

export function MissionModal({ mission, onClose }: MissionModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (mission) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mission, handleKeyDown]);

  if (!mission) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          className="relative w-full max-w-2xl hud-card hud-brackets border border-neon-cyan/50 bg-surface-1 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,123,244,0.3)] z-10 my-8 max-h-[85vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mission-modal-title"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-line mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-neon-cyan tracking-wider">
                  [ MISSION {mission.id} ]
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-neon-indigo/20 border border-neon-indigo/40 text-tagline">
                  {mission.domain}
                </span>
              </div>
              <h3
                id="mission-modal-title"
                className="font-display font-bold text-xl sm:text-2xl text-text"
              >
                {mission.title}
              </h3>
              <p className="font-mono text-xs text-text-muted mt-1">
                Contributed by: <span className="text-white font-semibold">{mission.company.name}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded border border-line bg-surface-2 flex items-center justify-center text-text-muted hover:text-neon-pink hover:border-neon-pink transition-colors font-mono"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-sm">
            {/* Background */}
            <div>
              <h4 className="mono-label mb-2">[ INDUSTRY BACKGROUND ]</h4>
              <p className="text-text-muted leading-relaxed font-sans">
                {mission.background}
              </p>
            </div>

            {/* The Challenge */}
            <div className="p-4 rounded-lg bg-surface-2/60 border border-line">
              <h4 className="mono-label text-neon-pink mb-2">[ THE PROBLEM CHALLENGE ]</h4>
              <p className="text-text leading-relaxed font-sans font-medium">
                {mission.challenge}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="mono-label mb-3">[ EXPECTED DELIVERABLES ]</h4>
              <ul className="space-y-2">
                {mission.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 font-sans text-text-muted">
                    <span className="text-neon-cyan font-mono mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Mentors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
              <div>
                <h4 className="mono-label mb-2">[ TOOLS & RESOURCES ]</h4>
                {mission.resources && mission.resources.length > 0 ? (
                  <ul className="space-y-1 font-mono text-xs text-text-muted">
                    {mission.resources.map((res, idx) => (
                      <li key={idx}>• {res}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-mono text-xs text-text-muted">Provided at event kickoff</p>
                )}
              </div>

              <div>
                <h4 className="mono-label mb-2">[ ASSIGNED MENTORS ]</h4>
                <ul className="space-y-1 font-mono text-xs text-tagline">
                  {mission.mentors.map((mentor, idx) => (
                    <li key={idx}>👤 {mentor}</li>
                  ))}
                </ul>
              </div>
            </div>

            {mission.linkedWorkshopId && (
              <div className="p-3 rounded border border-neon-indigo/40 bg-neon-indigo/10 flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">Aligned Workshop:</span>
                <span className="text-neon-cyan font-semibold">{mission.linkedWorkshopId}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="neon-btn neon-btn--ghost w-full sm:w-auto text-xs"
            >
              Back to Missions
            </button>
            <a
              href={event.registerUrl || "#top"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("register_click", { mission: mission.id });
                onClose();
              }}
              className="neon-btn neon-btn--primary w-full sm:w-auto text-xs"
            >
              Register For This Mission →
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
