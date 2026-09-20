// components/sections/Contact.tsx — Contact & venue info (§14)
"use client";

import { motion } from "framer-motion";
import { contacts, venueInfo } from "@/content/contact";
import { event } from "@/content/event";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ DIRECT DISPATCH ]</p>
          <h2 className="section-heading neon-text mb-4">Contact & Venue</h2>
          <p className="section-subtitle mx-auto">
            Get in touch with the student organizing committee and find your route to campus.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contacts.map((c, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="hud-card p-6 border border-line bg-surface-1/80 hover:border-neon-cyan/50 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="mono-label text-[10px] block mb-2">
                  [ {c.role.toUpperCase()} ]
                </span>
                <h4 className="font-display font-bold text-base text-text mb-3">
                  {c.name}
                </h4>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-line/40 font-mono text-xs">
                <div>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-text-muted hover:text-neon-cyan transition-colors truncate block"
                  >
                    ✉ {c.email}
                  </a>
                </div>
                <div>
                  <a
                    href={`tel:${c.phone}`}
                    className="text-neon-cyan/90 hover:text-neon-pink transition-colors truncate block"
                  >
                    ☎ {c.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Venue Information Card */}
        <motion.div
          className="hud-card hud-brackets p-8 sm:p-10 border border-line bg-surface-1/90 max-w-3xl mx-auto text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-2">[ PHYSICAL COORDINATES ]</p>
          <h3 className="font-display font-bold text-2xl text-text mb-3">
            {event.venue}
          </h3>
          <p className="font-mono text-sm text-text-muted mb-6">
            {venueInfo.address}
          </p>

          <a
            href={venueInfo.mapsUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn neon-btn--secondary text-xs inline-flex"
          >
            Open in Google Maps ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
