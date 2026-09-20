// components/sections/About.tsx — About section with terminal card + HUD checklist
"use client";

import { motion } from "framer-motion";
import { about } from "@/content/about";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion";

export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Terminal window card */}
          <motion.div variants={slideInLeft}>
            <div className="rounded-xl overflow-hidden border border-line bg-surface-1">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-surface-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-text-muted">
                  about_yugmora.md
                </span>
              </div>
              {/* Content */}
              <div className="p-6 sm:p-8">
                <h2 className="section-heading text-2xl sm:text-3xl mb-6 neon-text">
                  About Yugmora
                </h2>
                <p className="text-text-muted leading-relaxed text-sm sm:text-base">
                  {about.paragraph}
                </p>
              </div>
            </div>
          </motion.div>

          {/* HUD checklist — objectives */}
          <motion.div variants={slideInRight}>
            <h3 className="mono-label mb-6">[ MISSION OBJECTIVES ]</h3>
            <div className="space-y-4">
              {about.objectives.map((obj, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 group"
                  variants={fadeInUp}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded border border-neon-cyan flex items-center justify-center mt-0.5"
                    style={{
                      boxShadow: "0 0 6px rgba(34, 225, 255, 0.3)",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-neon-cyan"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-text-muted group-hover:text-white transition-colors">
                    {obj}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Belief statement pull-quote */}
            <motion.blockquote
              className="mt-10 pl-6 border-l-2 border-neon-indigo"
              variants={fadeInUp}
            >
              <p
                className="text-lg sm:text-xl font-display font-bold leading-relaxed"
                style={{ color: "var(--tagline)" }}
              >
                &ldquo;{about.beliefStatement}&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
