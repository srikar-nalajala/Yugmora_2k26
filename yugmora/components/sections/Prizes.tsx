// components/sections/Prizes.tsx — Prizes & judging criteria (§5.8, §5.9)
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { prizes, specialPrizes, judgingCriteria } from "@/content/prizes";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Prizes() {
  const [activeCriterion, setActiveCriterion] = useState<number | null>(null);

  // Podium order: First Runner-up (2nd), Winner (1st), Second Runner-up (3rd)
  const podiumOrder = [
    { ...prizes[1], rank: "2nd", place: "First Runner-up", height: "h-64 sm:h-72", color: "from-neon-indigo/30 to-surface-1", border: "border-neon-indigo", badge: "🥈" },
    { ...prizes[0], rank: "1st", place: "Champion Winner", height: "h-76 sm:h-88", color: "from-neon-blue/40 via-neon-magenta/30 to-surface-1", border: "border-neon-cyan", badge: "🏆" },
    { ...prizes[2], rank: "3rd", place: "Second Runner-up", height: "h-56 sm:h-64", color: "from-neon-violet/30 to-surface-1", border: "border-neon-violet", badge: "🥉" },
  ];

  return (
    <section id="prizes" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ REWARDS & RECOGNITION ]</p>
          <h2 className="section-heading neon-text mb-4">Prizes & Judging</h2>
          <p className="section-subtitle mx-auto">
            Honoring exceptional craftsmanship, groundbreaking innovation, and real-world impact.
          </p>
        </motion.div>

        {/* 3D-styled Podium Bars */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-4">
            {podiumOrder.map((item, idx) => (
              <motion.div
                key={idx}
                className={`flex-1 flex flex-col items-center justify-end rounded-t-xl border-t-2 border-x ${item.border} bg-gradient-to-b ${item.color} p-4 sm:p-6 text-center transition-transform hover:-translate-y-2 relative shadow-lg`}
                style={{ minHeight: idx === 1 ? "320px" : idx === 0 ? "260px" : "220px" }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                {idx === 1 && (
                  <div className="absolute -top-6 px-4 py-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,225,255,0.6)]">
                    GRAND PRIZE
                  </div>
                )}
                <div className="text-3xl sm:text-4xl mb-2">{item.badge}</div>
                <div className="font-mono text-xs text-neon-cyan uppercase tracking-widest mb-1">
                  {item.rank} Place
                </div>
                <div className="font-display font-bold text-sm sm:text-lg text-text mb-3">
                  {item.place}
                </div>
                <div className="font-mono font-bold text-lg sm:text-2xl text-white tracking-wider bg-black/40 px-3 py-1.5 rounded border border-line w-full">
                  {item.reward}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Special Awards Grid */}
        <div className="mb-20">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neon-cyan text-center mb-8">
            [ SPECIAL TRACKS & FAST-TRACK AWARDS ]
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialPrizes.map((special, idx) => (
              <motion.div
                key={idx}
                className="p-5 rounded-lg border border-line bg-surface-1/70 hover:border-neon-pink/50 transition-all flex items-start justify-between gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h4 className="font-display font-semibold text-sm text-text mb-1">
                    {special.award}
                  </h4>
                  <p className="font-mono text-xs text-tagline">
                    {special.reward}
                  </p>
                </div>
                <span className="text-neon-pink text-lg">✦</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Judging Criteria Neon Bars */}
        <div className="max-w-4xl mx-auto hud-card hud-brackets p-6 sm:p-10 border border-line bg-surface-1/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <p className="mono-label mb-1">[ EVALUATION METRICS ]</p>
              <h3 className="font-display font-bold text-2xl text-text">
                Judging Criteria (100% Total)
              </h3>
            </div>
            <span className="font-mono text-xs text-text-muted">
              Tap / hover for judge review notes
            </span>
          </div>

          <div className="space-y-6">
            {judgingCriteria.map((criterion, idx) => {
              const percentage = parseInt(criterion.weight.replace("%", ""), 10) || 20;
              const isSelected = activeCriterion === idx;

              return (
                <div
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setActiveCriterion(isSelected ? null : idx)}
                  onMouseEnter={() => setActiveCriterion(idx)}
                >
                  <div className="flex justify-between items-center text-sm font-mono mb-2">
                    <span className="font-semibold text-text group-hover:text-neon-cyan transition-colors">
                      {criterion.name}
                    </span>
                    <span className="text-neon-pink font-bold">
                      {criterion.weight}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-line">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-blue via-neon-indigo to-neon-pink"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage * 3.5}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>

                  {/* Judge's review note */}
                  <p
                    className={`mt-2 text-xs text-text-muted transition-all duration-200 ${
                      isSelected ? "block text-neon-cyan/90 font-mono" : "hidden sm:block text-text-muted/70"
                    }`}
                  >
                    🔍 {criterion.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
