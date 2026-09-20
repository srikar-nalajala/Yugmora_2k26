// components/sections/Sponsors.tsx — Sponsor tiered logo wall (§12)
"use client";

import { motion } from "framer-motion";
import { sponsorTiers } from "@/content/sponsors";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Sponsors() {
  return (
    <section id="sponsors" className="py-20 lg:py-32 relative bg-surface-1/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ SUPPORTING ECOSYSTEM ]</p>
          <h2 className="section-heading neon-text mb-4">Our Sponsors & Partners</h2>
          <p className="section-subtitle mx-auto">
            Backed by forward-thinking organizations empowering campus creators and builders.
          </p>
        </motion.div>

        {/* Tiered Walls */}
        <div className="space-y-16">
          {sponsorTiers.map((tierData, idx) => (
            <motion.div
              key={tierData.tier}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-tagline mb-6">
                [ {tierData.tier.toUpperCase()} ]
              </h3>

              <div
                className={`flex flex-wrap justify-center items-center gap-4 sm:gap-6 ${
                  idx === 0 ? "max-w-xl mx-auto" : "max-w-5xl mx-auto"
                }`}
              >
                {tierData.sponsors.map((sponsor, sIdx) => (
                  <div
                    key={sIdx}
                    className={`rounded-lg border transition-all duration-300 flex items-center justify-center font-mono ${
                      idx === 0
                        ? "w-full sm:w-80 h-28 border-neon-cyan/60 bg-neon-blue/5 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(34,225,255,0.2)] text-base font-bold text-neon-cyan"
                        : idx === 1
                        ? "w-44 sm:w-56 h-20 border-line bg-surface-1/80 hover:border-neon-indigo text-sm font-semibold text-text"
                        : "w-36 sm:w-44 h-16 border-dashed border-line/80 bg-surface-2/40 hover:border-neon-pink/40 text-xs text-text-muted"
                    }`}
                  >
                    <span>{sponsor.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sponsor CTA Banner */}
        <motion.div
          className="mt-20 p-8 rounded-xl border border-dashed border-line text-center bg-surface-1/50 max-w-2xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs text-neon-cyan uppercase tracking-wider mb-2">
            Interested in supporting Yugmora?
          </p>
          <h4 className="font-display font-bold text-lg text-text mb-4">
            Become a Sponsor or Track Partner
          </h4>
          <a href="#partner" className="neon-btn neon-btn--secondary text-xs">
            Explore Sponsorship Tiers →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
