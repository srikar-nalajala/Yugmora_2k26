// app/page.tsx — Landing page composing 3D Scene and all 15 sections
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Pillars } from "@/components/sections/Pillars";
import { Missions } from "@/components/sections/Missions";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Workshops } from "@/components/sections/Workshops";
import { Mela } from "@/components/sections/Mela";
import { Schedule } from "@/components/sections/Schedule";
import { Prizes } from "@/components/sections/Prizes";
import { Community } from "@/components/sections/Community";
import { Partner } from "@/components/sections/Partner";
import { Sponsors } from "@/components/sections/Sponsors";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

import { SceneWrapper } from "@/components/three/SceneWrapper";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Fixed 3D Scene background */}
      <SceneWrapper />

      {/* Page Sections (z-10 above canvas) */}
      <div className="relative z-10 flex flex-col">
        <Hero />
        <About />
        <Pillars />
        <Missions />
        <HowItWorks />
        <Workshops />
        <Mela />
        <Schedule />
        <Prizes />
        <Community />
        <Partner />
        <Sponsors />
        <DownloadCTA />
        <Faq />
        <Contact />
      </div>
    </div>
  );
}
