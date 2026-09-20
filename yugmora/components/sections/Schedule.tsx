// components/sections/Schedule.tsx — 40-hour timeline + important dates (§9, §10.3)
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { schedule, importantDates } from "@/content/schedule";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Schedule() {
  const [activeTab, setActiveTab] = useState<"timeline" | "dates">("timeline");

  return (
    <section id="schedule" className="py-20 lg:py-32 relative bg-surface-1/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ 40-HOUR CHRONOLOGY ]</p>
          <h2 className="section-heading neon-text mb-4">Event Schedule</h2>
          <p className="section-subtitle mx-auto">
            From the opening buzzer to the victory ceremony: track every milestone across the 40-hour hackathon.
          </p>

          {/* Toggle buttons for mobile/desktop view preference */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-5 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all ${
                activeTab === "timeline"
                  ? "bg-neon-blue/20 border border-neon-blue text-neon-cyan shadow-[0_0_12px_rgba(0,123,244,0.3)]"
                  : "border border-line text-text-muted hover:border-text-muted"
              }`}
            >
              40-Hour Timeline
            </button>
            <button
              onClick={() => setActiveTab("dates")}
              className={`px-5 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all ${
                activeTab === "dates"
                  ? "bg-neon-blue/20 border border-neon-blue text-neon-cyan shadow-[0_0_12px_rgba(0,123,244,0.3)]"
                  : "border border-line text-text-muted hover:border-text-muted"
              }`}
            >
              Important Dates
            </button>
          </div>
        </motion.div>

        {activeTab === "timeline" ? (
          /* Timeline view */
          <div className="space-y-12">
            {/* Desktop timeline track */}
            <div className="hidden lg:block relative py-8 px-4 overflow-x-auto">
              <div className="min-w-[1100px]">
                {/* Visual Progress Track */}
                <div className="relative h-1 bg-line mb-12 rounded">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue via-neon-indigo to-neon-magenta w-full" />
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {schedule.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 rounded border border-line bg-surface-1/90 hover:border-neon-cyan/50 transition-all group relative flex flex-col justify-between min-h-[140px]"
                      whileHover={{ y: -4 }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-neon-cyan group-hover:text-neon-pink transition-colors">
                            {item.hourLabel}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            H+{item.hourStart}
                          </span>
                        </div>
                        <p className="font-display text-xs font-semibold text-text group-hover:text-white transition-colors line-clamp-2">
                          {item.activity}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-line/40 text-[10px] font-mono text-tagline">
                        {item.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile / Compact Vertical Timeline */}
            <div className="lg:hidden relative pl-6 border-l-2 border-line space-y-6">
              {schedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-neon-indigo border-2 border-neon-cyan group-hover:bg-neon-pink group-hover:border-white transition-colors" />
                  <div className="p-4 rounded border border-line bg-surface-1/90">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-neon-cyan">
                        {item.hourLabel}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted">
                        {item.time}
                      </span>
                    </div>
                    <p className="font-display font-medium text-sm text-text">
                      {item.activity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Important Dates Milestone Table */
          <motion.div
            className="max-w-3xl mx-auto hud-card p-6 sm:p-8 border border-line bg-surface-1/90"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 divide-y divide-line/60">
              {importantDates.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-2/40 px-3 rounded transition-colors"
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-text">
                    {item.event}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-neon-cyan px-3 py-1 rounded bg-neon-blue/10 border border-neon-blue/20 w-fit">
                    {item.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
