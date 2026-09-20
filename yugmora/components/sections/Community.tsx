// components/sections/Community.tsx — Community hub (§5.5, §10.2, §14)
"use client";

import { motion } from "framer-motion";
import { event } from "@/content/event";
import { speakers } from "@/content/speakers";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

export function Community() {
  const counters = [
    { label: "Registered Teams", value: "[450+]" },
    { label: "Campuses Represented", value: "[80+]" },
    { label: "Partner Companies", value: "[25+]" },
    { label: "Industry Mentors", value: "[40+]" },
  ];

  return (
    <section id="community" className="py-20 lg:py-32 relative bg-surface-1/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ DEVELOPER ECOSYSTEM ]</p>
          <h2 className="section-heading neon-text mb-4">Community Hub</h2>
          <p className="section-subtitle mx-auto">
            Connect with builders, find team members across disciplines, and join our active channels.
          </p>
        </motion.div>

        {/* Live Counters */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {counters.map((c, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="hud-card p-6 text-center border border-line bg-surface-1/80"
            >
              <div className="font-mono font-bold text-2xl sm:text-3xl text-neon-cyan mb-1">
                {c.value}
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-text-muted">
                {c.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 2 Main Cards: Join WhatsApp/Discord + Find Your Squad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Join Channels */}
          <motion.div
            className="hud-card hud-brackets p-8 border border-line bg-surface-1/90 flex flex-col justify-between"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <p className="mono-label mb-2">[ DIRECT ACCESS ]</p>
              <h3 className="font-display font-bold text-2xl text-text mb-4">
                Join The Official Community
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Receive real-time announcements, problem-statement clarifications, workshop links, and direct AMA access with organisers and mentors.
              </p>

              <div className="p-4 rounded border border-dashed border-neon-cyan/40 bg-surface-2/60 mb-6 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-text font-bold">
                    WhatsApp & Discord Channels
                  </div>
                  <div className="font-mono text-xs text-text-muted">
                    Instant updates & team-building chatter
                  </div>
                </div>
                <div className="w-12 h-12 rounded bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center font-mono text-xs text-neon-cyan">
                  QR
                </div>
              </div>
            </div>

            <a
              href={event.communityUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("community_join", { platform: "discord_whatsapp" })}
              className="neon-btn neon-btn--primary w-full text-center"
            >
              Join WhatsApp / Discord →
            </a>
          </motion.div>

          {/* Card 2: Find Your Squad */}
          <motion.div
            className="hud-card hud-brackets p-8 border border-line bg-surface-1/90 flex flex-col justify-between"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <p className="mono-label mb-2">[ SOLO REGISTRANTS WELCOME ]</p>
              <h3 className="font-display font-bold text-2xl text-text mb-4">
                Find Your Squad
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Don&apos;t have a team yet? Register as a solo participant. During the opening ceremony, we host a dedicated team-formation session where builders pair up with complementary talents.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-text">
                  <span className="text-neon-cyan">✔</span>
                  <span>Cross-branch and cross-year teams welcomed</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-text">
                  <span className="text-neon-cyan">✔</span>
                  <span>Beginner-friendly environments and guidance</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-text">
                  <span className="text-neon-cyan">✔</span>
                  <span>Pair developers with designers and domain thinkers</span>
                </div>
              </div>
            </div>

            <a
              href={event.registerUrl || "#top"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("register_click", { section: "squad_finder" })}
              className="neon-btn neon-btn--secondary w-full text-center"
            >
              Register Solo & Match Later
            </a>
          </motion.div>
        </div>

        {/* Mentors on Campus Strip */}
        <motion.div
          className="p-6 rounded-xl border border-line bg-surface-1/60 mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="mono-label">[ ON-SITE GUIDANCE ]</span>
              <h3 className="font-display font-bold text-lg text-text">
                Industry Mentors On Campus
              </h3>
            </div>
            <p className="text-xs font-mono text-text-muted">
              Active round-the-clock reviews during H+12 and H+24
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {speakers.slice(0, 4).map((speaker) => (
              <div
                key={speaker.id}
                className="p-3 rounded border border-line/60 bg-surface-2/40 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-pink flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                  {speaker.name[0]}
                </div>
                <div className="overflow-hidden">
                  <div className="font-display font-semibold text-xs text-text truncate">
                    {speaker.name}
                  </div>
                  <div className="font-mono text-[10px] text-text-muted truncate">
                    {speaker.company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Socials Row */}
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
            [ FOLLOW YUGMORA ON SOCIAL CHANNELS ]
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(event.socials).map(([platform, handle]) => (
              <a
                key={platform}
                href="#"
                className="px-4 py-2 rounded border border-line bg-surface-1 font-mono text-xs uppercase text-text hover:text-neon-cyan hover:border-neon-cyan transition-all"
              >
                {platform}: <span className="text-tagline">{handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
