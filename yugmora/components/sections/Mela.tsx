// components/sections/Mela.tsx — Internship Mela section (§8)
"use client";

import { motion } from "framer-motion";
import {
  melaOverview,
  melaSteps,
  melaChecklist,
  melaRoles,
  melaCompanies,
} from "@/content/mela";
import { event } from "@/content/event";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

export function Mela() {
  return (
    <section id="mela" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ ON-CAMPUS HIRING ]</p>
          <h2 className="section-heading neon-text mb-4">
            {melaOverview.title}
          </h2>
          <p className="text-tagline font-mono text-sm uppercase tracking-wider mb-4">
            &quot;{melaOverview.subtitle}&quot;
          </p>
          <p className="section-subtitle mx-auto text-text-muted">
            {melaOverview.description}
          </p>
        </motion.div>

        {/* Roles Marquee */}
        <div className="mb-20 overflow-hidden py-4 border-y border-line bg-surface-1/40 backdrop-blur-sm">
          <div className="marquee-track flex gap-8 items-center">
            {[...melaRoles, ...melaRoles].map((role, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-muted shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                <span className="text-text hover:text-neon-cyan transition-colors">
                  {role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Step Student Flow */}
        <div className="mb-20">
          <motion.h3
            className="text-center font-mono text-sm tracking-widest text-neon-cyan uppercase mb-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            [ THE 6-STEP CANDIDATE JOURNEY ]
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {melaSteps.map((step) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="hud-card p-6 border border-line bg-surface-1/80 hover:border-neon-indigo/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded bg-neon-indigo/10 border border-neon-indigo/30 flex items-center justify-center font-mono font-bold text-neon-cyan group-hover:border-neon-cyan transition-colors">
                    0{step.step}
                  </div>
                  <h4 className="font-display font-bold text-lg text-text group-hover:text-neon-cyan transition-colors">
                    {step.title}
                  </h4>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* What to bring checklist & Mela Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <motion.div
            className="lg:col-span-5 hud-card hud-brackets p-8 bg-surface-1/90 border border-line flex flex-col justify-between"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <p className="mono-label mb-2">[ RECRUITMENT GEAR ]</p>
              <h3 className="font-display font-bold text-2xl text-text mb-6">
                What To Bring
              </h3>
              <ul className="space-y-4 font-mono text-sm">
                {melaChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-neon-cyan mt-0.5">✔</span>
                    <span className="text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-line/60">
              <p className="text-xs font-mono text-tagline">
                ⚡ Pro-tip: Keep your GitHub code commits active throughout the 40 hours. Recruiters review commit history!
              </p>
            </div>
          </motion.div>

          {/* Participating Companies */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-2xl text-text">
                Participating Companies
              </h3>
              <span className="mono-label">[ HIRING PARTNERS ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {melaCompanies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg border border-line bg-surface-2/60 hover:border-neon-pink/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono font-bold text-base text-text">
                        {comp.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-magenta/20 text-neon-pink border border-neon-magenta/40">
                        {comp.type}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-xs font-mono">
                      <div>
                        <span className="text-text-muted">Roles: </span>
                        <span className="text-neon-cyan">
                          {comp.roles.join(", ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted">Eligibility: </span>
                        <span className="text-text">{comp.eligibility}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line/50 flex items-center justify-between text-xs font-mono">
                    <span className="text-text-muted">Stipend:</span>
                    <span className="text-neon-cyan font-bold">
                      {comp.stipend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mela CTA */}
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <a
            href={event.registerUrl || "#top"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("register_click", { section: "mela" })}
            className="neon-btn neon-btn--primary"
          >
            Register For The Internship Mela →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
