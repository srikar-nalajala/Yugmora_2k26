// components/sections/Partner.tsx — Partner With Us section (§11)
"use client";

import { motion } from "framer-motion";
import { partnerships, whyPartner, partnerChecklist } from "@/content/partners";
import { event } from "@/content/event";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

export function Partner() {
  return (
    <section id="partner" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ INDUSTRY COLLABORATION ]</p>
          <h2 className="section-heading neon-text mb-4">Partner With Us</h2>
          <p className="section-subtitle mx-auto">
            Shape the future of student innovation. Submit real challenges, hire vetted engineering talent, and mentor the next generation.
          </p>
        </motion.div>

        {/* 4 Partnership Tracks */}
        <div className="mb-20">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {partnerships.map((p, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="hud-card p-6 sm:p-8 border border-line bg-surface-1/90 hover:border-neon-indigo/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono-label">[ TRACK 0{idx + 1} ]</span>
                    <span className="text-neon-cyan font-mono text-xs">✦</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-text mb-4">
                    {p.name}
                  </h3>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="p-3 rounded bg-surface-2/60 border border-line/60">
                      <span className="text-neon-cyan font-bold block mb-1">
                        WHAT YOU DO:
                      </span>
                      <span className="text-text-muted leading-relaxed font-sans text-sm">
                        {p.youDo}
                      </span>
                    </div>

                    <div className="p-3 rounded bg-surface-2/60 border border-line/60">
                      <span className="text-neon-pink font-bold block mb-1">
                        WHAT YOU GET:
                      </span>
                      <span className="text-text leading-relaxed font-sans text-sm">
                        {p.youGet}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why Partner & Checklist + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Why Partner & Checklist */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              className="p-6 sm:p-8 rounded-xl border border-line bg-surface-1/70"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-2xl text-text mb-6">
                Why Partner With Yugmora?
              </h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-text-muted">
                {whyPartner.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-neon-cyan mt-1">✔</span>
                    <span className="font-sans text-text-muted">{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="p-6 sm:p-8 rounded-xl border border-dashed border-line bg-surface-2/40"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-lg text-text mb-4">
                What We Need From Partners
              </h3>
              <ul className="space-y-2 font-mono text-xs text-text-muted">
                {partnerChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-neon-pink">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-line/60">
                <a
                  href={event.partnerBrochureUrl}
                  download
                  onClick={() => trackEvent("brochure_download", { type: "partner" })}
                  className="neon-btn neon-btn--secondary w-full text-center text-xs"
                >
                  Download Partnership Brochure (PDF) ↓
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-6">
            <PartnerForm />
          </div>
        </div>
      </div>
    </section>
  );
}
