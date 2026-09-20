// components/sections/DownloadCTA.tsx — Dedicated download cartridge panel & final CTA (§1, §11.3)
"use client";

import { motion } from "framer-motion";
import { event } from "@/content/event";
import { trackEvent } from "@/lib/analytics";
import { fadeInUp } from "@/lib/motion";

export function DownloadCTA() {
  return (
    <section id="download" className="py-20 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Cartridge Panel */}
        <motion.div
          className="hud-card hud-brackets p-8 sm:p-14 border border-line bg-gradient-to-b from-surface-1 to-surface-2 text-center relative overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Subtle neon glow backdrops */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-neon-cyan/10 blur-[90px] pointer-events-none" />

          <p className="mono-label mb-4">[ OFFLINE READINESS ]</p>
          <h2 className="section-heading neon-text mb-4">
            Take Yugmora With You.
          </h2>
          <p className="section-subtitle mx-auto mb-10">
            Download our complete event brochures with full schedules, problem domain breakdowns, campus logistics, and partnership decks.
          </p>

          {/* Download Cartridge Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
            {/* Participant Brochure */}
            <a
              href={event.brochureUrl}
              download
              onClick={() => trackEvent("brochure_download", { type: "participant" })}
              className="w-full sm:w-auto px-8 py-4 rounded bg-surface-1 border border-neon-cyan/50 hover:border-neon-cyan text-left hover:shadow-[0_0_20px_rgba(34,225,255,0.25)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl text-neon-cyan group-hover:animate-pulse">💾</span>
                <div>
                  <div className="font-mono text-xs text-text-muted uppercase">DOWNLOAD.EXE</div>
                  <div className="font-display font-bold text-base text-text group-hover:text-neon-cyan transition-colors">
                    Participant Brochure (PDF)
                  </div>
                  <div className="font-mono text-[10px] text-tagline mt-0.5">
                    [~2.4 MB • Complete Guide]
                  </div>
                </div>
              </div>
            </a>

            {/* Partner Brochure */}
            <a
              href={event.partnerBrochureUrl}
              download
              onClick={() => trackEvent("brochure_download", { type: "partner" })}
              className="w-full sm:w-auto px-8 py-4 rounded bg-surface-1 border border-neon-pink/50 hover:border-neon-pink text-left hover:shadow-[0_0_20px_rgba(255,61,219,0.25)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl text-neon-pink group-hover:animate-pulse">📂</span>
                <div>
                  <div className="font-mono text-xs text-text-muted uppercase">PARTNER_DECK.PDF</div>
                  <div className="font-display font-bold text-base text-text group-hover:text-neon-pink transition-colors">
                    Partnership Brochure (PDF)
                  </div>
                  <div className="font-mono text-[10px] text-tagline mt-0.5">
                    [~3.1 MB • Corporate & Hiring]
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent mb-10" />

          {/* Final Register CTA */}
          <div className="flex flex-col items-center">
            <h3 className="font-display font-bold text-xl text-text mb-2">
              Ready to hack the future?
            </h3>
            <p className="font-mono text-xs text-text-muted mb-6">
              Spots are limited per track. Assemble your squad and lock in your registration.
            </p>
            <a
              href={event.registerUrl || "#top"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("register_click", { section: "download_cta" })}
              className="neon-btn neon-btn--primary text-base px-10 py-4"
            >
              Register For Yugmora Now →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
