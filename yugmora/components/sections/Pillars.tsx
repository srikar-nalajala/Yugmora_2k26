// components/sections/Pillars.tsx — Three Pillars with holographic cards
"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const pillars = [
  {
    title: "Hackathon",
    icon: "⚡",
    description:
      "40 hours of intense building. Solve real-world problem statements from leading companies with your team. Ship a working prototype, get judged by industry experts.",
    highlight: "var(--neon-blue)",
  },
  {
    title: "Workshops & Guest Speakers",
    icon: "🎓",
    description:
      "Expert-led workshops aligned to the problem statements. Learn from CTOs, engineers, and founders who have built at scale. Skills that matter, taught by people who've used them.",
    highlight: "var(--neon-violet)",
  },
  {
    title: "Internship Mela",
    icon: "🚀",
    description:
      "Your hackathon performance is your resume. Top performers get fast-tracked to interview booths where companies offer internships and PPOs on the spot.",
    highlight: "var(--neon-magenta)",
  },
];

export function Pillars() {
  return (
    <section id="pillars" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ THE THREE PILLARS ]</p>
          <h2 className="section-heading neon-text">
            One Event. Three Dimensions.
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              className="group relative"
              variants={fadeInUp}
            >
              <div
                className="hud-card hud-brackets p-8 sm:p-10 h-full transition-all duration-500 hover:border-opacity-60"
                style={
                  {
                    "--hover-color": pillar.highlight,
                  } as React.CSSProperties
                }
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${pillar.highlight}15 0%, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="text-4xl mb-6">{pillar.icon}</div>
                  <h3
                    className="font-display font-bold text-xl sm:text-2xl mb-4"
                    style={{ color: pillar.highlight }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
