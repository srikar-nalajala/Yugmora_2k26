// components/sections/Workshops.tsx — Workshops + Player Select Carousel (§6, §7)
"use client";

import { motion } from "framer-motion";
import { workshopTakeaways } from "@/content/workshops";
import { speakers } from "@/content/speakers";
import { useLiveContent } from "@/context/LiveContentContext";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { ShowcaseCarousel } from "@/components/showcase/ShowcaseCarousel";
import { SpeakerCard } from "@/components/showcase/SpeakerCard";
import type { Speaker } from "@/content/types";

export function Workshops() {
  const { content } = useLiveContent();
  const workshops = content.workshops;
  return (
    <section id="workshops" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ SKILL UPGRADE ]</p>
          <h2 className="section-heading neon-text mb-4">
            Workshops & Speakers
          </h2>
          <p className="section-subtitle mx-auto">
            Expert-led sessions aligned to problem statements. Learn hands-on architectures, tools, and best practices directly from industry builders.
          </p>
        </motion.div>

        {/* Workshop schedule table */}
        <motion.div
          className="mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="rounded-xl overflow-hidden border border-line bg-surface-1">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-surface-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-mono text-text-muted">
                workshop_schedule.log
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="px-4 py-3 font-mono text-[11px] text-neon-cyan uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 font-mono text-[11px] text-neon-cyan uppercase tracking-wider">
                      Workshop
                    </th>
                    <th className="px-4 py-3 font-mono text-[11px] text-neon-cyan uppercase tracking-wider hidden sm:table-cell">
                      Domain
                    </th>
                    <th className="px-4 py-3 font-mono text-[11px] text-neon-cyan uppercase tracking-wider hidden md:table-cell">
                      Time
                    </th>
                    <th className="px-4 py-3 font-mono text-[11px] text-neon-cyan uppercase tracking-wider hidden md:table-cell">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workshops.map((ws) => (
                    <tr
                      key={ws.id}
                      className="border-b border-line/50 hover:bg-surface-2 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-neon-violet">
                        {ws.id}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{ws.title}</td>
                      <td className="px-4 py-3 text-text-muted hidden sm:table-cell font-mono text-xs">
                        {ws.domain}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted hidden md:table-cell">
                        {ws.datetime}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-tagline hidden md:table-cell">
                        {ws.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Workshop takeaways */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {workshopTakeaways.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 p-4 rounded-lg border border-line/50 bg-surface-1/50"
              variants={fadeInUp}
            >
              <span className="text-neon-cyan text-lg">✓</span>
              <p className="text-sm text-text-muted font-sans">{item}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Speakers — "Player Select" Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ PLAYER SELECT ]</p>
          <h3 className="section-heading text-2xl sm:text-3xl neon-text mb-2">
            Guest Speakers & Mentors
          </h3>
          <p className="section-subtitle mx-auto text-sm">
            Meet the veterans and engineers mentoring teams throughout the 40 hours.
          </p>
        </motion.div>

        {/* 3D Coverflow Player Select Carousel */}
        <div className="relative">
          <ShowcaseCarousel<Speaker>
            items={speakers}
            renderItem={(speaker, isActive) => (
              <SpeakerCard speaker={speaker} isActive={isActive} />
            )}
          />
        </div>
      </div>
    </section>
  );
}
