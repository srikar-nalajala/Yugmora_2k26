// components/sections/HowItWorks.tsx — 9-step quest log
"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const steps = [
  { step: 1, title: "Register", description: "Sign up as an individual or team on the registration portal." },
  { step: 2, title: "Form Your Squad", description: "Don't have a team? Join the team-formation session and find your crew." },
  { step: 3, title: "Attend the Opening Ceremony", description: "Keynote, problem statement reveal, and the official start of the 40-hour clock." },
  { step: 4, title: "Choose Your Mission", description: "Pick the problem statement that excites you and aligns with your skills." },
  { step: 5, title: "Attend Workshops", description: "Industry experts run hands-on sessions aligned to the problem domains." },
  { step: 6, title: "Build & Iterate", description: "40 hours of coding, designing, testing, and iterating with mentor support." },
  { step: 7, title: "Submit & Demo", description: "Submit your prototype and present to the judges in a 5-minute demo." },
  { step: 8, title: "Win & Get Recognized", description: "Prizes, awards, and recognition for the best solutions." },
  { step: 9, title: "Internship Mela", description: "Top performers fast-track to interviews with partner companies." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 lg:py-32 relative bg-surface-1/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ QUEST LOG ]</p>
          <h2 className="section-heading neon-text">How It Works</h2>
        </motion.div>

        <motion.div
          className="relative max-w-2xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "var(--line)" }}
            aria-hidden="true"
          />

          {steps.map((s) => (
            <motion.div
              key={s.step}
              className="relative flex gap-6 mb-8 last:mb-0 group"
              variants={fadeInUp}
            >
              {/* Step node */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm z-10 border transition-all group-hover:scale-110"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--line)",
                  color: "var(--neon-cyan)",
                }}
              >
                {String(s.step).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
