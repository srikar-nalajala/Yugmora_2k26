// components/sections/Missions.tsx — Mission Select section with 3D Coverflow Showcase
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { missions, domains } from "@/content/missions";
import { fadeInUp } from "@/lib/motion";
import type { Domain, Mission } from "@/content/types";
import { ShowcaseCarousel } from "@/components/showcase/ShowcaseCarousel";
import { MissionCard } from "@/components/showcase/MissionCard";
import { MissionModal } from "@/components/showcase/MissionModal";

export function Missions() {
  const [activeDomain, setActiveDomain] = useState<Domain | "All">("All");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const filtered =
    activeDomain === "All"
      ? missions
      : missions.filter((m) => m.domain === activeDomain || m.locked);

  return (
    <section id="missions" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ SELECT YOUR MISSION ]</p>
          <h2 className="section-heading neon-text mb-4">
            Problem Statements
          </h2>
          <p className="section-subtitle mx-auto">
            Real-world challenges contributed by industry leaders. Pick your mission, assemble your squad, and build solutions that matter.
          </p>
        </motion.div>

        {/* Domain filter chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <button
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
              activeDomain === "All"
                ? "bg-neon-blue/20 border-neon-blue text-neon-cyan shadow-[0_0_12px_rgba(0,123,244,0.3)]"
                : "border-line text-text-muted hover:border-text-muted"
            }`}
            onClick={() => setActiveDomain("All")}
          >
            All Tracks
          </button>
          {domains.map((domain) => (
            <button
              key={domain}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                activeDomain === domain
                  ? "bg-neon-blue/20 border-neon-blue text-neon-cyan shadow-[0_0_12px_rgba(0,123,244,0.3)]"
                  : "border-line text-text-muted hover:border-text-muted"
              }`}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </motion.div>

        {/* 3D Coverflow Carousel */}
        <div className="relative">
          <ShowcaseCarousel<Mission>
            key={activeDomain} // re-init carousel when filter changes
            items={filtered}
            renderItem={(mission, isActive) => (
              <MissionCard
                mission={mission}
                isActive={isActive}
                onOpenDetails={(m) => setSelectedMission(m)}
              />
            )}
          />
        </div>
      </div>

      {/* Details Modal */}
      <MissionModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
      />
    </section>
  );
}
